import { useState } from 'react';
import { Clock, Trash2, MessageSquare, LayoutGrid, Video, ChevronDown, ChevronUp } from 'lucide-react';
import {Button} from "./ui/button.tsx";


interface ScheduledMessageItemProps {
    message: {
        id: number;
        type: 'text' | 'carousel' | 'media';
        content?: string;
        scheduledFor?: Date;
        carouselData?: any[];
        mediaData?: any;
    };
    onDelete: () => void;
}

export const ScheduledMessageItem = ({ message, onDelete }: ScheduledMessageItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getTypeIcon = () => {
        switch (message.type) {
            case 'carousel':
                return <LayoutGrid className="w-4 h-4" />;
            case 'media':
                return <Video className="w-4 h-4" />;
            default:
                return <MessageSquare className="w-4 h-4" />;
        }
    };

    const getPreview = () => {
        if (message.type === 'carousel' && message.carouselData) {
            return `Carousel with ${message.carouselData.length} cards`;
        }
        if (message.type === 'media' && message.mediaData) {
            return `${message.mediaData.type === 'video' ? 'Video' : 'Voice'} message`;
        }
        if (message.content) {
            const div = document.createElement('div');
            div.innerHTML = message.content;
            return div.textContent?.slice(0, 100) || 'Text message';
        }
        return 'Message';
    };

    const getTimeUntilSend = () => {
        if (!message.scheduledFor) return '';
        const now = new Date();
        const scheduled = new Date(message.scheduledFor);
        const diff = scheduled.getTime() - now.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
        return 'soon';
    };

    const getFullContent = () => {
        if (message.type === 'carousel' && message.carouselData) {
            return (
                <div className="space-y-2">
                    {message.carouselData.map((card: any, idx: number) => (
                        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium text-sm mb-1">Card {idx + 1}</p>
                            {card.title && <p className="text-sm"><span className="font-medium">Title:</span> {card.title}</p>}
                            {card.description && <p className="text-sm"><span className="font-medium">Description:</span> {card.description}</p>}
                            {card.imageUrl && <p className="text-xs text-muted-foreground">Image: {card.imageUrl}</p>}
                        </div>
                    ))}
                </div>
            );
        }
        if (message.type === 'media' && message.mediaData) {
            return (
                <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Type:</span> {message.mediaData.type}</p>
                    {message.mediaData.url && <p className="text-xs text-muted-foreground break-all">URL: {message.mediaData.url}</p>}
                    {message.mediaData.caption && <p className="text-sm"><span className="font-medium">Caption:</span> {message.mediaData.caption}</p>}
                </div>
            );
        }
        if (message.content) {
            return <div className="text-sm" dangerouslySetInnerHTML={{ __html: message.content }} />;
        }
        return null;
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div
                className="p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {getTypeIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                            {getPreview()}
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="h-8 w-8"
                            >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="h-8 w-8"
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
              {message.scheduledFor?.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
              })}
            </span>
                        <span>•</span>
                        <span className="text-primary">{getTimeUntilSend()}</span>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <>
                    <Separator />
                    <div className="p-4 bg-muted/20">
                        {getFullContent()}
                    </div>
                </>
            )}
        </div>
    );
};
