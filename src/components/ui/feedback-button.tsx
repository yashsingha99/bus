"use client"

import type React from "react"

import { useCallback, useRef } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeedbackButtonProps extends ButtonProps {
  soundEffect?: string
  vibration?: boolean
}

export function FeedbackButton({
  children,
  className,
  soundEffect = "/sounds/click.mp3",
  vibration = true,
  onClick,
  ...props
}: FeedbackButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    try {
      // Only try to play sound if we're in a browser environment
      if (typeof window !== "undefined") {
        // Create audio element if it doesn't exist
        if (!audioRef.current) {
          audioRef.current = new Audio(soundEffect)
        }
        
        // Try to play the sound, but don't throw if it fails
        audioRef.current.play().catch(err => {
          // Silently fail - sound is not critical
          console.debug("Sound playback not supported:", err)
        })
      }
    } catch (error) {
      // Silently fail - sound is not critical
      console.debug("Error playing sound:", error)
    }
  }, [soundEffect])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      playSound()
      onClick?.(e)

      // Trigger vibration if supported
      if (vibration && "vibrate" in navigator) {
        navigator.vibrate(40)
      }
    },
    [onClick, playSound, vibration]
  )

  return (
    <Button
      className={cn("", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  )
}

