"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { STOCK_TYPES } from "@/types/stock_types"

interface StockData {
  [key: string]: string
}

interface StockFormProps {
  onSubmit: (stocks: StockData[]) => void
  isLoading?: boolean
}

export function StockForm({ onSubmit, isLoading = false }: StockFormProps) {
  const [selectedType, setSelectedType] = useState<string>("discord_nitro")
  const [stocks, setStocks] = useState<{ type: string; data: StockData }[]>([])
  const [currentData, setCurrentData] = useState<StockData>({})

  const currentTypeConfig = STOCK_TYPES[selectedType as keyof typeof STOCK_TYPES]

  const handleAddStock = () => {
    const allFilled = currentTypeConfig.fields.every((field) => currentData[field.key]?.trim())

    if (!allFilled) {
      toast.error("Please fill in all fields")
      return
    }

    setStocks([...stocks, { type: selectedType, data: { ...currentData } }])
    setCurrentData({})
    toast.success("Stock added to list")
  }

  const handleRemoveStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (stocks.length === 0) {
      toast.error("Please add at least one stock")
      return
    }

    const stockDataArray = stocks.map((stock) => stock.data)
    onSubmit(stockDataArray)
    setStocks([])
    setCurrentData({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white">Stock Type *</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {Object.entries(STOCK_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700">
        {currentTypeConfig.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <Label htmlFor={field.key} className="text-white text-sm">
              {field.label}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              value={currentData[field.key] || ""}
              onChange={(e) =>
                setCurrentData({
                  ...currentData,
                  [field.key]: e.target.value,
                })
              }
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled={field.disabled}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAddStock}
        variant="outline"
        className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent gap-2"
      >
        <Plus className="w-4 h-4" />
        Add to List
      </Button>

      {stocks.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-slate-700">
          <p className="text-sm text-gray-400 font-medium">Stocks to Add ({stocks.length})</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stocks.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-900/50 border border-slate-700 rounded gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cyan-400">{STOCK_TYPES[stock.type as keyof typeof STOCK_TYPES]?.label}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {Object.entries(stock.data)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" • ")}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveStock(index)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={stocks.length === 0 || isLoading}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50"
        >
          {isLoading ? "Adding..." : `Add ${stocks.length} Stock${stocks.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </form>
  )
}
