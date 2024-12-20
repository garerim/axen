import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { getPseudoLocale, useWebSocket } from "./provider/WebSocketProvider";
import { useState } from "react";

export default function ChatInput() {
    const { sendMessage, role, currentPhase, currentPlayer } = useWebSocket()

    const [text, setText] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim()) return;

        const messageData = {
            type: 'message',
            data: {
                chatType: 'general',
                message: text,
                sender: getPseudoLocale(),
                role: role
            }
        };

        sendMessage(messageData.type, messageData.data);
        setText('');
    };

    const isDisabled = (currentPhase.includes('night') && role !== 'werewolf') || currentPlayer?.isAlive === false

    return (
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tapez un message..." disabled={isDisabled} />
            <Button className="bg-green-500 hover:bg-green-600" disabled={isDisabled}>
                <Send />
            </Button>
        </form>
    )
}