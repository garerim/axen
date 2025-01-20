import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User } from "lucide-react"
import { useWebSocket } from "./provider/WebSocketProvider"
import { Card, CardContent } from "@/components/ui/card"

export default function PlayerList() {

    const { playersInGame } = useWebSocket()

    return (
        <Card className="w-fit h-auto absolute top-1 right-1 m-2 shadow-md">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="px-3">
                        Liste des joueurs ({playersInGame.length})
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="pb-0">
                            {playersInGame.map((player) => (
                                <div key={player.id} className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <p>{player.pseudo}</p>
                                </div>
                            ))}
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}
