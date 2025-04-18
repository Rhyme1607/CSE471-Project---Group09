'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowLeft, ShoppingBag, User, Settings, LogOut, Package } from 'lucide-react';
import Footer from '@/components/ui/Footer';
import { useUser } from '../context/UserContext';
import CartIcon from '../components/CartIcon';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/login');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/Adobe Express - file.png"
                alt="GenWear Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-teal-600">GenWear</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-teal-600 font-bold">
                Home
              </Link>
              <Link href="/browse" className="text-gray-600 hover:text-teal-600 font-bold">
                Browse
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-teal-600 font-bold">
                Contact
              </Link>
              <Link href="/about-us" className="text-gray-600 hover:text-teal-600 font-bold">
                About Us
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <CartIcon />
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user?.profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Profile
                    </Link>
                    
                    <Link 
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" />
                      Order History
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2">
                <User className="w-6 h-6 text-gray-600 hover:text-teal-600" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/browse">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
                </div>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          ৳{item.price.toFixed(2)} each
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-600">
                            Size: <span className="font-medium">{item.size}</span>
                          </p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-600">
                            Color: <span className="font-medium">{item.color}</span>
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Cart</span>
                  </button>
                  <Link href="/browse" className="flex items-center gap-1 text-teal-600 hover:text-teal-800">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">৳{Number(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>৳{Number(totalPrice).toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 