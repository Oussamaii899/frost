"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Zap,
  MessageCircle,
  Crown,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Award,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Globe,
  Clock,
  Headphones,
  Sparkles,
  Heart,
  Rocket,
  Music,
  Camera,
  Server,
  LucideIcon,
  ShoppingCart,
} from "lucide-react"
import { getIcon } from "./Admin/icon-map"
import CookieConsent from "@/components/CookieConsent"
import { usePage } from "@inertiajs/react"

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}): [React.MutableRefObject<any>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true)
          setHasAnimated(true)
        }
      },
      {
        threshold: 0.05,
        rootMargin: "150px",
        ...options,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [hasAnimated, options])

  return [ref, isIntersecting] as const
}

interface Categories {
  id: number
  name: string
  slug: string
  icon: string | LucideIcon
}

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M3 4h2l2.4 10.2a1 1 0 0 0 .98.8H18a1 1 0 0 0 .97-.76L21 8H8" />
  </svg>
)


export default function FrostMarket({ Categories, Products, Settings, user }: { Categories?: Categories[], Products?: any[], Settings?: any[], user?: any }) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedProductslug, setSelectedProductslug] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  let cart = [];


  function addToCart(slug) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // prevent duplicates (optional)
    if (!cart.includes(slug)) {
      cart.push(slug);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Added to cart:", slug);
  }


  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }




  const [settings, setSettings] = useState(
    (Settings || []).reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, any>)
  )



  const { props } = usePage()
  const themeColor = props.color as string
  const backgroundColor = props.background_color as string

  useEffect(() => {
    if (themeColor) {
      document.documentElement.style.setProperty('--primary', themeColor)
      document.documentElement.style.setProperty('--ring', themeColor)
      document.documentElement.style.setProperty('--sidebar-primary', themeColor)
      document.documentElement.style.setProperty('--sidebar-ring', themeColor)
    }
    if (backgroundColor) {
      document.documentElement.style.setProperty('--background', backgroundColor)
    }
  }, [themeColor, backgroundColor])

  console.log(settings);
  // Intersection observer refs for scroll animations
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 })
  const [productsRef, productsInView] = useIntersectionObserver({ threshold: 0.1 })
  const [featuresRef, featuresInView] = useIntersectionObserver({ threshold: 0.1 })
  const [contactRef, contactInView] = useIntersectionObserver({ threshold: 0.1 })
  const [ctaRef, ctaInView] = useIntersectionObserver({ threshold: 0.1 })

  // Initial loading animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setShowContent(true)
      }, 100)
    }, 800)

    return () => clearTimeout(loadingTimer)
  }, [])

  // Scroll event listener for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])


  const handlePurchase = (productName: string, productSlug: string) => {
    setSelectedProduct(productName)
    setSelectedProductslug(productSlug)
    setShowPurchaseModal(true)
  }
  /* 
   
     const productCategories = {
     nitro: [
       {
         id: 1,
         name: "Discord Nitro Monthly",
         description: "1 month of premium Discord experience with all features unlocked",
         price: "$9.99",
         originalPrice: "$14.99",
         badge: "Most Popular",
         stock: "In Stock",
       },
       {
         id: 2,
         name: "Discord Nitro Yearly",
         description: "12 months of premium Discord experience - Best Value!",
         price: "$99.99",
         originalPrice: "$179.88",
         badge: "Best Value",
         stock: "In Stock",
       },
       {
         id: 3,
         name: "Discord Nitro Basic",
         description: "Essential Discord premium features at an affordable price",
         price: "$2.99",
         originalPrice: "$4.99",
         badge: "Budget Friendly",
         stock: "Out of Stock",
       },
     ],
     boosts: [
       {
         id: 4,
         name: "2x Server Boost (1 Month)",
         description: "Double server boost for one month to enhance your server features",
         price: "$8.99",
         originalPrice: "$13.98",
         badge: "Starter",
         boostLevel: "Level 0 → Level 1",
         stock: "In Stock",
       },
       {
         id: 5,
         name: "7x Server Boost Pack (1 Month)",
         description: "Advanced boost package for one month with Level 2 server status",
         price: "$29.99",
         originalPrice: "$48.93",
         badge: "Popular",
         boostLevel: "Level 2 Guaranteed",
         stock: "In Stock",
       },
       {
         id: 6,
         name: "7x Server Boost Pack (3 Months)",
         description: "Advanced boost package for three months with sustained Level 2 server status",
         price: "$79.99",
         originalPrice: "$146.79",
         badge: "Extended",
         boostLevel: "Level 2 Guaranteed",
         stock: "In Stock",
       },
       {
         id: 7,
         name: "14x Server Boost Pack (1 Month)",
         description: "Maximum boost package for one month with Level 3 server status",
         price: "$59.99",
         originalPrice: "$97.86",
         badge: "Premium",
         boostLevel: "Level 3 Maximum",
         stock: "In Stock",
       },
       {
         id: 8,
         name: "14x Server Boost Pack (3 Months)",
         description: "Maximum boost package for three months with Level 3 server status",
         price: "$159.99",
         originalPrice: "$293.58",
         badge: "Ultimate",
         boostLevel: "Level 3 Maximum",
         stock: "Out of Stock",
       },
     ],
     spotify: [
       {
         id: 9,
         name: "Spotify Premium Family",
         description: "Family plan for up to 6 accounts with individual profiles",
         price: "$8.99",
         originalPrice: "$15.99",
         badge: "Family",
         stock: "In Stock",
       },
     ],
     minecraft: [
       {
         id: 10,
         name: "Minecraft Java Edition Account",
         description: "Full Minecraft Java Edition account with lifetime access",
         price: "$19.99",
         originalPrice: "$26.95",
         badge: "Lifetime",
         stock: "In Stock",
       },
     ],
     snapchat: [
       {
         id: 11,
         name: "Snapchat+ Premium (1 Month)",
         description: "Snapchat Plus subscription with exclusive features and early access",
         price: "$2.99",
         originalPrice: "$3.99",
         badge: "Premium",
         stock: "In Stock",
       },
       {
         id: 12,
         name: "Snapchat+ Premium (1 Year)",
         description: "Annual Snapchat Plus subscription with exclusive features and maximum savings",
         price: "$29.99",
         originalPrice: "$47.88",
         badge: "Best Value",
         stock: "In Stock",
       },
     ],
     hosting: [
       {
         id: 13,
         name: "Discord Bot Hosting (Monthly)",
         description: "Reliable 24/7 bot hosting with 99.9% uptime guarantee",
         price: "$9.99",
         originalPrice: "$14.99",
         badge: "Reliable",
         boostLevel: "24/7 Uptime",
         stock: "In Stock",
       },
       {
         id: 14,
         name: "Premium Bot Hosting (Monthly)",
         description: "High-performance hosting with dedicated resources and priority support",
         price: "$19.99",
         originalPrice: "$29.99",
         badge: "Premium",
         boostLevel: "Dedicated Resources",
         stock: "In Stock",
       },
       {
         id: 15,
         name: "Enterprise Bot Hosting (Monthly)",
         description: "Enterprise-grade hosting solution with custom configurations",
         price: "$49.99",
         originalPrice: "$79.99",
         badge: "Enterprise",
         boostLevel: "Custom Config",
         stock: "Out of Stock",
       },
     ],
     bots: [
       {
         id: 16,
         name: "Moderation Bot",
         description: "Advanced moderation bot with comprehensive features",
         price: "$19.99",
         originalPrice: "$29.99",
         badge: "Advanced",
         stock: "In Stock",
       },
       {
         id: 17,
         name: "Music Bot Premium",
         description: "High-quality music bot with premium streaming",
         price: "$14.99",
         originalPrice: "$24.99",
         badge: "Popular",
         stock: "In Stock",
       },
       {
         id: 18,
         name: "Custom Bot Development",
         description: "Fully custom bot tailored specifically to your needs",
         price: "$99.99",
         originalPrice: "$149.99",
         badge: "Custom",
         stock: "In Stock",
       },
     ],
   }
   
  */


  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Most Popular":
      case "Popular":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Best Value":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Premium":
      case "Advanced":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Custom":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30"
      case "Ultimate":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30"
    }
  }

  const renderProductCard = (product: any, index: number) => (
    <Card
      key={product.id}
      className={`bg-slate-800/50 dark:bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 group relative overflow-hidden transform ${productsInView ? "animate-slide-in-up opacity-100" : "opacity-0 translate-y-8"
        }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-1/2 -left-2 w-3 h-3 bg-primary/20 rounded-full animate-float-delayed opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-2 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-float-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-white text-xl group-hover:text-primary transition-colors duration-300">
                {product.name}
              </CardTitle>
            </div>
            {product.boostLevel && (
              <div className="mb-2">
                <Badge className="bg-gradient-to-r from-primary/20 to-primary/20 text-primary border-primary/30 text-xs animate-pulse-slow">
                  {product.boostLevel}
                </Badge>
              </div>
            )}
            <div className="flex items-center space-x-2 mb-2">
              <Badge
                className={`text-xs font-medium ${product.stock > 0
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
              >
                {product.stock > 0 ? "In Stock" : "Unavailable"}
              </Badge>
            </div>
          </div>
          <Badge className={`${getBadgeColor(product.badge)} animate-bounce-subtle`}>{product.badge}</Badge>
        </div>
        <CardDescription className="text-gray-300 text-base leading-relaxed">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              {product.price}
            </span>
            <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-semibold animate-pulse-green">
              Save{" "}
              {Math.round(
                ((Number.parseFloat(String(product.originalPrice).slice(1)) - Number.parseFloat(String(product.price).slice(1))) /
                  Number.parseFloat(String(product.originalPrice).slice(1))) *
                100,
              )}
              %
            </Badge>
          </div>

          <Button
            className={`w-full font-semibold py-3 transition-all duration-300 hover:shadow-lg group/btn relative overflow-hidden ${product.stock > 0
              ? "bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white hover:shadow-primary/25"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            onClick={() => product.stock > 0 && handlePurchase(product.name, product.slug)}
            disabled={product.stock <= 0}
          >
            <span className="relative z-10 flex items-center justify-center">
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              {product.stock > 0 && (
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
              )}
            </span>

          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Loading Screen Component
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      >
        <div className="text-center">
          <div className="relative mb-8">
            <img
              src="/frost-logo.png"
              alt="Frost Market Logo"
              width={200}
              height={80}
              className="h-20 w-auto animate-pulse-glow"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 rounded-2xl blur-3xl animate-pulse-glow"></div>
          </div>
          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className={`text-lg font-medium animate-pulse ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Loading {settings.site_name}...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-500 bg-background ${isDarkMode
        ? "dark"
        : ""
        }`}
    >
      <CookieConsent></CookieConsent>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div
          className={`backdrop-blur-xl border-b transition-all duration-500 ${isScrolled ? "bg-slate-900/50 border-slate-700/30" : "bg-transparent border-transparent"
            }`}
        >
          {/* Centered container with max width */}
          <div className="max-w-[1530px] mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <div className="relative group">
                  <img
                    src="/frost.png"
                    alt="Frost Market Logo"
                    width={120}
                    height={40}
                    className="h-12 w-auto hover:scale-105 transition-transform duration-300 filter drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Desktop Navigation - Centered */}
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group text-white"
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary group-hover:w-full transition-all duration-300"></span>
                </button>
                <button
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group text-white"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary group-hover:w-full transition-all duration-300"></span>
                </button>
                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group text-white"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary group-hover:w-full transition-all duration-300"></span>
                </button>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group text-white"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <a href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 hidden sm:flex hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 relative group overflow-hidden">
                        <span className="relative z-10">{user.role === "admin" ? "Admin" : "Dashboard"}</span>
                      </Button>
                    </a>
                    <a href="/cart">
                      {
                        cartItems.length > 0 ? (
                          <div className="relative">
                            <span className="absolute -top-2 -right-2 flex items-center  justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                              {cartItems.length}
                            </span>
                            <ShoppingCart className="w-6 h-6 text-white transition-all duration-300" />
                          </div>
                        ) : (
                          <ShoppingCart className="w-6 h-6 text-white transition-all duration-300" />
                        )
                      }
                    </a>
                  </div>
                ) : (
                  <a href="/login">
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 hidden sm:flex hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 relative group overflow-hidden">
                      <span className="relative z-10">Login</span>
                    </Button>
                  </a>
                )}

                {/* Mobile Menu Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden bg-slate-800/50 backdrop-blur-sm hover:scale-110 transition-all duration-300 border-slate-600"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4 animate-spin" /> : <Menu className="w-4 h-4 animate-pulse" />}
                </Button>
              </div>
            </nav>

            {/* Mobile Menu - Full width glass effect */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 p-4 rounded-lg border transition-all duration-500 animate-slide-down backdrop-blur-lg bg-slate-800/50 border-slate-700/30">
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-left text-white"
                  >
                    About
                  </button>
                  <button
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-left text-white"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                    className="font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-left text-white"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                      setIsMobileMenuOpen(false)
                    }}
                    className="font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 text-left text-white"
                  >
                    Contact
                  </button>
                  {user ? (
                    <a href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white flex items-center font-semibold w-full justify-center">
                        {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                      </Button>
                    </a>
                  ) : (
                    <a href="/login">
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white flex items-center font-semibold w-full justify-center">
                        Login
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Enhanced Hero Section */}
      <section id="about" className="container mx-auto px-4 py-16 lg:py-24 relative" ref={heroRef}>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-glow ${showContent ? "animate-slide-in-left" : "opacity-0 -translate-x-full"
                }`}
              style={{ animationDelay: "0.1s" }}
            >
              <TrendingUp className="w-4 h-4 text-primary animate-bounce" />
              <span className="text-primary text-sm font-medium">#1 Digital Marketplace</span>
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDarkMode ? "text-white" : "text-gray-900"
                } ${showContent ? "animate-slide-in-left" : "opacity-0 -translate-x-full"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <span className="block">Welcome to</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary animate-gradient">
                {settings.site_name}
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl lg:max-w-none ${isDarkMode ? "text-gray-300" : "text-gray-600"
                } ${showContent ? "animate-slide-in-left" : "opacity-0 -translate-x-full"}`}
              style={{ animationDelay: "0.3s" }}
            >
              {settings.site_description}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start ${showContent ? "animate-slide-in-left" : "opacity-0 -translate-x-full"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                onClick={() => {
                  window.open(settings.discord_link, "_blank")
                }}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-4 text-lg font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
              >
                <MessageCircle className="w-5 h-5 mr-2 animate-pulse" />
                Join our Discord
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className={`px-8 py-4 text-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? "border-primary text-primary hover:bg-primary/10 bg-transparent"
                  : "border-primary text-primary hover:bg-primary/5 bg-transparent"
                  }`}
              >
                Browse Products
              </Button>
            </div>

            {/* Enhanced Static Stats */}
            <div
              className={`grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50 ${showContent ? "animate-slide-in-left" : "opacity-0 -translate-x-full"
                }`}
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-center lg:text-left group">
                <div
                  className={`text-2xl lg:text-3xl font-bold mb-1 group-hover:text-primary transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  150+
                </div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Happy Customers</div>
              </div>
              <div className="text-center lg:text-left group">
                <div
                  className={`text-2xl lg:text-3xl font-bold mb-1 group-hover:text-primary transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  99.9%
                </div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Success Rate</div>
              </div>
              <div className="text-center lg:text-left group">
                <div
                  className={`text-2xl lg:text-3xl font-bold mb-1 group-hover:text-primary transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  24/7
                </div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Image */}
          <div
            className={`flex-1 relative ${showContent ? "animate-slide-in-right" : "opacity-0 translate-x-full"}`}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 rounded-2xl blur-3xl animate-pulse-glow"></div>
              <img
                src="/frost-logo.png?height=500&width=600"
                alt="Digital Services Showcase"
                width={600}
                height={500}
                className="relative   w-full h-auto hover:scale-105 transition-transform duration-500"
              />

              {/* Enhanced Floating Cards with Animations */}
              <div
                className={`absolute -top-4 -left-4 backdrop-blur-sm border border-primary/30 rounded-lg p-3 hidden lg:block animate-float ${isDarkMode ? "bg-slate-800/90" : "bg-white/90"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary animate-spin-slow" />
                  <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Premium Services
                  </span>
                </div>
              </div>

              <div
                className={`absolute -bottom-4 -right-4 backdrop-blur-sm border border-primary/30 rounded-lg p-3 hidden lg:block animate-float-delayed ${isDarkMode ? "bg-slate-800/90" : "bg-white/90"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400 animate-bounce" />
                  <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Trusted Seller
                  </span>
                </div>
              </div>

              <div
                className={`absolute top-1/2 -right-4 backdrop-blur-sm border border-primary/30 rounded-lg p-3 hidden lg:block animate-float-slow ${isDarkMode ? "bg-slate-800/90" : "bg-white/90"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Instant Delivery
                  </span>
                </div>
              </div>

              <div
                className={`absolute top-50 -left-8 backdrop-blur-sm border border-primary/30 rounded-lg p-3 hidden lg:block animate-bounce-subtle ${isDarkMode ? "bg-slate-800/90" : "bg-white/90"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400 animate-heartbeat" />
                  <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Loved by Users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: Shield,
              title: "Secure & Safe",
              desc: "All transactions are protected with enterprise-grade security and encryption protocols",
              delay: "0.15s",
            },
            {
              icon: Clock,
              title: "Instant Delivery",
              desc: "Get your products delivered within minutes of purchase completion with automated systems",
              delay: "0.25s",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "Round-the-clock customer support via Discord with dedicated professional team",
              delay: "0.35s",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`text-center group ${heroInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: feature.delay }}
            >
              <div
                className={`border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-2 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-gray-200"
                  }`}
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary animate-pulse-slow" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Products Section with Tabs */}
      <section id="products" className="container mx-auto px-4 py-20" ref={productsRef}>
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-glow ${productsInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
          >
            <Crown className="w-4 h-4 text-primary animate-spin-slow" />
            <span className="text-primary text-sm font-medium">Premium Products</span>
          </div>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} ${productsInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.2s" }}
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary animate-gradient">
              Premium Products
            </span>
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"} ${productsInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.4s" }}
          >
            Discover our carefully curated selection of digital services designed to elevate your online presence and
            gaming experience to the next level with professional quality and reliability.
          </p>
        </div>

        <Tabs
          defaultValue="boosts"
          className={`max-w-7xl mx-auto ${productsInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
          style={{ animationDelay: "0.6s" }}
        >
          <TabsList
            className={`w-full max-w-6xl mx-auto border rounded-xl h-full p-4 mb-12 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-gray-200"}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full">

              {
                Categories?.map((category) => {
                  const Icon = getIcon(category.icon)

                  return (
                    <TabsTrigger
                      key={category.slug}
                      value={category.slug}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/20 data-[state=active]:text-primary rounded-lg transition-all duration-300 hover:scale-105 py-3 px-2 text-xs sm:text-sm font-medium flex items-center justify-center"
                    >
                      {Icon && category.icon ? <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-pulse" /> : "ll"}
                      <span>{category.name}</span>
                    </TabsTrigger>
                  )
                })
              }

            </div>
          </TabsList>

          {
            Categories?.map((category) => {
              return (
                <TabsContent key={category.slug} value={category.slug} className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Products
                      ?.filter((product: any) => product.category.slug === category.slug)
                      .map((product: any, index: number) => renderProductCard(product, index))}
                  </div>
                </TabsContent>
              )
            })
          }
        </Tabs>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="container mx-auto px-4 py-20" ref={featuresRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-glow ${featuresInView ? "animate-slide-in-left" : "opacity-0 -translate-x-8"
                }`}
            >
              <Award className="w-4 h-4 text-primary animate-spin-slow" />
              <span className="text-primary text-sm font-medium">Why Choose Us</span>
            </div>
            <h3
              className={`text-3xl lg:text-4xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-900"} ${featuresInView ? "animate-slide-in-left" : "opacity-0 -translate-x-8"
                }`}
              style={{ animationDelay: "0.2s" }}
            >
              Why Choose {settings.site_name}?
            </h3>
            <div className="space-y-8">
              {[
                {
                  icon: Globe,
                  title: "Global Trusted Platform",
                  desc: "Over 150+ satisfied customers worldwide trust our services with 99.9% success rate and reliability",
                  delay: "0.3s",
                },
                {
                  icon: Clock,
                  title: "Lightning Fast Delivery",
                  desc: "Instant delivery within minutes of purchase with fully automated systems and real-time processing",
                  delay: "0.5s",
                },
                {
                  icon: Headphones,
                  title: "Premium Support",
                  desc: "24/7 customer support via Discord with dedicated professional team and instant response times",
                  delay: "0.7s",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 group ${featuresInView ? "animate-slide-in-left" : "opacity-0 -translate-x-8"
                    }`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div
                    className={`border rounded-lg p-3 group-hover:border-primary/50 transition-all duration-300 group-hover:scale-110 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-gray-200"
                      }`}
                  >
                    <feature.icon className="w-6 h-6 text-primary animate-pulse-slow" />
                  </div>
                  <div>
                    <h4
                      className={`text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {feature.title}
                    </h4>
                    <p className={`leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`relative ${featuresInView ? "animate-slide-in-right" : "opacity-0 translate-x-8"}`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 rounded-2xl blur-3xl animate-pulse-glow"></div>
            <img
              src="/frost.png?height=500&width=600"
              alt="Customer Support"
              width={600}
              height={500}
              className="relative rounded-2xl  w-full h-auto hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20" ref={contactRef}>
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-glow ${contactInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
          >
            <MessageCircle className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary text-sm font-medium">Get In Touch</span>
          </div>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} ${contactInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.2s" }}
          >
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary animate-gradient">
              Discord Community
            </span>
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto leading-relaxed mb-12 ${isDarkMode ? "text-gray-300" : "text-gray-600"} ${contactInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.4s" }}
          >
            Connect with our community, get instant support, and stay updated with the latest offers. Our Discord server
            is the best place to reach us!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {[
            {
              icon: MessageCircle,
              title: "Community Support",
              desc: "Join thousands of satisfied customers in our active Discord community",
              delay: "0.1s",
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              desc: "Get help anytime with our round-the-clock support team",
              delay: "0.3s",
            },
            {
              icon: Zap,
              title: "Instant Responses",
              desc: "Quick ticket system for fast resolution of your queries",
              delay: "0.5s",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`text-center group ${contactInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: feature.delay }}
            >
              <div
                className={`border rounded-2xl p-6 lg:p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 hover:-translate-y-2 ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-gray-200"
                  }`}
              >
                <div className="bg-gradient-to-r from-primary/20 to-primary/20 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary animate-pulse-slow" />
                </div>
                <h3 className={`text-lg lg:text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm lg:text-base leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`text-center ${contactInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
          style={{ animationDelay: "0.7s" }}
        >
          <Button
            size="lg"
            onClick={() => window.open(settings.discord_link, "_blank")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 lg:px-12 py-3 lg:py-4 text-lg lg:text-xl font-semibold flex items-center gap-3 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 mx-auto"
          >
            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 animate-pulse" />
            Join Our Discord Server
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="container mx-auto px-4 py-20" ref={ctaRef}>
        <div
          className={`bg-gradient-to-r from-primary/20 to-primary/20 rounded-3xl p-8 md:p-16 text-center border border-primary/30 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 ${ctaInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/5 rounded-3xl animate-pulse-glow"></div>
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Sparkles className="absolute top-10 left-10 w-6 h-6 text-primary/30 animate-twinkle" />
            <Sparkles className="absolute top-20 right-20 w-4 h-4 text-blue-400/30 animate-twinkle-delayed" />
            <Sparkles className="absolute bottom-20 left-20 w-5 h-5 text-purple-400/30 animate-twinkle-slow" />
            <Rocket className="absolute bottom-10 right-10 w-8 h-8 text-primary/20 animate-float" />
          </div>
          <div className="relative">
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                } ${ctaInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: "0.2s" }}
            >
              Ready to Upgrade Your Digital Experience?
            </h2>
            <p
              className={`text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                } ${ctaInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"}`}
              style={{ animationDelay: "0.4s" }}
            >
              Join thousands of satisfied customers who have enhanced their digital presence with our premium services.
              Get started today and experience the difference quality makes!
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center ${ctaInView ? "animate-slide-in-up" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                size="lg"
                onClick={() => {
                  window.open(settings.discord_link, "_blank")
                }}
                className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white px-10 py-4 text-lg font-semibold flex items-center gap-3 group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
              >
                <MessageCircle className="w-5 h-5 animate-pulse" />
                Join our Discord
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className={`px-10 py-4 text-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? "border-primary text-primary hover:bg-primary/10 bg-transparent"
                  : "border-primary text-primary hover:bg-primary/5 bg-transparent"
                  }`}
              >
                Browse All Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer
        className={`container mx-auto px-4 py-12 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"} ${showContent ? "animate-slide-in-up" : "opacity-0 translate-y-8"
          }`}
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <img
              src="/frost-logo.png"
              alt="Frost Market Logo"
              width={120}
              height={40}
              className="h-10 w-auto hover:scale-105 transition-transform duration-300"
            />
            <Badge className="bg-gradient-to-r from-primary/20 to-primary/20 text-primary border-primary/30 text-xs animate-pulse-slow">
              Premium Quality
            </Badge>
          </div>
          <div className={`text-center md:text-right ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p className="text-lg font-medium">&copy; 2025 {settings.site_name}. All rights reserved.</p>
            <p className="mt-2">Premium digital services you can trust worldwide.</p>
            {settings.developer_badge == 1 ? (
              <div className="mt-3 flex items-center justify-center md:justify-end gap-2">
                <span className="text-sm">Developed by</span>
                <button
                  onClick={() => setShowDeveloperModal(true)}
                  className="text-primary hover:text-primary font-medium text-sm transition-colors duration-300 hover:underline relative group"
                >
                  xOussamaii
                  <div
                    className={`absolute -top-16 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Full Stack Developer</span>
                    </div>
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isDarkMode ? "border-t-slate-800" : "border-t-white"
                        }`}
                    ></div>
                  </div>
                </button>
              </div>
            ) : (
              <div>
              </div>
            )
            }
          </div>
        </div>
      </footer>

      {/* Enhanced Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent
          className={`max-w-md border animate-modal-in ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
        >
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl font-bold animate-slide-in-left">
              Complete Your Purchase
            </DialogTitle>
            <DialogDescription
              className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"} animate-slide-in-left`}
              style={{ animationDelay: "0.1s" }}
            >
              To complete your purchase of{" "}
              <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedProduct}</span>,
              please follow the steps below:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div
              className={`p-6 rounded-xl border border-primary/30 animate-slide-in-up ${isDarkMode ? "bg-slate-700/50" : "bg-primary/5"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 animate-check" />
                How to complete your order:
              </h4>
              <ol className={`list-decimal list-inside space-y-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {[
                  "Click the \"add to cart\" button",
                  "Review your cart and proceed to checkout",
                  "Complete the payment process",
                  "Once the payment is confirmed, your order will be processed and shipped to you",
                ].map((step, index) => (
                  <li key={index} className="animate-slide-in-left" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex gap-4 animate-slide-in-up" style={{ animationDelay: "0.7s" }}>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white flex items-center gap-2 py-3 group hover:scale-105 transition-all duration-300"
                onClick={() => {
                  // In a real app, this would open Discord invite
                  addToCart(selectedProductslug);
                }}
              /* window.open(settings.discord_link, "_blank") */
              >
                <ExternalLink className="w-4 h-4" />
                Add to cart
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                className={`px-6 transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? "border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                  }`}
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Developer Modal */}
      <Dialog open={showDeveloperModal} onOpenChange={setShowDeveloperModal}>
        <DialogContent
          className={`max-w-md border animate-modal-in ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
        >
          <DialogHeader>
            <DialogTitle className="text-primary text-2xl font-bold animate-slide-in-left flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                O
              </div>
              Developer Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div
              className={`p-6 rounded-xl border border-primary/30 animate-slide-in-up ${isDarkMode ? "bg-slate-700/50" : "bg-primary/5"}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary mb-2">xOussamaii</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Full Stack Developer</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Available for projects</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Specialized in React & Laravel
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    2+ years of experience
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    I'm a passionate and versatile full-stack web developer .
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white flex items-center gap-2 py-3 group hover:scale-105 transition-all duration-300"
                onClick={() => {
                  window.open(settings.discord_link, "_blank")
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Contact on Discord
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                className={`px-6 transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? "border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                  }`}
                onClick={() => setShowDeveloperModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes pulse-green {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3) rotate(180deg);
          }
        }
        @keyframes twinkle-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px color-mix(in srgb, var(--primary), transparent 70%);
          }
          50% {
            box-shadow: 0 0 20px color-mix(in srgb, var(--primary), transparent 40%);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes check {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-pulse-green {
          animation: pulse-green 2s ease-in-out infinite;
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-twinkle-delayed {
          animation: twinkle-delayed 3s ease-in-out infinite;
        }
        .animate-twinkle-slow {
          animation: twinkle-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-check {
          animation: check 0.6s ease-in-out;
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out forwards;
        }
      `}} />
    </div>
  )
}