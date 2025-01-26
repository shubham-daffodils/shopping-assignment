"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { stockData, getSeasonalItems, type StockItem } from "../data/stockData"

interface SuggestionsProps {
  onAddItem: (item: string) => void
  language: string
}

const translations = {
  en: {
    suggestions: "Suggestions",
    seasonal: "Seasonal",
  },
  es: {
    suggestions: "Sugerencias",
    seasonal: "De Temporada",
  },
  fr: {
    suggestions: "Suggestions",
    seasonal: "De Saison",
  },
}

const Suggestions: React.FC<SuggestionsProps> = ({ onAddItem, language }) => {
  const seasonalItems = getSeasonalItems()
  const randomSuggestions = getRandomSuggestions(3)
  const t = translations[language as keyof typeof translations] || translations["en"]

  const getTranslatedName = (item: StockItem) => {
    if (language === "en" || !(language in translations)) return item.name
    const index = language === "es" ? 0 : 1
    return item.translations[index] || item.name
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-white">{t.suggestions}</h3>
      <div className="flex flex-wrap gap-2">
        {seasonalItems.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => onAddItem(item.name)}
            className="bg-white/20 text-white hover:bg-white/30"
          >
            {getTranslatedName(item)} ({t.seasonal})
          </Button>
        ))}
        {randomSuggestions.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            onClick={() => onAddItem(item.name)}
            className="bg-white/20 text-white hover:bg-white/30"
          >
            {getTranslatedName(item)}
          </Button>
        ))}
      </div>
    </div>
  )
}

function getRandomSuggestions(count: number): StockItem[] {
  const shuffled = [...stockData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default Suggestions

