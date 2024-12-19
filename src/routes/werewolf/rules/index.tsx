import { RulesPage } from '@/components/pages/werewolf/Rules/RulesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/werewolf/rules/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
        <RulesPage />
    </main>
  )
}
