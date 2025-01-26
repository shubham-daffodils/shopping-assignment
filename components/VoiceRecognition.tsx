"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { detectLanguage } from "../utils/nlp"

interface VoiceRecognitionProps {
  onResult: (result: string) => void
  onError: (error: string) => void
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [language, setLanguage] = useState("en-US")

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const result = event.results[0][0].transcript
          onResult(result)
        } else {
          onError("No speech was detected")
        }
      }

      recognitionInstance.onerror = (event: any) => {
        onError(`Error occurred in recognition: ${event.error}`)
      }

      setRecognition(recognitionInstance)
    } else {
      onError("Speech recognition is not supported in this browser")
    }
  }, [onResult, onError])

  const toggleListening = () => {
    if (isListening) {
      recognition.stop()
    } else {
      recognition.lang = language
      recognition.start()
    }
    setIsListening(!isListening)
  }

  const getFullLanguageCode = (shortCode: string): string => {
    const langMap: { [key: string]: string } = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
    }
    return langMap[shortCode] || "en-US"
  }

  return (
    <Button onClick={toggleListening} variant="outline" size="icon">
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}

export default VoiceRecognition

