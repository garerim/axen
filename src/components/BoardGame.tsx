import PlayerList from "@/components/PlayerList"
import { WerewolfCard } from "@/components/Werewolf/WerewolfCard/WerewolfCard"
import { WerewolfRole } from "@/components/Werewolf/WerewolfCard/types"
import { useTheme } from "@/components/provider/ThemeProvider"
import { PHASE_DURATIONS, Player, getPseudoLocale, useWebSocket } from "@/components/provider/WebSocketProvider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti";
import { Heart, Skull, Triangle } from "lucide-react"

import { useEffect, useState } from "react"

export default function BoardGame() {

  const { setTheme } = useTheme();
  const [seerFlip, setSeerFlip] = useState<string>("");

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
    dayVoted,
    seerHasFlipped,
    setSeerHasFlipped,
    winner,
    resetGame,
    canGameReset,
    sendMessage
  } = useWebSocket()

  useEffect(() => {
    if (currentPhase.includes('night')) {
      setTheme("night")
    } else {
      setTheme("day")
    }
  }, [currentPhase])

  useEffect(() => {
    if (winner === "villager") {
      const end = Date.now() + 3 * 1000; // 3 seconds
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    } else if (winner === "werewolf") {
      const scalar = 2;
      const blood = confetti.shapeFromText({ text: "🩸", scalar });

      const defaults = {
        spread: 360,
        ticks: 60,
        gravity: 0,
        decay: 0.96,
        startVelocity: 20,
        shapes: [blood],
        scalar,
      };

      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 30,
        });

        confetti({
          ...defaults,
          particleCount: 5,
        });

        confetti({
          ...defaults,
          particleCount: 15,
          scalar: scalar / 2,
        });
      };

      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
      setTimeout(shoot, 300);
      setTimeout(shoot, 500);
    }
  }, [winner])

  const PhaseName = {
    'night-seer': 'Tour de la voyante',
    'night-werewolf': 'Tour des loups',
    'day-discussion': 'Discussion du jour',
    'day-vote': 'Vote du jour',
    'waiting': 'En attente des autres joueurs',
  }

  const isCardFlipped = (player: Player, flip: boolean = false) => {
    let res = true;

    if (!player.isAlive) {
      return false;
    }

    if (flip) {
      return true;
    }


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

  const canSeerFlipCard = () => {
    return currentPhase === "night-seer" && role === 'seer' && currentPlayer?.isAlive && !seerHasFlipped;
  }

  const seerFlipCard = (player: Player) => {
    if (player.pseudo !== currentPlayer?.pseudo) {
      setSeerFlip(player.pseudo)
      setSeerHasFlipped(true)
    }
  }

  const leaveGame = () => {
    sendMessage("leaveGame", {
      pseudo: currentPlayer?.pseudo,
      roleDistributed: rolesDistributed,
    })
  }

  useEffect(() => {
    if (seerFlip !== "") {
      setTimeout(() => {
        setSeerFlip("")
      }, 2000)
    }
  }, [seerFlip])

  return (
    <div className={cn("w-full h-full")}>
      <h1 className='text-2xl text-center font-bold'><p>Phase : {PhaseName[currentPhase]}</p></h1>
      <PlayerList />
      {
        currentPhase === "waiting" ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {gameCanStart ? (
              <>
                {rolesDistributed ? (
                  <>
                    {rolesDistributed}
                    {playersInGame.length > 0 && currentPlayer?.pseudo === playersInGame[0].pseudo ? (
                      <Button onClick={startGame} >
                        Lancer la partie
                      </Button>
                    ) : (
                      <Button disabled >
                        En attente du créateur de la partie
                      </Button>
                    )}
                    <Button onClick={() => leaveGame()}>
                      Quitter la partie
                    </Button>
                  </>
                ) : (
                  <>
                    {playersInGame.length > 0 && currentPlayer?.pseudo === playersInGame[0].pseudo ? (
                      <Button onClick={distributeRoles} >
                        Distribuer les rôles {rolesDistributed}
                      </Button>
                    ) : (
                      <Button disabled >
                        En attente du créateur de la partie
                      </Button>
                    )}
                    <Button onClick={() => leaveGame()}>
                      Quitter la partie
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {playersInGame.find(p => p.pseudo === getPseudoLocale()) !== undefined ? (
                  <>
                    <Button disabled >
                      En attente des autres joueurs
                    </Button>
                    <Button onClick={() => leaveGame()}>
                      Quitter la partie
                    </Button>
                  </>
                ) : (
                  <>
                    {canGameReset ? (
                      <Button onClick={resetGame} >
                        Recommencer la partie
                      </Button>
                    ) : (
                      <Button onClick={joinGame} >
                        Joindre la partie
                      </Button>
                    )}
                  </>
                )
                }
              </>
            )}
          </div>
        ) : (
          <div className="absolute w-full px-4 flex flex-col items-center gap-2 bottom-4 left-1/2 -translate-x-1/2">
            <Progress value={phaseTimeRemaining * 100 / PHASE_DURATIONS[currentPhase]} />
          </div>
        )
      }

      <div className=" w-full h-4/5 flex items-center justify-center flex-wrap gap-4">
        {playersInGame.map((player) => (
          <div className="relative flex flex-col items-center" key={player.id} onClick={canWerewolfVote() && player.isAlive ? () => voteWerewolf(player.pseudo, getPseudoLocale() ?? "") : canDayVote() ? () => voteDay(player.pseudo, getPseudoLocale() ?? "") : canSeerFlipCard() ? () => seerFlipCard(player) : undefined}>

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
              {player.pseudo} {JSON.stringify(isCardFlipped(player))} {player.isAlive ? <Heart fill="red" className="w-4 h-4 text-red-500" /> : <Skull className="w-4 h-4" />}
            </div>

            {(role === 'werewolf' && currentPhase === "night-werewolf") && werewolfVoted.filter(vote => vote.votedPseudo === player.pseudo).length}
            {currentPhase === "day-vote" && dayVoted.filter(vote => vote.votedPseudo === player.pseudo).length}

            <WerewolfCard role={player.role as WerewolfRole} isFlipped={seerFlip === player.pseudo ? false : isCardFlipped(player)} isAlive={player.isAlive} className="w-48 h-48" />
          </div>
        ))}
      </div>
    </div>
  )
}
