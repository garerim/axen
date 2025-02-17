import cupidonImage from "@/assets/werewolf/role/cupidon.png";
import hunterImage from "@/assets/werewolf/role/hunter.png";
import littleGirlImage from "@/assets/werewolf/role/petite-fille.png";
import seerImage from "@/assets/werewolf/role/seer.png";
import villagerImage from "@/assets/werewolf/role/villager.png";
import witchImage from "@/assets/werewolf/role/witch.png";
import werewolfImage from "@/assets/werewolf/role/wolf.png";
import type { WerewolfRole } from './types';

interface RoleImageProps {
  role: WerewolfRole;
}

export const RoleImage = ({ role }: RoleImageProps) => {
  const roleImages = {
    werewolf: werewolfImage,
    hunter: hunterImage,
    villager: villagerImage,
    witch: witchImage,
    seer: seerImage,
    littleGirl: littleGirlImage,
    cupidon: cupidonImage,
  };

  const image = roleImages[role] || villagerImage;
  return <img src={image} alt={role} className="rounded-md" />;
};