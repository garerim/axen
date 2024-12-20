import { User } from "lucide-react"
import { useWebSocket } from "./provider/WebSocketProvider"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function PlayerList() {

    const { playersInGame } = useWebSocket()

    return (
        <Card className="w-fit h-auto absolute top-1 right-1 m-2 shadow-md">
            <CardHeader>
                <CardTitle>Liste des joueurs</CardTitle>
            </CardHeader>
            <CardContent>
                {playersInGame.map((player) => (
                    <div key={player.id} className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <p>{player.pseudo}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
