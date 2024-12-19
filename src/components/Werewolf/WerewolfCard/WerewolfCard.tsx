import backCardImage from "@/assets/werewolf/role/backCard.png";
import { MayorBadge } from "./MayorBadge";
import { RoleImage } from "./RoleImage";
import type { WerewolfCardProps } from "./types";

export const WerewolfCard = (props: WerewolfCardProps) => {
	const {
		className = "",
		role = "villager",
		flipCard,
		isFlipped,
		isAlive = true,
		isMayor = false,
	} = props;

	const handleClick = () => {
		if (flipCard) {
			flipCard(!isFlipped);
		}
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={`relative w-64 h-64 cursor-pointer perspective-1000 ${!isAlive && 'grayscale'} ${className}`}
			onClick={handleClick}
		>
			<div
				className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
					isFlipped ? "rotate-y-180" : ""
				}`}
			>
				{/* Front de la carte */}
				<div className="absolute w-full backface-hidden">
					<div className="w-full h-full bg-blue-950 rounded-lg shadow-lg p-3">
						<RoleImage role={role} />
						{isMayor && <MayorBadge />}
					</div>
				</div>

				{/* Dos de la carte */}
				<div className="absolute w-full backface-hidden rotate-y-180">
					<div className="w-full h-full bg-blue-950 rounded-lg shadow-lg p-3">
						<img src={backCardImage} alt="backCard" />
						{isMayor && <MayorBadge />}
					</div>
				</div>
			</div>
		</div>
	);
};
