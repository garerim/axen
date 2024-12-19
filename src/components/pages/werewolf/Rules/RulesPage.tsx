import { WerewolfCard } from "@/components/Werewolf/WerewolfCard/WerewolfCard";
import type { WerewolfCardProps } from "@/components/Werewolf/WerewolfCard/types"
import WordFadeIn from "@/components/ui/word-fade-in";
import { useState } from "react";

export const RulesPage = () => {
    const [cardIsOpen, setCardIsOpen] = useState({
        villager: true,
        werewolf: true,
        seer: true,
        witch: true,
        hunter: true,
        cupidon: true,
        littleGirl: true,
        mayor: true,
    });

    type RolesCards = {
        description: string,
    } & WerewolfCardProps;
    const ROLES: RolesCards[] = [
        {
            role: "villager",
            isFlipped: cardIsOpen.villager,
            description: "Le villageois n'a pas de pouvoir particulier, il doit survivre jusqu'à la fin de la partie. Il doit trouver les loups-garous et doit se défendre pour ne pas être éliminé. Il doit aussi aider les autres villageois à trouver les loups-garous. Il dort pendant la nuit.",
        },
        {
            role: "werewolf",
            isFlipped: cardIsOpen.werewolf,
            description: "Le loup-garou est un personnage qui se réveille la nuit avec les autres loups-garous pour éliminer un villageois. Il doit se faire passer pour un villageois pour ne pas être éliminé. Il dort pendant la journée, mais dois agir comme un villageois en participant aux débats.",
        },
        {
            role: "seer",
            isFlipped: cardIsOpen.seer,
            description: "La voyante est un personnage qui se réveille la nuit pour connaître le rôle d'un autre joueur. Elle doit aider les villageois à trouver les loups-garous. Elle dort pendant la journée, mais doit agir comme un villageois en participant aux débats.",
        },
        {
            role: "witch",
            isFlipped: cardIsOpen.witch,
            description: "La sorcière est un personnage qui se réveille la nuit pour sauver un joueur de la mort ou pour éliminer un joueur. Elle ne peut utiliser ses pouvoirs qu'une seule fois par partie. Elle dort pendant la journée, mais doit agir comme un villageois en participant aux débats.",
        },
        {
            role: "hunter",
            isFlipped: cardIsOpen.hunter,
            description: "Le chasseur est un personnage qui, lorsqu'il est éliminé, peut éliminer un autre joueur de son choix. Il dort pendant la nuit.",
        },
        {
            role: "cupidon",
            isFlipped: cardIsOpen.cupidon,
            description: "Cupidon est un personnage qui se réveille la première nuit pour choisir deux joueurs qui deviendront amoureux. Si l'un des deux meurt, l'autre meurt de chagrin. Il dort pendant la journée, mais doit agir comme un villageois en participant aux débats.",
        },
        {
            role: "littleGirl",
            isFlipped: cardIsOpen.littleGirl,
            description: "La petite fille est un personnage qui se réveille la nuit pour espionner les loups-garous. Si elle est découverte, elle meurt. Elle dort pendant la journée, mais doit agir comme un villageois en participant aux débats.",
        },
        {
            role: "hunter",
            isFlipped: cardIsOpen.mayor,
            isMayor: true,
            description: "Le maire est un rôle spécial. Il est voté après la première nuit. Il a deux voix lors des votes. Le maire peut initialement être un villageois ou un loup-garou, mais il est élu par les villageois. Il dort pendant la nuit. Une fois mort, il décide de lui même qui est le nouveau maire.",
        },
    ];

    return (
        <div className="p-6 bg-red-700 flex flex-col">
            <div className="flex flex-col items-center">
                <h1>Les règles du jeu du Loup-Garou</h1>
                <p>Le jeu du Loup-Garou est un jeu de société qui mélange bluff, déduction et stratégie. Il se joue de 8 à 18 joueurs et dure environ 30 minutes.</p>
            </div>
            <div className="flex flex-col items-center mt-10">
                <p>Les différents rôles : </p>
            </div>
            <div className="mt-10 p-7 flex flex-col gap-24">
                {ROLES.map((role, index) => ( 
                    <div key={index.toString()} className="h-[400px]" >
                    {/* <div key={index.toString()} className="pl-6 h-424px mb-400px"> */}
                        <WerewolfCard isMayor={role.isMayor} role={role.role} isFlipped={role.isFlipped} flipCard={(value) => setCardIsOpen(prevState => ({ ...prevState, [role.role]: value }))} />
                        {
                            !role.isFlipped && (
                                <div className="bg-red-600 absolute p-6 rounded-lg ml-72 mr-6">
                                    {/* <p>{role.description}</p> */}
                                    <WordFadeIn delay={0.03} className="font-light text-sm md:text-sm" words={role.description} />
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}