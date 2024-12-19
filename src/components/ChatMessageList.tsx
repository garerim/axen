import { cn } from "@/lib/utils"
import { useWebSocket } from "./provider/WebSocketProvider"

export default function ChatMessageList() {

    const { messages, role } = useWebSocket()

  return (
    <div className="w-full flex-1 overflow-y-auto py-2" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
        {messages.filter(message => message.type !== 'error').map((message, index) => (
            <div key={index}>
                <p><span className={cn("font-bold", role === 'loup' && message.role === 'loup' && "text-red-500")}>{message.sender || 'Système'}</span> : {message.message}</p>
            </div>
        ))}
    </div>
  )
}
