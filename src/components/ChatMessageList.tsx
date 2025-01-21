import { cn } from "@/lib/utils"
import { useWebSocket } from "./provider/WebSocketProvider"

export default function ChatMessageList() {

    const { messages, role } = useWebSocket()

  return (
    <div className="w-full flex-1 overflow-y-auto py-2" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
        {messages.filter(message => message.type !== 'error').map((message, index) => (
            <div key={index} className={
              cn(
                (message.time === 'night' && (role === 'werewolf' || role === 'littleGirl') && message.sender.role === 'werewolf') ? "block" : "hidden",
                (message.time === null) && "block",
                message.time === 'day' && "block"
              )
            }>
                <p><span className={cn("font-bold", (role === 'werewolf' && message.sender.role === 'werewolf') && "text-red-500")}>{(message.time === 'night' && role === 'littleGirl') ? '#######' : (message.sender.pseudo || 'Système')}</span> : {message.message}</p>
            </div>
        ))}
    </div>
  )
}
