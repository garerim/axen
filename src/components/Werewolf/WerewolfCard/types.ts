export type WerewolfRole = "werewolf" | "villager" | "hunter" | "witch" | "seer" | "littleGirl" | "cupidon";

export interface WerewolfCardProps {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  role: WerewolfRole;
  isFlipped?: boolean;
  isAlive?: boolean;
  isMayor?: boolean;
  flipCard?: (value: boolean) => void;
}