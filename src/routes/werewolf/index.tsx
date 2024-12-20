import BoardGame from '@/components/BoardGame'
import GameChat from '@/components/GameChat'
import PseudoDialog from '@/components/PseudoDialog'
import { useTheme } from '@/components/provider/ThemeProvider'
import { useWebSocket } from '@/components/provider/WebSocketProvider'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import {Helmet} from "react-helmet";

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
      <Helmet>
        <title>Axen - Loup-Garou</title>
        <link rel="icon" type='image/png' href="logoWerewolf.png" sizes="24x24" />
      </Helmet>
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

