import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useWebSocket } from '@/components/provider/WebSocketProvider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import RoomCard from '@/components/RoomCard'

export const Route = createFileRoute('/werewolf/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { createRoom, rooms } = useWebSocket()
  const [roomName, setRoomName] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value)
  }

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (roomName && roomName !== 'none' && roomName !== '') {
      createRoom(roomName)
      setRoomName('')
      setIsPopoverOpen(false)
    }
  }

  const filteredRooms = Object.values(rooms).filter(room =>
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className='flex flex-col items-center justify-center h-[100dvh] pb-2'>
      <div className='relative w-full flex flex-row items-center justify-center gap-2 p-2'>
        <a href="/">
          <Button variant="ghost" size="icon" className='absolute left-4 top-1'>
            <ArrowLeft className='w-5 h-5' />
          </Button>
        </a>
        <h1 className='text-2xl md:text-3xl font-bold'>Loup-Garou</h1>
      </div>

      <Input
        type="text"
        placeholder='Rechercher une partie'
        className='w-full max-w-[400px] mb-4 mx-auto md:mx-4 self-start'
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className='flex-1 w-full flex flex-wrap gap-3 p-4 justify-center md:justify-start overflow-y-scroll'>
        {filteredRooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className='mt-2' variant="outline" onClick={() => setIsPopoverOpen(true)}>Créer une partie</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <form onSubmit={handleCreateRoom} className=" flex flex-row items-center gap-2">
            <Label htmlFor="roomName">Nom de la partie</Label>
            <Input
              id="roomName"
              defaultValue="none"
              className="col-span-2 h-8"
              value={roomName}
              onChange={handleRoomNameChange}
            />
            <Button type="submit"><Plus /></Button>
          </form>
        </PopoverContent>
      </Popover>

    </div>
  )
}

