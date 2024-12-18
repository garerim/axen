import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/werewolf/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Werewolf</h1>
    </div>
  )
}
