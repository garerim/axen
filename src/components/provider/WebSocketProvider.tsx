import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

interface WebSocketProviderProps {
    children: ReactNode;
}
export type Player = {
    id: number;
    pseudo: string;
    role?: string;
    isAlive?: boolean;
    isMayor?: boolean;
};

type Phase = 'waiting' | 'night-werewolf' | 'day-discussion' | 'day-vote' | 'night-seer' | 'hunter-phase-1' | 'hunter-phase-2' | 'night-witch';

type Message = {
    type: string;
    message: string;
    sender: Player;
    time: 'day' | 'night' | null;
};

type WebSocketContextType = {
    currentPlayer: Player | null;
    sendMessage: (type: string, data: any) => void;
    setPseudo: (pseudo: string) => void;
    isConnected: boolean;
    messages: Message[];
    players: Player[];
    playersInGame: Player[];
    joinGame: () => void;
    role: string | null;
    rolesDistributed: boolean;
    gameCanStart: boolean;
    gameStopped: boolean;
    distributeRoles: (array: any[]) => void;
    startGame: () => void;
    currentPhase: Phase;
    phaseTimeRemaining: number;
    voteWerewolf: (playerPseudo: string, voterPseudo: string) => void;
    werewolfVoted: { voterPseudo: string, votedPseudo: string }[];
    voteDay: (playerPseudo: string, voterPseudo: string) => void;
    dayVoted: { voterPseudo: string, votedPseudo: string }[];
    seerHasFlipped: boolean;
    setSeerHasFlipped: (seerHasFlipped: boolean) => void;
    winner: string | null;
    resetGame: () => void;
    canGameReset: boolean;
    hunterKill: (player: Player) => void;
    hunterHasKill: boolean;
    wolfWillKill: string | null;
    savePlayer: (player: string) => void;
    witchWantsKill: boolean;
    setWitchWantsKill: (witchWantsKill: boolean) => void;
    witchKill: Player | null;
    witchPotion: {life: boolean, death: boolean};
    witchKillPlayer: (player: Player) => void;
    defaultRoles: string[];
    hasWitchUsePotion: boolean;
    setHasWitchUsePotion: (hasWitchUsePotion: boolean) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const PHASE_DURATIONS = {
    'night-seer': 20000,        // 20 secondes pour le seer
    'night-werewolf': 30000,    // 30 secondes pour les loups
    'night-witch': 30000,      // 30 secondes pour la sorcière
    'day-discussion': 10000,   // 2 minutes de discussion
    'day-vote': 30000,          // 30 secondes pour voter
    'hunter-phase-1': 10000,    // 10 secondes pour le hunter
    'hunter-phase-2': 10000,    // 10 secondes pour le hunter
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error("useWebSocket doit être utilisé dans un WebSocketProvider");
    return context;
};

export const setPseudoLocale = (pseudo: string) => {
    localStorage.setItem('pseudo', pseudo);
};

export const getPseudoLocale = () => {
    return localStorage.getItem('pseudo');
};

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playersInGame, setPlayersInGame] = useState<Player[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [gameCanStart, setGameCanStart] = useState(false);
    const [gameStopped, setGameStopped] = useState(false);
    const [rolesDistributed, setRolesDistributed] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<Phase>('waiting');
    const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number>(0);
    const [werewolfVoted, setWerewolfVoted] = useState<{ voterPseudo: string, votedPseudo: string }[]>([]);
    const [dayVoted, setDayVoted] = useState<{ voterPseudo: string, votedPseudo: string }[]>([]);
    const [seerHasFlipped, setSeerHasFlipped] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [canGameReset, setCanGameReset] = useState(false);
    const [hunterHasKill, setHunterHasKill] = useState(false);
    const [wolfWillKill, setWolfWillKill] = useState<string | null>(null);
    const [witchWantsKill, setWitchWantsKill] = useState<boolean>(false);
    const [witchKill, setWitchKill] = useState<Player | null>(null);
    const [witchPotion, setWitchPotion] = useState({life: false, death: false});
    const [defaultRoles, setDefaultRoles] = useState<string[]>([])
    const [hasWitchUsePotion, setHasWitchUsePotion] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Initialisation de la connexion WebSocket
        const connect = () => {
            ws.current = new WebSocket(import.meta.env.VITE_BACKEND_URL ?? 'ws://localhost:3000');

            ws.current.onopen = () => {
                console.log('Connecté au serveur WebSocket');
                const pseudo = getPseudoLocale();
                if (pseudo) {
                    sendMessage('setPseudo', pseudo);
                    setIsConnected(true);
                } else {
                    setIsConnected(false);
                }
            };

            ws.current.onclose = () => {
                console.log('Déconnecté du serveur WebSocket');
                setIsConnected(false);
                // Tentative de reconnexion après 3 secondes
                setTimeout(connect, 3000);
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'playersUpdate':
                        setPlayers(data.players);
                        break;
                    case 'playersInGameUpdate':
                        setPlayersInGame(data.players);
                        setCurrentPlayer(data.players.find((p: any) => p.pseudo === getPseudoLocale()));
                        break;
                    case 'init':
                        setPlayers(data.data.players);
                        setPlayersInGame(data.data.playersInGame);
                        setMessages(data.data.messages);
                        setGameCanStart(data.data.gameCanStart);
                        setCurrentPhase(data.data.currentPhase);
                        setPhaseTimeRemaining(data.data.phaseTimeRemaining);
                        setWerewolfVoted(data.data.werewolfVotedArray);

                        const role = data.data.playersInGame.find((p: any) => p.pseudo === getPseudoLocale())?.role || '';
                        setRole(role);

                        break;
                    case 'welcome':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('welcome', data.message)]);
                        break;
                    case 'infoNight':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('infoNight', data.message)]);
                        break;
                    case 'infoDay':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('infoDay', data.message)]);
                        break;
                    case 'error':
                        console.error(data.message);
                        setMessages((prevMessages) => [...prevMessages, systemMessage('error', data.message)]);
                        break;
                    case 'role':
                        setRole(data.role);
                        break;
                    case 'gameStarted':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('gameStart', data.message)]);
                        break;
                    case 'gameOver':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('gameOver', data.message)]);
                        setWinner(data.winner);
                        break;
                    case 'gameStopped':
                        setGameStopped(true);
                        setCurrentPhase('waiting');
                        setRolesDistributed(false);
                        setGameCanStart(false);
                        setMessages((prevMessages) => [...prevMessages, systemMessage('gameStopped', data.message)]);
                        break;
                    case 'resetGame':
                        setCanGameReset(true);
                        break;
                    case 'gameCanStart':
                        setMessages((prevMessages) => [...prevMessages, systemMessage('gameCanStart', data.message)]);
                        setGameCanStart(true);
                        setDefaultRoles(data.roles);
                        break;
                    case 'gameCantStart':
                        setGameCanStart(false);
                        break;
                    case 'werewolfHasVoted':
                        setWerewolfVoted(data.werewolfVotedArray);
                        break;
                    case 'wolfWillKill':
                        setWolfWillKill(data.playerToDie);
                        break;
                    case 'dayHasVoted':
                        setDayVoted(data.dayVotedArray);
                        break;
                    case 'hunterHasKill':
                        setHunterHasKill(true);
                        break;
                    case 'general':
                        setMessages((prevMessages) => [...prevMessages, {
                            type: 'general',
                            message: data.message,
                            sender: data.sender,
                            time: data.time
                        }]);
                        break;
                    case 'phaseChange':
                        setCurrentPhase(data.phase);
                        if (data.phase === 'night-seer') {
                            setSeerHasFlipped(false);
                        }
                        setPhaseTimeRemaining(data.timeRemaining);
                        break;
                    case 'timeUpdate':
                        setPhaseTimeRemaining(data.timeRemaining);
                        break;
                    default:
                        setMessages((prevMessages) => [...prevMessages, systemMessage('unknown', JSON.stringify(data))]);
                }
            };

            ws.current.onerror = (error) => {
                console.error('Erreur WebSocket:', error);
            };
        };

        connect();

        // Nettoyage à la déconnexion
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    useEffect(() => {
        let roleCounter = 0;
        playersInGame.forEach(player => {
            if (player.role !== '') {
                roleCounter++
            }
        });

        if (playersInGame.length > 0 && roleCounter === playersInGame.length) {
            setRolesDistributed(true);
        } else {
            setRolesDistributed(false);
            // setGameCanStart(false);
        }
    }, [playersInGame])

    useEffect(() => {
        if (currentPhase === 'hunter-phase-1') {
            setWitchWantsKill(false);
        }
    }, [currentPhase])

    const sendMessage = (type: string, data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type, data }));
        }
    };

    const setPseudo = (pseudo: string) => {
        sendMessage('setPseudo', pseudo);
    };

    const joinGame = () => {
        const pseudo = getPseudoLocale();
        if (pseudo) {
            sendMessage('joinGame', pseudo);
        }
    }

    const distributeRoles = (roles: any[] = []) => {
        sendMessage('distributeRoles', {roles});
    }

    const startGame = () => {
        sendMessage('startGame', {});
    }

    const voteWerewolf = (playerPseudo: string, voterPseudo: string) => {
        const newArray = Array.isArray(werewolfVoted) ? [...werewolfVoted].filter(vote => vote.voterPseudo !== voterPseudo) : [];
        newArray.push({ voterPseudo: voterPseudo, votedPseudo: playerPseudo });

        setWerewolfVoted(newArray);
        sendMessage('voteWerewolf', { werewolfVoted: newArray });
    }

    const voteDay = (playerPseudo: string, voterPseudo: string) => {
        const newArray = Array.isArray(dayVoted) ? [...dayVoted].filter(vote => vote.voterPseudo !== voterPseudo) : [];
        newArray.push({ voterPseudo: voterPseudo, votedPseudo: playerPseudo });

        setDayVoted(newArray);
        sendMessage('voteDay', { dayVoted: newArray });
    }

    const hunterKill = (player: Player) => {
        setHunterHasKill(true);
        sendMessage('hunterKill', { hunterPseudo: currentPlayer?.pseudo, playerPseudo: player.pseudo });
    }

    const savePlayer = (player: string) => {
        const potion = {
            life: false,
            death: witchPotion.death
        }
        setWitchPotion(potion);
        sendMessage('savePlayer', { playerPseudo: player });
    }

    const witchKillPlayer = (player: Player) => {
        setWitchKill(player);
        sendMessage('witchKillPlayer', { playerPseudo: player.pseudo });
        const potion = {
            life: witchPotion.life,
            death: true
        }
        setWitchPotion(potion);
    }

    const resetGame = () => {
        setCurrentPlayer(null);
        setRole(null);
        setPlayersInGame([]);
        setMessages([]);
        setGameCanStart(false);
        setGameStopped(false);
        setRolesDistributed(false);
        setCurrentPhase('waiting');
        setPhaseTimeRemaining(0);
        setWerewolfVoted([]);
        setDayVoted([]);
        setSeerHasFlipped(false);
        setWinner(null);
        setCanGameReset(false);
        setHunterHasKill(false);
        setWitchPotion({ life: false, death: false });
        setWitchKill(null);
        setWitchWantsKill(false);
        setHasWitchUsePotion(false);
    }

    // Pour les messages système (welcome, infoNight, etc.), ajoutez un sender système et un time
    const systemMessage = (type: string, message: any): Message => ({
        type,
        message,
        sender: { id: 0, pseudo: 'System' },
        time: null // currentPhase?.includes('night') ? 'night' : 'day' as const
    });

    return (
        <WebSocketContext.Provider
            value={{
                currentPlayer,
                sendMessage,
                setPseudo,
                isConnected,
                players,
                messages,
                role,
                gameCanStart,
                gameStopped,
                playersInGame,
                joinGame,
                distributeRoles,
                rolesDistributed,
                startGame,
                currentPhase,
                phaseTimeRemaining,
                voteWerewolf,
                werewolfVoted,
                voteDay,
                dayVoted,
                seerHasFlipped,
                setSeerHasFlipped,
                winner,
                resetGame,
                canGameReset,
                hunterKill,
                hunterHasKill,
                wolfWillKill,
                savePlayer,
                witchWantsKill,
                setWitchWantsKill,
                witchKill,
                witchPotion,
                witchKillPlayer,
                defaultRoles,
                hasWitchUsePotion,
                setHasWitchUsePotion
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
}
