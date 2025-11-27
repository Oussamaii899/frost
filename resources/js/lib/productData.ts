export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  badge: string;
  stock: "In Stock" | "Out of Stock";
  boostLevel?: string;
}

export interface ProductCategories {
  [key: string]: Product[];
}

export const productCategories: ProductCategories = {
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
};

export function getBadgeColor(badge: string): string {
  switch (badge) {
    case "Most Popular":
    case "Popular":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Best Value":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Premium":
    case "Advanced":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Custom":
      return "bg-pink-500/20 text-pink-400 border-pink-500/30";
    case "Ultimate":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  }
}

export function calculateSavingsPercentage(price: string, originalPrice: string): number {
  const priceNum = parseFloat(price.slice(1));
  const originalPriceNum = parseFloat(originalPrice.slice(1));
  return Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
}
