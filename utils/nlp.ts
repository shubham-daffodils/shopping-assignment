import { stockData, type StockItem } from "../data/stockData"
import LanguageDetect from "languagedetect"

const lngDetector = new LanguageDetect()

interface CommandResult {
  action: string
  item: string
  quantity?: number
  language: string
}

const actionKeywords: { [key: string]: { [key: string]: string[] } } = {
  en: {
    add: ["add", "buy", "get", "need", "want"],
    remove: ["remove", "delete", "take off"],
  },
  es: {
    add: ["añadir", "comprar", "obtener", "necesitar", "querer"],
    remove: ["quitar", "eliminar", "borrar"],
  },
  fr: {
    add: ["ajouter", "acheter", "obtenir", "avoir besoin", "vouloir"],
    remove: ["supprimer", "enlever", "retirer"],
  },
}

export function detectLanguage(text: string): string {
  const [detectedLang] = lngDetector.detect(text, 1)
  return detectedLang && detectedLang[0] in actionKeywords ? detectedLang[0] : "en"
}

export function processCommand(command: string): CommandResult {
  const language = detectLanguage(command)
  const lowercaseCommand = command.toLowerCase()
  let action = "add"
  let item = ""
  let quantity = 1

  const words = lowercaseCommand.split(" ")

  // Check for remove action
  if (actionKeywords[language].remove.some((keyword) => lowercaseCommand.includes(keyword))) {
    action = "remove"
  }

  // Check for quantity
  const numberIndex = words.findIndex((word) => !isNaN(Number(word)))
  if (numberIndex !== -1) {
    quantity = Number(words[numberIndex])
    words.splice(numberIndex, 1)
  }

  // Extract item name
  item = words
    .filter((word) => !actionKeywords[language].add.concat(actionKeywords[language].remove).includes(word))
    .join(" ")
    .trim()

  return { action, item, quantity, language }
}

export function findItem(itemName: string): StockItem | undefined {
  return stockData.find(
    (item) =>
      item.name.toLowerCase() === itemName.toLowerCase() ||
      item.translations.some((translation) => translation.toLowerCase() === itemName.toLowerCase()),
  )
}

export function categorizeItem(item: string): string {
  const foundItem = findItem(item)
  return foundItem ? foundItem.category : "Uncategorized"
}

