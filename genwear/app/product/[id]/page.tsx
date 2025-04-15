'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Star, Truck, RotateCcw, Shield, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Footer from '@/components/ui/Footer';
import { getProductById, getProductByName, getSimilarProducts } from '@/app/utils/productUtils';

// CSS for hiding scrollbar
const styles = `
  @layer utilities {
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
`;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productIdOrName = params.id as string;
    let productData = getProductById(productIdOrName);
    
    // If not found by ID, try finding by name
    if (!productData) {
      productData = getProductByName(productIdOrName);
    }

    if (productData) {
      setProduct(productData);
      // Get similar products based on the product name
      const similarProducts = getSimilarProducts(productData.name);
      setSimilarProducts(similarProducts);
    } else {
      // If product not found, redirect to browse page
      router.push('/browse');
    }
    
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{styles}</style>
      
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
            <button className="p-2">
              <Heart className="w-6 h-6 text-gray-600 hover:text-teal-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/browse" className="hover:text-teal-600">Browse</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-teal-600 transition-colors"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-2xl font-bold text-teal-600">
              ${product.price.toFixed(2)}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button className="flex-1">Add to Cart</Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5" />
                <span>2-year warranty</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Features</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {product.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
        </div>
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="flex-shrink-0 w-[250px] group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                      <button className="ml-2 p-1 rounded-full hover:bg-gray-100">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) {
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600 rotate-180" />
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            onClick={() => {
              const container = document.querySelector('.overflow-x-auto');
              if (container) {
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
} 