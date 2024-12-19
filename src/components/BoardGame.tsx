import PlayerList from "@/components/PlayerList"
import { getPseudoLocale, PHASE_DURATIONS, useWebSocket } from "@/components/provider/WebSocketProvider"
import { Button } from "@/components/ui/button"
import { Progress } from "./ui/progress"
import { WerewolfCard } from "./Werewolf/WerewolfCard/WerewolfCard"
import { WerewolfRole } from "./Werewolf/WerewolfCard/types"

export default function BoardGame() {

  const {
    gameCanStart,
    joinGame,
    playersInGame,
    distributeRoles,
    rolesDistributed,
    startGame,
    phaseTimeRemaining,
    currentPhase
  } = useWebSocket()

  const PhaseName = {
    'night-werewolf': 'Nuit des loups',
    'day-discussion': 'Discussion du jour',
    'day-vote': 'Vote du jour',
    'waiting': 'En attente des autres joueurs',
  }

  return (
    <div className="w-full h-full">
      <h1 className='text-2xl font-bold'>Werewolf</h1>
      <PlayerList />
      {
        currentPhase === "waiting" ? (
          <>
            {gameCanStart ? (
              <>
                {rolesDistributed ? (
                  <Button onClick={startGame} className='absolute bottom-4 left-1/2 -translate-x-1/2 '>
                    Lancer la partie
                  </Button>
                ) : (
                  <Button onClick={distributeRoles} className='absolute bottom-4 left-1/2 -translate-x-1/2 '>
                    Distribuer les rôles
                  </Button>
                )}
              </>
            ) : (
              <>
                {playersInGame.find(p => p.pseudo === getPseudoLocale()) !== undefined ? (
                  <Button disabled className='absolute bottom-4 left-1/2 -translate-x-1/2 '>
                    En attente des autres joueurs
                  </Button>
                ) : (
                  <Button onClick={joinGame} className='absolute bottom-4 left-1/2 -translate-x-1/2 '>
                    Joindre la partie
                  </Button>
                )
                }
              </>
            )}
          </>
        ) : (
          <div className="absolute w-full px-4 flex flex-col items-center gap-2 bottom-20 left-1/2 -translate-x-1/2">
            <p>Phase : {PhaseName[currentPhase]}</p>
            <Progress value={phaseTimeRemaining * 100 / PHASE_DURATIONS[currentPhase]} />
          </div>
        )
      }

      <div className=" w-full h-full flex items-center justify-center flex-wrap gap-4">
        {playersInGame.map((player) => (
          // <div className="flex flex-col items-center justify-center w-fit bg-slate-400 p-4 rounded-md" key={player.id}>
          //   <p>{player.pseudo}</p>
          //   <p>{player.role}</p>
          // </div>
          <WerewolfCard key={player.id} role={player.role as WerewolfRole} className="w-48 h-48" />
        ))}
      </div>

      {/* <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        {JSON.stringify(phaseTimeRemaining)}
        {JSON.stringify(currentPhase)}
      </div> */}

    </div>
  )
}
