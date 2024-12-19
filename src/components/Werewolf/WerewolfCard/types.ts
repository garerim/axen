export type WerewolfRole = "werewolf" | "villager" | "hunter" | "witch" | "seer" | "littleGirl" | "cupidon";

export interface WerewolfCardProps {
  role: WerewolfRole;
  isAlive?: boolean;
  isFlipped?: boolean;
  isMayor?: boolean;
  className?: string;
  flipCard?: (value: boolean) => void;
}