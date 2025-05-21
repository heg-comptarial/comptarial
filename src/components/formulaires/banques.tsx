"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BanquesData {
  banque_id?: number
  prive_id?: number
  nb_compte: number
}

interface BanquesProps {
  data: BanquesData | null
  onUpdate: (data: BanquesData) => void
  onNext: () => void
  onPrev: () => void
}

export default function Banques({ data, onUpdate, onNext, onPrev }: BanquesProps) {
  const [nbCompte, setNbCompte] = useState<number>(data?.nb_compte ?? 1)

  useEffect(() => {
    onUpdate({ ...data, nb_compte: nbCompte })
  }, [nbCompte])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="nbCompte" className="block text-sm font-medium text-gray-700">
          Combien de comptes bancaires avez-vous ?
        </label>
        <Input
          id="nbCompte"
          type="number"
          min={0}
          value={nbCompte}
          onChange={(e) => setNbCompte(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={onNext}>Continuer</Button>
      </div>
    </div>
  )
}
