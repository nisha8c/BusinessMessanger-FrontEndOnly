import { useState } from 'react';
import {Avatar, AvatarFallback} from "./ui/avatar.tsx";

interface VariableChipProps {
    values: string[];
    type: 'name' | 'contact' | 'data';
}

export const VariableChip = ({ values, type }: VariableChipProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (values.length === 1) {
        return (
            <span className="inline-flex items-center gap-1 bg-gradient-tech px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground mx-0.5 shadow-glow animate-slide-up">
        {type === 'name' && (
            <Avatar className="w-4 h-4 border border-primary-foreground/20">
                <AvatarFallback className="text-[8px] bg-white/20 text-primary-foreground">
                    {values[0].substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        )}
                <span>{values[0]}</span>
      </span>
        );
    }

    // Multiple values - stacked chips
    return (
        <span
            className="inline-flex items-center relative mx-1 cursor-pointer group"
            onClick={() => setIsExpanded(!isExpanded)}
        >
      {/* Stacked avatars */}
            <div className="flex -space-x-2 animate-slide-up">
        {values.slice(0, isExpanded ? values.length : 3).map((value, idx) => (
            <div
                key={idx}
                className="relative inline-flex items-center gap-1 bg-gradient-tech px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground border-2 border-background shadow-lg transition-transform hover:scale-110 hover:z-10"
                style={{
                    zIndex: values.length - idx,
                    transform: `translateX(${idx * 2}px)`,
                }}
            >
                {type === 'name' && (
                    <Avatar className="w-4 h-4 border border-primary-foreground/20">
                        <AvatarFallback className="text-[8px] bg-white/20 text-primary-foreground">
                            {value.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}
                <span className="whitespace-nowrap">{value}</span>
            </div>
        ))}

                {!isExpanded && values.length > 3 && (
                    <div
                        className="inline-flex items-center justify-center bg-accent px-2 py-1 rounded-full text-xs font-bold text-accent-foreground border-2 border-background shadow-lg"
                        style={{ zIndex: 0, transform: 'translateX(6px)' }}
                    >
                        +{values.length - 3}
                    </div>
                )}
      </div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 animate-slide-up">
        <div className="bg-card border border-border rounded-lg p-2 shadow-xl min-w-[120px]">
          <p className="text-xs text-muted-foreground mb-1">Recipients:</p>
            {values.map((value, idx) => (
                <div key={idx} className="text-xs text-foreground py-0.5">
                    • {value}
                </div>
            ))}
        </div>
      </div>
    </span>
    );
};
