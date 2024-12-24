import * as React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { setPseudoLocale, useWebSocket } from "./provider/WebSocketProvider"

const PseudoDialog = () => {
  const [pseudo, setPseudo] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [error, setError] = useState("")

  const { sendMessage, players } = useWebSocket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (players.find(player => player.pseudo === pseudo.trim())) {
      setError("Ce pseudo est déjà utilisé.");
      setPseudo("");
      return
    }
    
    if (pseudo.trim().length < 3) {
      setError("Le pseudo doit contenir au moins 3 caractères.");
      setPseudo("");
      return
    }

    const trimmedPseudo = pseudo.trim();
    sendMessage("setPseudo", trimmedPseudo)
    setPseudoLocale(trimmedPseudo)
    setIsOpen(false)
    window.location.reload();
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrer votre pseudo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Entrer votre pseudo"
            className="input"
          />
          <Button type="submit" className="w-full">
            Valider
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PseudoDialog
