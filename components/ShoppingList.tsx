"use client"
import type React from "react"
import { useState, useEffect } from "react"
import VoiceRecognition from "./VoiceRecognition"
import Suggestions from "./Suggestions"
import { processCommand, findItem, categorizeItem, detectLanguage } from "../utils/nlp"
import { stockData, type StockItem } from "../data/stockData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ShoppingListItem extends StockItem {
  quantity: number
}

const translations = {
  en: {
    title: "Voice Command Shopping Assistant",
    inputPlaceholder: "Type an item...",
    shoppingList: "Shopping List",
    quantity: "Qty",
    suggestions: "Suggestions",
    seasonal: "Seasonal",
    errorNotAvailable: 'Sorry, "{item}" is not available in our stock.',
    errorOutOfStock: 'Sorry, "{item}" is out of stock.',
    errorMaxStock: 'You\'ve reached the maximum available quantity for "{item}".',
    processedCommand: "Processed command: {command}",
    total: "Total",
  },
  es: {
    title: "Asistente de Compras por Voz",
    inputPlaceholder: "Escribe un artículo...",
    shoppingList: "Lista de Compras",
    quantity: "Cant",
    suggestions: "Sugerencias",
    seasonal: "De Temporada",
    errorNotAvailable: 'Lo siento, "{item}" no está disponible en nuestro stock.',
    errorOutOfStock: 'Lo siento, "{item}" está agotado.',
    errorMaxStock: 'Has alcanzado la cantidad máxima disponible para "{item}".',
    processedCommand: "Comando procesado: {command}",
    total: "Total",
  },
  fr: {
    title: "Assistant d'Achat à Commande Vocale",
    inputPlaceholder: "Tapez un article...",
    shoppingList: "Liste de Courses",
    quantity: "Qté",
    suggestions: "Suggestions",
    seasonal: "De Saison",
    errorNotAvailable: 'Désolé, "{item}" n\'est pas disponible dans notre stock.',
    errorOutOfStock: 'Désolé, "{item}" est en rupture de stock.',
    errorMaxStock: 'Vous avez atteint la quantité maximale disponible pour "{item}".',
    processedCommand: "Commande traitée : {command}",
    total: "Total",
  },
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [feedback, setFeedback] = useState<string>("")
  const [language, setLanguage] = useState<string>("en")
  const [lastVoiceInput, setLastVoiceInput] = useState<string>("")

  const t = translations[language as keyof typeof translations] || translations["en"]

  const addItem = (itemName: string, quantity = 1) => {
    const stockItem = findItem(itemName)
    if (!stockItem) {
      toast.error(t.errorNotAvailable.replace("{item}", itemName))
      return
    }
    if (!stockItem.inStock) {
      toast.error(t.errorOutOfStock.replace("{item}", itemName))
      return
    }
    const existingItem = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase())
    if (existingItem) {
      if (existingItem.quantity + quantity > stockItem.maxStock) {
        toast.error(t.errorMaxStock.replace("{item}", itemName))
        return
      }
      setItems(
        items.map((item) =>
          item.name.toLowerCase() === itemName.toLowerCase() ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      )
    } else {
      if (quantity > stockItem.maxStock) {
        toast.error(t.errorMaxStock.replace("{item}", itemName))
        return
      }
      setItems([...items, { ...stockItem, quantity }])
    }
  }

  const removeItem = (itemName: string) => {
    setItems(items.filter((item) => item.name.toLowerCase() !== itemName.toLowerCase()))
  }

  const updateQuantity = (itemName: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.name.toLowerCase() === itemName.toLowerCase()) {
          const newQuantity = item.quantity + delta
          if (newQuantity < 1) {
            return item
          }
          if (newQuantity > item.maxStock) {
            toast.error(t.errorMaxStock.replace("{item}", itemName))
            return item
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const handleVoiceResult = (result: string) => {
    setLastVoiceInput(result)
    try {
      const { action, item, quantity, language } = processCommand(result)
      setLanguage(language)
      if (action === "add") {
        addItem(item, quantity)
      } else if (action === "remove") {
        removeItem(item)
      }
      toast.info(t.processedCommand.replace("{command}", result))
    } catch (error) {
      console.error("Error processing voice command:", error)
      toast.error("Sorry, I couldn't understand that command. Please try again.")
    }
  }

  const handleVoiceError = (error: string) => {
    toast.error(`Error: ${error}`)
  }

  const handleSuggestionClick = (item: string) => {
    addItem(item)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <CardHeader>
          <CardTitle className="text-white text-3xl font-bold">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Input
              type="text"
              placeholder={t.inputPlaceholder}
              className="bg-white/20 text-white placeholder-white/70"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const input = e.currentTarget as HTMLInputElement
                  addItem(input.value)
                  input.value = ""
                }
              }}
            />
            <VoiceRecognition onResult={handleVoiceResult} onError={handleVoiceError} />
          </div>
          {lastVoiceInput && (
            <div className="mb-4 p-2 bg-white/10 rounded text-white">
              <span className="font-semibold">Last voice input:</span> {lastVoiceInput}
            </div>
          )}
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4 text-white">{t.shoppingList}</h3>
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/20 text-white">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.name, -1)}
                    className="text-white hover:bg-white/20"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {t.quantity}: {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(item.name, 1)}
                    className="text-white hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.name)}
                    className="text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {items.length > 0 && (
              <div className="mt-4 text-right text-white">
                <span className="font-bold">
                  {t.total}: ${calculateTotal()}
                </span>
              </div>
            )}
          </div>
          <Suggestions onAddItem={handleSuggestionClick} language={language} />
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  )
}

export default ShoppingList

