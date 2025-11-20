interface EmptyStateProps {
    message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
    return (
        <div className="flex items-center justify-center h-full p-8">
            <p className="text-muted-foreground text-center">{message}</p>
        </div>
    );
};
