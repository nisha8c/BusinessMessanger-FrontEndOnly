interface SectionHeaderProps {
    title: string;
    icon?: string;
}

export const SectionHeader = ({ title, icon }: SectionHeaderProps) => {
    return (
        <div className="px-4 py-2 bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {icon && `${icon} `}{title}
            </p>
        </div>
    );
};
