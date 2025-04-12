"use client";

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Search, Menu, Mail, Bell, User } from "lucide-react"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

// Add type definitions for filter state
type FilterState = {
  categories: {
    shoes: boolean;
    clothing: boolean;
    accessories: boolean;
  };
  brands: {
    nike: boolean;
    adidas: boolean;
    puma: boolean;
    fenty: boolean;
  };
  ratings: {
    rating5: boolean;
    rating4: boolean;
    rating3Below: boolean;
  };
  priceRange: number[];
};

type FilterType = keyof FilterState;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFirstBanner] = useState(Math.random() < 0.5);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const productsPerPage = 12; // Number of products per page
  const [activeTab, setActiveTab] = useState("all"); // Active filter tab

  // Update the filter state with proper typing
  const [filters, setFilters] = useState<FilterState>({
    categories: {
      shoes: false,
      clothing: false,
      accessories: false
    },
    brands: {
      nike: false,
      adidas: false,
      puma: false,
      fenty: false
    },
    ratings: {
      rating5: false,
      rating4: false,
      rating3Below: false
    },
    priceRange: [0, 300]
  });

  // Add useEffect for debouncing search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allProducts = [
    { image: "/JORDAN+6+RINGS-Photoroom.png?height=auto&width=auto", name: "Nike Air Jordan 6 Rings", price: "$169.99", rating: 4.9, category: "shoes" },
    { image: "/Samba_OG_Shoes_White_JH5633_04_standard-Photoroom.png?height=200&width=200", name: "adidas Samba OG Shoes", price: "$101.99", rating: 4.9, category: "shoes" },
    { image: "/PUMA-x-LAMELO-BALL-MB.04-Golden-Child-Men's-Basketball-Shoes-Photoroom.png?height=200&width=200", name: "PUMA x LAMELO BALL Golden Child", price: "$124.99", rating: 5.0, category: "shoes" },
    { image: "/JORDAN+LUKA+3 (1)-Photoroom.png?height=200&width=200", name: "Nike Air Jordan Luka 3", price: "$129.99", rating: 5.0, category: "shoes" },
    { image: "/WMNS+AIR+JORDAN+1+MID-Photoroom.png?height=200&width=200", name: "Nike Air Jordan 1 Mid Women", price: "$124.99", rating: 4.6, category: "shoes" },
    { image: "/FENTY-x-PUMA-Avanti-LS-Stitched-Men's-Sneakers-Photoroom.png?height=200&width=200", name: "FENTY x PUMA", price: "$124.99", rating: 4.6, category: "shoes" },
    { image: "/AEROREADY_Designed_to_Move_Woven_Sport_Shorts_Black_GT8161_01_laydown-Photoroom.png?height=200&width=200", name: "adidas Black Shorts Sports", price: "$101.99", rating: 4.9, category: "clothing" },
    { image: "/3-Stripes_Tricot_Regular_Tapered_Track_Pants_Black_JI8809_01_laydown-Photoroom.png?height=200&width=200", name: "adidas 24 Training Pants", price: "$124.99", rating: 5.0, category: "clothing" },
    { image: "/New_York_Red_Bulls_UBP_Travel_Hoodie_Red_JE5524_01_laydown-Photoroom.png?height=200&width=200", name: "adidas NY Bulls Red Hoodie", price: "$79.99", rating: 4.8, category: "clothing" },
    { image: "/ESS-No.-1-Logo-Men's-Tee-Photoroom.png?height=200&width=200", name: "PUMA Blue Tee", price: "$169.99", rating: 4.9, category: "clothing" },
    { image: "/F1®-Japan-Men's-Tee-Photoroom.png?height=200&width=200", name: "Fenty Men's Japan", price: "$124.99", rating: 4.6, category: "clothing" },
    { image: "/PUMA-x-LAMELO-BALL-Golden-Child-Men's-Basketball-Shirt-Photoroom.png?height=200&width=200", name: "Puma X Lamelo Golden", price: "$124.99", rating: 4.6, category: "clothing" },
    { image: "/placeholder.svg?height=200&width=200", name: "Nike Training Gloves", price: "$29.99", rating: 4.7, category: "accessories" },
    { image: "/placeholder.svg?height=200&width=200", name: "adidas Sports Bag", price: "$59.99", rating: 4.8, category: "accessories" },
    { image: "/placeholder.svg?height=200&width=200", name: "PUMA Cap", price: "$24.99", rating: 4.5, category: "accessories" },
  ];

  // Update the filtering logic to use the new filter state
  const filteredProducts = allProducts.filter((product) => {
    const productPrice = parseFloat(product.price.replace("$", ""));

    // Filter by active tab
    const matchesTab = activeTab === "all" || product.category === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    // Filter by sidebar categories
    const matchesCategory =
      (!filters.categories.shoes && !filters.categories.clothing && !filters.categories.accessories) ||
      (filters.categories.shoes && product.category === "shoes") ||
      (filters.categories.clothing && product.category === "clothing") ||
      (filters.categories.accessories && product.category === "accessories");

    // Filter by brands
    const matchesBrand =
      (!filters.brands.nike && !filters.brands.adidas && !filters.brands.puma && !filters.brands.fenty) ||
      (filters.brands.nike && product.name.toLowerCase().includes("nike")) ||
      (filters.brands.adidas && product.name.toLowerCase().includes("adidas")) ||
      (filters.brands.puma && product.name.toLowerCase().includes("puma")) ||
      (filters.brands.fenty && product.name.toLowerCase().includes("fenty"));

    // Filter by price range
    const matchesPrice = productPrice >= filters.priceRange[0] && productPrice <= filters.priceRange[1];

    // Filter by rating
    const matchesRating =
      (!filters.ratings.rating5 && !filters.ratings.rating4 && !filters.ratings.rating3Below) ||
      (filters.ratings.rating5 && product.rating >= 5) ||
      (filters.ratings.rating4 && product.rating >= 4 && product.rating < 5) ||
      (filters.ratings.rating3Below && product.rating < 4);

    return matchesTab && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Update the filter handler with proper typing
  const handleFilterChange = (filterType: FilterType, filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [filterName]: value
      }
    }));
    setCurrentPage(1);
  };

  // Update the clear all filters function
  const clearAllFilters = () => {
    setFilters({
      categories: {
        shoes: false,
        clothing: false,
        accessories: false
      },
      brands: {
        nike: false,
        adidas: false,
        puma: false,
        fenty: false
      },
      ratings: {
        rating5: false,
        rating4: false,
        rating3Below: false
      },
      priceRange: [0, 300]
    });
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/placeholder.jpg?height=40&width=40"
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
              <Link href="/contact" className="text-gray-600 hover:text-teal-600 font-bold">
                Contact
              </Link>
              <Link href="/sign-up" className="text-gray-600 hover:text-teal-600 font-bold">
                Sign Up
              </Link>
              <Link href="/about-us" className="text-gray-600 hover:text-teal-600 font-bold">
                About Us
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search Product"
                className="pl-10 w-64 bg-gray-50 border border-gray-300 rounded-md py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setActiveSearchQuery(searchQuery);
                    setCurrentPage(1);
                  }
                }}
              />
            </div>
            <button className="p-2">
              <Menu className="w-6 h-6" />
            </button>
            <button className="p-2">
              <Mail className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2">
              <Bell className="w-6 h-6" />
            </button>
            <Link href="/login" className="p-2">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-teal-400 py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Browse Products</h1>
          <div className="flex items-center gap-2 text-white">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Browse Products</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-600 hover:text-teal-700"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {/* Shoes */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("categories", "shoes", !filters.categories.shoes)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.categories.shoes ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.categories.shoes && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("categories", "shoes", !filters.categories.shoes)}
                        className="cursor-pointer text-sm"
                      >
                        Shoes
                      </label>
                    </div>
                    
                    {/* Clothing */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("categories", "clothing", !filters.categories.clothing)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.categories.clothing ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.categories.clothing && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("categories", "clothing", !filters.categories.clothing)}
                        className="cursor-pointer text-sm"
                      >
                        Clothing
                      </label>
                    </div>

                    {/* Accessories */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("categories", "accessories", !filters.categories.accessories)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.categories.accessories ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.categories.accessories && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("categories", "accessories", !filters.categories.accessories)}
                        className="cursor-pointer text-sm"
                      >
                        Accessories
                      </label>
                    </div>
                  </div>
                </div>
                {/* Brands */}
                <div>
                  <h3 className="font-medium mb-2">Brands</h3>
                  <div className="space-y-2">
                    {/* Nike */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("brands", "nike", !filters.brands.nike)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.brands.nike ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.brands.nike && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("brands", "nike", !filters.brands.nike)}
                        className="cursor-pointer text-sm"
                      >
                        Nike
                      </label>
                    </div>
                    {/* Adidas */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("brands", "adidas", !filters.brands.adidas)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.brands.adidas ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.brands.adidas && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("brands", "adidas", !filters.brands.adidas)}
                        className="cursor-pointer text-sm"
                      >
                        Adidas
                      </label>
                    </div>
                    {/* Puma */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("brands", "puma", !filters.brands.puma)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.brands.puma ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.brands.puma && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("brands", "puma", !filters.brands.puma)}
                        className="cursor-pointer text-sm"
                      >
                        Puma
                      </label>
                    </div>

                    {/* Fenty */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("brands", "fenty", !filters.brands.fenty)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.brands.fenty ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.brands.fenty && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("brands", "fenty", !filters.brands.fenty)}
                        className="cursor-pointer text-sm"
                      >
                        Fenty
                      </label>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Slider
                    defaultValue={filters.priceRange}
                    min={0}
                    max={300}
                    step={1}
                    onValueChange={(value) => handleFilterChange("priceRange", "priceRange", value)}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${filters.priceRange[0]}</span>
                    <span className="text-sm">${filters.priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-2">Rating</h3>
                  <div className="space-y-2">
                    {/* 5 Stars */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("ratings", "rating5", !filters.ratings.rating5)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.ratings.rating5 ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.ratings.rating5 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("ratings", "rating5", !filters.ratings.rating5)}
                        className="cursor-pointer text-sm flex items-center"
                      >
                        <span className="flex text-yellow-400">★★★★★</span>
                        <span className="ml-1">& up</span>
                      </label>
                    </div>
                    {/* 4 Stars */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("ratings", "rating4", !filters.ratings.rating4)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.ratings.rating4 ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.ratings.rating4 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("ratings", "rating4", !filters.ratings.rating4)}
                        className="cursor-pointer text-sm flex items-center"
                      >
                        <span className="flex text-yellow-400">★★★★</span>
                        <span className="ml-1">& up</span>
                      </label>
                    </div>
                    {/* 3 Stars & Below */}
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => handleFilterChange("ratings", "rating3Below", !filters.ratings.rating3Below)}
                        className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center cursor-pointer ${
                          filters.ratings.rating3Below ? "bg-teal-600 border-teal-600" : "bg-white"
                        }`}
                      >
                        {filters.ratings.rating3Below && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={() => handleFilterChange("ratings", "rating3Below", !filters.ratings.rating3Below)}
                        className="cursor-pointer text-sm flex items-center"
                      >
                        <span className="flex text-yellow-400">★★★</span>
                        <span className="ml-1">& below</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl p-5 group">
              {/* Animated Circle 1 */}
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-100 opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-45"></div>
              
              {/* Animated Circle 2 */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-100 opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-45"></div>
              
              {/* Content */}
              <h3 className="text-3xl font-bold text-teal-800 mb-3 relative z-10 text-center">Need Help?</h3>
              <p className="text-teal-700 text-sm mb-4 text-center relative z-10">
                About Account Management
                <br />
                Ordering & Payment refund and
                <br />
                FAQ
              </p>
              <div className="flex justify-center relative z-10">
                <button className="bg-white text-teal-700 font-medium py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-shadow">
                  Customer Service
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">Sort by:</span>
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[160px] bg-gray-50 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-teal-600 focus:outline-none">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-50">
                      <SelectItem value="featured" className="px-4 py-2 hover:bg-teal-50 hover:text-teal-600 cursor-pointer rounded-md">Featured</SelectItem>
                      <SelectItem value="newest" className="px-4 py-2 hover:bg-teal-50 hover:text-teal-600 cursor-pointer rounded-md">Newest</SelectItem>
                      <SelectItem value="price-low" className="px-4 py-2 hover:bg-teal-50 hover:text-teal-600 cursor-pointer rounded-md">Price: Low to High</SelectItem>
                      <SelectItem value="price-high" className="px-4 py-2 hover:bg-teal-50 hover:text-teal-600 cursor-pointer rounded-md">Price: High to Low</SelectItem>
                      <SelectItem value="rating" className="px-4 py-2 hover:bg-teal-50 hover:text-teal-600 cursor-pointer rounded-md">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="all"
              className="mb-8"
              onValueChange={(value) => {
                setActiveTab(value); // Update activeTab state
                setCurrentPage(1);  // Reset pagination to the first page
              }}
            >
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  All Products
                </TabsTrigger>
                <TabsTrigger value="shoes" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Shoes
                </TabsTrigger>
                <TabsTrigger value="clothing" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Clothing
                </TabsTrigger>
                <TabsTrigger value="accessories" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Accessories
                </TabsTrigger>
              </TabsList>

              {/* TabsContent for All Products */}
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={index}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* TabsContent for Shoes */}
              <TabsContent value="shoes" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={index}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* TabsContent for Clothing */}
              <TabsContent value="clothing" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={index}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* TabsContent for Accessories */}
              <TabsContent value="accessories" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={index}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-teal-600 hover:text-white transition-colors ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={currentPage === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md ${
                      page === currentPage
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 hover:bg-teal-600 hover:text-white transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-teal-600 hover:text-white transition-colors ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFirstBanner ? (
        <div className="gradient-wave-hover py-12 mt-12 rounded-xl overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="max-w-md mb-8 md:mb-0">
                <h2 className="text-4xl font-bold text-teal-800 mb-6">New and Featured</h2>
                <p className="text-teal-700 mb-8">
                  Discover our latest arrivals and featured collections. Stay ahead of the curve with GenWear's cutting-edge designs and exclusive styles.
                </p>
                <button className="flex items-center text-teal-700 font-semibold text-lg transition-transform">
                  Buy it now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 transform transition-transform"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              <div>
                <Image
                  src="/PUMA-x-LAMELO-BALL-Golden-Child-Men's-Basketball-Tee-Photoroom.png"
                  alt="New Collection - Person wearing stylish outfit"
                  width={500}
                  height={400}
                  className="rounded-lg transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gradient-wave-hover py-12 mt-12 rounded-xl overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="max-w-md mb-8 md:mb-0">
                <h2 className="text-4xl font-bold text-teal-800 mb-6">New Summer Deals</h2>
                <p className="text-teal-700 mb-8">
                  Get ready for summer with our exclusive deals on sportswear and accessories. Embrace the sunshine in style!
                </p>
                <button className="flex items-center text-teal-700 font-semibold text-lg transition-transform">
                  Shop Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 transform transition-transform"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              <div>
                <Image
                  src="/U+NK+SB+TEE+M90+OC+TOW-Photoroom.png"
                  alt="Summer Deals - Person enjoying summer"
                  width={500}
                  height={400}
                  className="rounded-lg transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">GenWear</h3>
              <p className="text-gray-600 mb-4">Your one-stop shop for premium sportswear and athletic gear.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Men
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Women
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Kids
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Shoes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Clothing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Track Order
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    Sizing Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-gray-600">+1 (234) 567-8901</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span className="text-gray-600">support@genwear.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-gray-600">123 Sports Avenue, Athletic City, AC 12345</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>© 2024 GenWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Product Card Component
interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  rating: number;
}

function ProductCard({ image, name, price, rating }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-card shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative group aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={200}
          height={200}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjY4OEI4Li8vQUVFRkZFRUVFRUVFRUVFRUVFRUX/2wBDAR0XFyAeIBogHiAeIBogHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
        <p className="font-bold text-teal-600 mt-1">{price}</p>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
              ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">{rating}</span>
        </div>
      </div>
    </div>
  );
}
