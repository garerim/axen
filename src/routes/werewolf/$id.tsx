import { createFileRoute } from '@tanstack/react-router'
import BoardGame from '@/components/BoardGame'
import GameChat from '@/components/GameChat'
import { useTheme } from '@/components/provider/ThemeProvider'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useEffect } from 'react'
import { Helmet } from "react-helmet"

export const Route = createFileRoute('/werewolf/$id')({
  component: WerewolfPage,
})

function WerewolfPage() {
  // const { id } = Route.useParams()

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
      <div className='md:block hidden w-full h-full'>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className='relative'>
            <BoardGame />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel maxSize={30} minSize={20} defaultSize={20}>
            <GameChat />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className='md:hidden block w-full h-full'>
        <BoardGame />
      </div>
    </div>
  )
}
