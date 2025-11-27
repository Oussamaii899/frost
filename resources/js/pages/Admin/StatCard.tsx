import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { getIcon } from "./icon-map"

interface StatCardProps {
  title: string
  value: string | number
  icon: string | LucideIcon
  trend?: string
  trendUp?: boolean
  delay?: string
}

export function StatCard({ title, value, icon, trend, trendUp, delay }: StatCardProps) {
  const Icon = getIcon(icon)

  return (
    <Card
      className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 group animate-slide-in-up"
      style={{ animationDelay: delay }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              {value}
            </h3>
            {trend && <p className={`text-sm mt-2 ${trendUp ? "text-green-500" : "text-red-500"}`}>{trend}</p>}
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {Icon ? <Icon className="w-6 h-6 text-primary" /> : <div className="w-6 h-6 bg-primary/30 rounded" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
