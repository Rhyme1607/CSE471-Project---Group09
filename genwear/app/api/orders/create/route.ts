import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const { token, items, totalAmount, shippingAddress, paymentMethod } = await req.json();

    // Verify token and get user
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Get the next order number
    const lastOrder = await db.collection('orders')
      .findOne({}, { sort: { orderNumber: -1 } });
    
    // Start from 1001 if no orders exist, or increment the last order number
    const nextOrderNum = lastOrder ? 
      parseInt(lastOrder.orderNumber.replace('GW', '')) + 1 : 
      1001;
    
    const orderNumber = `GW${nextOrderNum}`;

    // Create new order
    const order = await db.collection('orders').insertOne({
      userId: new ObjectId(user.id),
      orderNumber,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'PENDING',
      createdAt: new Date()
    });

    // Add order ID to user's orders array
    const userId = new ObjectId(user.id);
    await db.collection('users').updateOne(
      { _id: userId },
      { $addToSet: { orders: order.insertedId } }
    );

    return NextResponse.json({ success: true, order: { _id: order.insertedId, orderNumber } });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
} 