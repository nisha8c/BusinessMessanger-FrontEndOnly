interface VariableItemProps {
    text: string;
    sampleValue: string;
    type: 'user' | 'company' | 'datetime';
    onClick: () => void;
}

export const VariableItem = ({ text, sampleValue, type, onClick }: VariableItemProps) => {
    const getTypeIcon = () => {
        switch (type) {
            case 'company':
                return '🏢 Company';
            case 'datetime':
                return '📅 Dynamic';
            default:
                return sampleValue;
        }
    };

    return (
        <button
            onClick={onClick}
            className="w-full px-4 py-3 text-left text-sm hover:bg-primary/20 transition-colors border-b border-border/50 text-foreground flex justify-between items-center"
        >
      <span className="font-semibold bg-gradient-tech bg-clip-text text-transparent">
        {text}
      </span>
            <span className="text-xs text-muted-foreground">
        {getTypeIcon()}
      </span>
        </button>
    );
};
