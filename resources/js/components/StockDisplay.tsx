"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface StockDisplayProps {
  stock: any
  onDelete: () => void
  isDeleting?: boolean
}

export function StockDisplay({ stock, onDelete, isDeleting = false }: StockDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  let stockData: Record<string, string> = {}
  try {
    if (typeof stock.data === "string") {
      stockData = JSON.parse(stock.data)
    } else {
      stockData = stock.data
    }
  } catch {
    console.error("Failed to parse stock data:", stock.data)
  }

  const dataEntries = Object.entries(stockData)

  return (
    <div className="border border-slate-700 rounded overflow-hidden bg-slate-900/30">
      <div className="flex items-center justify-between p-3 hover:bg-slate-900/50 transition-colors">
        <div className="flex-1 min-w-0">
          {dataEntries.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">{dataEntries[0][0]}:</span>
                <Badge variant="secondary" className="text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                  {String(dataEntries[0][1]).substring(0, 30)}
                  {String(dataEntries[0][1]).length > 30 ? "..." : ""}
                </Badge>
              </div>
              {dataEntries.length > 1 && (
                <p className="text-xs text-gray-600">
                  +{dataEntries.length - 1} more field{dataEntries.length - 1 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
          <p className="text-xs text-gray-600 mt-2">{new Date(stock.created_at).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2 ml-3">
          {dataEntries.length > 1 && (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-400"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isExpanded && dataEntries.length > 1 && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3 space-y-2">
          {dataEntries.map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="text-xs text-gray-500 min-w-fit">{key}:</span>
              <span className="text-xs text-gray-300 break-all">
                {String(value).substring(0, 60)}
                {String(value).length > 60 ? "..." : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
