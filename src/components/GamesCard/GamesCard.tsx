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
			className={`${disabled ? "bg-slate-400" : "bg-red-700"} max-w-80 p-5 flex flex-col gap-2`}
		>
			<div className="flex justify-center">
				<h2 className="uppercase text-white">{gameName}</h2>
			</div>
			<div>
				<img src={gameImage} alt={gameName} />
			</div>
			<div className="flex flex-col justify-between h-full gap-2">
				<div className="flex flex-col gap-2">
					<p className="text-slate-200 text-sm">{gameDescription}</p>
					<p className="text-slate-200 text-sm">
						Players: {numberOfPlayers.min} - {numberOfPlayers.max}
					</p>
					<p className="text-slate-200 text-sm">
						Duration: {gameDuration} minutes
					</p>
				</div>
				<div
					className={`flex justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
				>
					<Button onClick={() => navigate({to: link})} disabled={disabled} className="w-full">
						Rejoindre
					</Button>
				</div>
			</div>
		</div>
	);
};
