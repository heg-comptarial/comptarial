"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Utiliser Omit pour exclure onChange de l'interface étendue
interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string
  error?: string
  value: string
  onChange: (value: string) => void
  className?: string
  labelClassName?: string
}

export function PhoneInput({
  label,
  error,
  value,
  onChange,
  className,
  labelClassName,
  required,
  id,
  ...props
}: PhoneInputProps) {
  const [inputValue, setInputValue] = useState(value || "")

  useEffect(() => {
    setInputValue(value || "")
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // Supprimer tous les caractères non numériques sauf + au début
    let formatted = input.replace(/[^\d+]/g, "")

    // S'assurer que + n'apparaît qu'au début
    if (formatted.indexOf("+") > 0) {
      formatted = formatted.replace(/\+/g, "")
    }

    // Limiter la longueur à 15 chiffres (standard E.164)
    if (formatted.startsWith("+")) {
      formatted = "+" + formatted.substring(1).slice(0, 15)
    } else {
      formatted = formatted.slice(0, 15)
    }

    setInputValue(formatted)
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className={cn(labelClassName)}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={id}
        type="tel"
        value={inputValue}
        onChange={handleChange}
        className={cn(className)}
        placeholder="+33612345678"
        required={required}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

