"use client"
import React, { useEffect, useRef, useState } from "react"

type FlashPriceProps = {
  value: number
  format: (value: number) => string
  className?: string
}

const FlashPrice: React.FC<FlashPriceProps> = ({ value, format, className }) => {
  const previousValueRef = useRef<number | null>(null)
  const [flashClass, setFlashClass] = useState<string>("")

  useEffect(() => {
    if (previousValueRef.current === null) {
      previousValueRef.current = value
      return
    }

    const previous = previousValueRef.current
    if (value > previous) {
      setFlashClass("flash-up ")
    } else if (value < previous) {
      setFlashClass("flash-down")
    }

    previousValueRef.current = value

    const timeout = setTimeout(() => setFlashClass(""), 1000)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className={`${flashClass} rounded-sm py-2  full ${className ?? ""}`}>
      {format(value)}
    </div>
  )
}

export default FlashPrice

