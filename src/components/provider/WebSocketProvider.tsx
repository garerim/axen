import { ReactNode, useEffect, useRef, useState, createContext, useContext } from 'react';

interface WebSocketProviderProps {
    children: ReactNode;
}
type Player = {
    id: number;
    pseudo: string;
    role?: string;
};

type Phase = 'waiting' | 'night-werewolf' | 'day-discussion' | 'day-vote';

type WebSocketContextType = {
    sendMessage: (type: string, data: any) => void;
    setPseudo: (pseudo: string) => void;
    isConnected: boolean;
    messages: Array<{ type: string; message: string; sender?: string; role?: string }>;
    players: Player[];
    playersInGame: Player[];
    joinGame: () => void;
    role: string | null;
    rolesDistributed: boolean;
    gameCanStart: boolean;
    distributeRoles: () => void;
    startGame: () => void;
    currentPhase: Phase;
    phaseTimeRemaining: number;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const PHASE_DURATIONS = {
    'night-werewolf': 30000,    // 30 secondes pour les loups
    'day-discussion': 120000,   // 2 minutes de discussion
    'day-vote': 30000,          // 30 secondes pour voter
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
    const [players, setPlayers] = useState<Player[]>([]);
    const [playersInGame, setPlayersInGame] = useState<Player[]>([]);
    const [messages, setMessages] = useState<Array<{ type: string; message: string; sender?: string; role?: string }>>([]);
    const [role, setRole] = useState<string | null>(null);
    const [gameCanStart, setGameCanStart] = useState(false);
    const [rolesDistributed, setRolesDistributed] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<Phase>('waiting');
    const [phaseTimeRemaining, setPhaseTimeRemaining] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Initialisation de la connexion WebSocket
        const connect = () => {
            ws.current = new WebSocket('ws://172.16.10.111:3000');
            // ws.current = new WebSocket('ws://172.20.10.2:3000');

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
                        break;
                    case 'init':
                        setPlayers(data.data.players);
                        setPlayersInGame(data.data.playersInGame);
                        setMessages(data.data.messages);
                        setGameCanStart(data.data.gameCanStart);
                        break;
                    case 'welcome':
                        console.log(data.message);
                        setMessages((prevMessages) => [...prevMessages, { type: 'welcome', message: data.message }]);
                        break;
                    case 'error':
                        console.error(data.message);
                        setMessages((prevMessages) => [...prevMessages, { type: 'error', message: data.message }]);
                        break;
                    case 'role':
                        console.log('Rôle reçu:', data.role);
                        setRole(data.role);
                        break;
                    case 'gameStarted':
                        console.log(data.message);
                        setMessages((prevMessages) => [...prevMessages, { type: 'gameStart', message: data.message }]);
                        break;
                    case 'gameCanStart':
                        console.log(data.message);
                        setMessages((prevMessages) => [...prevMessages, { type: 'gameCanStart', message: data.message }]);
                        setGameCanStart(true);
                        break;
                    case 'general':
                        setMessages((prevMessages) => [...prevMessages, { type: 'general', message: data.message, sender: data.sender, role: data.role }]);
                        break;
                    case 'phaseChange':
                        console.log("phaseChange", data);
                        setCurrentPhase(data.phase);
                        setPhaseTimeRemaining(data.duration);
                        
                        // Gérer le compte à rebours
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        
                        const startTime = Date.now();
                        timerRef.current = setInterval(() => {
                            const elapsed = Date.now() - startTime;
                            const remaining = data.duration - elapsed;
                            
                            if (remaining <= 0) {
                                clearInterval(timerRef.current!);
                                setPhaseTimeRemaining(0);
                            } else {
                                setPhaseTimeRemaining(remaining);
                            }
                        }, 1000);
                        break;
                    default:
                        console.log('Message reçu:', data);
                        setMessages((prevMessages) => [...prevMessages, { type: 'unknown', message: JSON.stringify(data) }]);
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
        }
    }, [playersInGame])

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

    const distributeRoles = () => {
        sendMessage('distributeRoles', {});
    }

    const startGame = () => {
        sendMessage('startGame', {});
        // setCurrentPhase('night-werewolf');
        // startNextPhase();
    }

    return (
        <WebSocketContext.Provider
            value={{
                sendMessage,
                setPseudo,
                isConnected,
                players,
                messages,
                role,
                gameCanStart,
                playersInGame,
                joinGame,
                distributeRoles,
                rolesDistributed,
                startGame,
                currentPhase,
                phaseTimeRemaining,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
}
