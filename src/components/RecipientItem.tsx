import { Check } from 'lucide-react';
import {Avatar, AvatarFallback} from "./ui/avatar.tsx";

interface RecipientItemProps {
    name: string;
    email: string;
    mobile: string;
    isSelected: boolean;
    onClick: () => void;
}

export const RecipientItem = ({ name, email, mobile, isSelected, onClick }: RecipientItemProps) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-accent/50 transition-colors active:scale-[0.98]"
        >
            <div className="relative">
                <Avatar className="w-10 h-10 bg-primary/20">
                    <AvatarFallback className="text-primary text-sm">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                {isSelected && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                )}
            </div>
            <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{mobile}</p>
                <p className="text-xs text-muted-foreground/70">{email}</p>
            </div>
            <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                }`}
            >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
        </button>
    );
};
