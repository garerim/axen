import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Check, Pencil, User } from "lucide-react";
import { getPseudoLocale, setPseudoLocale } from "../provider/WebSocketProvider";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";

export default function UserButton() {

    const [isEdited, setIsEdited] = useState(false)
    const [pseudo, setPseudo] = useState(getPseudoLocale()!)

    const handlePseudo = (value: string) => {
        setPseudo(value)
    }

    const handleSavePseudo = () => {
        setIsEdited(false)
        if (pseudo) {
            setPseudoLocale(pseudo)
        }
    }

    return (
        <Popover>
            <PopoverTrigger>
                <User className="w-8 h-8 text-white" />
            </PopoverTrigger>
            <PopoverContent>
                <h3 className="text-lg font-bold mb-3">Modifier votre pseudo</h3>
                <div className="flex items-center gap-2">
                    {isEdited ? (
                        <>
                            <Input className="flex-1" value={pseudo} onChange={(e) => handlePseudo(e.target.value)} />
                            <Button onClick={() => handleSavePseudo()}>
                                <Check className="w-5 h-5" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex-1 border rounded-md p-2">
                                {getPseudoLocale()}
                            </div>
                            <Button onClick={() => setIsEdited(true)}>
                                <Pencil className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
