import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

export default function GameChat() {
  return (
    <div className="w-full h-full flex flex-col p-4">
        <ChatMessageList />
        <ChatInput />
    </div>
  )
}
