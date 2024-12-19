import * as React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { setPseudoLocale, useWebSocket } from "./provider/WebSocketProvider"

const PseudoDialog = () => {
  const [pseudo, setPseudo] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  const { sendMessage } = useWebSocket()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Pseudo submitted:", pseudo)
    sendMessage("setPseudo", pseudo)
    setPseudoLocale(pseudo)
    setIsOpen(false)
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
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PseudoDialog
