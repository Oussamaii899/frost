import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Home,
  Settings,
  BarChart,
  Clock,
  AlertCircle,
  CheckCircle,
  Box,
  Zap,
  Gamepad2,
  Server,
  Bot,
  Music,
  Camera,
  Crown,
  Globe,
  type LucideIcon,
} from "lucide-react"

export const iconMap: Record<string, LucideIcon> = {
  // Standard icons
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Home,
  Settings,
  BarChart,
  Clock,
  AlertCircle,
  CheckCircle,
  Box: Box,
  Zap: Zap,
  Music: Music, // Closest alternative to Spotify icon
  Camera: Camera, // Closest alternative to Instagram icon
  Crown: Crown,   // Closest alternative to Twitch icon
  Globe: Globe,   // Closest alternative to Twitter icon
  Gamepad2: Gamepad2,
  Snapchat: Package, // Fallback since Lucide doesn't have Snapchat
  Robot: Bot,
  Server,
}

export function getIcon(iconName: string | LucideIcon): LucideIcon | undefined {
  if (typeof iconName === "string") {
    return iconMap[iconName]
  }
  return iconName as LucideIcon
}
