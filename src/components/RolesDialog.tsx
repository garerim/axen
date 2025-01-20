import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface RolesDialogProps {
  distributeRoles: () => void
}

export function RolesDialog({ distributeRoles }: RolesDialogProps) {

    const [werewolf, setWerewolf] = useState(2)
    const [villager, setVillager] = useState(2)
    const [seer, setSeer] = useState(1)
    const [hunter, setHunter] = useState(1) 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Distribuer les rôles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Distribuer les rôles</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="werewolf" className="text-right">
              Loups-garous
            </Label>
            <Input
              id="werewolf"
              value={werewolf}
              onChange={(e) => setWerewolf(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="villager" className="text-right">
              Villageois
            </Label>
            <Input
              id="villager"
              value={villager}
              onChange={(e) => setVillager(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="seer" className="text-right">
              Voyantes
            </Label>
            <Input
              id="seer"
              value={seer}
              onChange={(e) => setSeer(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hunter" className="text-right">
              Chasseurs
            </Label>
            <Input
              id="hunter"
              value={hunter}
              onChange={(e) => setHunter(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={distributeRoles}>Distribuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
