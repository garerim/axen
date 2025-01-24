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
import { useEffect, useState } from "react"
import { useWebSocket } from "./provider/WebSocketProvider"

export function RolesDialog() {

    const [werewolf, setWerewolf] = useState(0)
    const [villager, setVillager] = useState(0)
    const [seer, setSeer] = useState(0)
    const [hunter, setHunter] = useState(0)
    const [witch, setWitch] = useState(0)
    const [littleGirl, setLittleGirl] = useState(0)

    const [error, setError] = useState('')

    const { distributeRoles, playersInGame, defaultRoles } = useWebSocket();

    useEffect(() => {
        if (!defaultRoles) return;
        setWerewolf(defaultRoles?.filter(role => role === 'werewolf').length || 0)
        setVillager(defaultRoles?.filter(role => role === 'villager').length || 0)
        setSeer(defaultRoles?.filter(role => role === 'seer').length || 0)
        setHunter(defaultRoles?.filter(role => role === 'hunter').length || 0)
        setWitch(defaultRoles?.filter(role => role === 'witch').length || 0)
        setLittleGirl(defaultRoles?.filter(role => role === 'littleGirl').length || 0)
    }, [defaultRoles])

    const sendRoles = () => {
        const totalRoles = werewolf + villager + seer + hunter + witch;
        if (totalRoles !== playersInGame.length) {
            setError(`Le nombre total de rôles (${totalRoles}) doit être égal au nombre de joueurs (${playersInGame.length}).`);
            return;
        }

        const goodRoles = villager + seer + hunter + witch;
        const badRoles = werewolf;

        if (goodRoles <= badRoles) {
            setError(`Il doit y avoir plus de gentils (${goodRoles}) que de méchants (${badRoles}).`);
            return;
        }

        const roles = [
            ...Array(werewolf).fill('werewolf'),
            ...Array(villager).fill('villager'),
            ...Array(seer).fill('seer'),
            ...Array(hunter).fill('hunter'),
            ...Array(witch).fill('witch'),
            ...Array(littleGirl).fill('littleGirl')
        ];
        distributeRoles(roles);
        setError('');
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Distribuer les rôles</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Distribuer les rôles</DialogTitle>
                </DialogHeader>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="werewolf" className="text-right">
                            Loups-garous
                        </Label>
                        <Input
                            id="werewolf"
                            value={werewolf}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setWerewolf(0)
                                } else {
                                    setWerewolf(parseInt(e.target.value))
                                }
                            }}
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
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setVillager(0)
                                } else {
                                    setVillager(parseInt(e.target.value))
                                }
                            }}
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
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setSeer(0)
                                } else {
                                    setSeer(parseInt(e.target.value))
                                }
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="witch" className="text-right">
                            Sorcière
                        </Label>
                        <Input
                            id="witch"
                            value={witch}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setWitch(0)
                                } else {
                                    setWitch(parseInt(e.target.value))
                                }
                            }}
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
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setHunter(0)
                                } else {
                                    setHunter(parseInt(e.target.value))
                                }
                            }}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="littleGirl" className="text-right">
                            Petite fille
                        </Label>
                        <Input
                            id="littleGirl"
                            value={littleGirl}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setLittleGirl(0)
                                } else {
                                    setLittleGirl(parseInt(e.target.value))
                                }
                            }}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={sendRoles}>Distribuer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
