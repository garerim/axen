import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";

export interface GamesCardProps {
	gameName: string;
	gameImage: string;
	gameDescription: string;
	numberOfPlayers: {
		min: number;
		max: number;
	};
	gameDuration: number;
	link: string;
	disabled?: boolean;
}

export const GamesCard = (props: GamesCardProps) => {
	const {
		gameName,
		gameImage,
		gameDescription,
		numberOfPlayers,
		gameDuration,
		link,
		disabled = false,
	} = props;

	const navigate = useNavigate({ from: "/" });

	return (
		<div
			className={`${disabled ? "bg-slate-400" : "bg-red-700"} max-w-full sm:max-w-80 p-5 flex flex-col gap-2 rounded-lg shadow-md`}
		>
			<div className="flex justify-center">
				<h2 className="uppercase text-white text-lg sm:text-xl">{gameName}</h2>
			</div>
			<div className="flex justify-center">
				<img src={gameImage} alt={gameName} className="w-full h-auto object-cover rounded-md" />
			</div>
			<div className="flex flex-col justify-between h-full gap-2">
				<div className="flex flex-col gap-2">
					<p className="text-slate-200 text-sm sm:text-base">{gameDescription}</p>
					<p className="text-slate-200 text-sm sm:text-base">
						Players: {numberOfPlayers.min} - {numberOfPlayers.max}
					</p>
					<p className="text-slate-200 text-sm sm:text-base">
						Duration: {gameDuration} minutes
					</p>
				</div>
				<div
					className={`flex flex-col sm:flex-row justify-center gap-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
				>
					<Button onClick={() => navigate({to: link})} disabled={disabled} className="w-full sm:w-auto">
						Rejoindre
					</Button>
					<Button onClick={() => navigate({to: `${link}/rules`})} disabled={disabled} className="w-full sm:w-auto">
						Règles
					</Button>
				</div>
			</div>
		</div>
	)
};
