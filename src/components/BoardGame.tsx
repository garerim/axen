import PlayerList from "@/components/PlayerList"
import { getPseudoLocale, PHASE_DURATIONS, Player, useWebSocket } from "@/components/provider/WebSocketProvider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Heart, Skull, Triangle } from "lucide-react"
import { useEffect } from "react"
import { useTheme } from "@/components/provider/ThemeProvider"
import { Progress } from "@/components/ui/progress"
import { WerewolfRole } from "@/components/Werewolf/WerewolfCard/types"
import { WerewolfCard } from "@/components/Werewolf/WerewolfCard/WerewolfCard"

export default function BoardGame() {

  const { setTheme } = useTheme()

  const {
    currentPlayer,
    gameCanStart,
    role,
    joinGame,
    playersInGame,
    distributeRoles,
    rolesDistributed,
    startGame,
    phaseTimeRemaining,
    currentPhase,
    voteWerewolf,
    werewolfVoted,
    voteDay,
    dayVoted
  } = useWebSocket()

  useEffect(() => {
    if (currentPhase === "night-werewolf") {
      setTheme("night")
    } else {
      setTheme("day")
    }
  }, [currentPhase])

  const PhaseName = {
    'night-werewolf': 'Nuit des loups',
    'day-discussion': 'Discussion du jour',
    'day-vote': 'Vote du jour',
    'waiting': 'En attente des autres joueurs',
  }

  const isCardFlipped = (player: Player) => {
    let res = true;
    if (player.pseudo === getPseudoLocale()) {
      res = false;
    }
    if (role === 'werewolf') {
      if (player.role === 'werewolf') {
        res = false;
      }
    }
    return res;
  }

  const canWerewolfVote = () => {
    return currentPhase === "night-werewolf" && role === 'werewolf' && currentPlayer?.isAlive;
  }

  const canDayVote = () => {
    return currentPhase === "day-vote" && currentPlayer?.isAlive;
  }

  return (
    <div className={cn("w-full h-full")}>
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
          <div className="absolute w-full px-4 flex flex-col items-center gap-2 bottom-4 left-1/2 -translate-x-1/2">
            <p>Phase : {PhaseName[currentPhase]}</p>
            <Progress value={phaseTimeRemaining * 100 / PHASE_DURATIONS[currentPhase]} />
          </div>
        )
      }

      <div className=" w-full h-4/5 flex items-center justify-center flex-wrap gap-4">
        {playersInGame.map((player) => (
          <div className="relative flex flex-col items-center" key={player.id} onClick={canWerewolfVote() && player.isAlive ? () => voteWerewolf(player.pseudo, getPseudoLocale() ?? "") : canDayVote() ? () => voteDay(player.pseudo, getPseudoLocale() ?? "") : undefined}>

            {werewolfVoted.find(vote => vote.votedPseudo === player.pseudo && vote.voterPseudo === currentPlayer?.pseudo) !== undefined && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-180">
                <Triangle className="w-8 h-8 text-green-500 fill-green-500 animate-bounce" />
              </div>
            )}

            {dayVoted.find(vote => vote.votedPseudo === player.pseudo && vote.voterPseudo === currentPlayer?.pseudo) !== undefined && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-180">
                <Triangle className="w-8 h-8 text-green-500 fill-green-500 animate-bounce" />
              </div>
            )}

            <div className="flex items-center gap-2 justify-center">
              {player.pseudo} {player.isAlive ? <Heart fill="red" className="w-4 h-4 text-red-500" /> : <Skull className="w-4 h-4" />}
            </div>

            {(role === 'werewolf' && currentPhase === "night-werewolf") && werewolfVoted.filter(vote => vote.votedPseudo === player.pseudo).length}
            {currentPhase === "day-vote" && dayVoted.filter(vote => vote.votedPseudo === player.pseudo).length}

            <WerewolfCard role={player.role as WerewolfRole} isFlipped={isCardFlipped(player)} isAlive={player.isAlive} className="w-48 h-48" />
          </div>
        ))}
      </div>
    </div>
  )
}
