import BoardGame from '@/components/BoardGame'
import GameChat from '@/components/GameChat'
import { useTheme } from '@/components/provider/ThemeProvider'
import { useWebSocket } from '@/components/provider/WebSocketProvider'
import PseudoDialog from '@/components/PseudoDialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/werewolf/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { isConnected } = useWebSocket()

  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("day")
  }, [])

  return (
    <div className='w-full h-full'>
      {isConnected ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className='relative'>
            <BoardGame />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel maxSize={35} minSize={20}>
            <GameChat />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <PseudoDialog />
      )}
    </div>
  )
}

