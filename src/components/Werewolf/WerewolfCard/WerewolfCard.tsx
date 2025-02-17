import backCardImage from "@/assets/werewolf/role/backCard.png";
import { MayorBadge } from "./MayorBadge";
import { RoleImage } from "./RoleImage";
import type { WerewolfCardProps } from "./types";

export const WerewolfCard = (props: WerewolfCardProps) => {
	const {
		className = "",
		role = "villager",
		flipCard,
		isFlipped = true,
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
			className={`relative w-24 md:w-40 cursor-pointer perspective-1000 shadow-lg ${!isAlive && "grayscale"} ${className}`}
			onClick={handleClick}
		>
			<div
				className={`relative flex flex-col w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
					}`}
			>
				{/* Front de la carte */}
				<div className="relative w-full backface-hidden">
					<div className="w-full h-full bg-blue-950 rounded-lg shadow-lg p-1 md:p-2">
						<RoleImage role={role} />
						{isMayor && <MayorBadge />}
					</div>
				</div>

				{/* Dos de la carte */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180">
					<div className="w-full h-full bg-blue-950 rounded-lg shadow-lg p-1 md:p-2">
						<img src={backCardImage} alt="backCard" className="rounded-md" />
						{isMayor && <MayorBadge />}
					</div>
				</div>
			</div>
		</div>

	);
};
