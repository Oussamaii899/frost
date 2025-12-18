"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StockDisplayItemProps {
  data: any
}

export function StockDisplayItem({ data }: StockDisplayItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  let stockData = data
  if (data?.data && typeof data.data === "object") {
    stockData = data.data
  }

  const entries = Object.entries(stockData || {})
  const firstEntry = entries[0]
  const restEntries = entries.slice(1)

  if (!firstEntry) return null

  return (
    <div className="space-y-2">
      <div className="p-3 bg-slate-900/50 border border-slate-700 rounded">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">{firstEntry[0]}</p>
            <p className="text-sm text-primary font-medium truncate">{String(firstEntry[1])}</p>
          </div>
          {restEntries.length > 0 && (
            <Button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-primary h-8 w-8 p-0 flex-shrink-0"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          )}
        </div>
      </div>

      {isExpanded && restEntries.length > 0 && (
        <div className="pl-3 space-y-2 border-l-2 border-slate-600">
          {restEntries.map(([key, value]) => (
            <div key={key} className="p-2 bg-slate-900/30 rounded border border-slate-700/50">
              <p className="text-xs text-gray-500 mb-1">{key}</p>
              <p className="text-sm text-gray-300 break-all">{String(value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
