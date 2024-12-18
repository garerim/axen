export type WerewolfRole = "werewolf" | "villager" | "hunter" | "witch" | "seer" | "littleGirl";

export interface WerewolfCardProps {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  role: WerewolfRole;
  isMayor?: boolean;
}