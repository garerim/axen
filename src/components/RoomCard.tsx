import { ArrowRight } from "lucide-react";
import { Room } from "./provider/WebSocketProvider";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "./ui/card";
import RoomCardImg from "@/assets/werewolf/roomCard.png";
import RoomCardImg2 from "@/assets/werewolf/roomCard2.png";
import RoomCardImg3 from "@/assets/werewolf/roomCard3.png";

interface RoomCardProps {
    room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {

    const roomCardArray = [RoomCardImg, RoomCardImg2, RoomCardImg3]
    const randomRoomCard = roomCardArray[room.roomImg - 1]

    return (
        <a href={`/werewolf/${room.roomId}`}>
            <Card className="p-0 overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-md">
                <CardContent className="p-0">
                    <img className="max-w-[280px]" src={randomRoomCard} alt="Room" />
                </CardContent>
                <CardFooter className="flex flex-col items-start pt-2 pb-2">
                    <CardTitle>{room.roomName}</CardTitle>
                    <CardDescription className="w-full flex items-center gap-2">
                        Nombre de joueurs: {room.playersInGame.length}
                        <ArrowRight className="w-7 h-7 ml-auto text-black -mr-3" />
                    </CardDescription>
                </CardFooter>
            </Card>
        </a>
    )
}