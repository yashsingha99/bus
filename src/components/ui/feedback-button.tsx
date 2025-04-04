"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeedbackButtonProps extends React.ComponentProps<typeof Button> {
  soundEffect?: boolean
  vibration?: boolean
}

export function FeedbackButton({ className, soundEffect = true, vibration = true, ...props }: FeedbackButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for click sound
    if (soundEffect && typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/click.mp3")
      audioRef.current.preload = "auto"
      audioRef.current.volume = 0.3
    }

    return () => {
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [soundEffect])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play sound effect
    if (soundEffect && audioRef.current) {
      // Reset audio to start (allows rapid clicking)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => console.error("Error playing sound:", err))
    }

    // Trigger vibration if supported
    if (vibration && "vibrate" in navigator) {
      navigator.vibrate(40)
    }

    // Call the original onClick handler if it exists
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return <Button className={cn(className)} {...props} onClick={handleClick} />
}

