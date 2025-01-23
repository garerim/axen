import PlayerList from "@/components/PlayerList"
import { WerewolfCard } from "@/components/Werewolf/WerewolfCard/WerewolfCard"
import { WerewolfRole } from "@/components/Werewolf/WerewolfCard/types"
import { useTheme } from "@/components/provider/ThemeProvider"
import { PHASE_DURATIONS, Player, getPseudoLocale, useWebSocket } from "@/components/provider/WebSocketProvider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti";
import { ChevronLeft, Heart, Skull, Triangle } from "lucide-react"

import { useEffect, useState } from "react"

import deathPotion from "@/assets/werewolf/death-potion.png"
import lifePotion from "@/assets/werewolf/life-potion.png"
import { Dialog, DialogContent } from "./ui/dialog"
import { RolesDialog } from "./RolesDialog"

export default function BoardGame() {

  const { setTheme } = useTheme();
  const [seerFlip, setSeerFlip] = useState<string>("");
  const [hasWitchUsePotion, setHasWitchUsePotion] = useState(false);

  const {
    currentPlayer,
    gameCanStart,
    gameStopped,
    role,
    joinGame,
    playersInGame,
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
    sendMessage,
    hunterKill,
    hunterHasKill,
    wolfWillKill,
    savePlayer,
    witchWantsKill,
    setWitchWantsKill,
    witchPotion,
    witchKillPlayer,
    witchKill,
  } = useWebSocket();

  useEffect(() => {
    if (getPseudoLocale() === null) {
      window.location.href = '/';
    }
  }, [])

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
    'night-witch': 'Tour de la sorcière',
    'day-discussion': 'Discussion du jour',
    'day-vote': 'Vote du jour',
    'waiting': 'En attente des autres joueurs',
    'hunter-phase-1': 'Phase du chasseur',
    'hunter-phase-2': 'Phase du chasseur',
  }

  const isCardFlipped = (player: Player) => {
    let res = true;

    if (!player.isAlive) {
      return false;
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

  const canHunterKill = () => {
    return (currentPhase === "hunter-phase-1" || currentPhase === "hunter-phase-2") && role === 'hunter' && !currentPlayer?.isAlive && !hunterHasKill;
  }

  const canWitchKill = () => {
    return currentPhase === "night-witch" && role === 'witch' && witchWantsKill && !hasWitchUsePotion;
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

  const getCardSize = (playerCount: number) => {
    if (playerCount <= 6) return "w-[210px]";
    if (playerCount <= 8) return "w-[180px]";
    if (playerCount <= 10) return "w-[150px]";
    return "w-[120px]";
  }

  return (
    <div className={cn("w-full h-full")}>
      <h1 className='text-2xl text-center font-bold'><p>Phase : {PhaseName[currentPhase]}</p></h1>
      <a href="/" className="absolute top-4 left-4">
        <Button>
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </a>
      <PlayerList />
      {
        currentPhase === "waiting" ? (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {gameCanStart ? (
              <>
                {rolesDistributed ? (
                  <>
                    {playersInGame.length > 0 && getPseudoLocale() === playersInGame[0].pseudo ? (
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
                    {playersInGame.find(p => p.pseudo === getPseudoLocale()) === undefined ? (
                      <>
                        <Button onClick={joinGame} >
                          Joindre la partie
                        </Button>
                      </>
                    ) : (
                      <>
                        {playersInGame.length > 0 && getPseudoLocale() === playersInGame[0].pseudo ? (
                          <>
                            <RolesDialog />
                            {/* <Button onClick={distributeRoles} >
                              Distribuer les rôles
                            </Button> */}
                          </>
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

      {gameStopped && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">La partie est terminée</h1>
          <p className="text-lg">{winner === "villager" ? "Les villageois ont gagné" : "Les loups ont gagné"}</p>
        </div>
      )}

      {(currentPhase === 'night-witch' && role === 'witch') && (
        <Dialog open={(!hasWitchUsePotion && !witchWantsKill)} onOpenChange={() => { }}>
          <DialogContent className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <p className="text-2xl font-bold">
              {wolfWillKill ? `${wolfWillKill} a été tué` : "Aucun joueur n'a été tué"}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button tabIndex={-1} disabled={!wolfWillKill || witchPotion.life} onClick={() => { savePlayer(wolfWillKill ?? ""); setHasWitchUsePotion(true); }} className="flex flex-col items-center gap-2 w-36">
                <div className="w-full h-auto border-[6px] border-green-400 rounded-lg overflow-hidden">
                  <img src={lifePotion} alt="Potion" className={cn("w-full h-full", wolfWillKill ? "opacity-100" : "brightness-[0.25]")} />
                </div>
                <p className="text-center">Voulez-vous le sauver ?</p>
              </button>
              <button tabIndex={-1} disabled={witchPotion.death} onClick={() => setWitchWantsKill(true)} className="flex flex-col items-center gap-2 w-36">
                <div className="w-full h-auto border-[6px] border-red-800 rounded-lg overflow-hidden">
                  <img src={deathPotion} alt="Potion" className={cn("w-full h-full", !witchPotion.death ? "opacity-100" : "brightness-[0.25]")} />
                </div>
                <p className="text-center">Voulez-vous tuer un autre joueur ?</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className=" w-full h-1/2 flex items-center justify-center flex-wrap gap-4">
        {playersInGame.map((player) => (
          <div
            className="relative flex flex-col items-center"
            key={player.id}
            onClick={
              canWerewolfVote() && player.isAlive ?
                () => voteWerewolf(player.pseudo, getPseudoLocale() ?? "") :
                canDayVote() ?
                  () => voteDay(player.pseudo, getPseudoLocale() ?? "") :
                  canSeerFlipCard() ?
                    () => seerFlipCard(player) :
                    canHunterKill() ?
                      () => hunterKill(player) :
                      canWitchKill() ?
                        () => {
                          // setHasWitchUsePotion(true);
                          witchKillPlayer(player);
                        } :
                        undefined
            }>

            {(werewolfVoted.find(vote => vote.votedPseudo === player.pseudo && vote.voterPseudo === currentPlayer?.pseudo) !== undefined && currentPhase === "night-werewolf") && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-180">
                <Triangle className="w-8 h-8 text-green-500 fill-green-500 animate-bounce" />
              </div>
            )}

            {dayVoted.find(vote => vote.votedPseudo === player.pseudo && vote.voterPseudo === currentPlayer?.pseudo) !== undefined && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-180">
                <Triangle className="w-8 h-8 text-green-500 fill-green-500 animate-bounce" />
              </div>
            )}

            {witchKill === player && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 rotate-180">
                <Triangle className="w-8 h-8 text-green-500 fill-green-500 animate-bounce" />
              </div>
            )}

            <div className="flex items-center gap-2 justify-center">
              {player.pseudo} {player.isAlive ? <Heart fill="red" className="w-4 h-4 text-red-500" /> : <Skull className="w-4 h-4" />}
            </div>

            {(role === 'werewolf' && currentPhase === "night-werewolf") && werewolfVoted.filter(vote => vote.votedPseudo === player.pseudo).length}
            {currentPhase === "day-vote" && dayVoted.filter(vote => vote.votedPseudo === player.pseudo).length}

            <WerewolfCard
              role={player.role as WerewolfRole}
              isFlipped={seerFlip === player.pseudo ? false : isCardFlipped(player)}
              isAlive={player.isAlive}
              className={getCardSize(playersInGame.length)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
