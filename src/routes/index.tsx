import bombeParty from "@/assets/bombeParty.png";
import posterBackGround from "@/assets/werewolf/backGround.png";
import { GamesCard, type GamesCardProps } from '@/components/GamesCard/GamesCard'
import { NavBar } from '@/components/NavBar/NavBar'
import { useTheme } from "@/components/provider/ThemeProvider";
import { useWebSocket } from "@/components/provider/WebSocketProvider";
import PseudoDialog from "@/components/PseudoDialog";
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Helmet } from "react-helmet";

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const GamesCardData: GamesCardProps[] = [
  {
    gameName: "Le jeu du Loup-Garou",
    gameDescription: "Un jeu mélangant bluff, déduction et stratégie.",
    gameDuration: 30,
    numberOfPlayers: { min: 8, max: 18 },
    gameImage: posterBackGround,
    link: "/werewolf",
  },
  {
    gameName: "Bombe Party",
    gameDescription: "Un jeu de rapidité et de réflexion.",
    gameDuration: 15,
    numberOfPlayers: { min: 2, max: 8 },
    gameImage: bombeParty,
    link: "/bomb-party",
    disabled: true,
  }
]

function RouteComponent() {

  const { isConnected } = useWebSocket()

  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("light")
  }, [])

  return (
    <div>
      <Helmet>
        <title>Axen - Games</title>
        <link rel="icon" type='image/png' href="logoAxenBase.png" sizes="24x24" />
      </Helmet>

      {isConnected ? (
        <>
          <NavBar />
          <div className="flex p-3 gap-2 flex-wrap">
            {GamesCardData.map((game, index) => (
              <GamesCard key={index.toString()} {...game} />
            ))}
          </div>
        </>
      ) : (
        <PseudoDialog />
      )}
    </div>
  )
}
