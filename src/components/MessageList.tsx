import { MessageBubble } from './MessageBubble';
import { CarouselMessage } from './CarouselMessage';
import { MediaMessage } from './MediaMessage';
import { ScheduledMessageItem } from './ScheduledMessageItem';
import type {Message} from "../types/types.ts";



interface MessagesListProps {
    messages: Message[];
    viewMode: 'chat' | 'scheduled' | 'sent' | 'threads';
    onDeleteScheduled?: (id: number) => void;
}

export const MessagesList = ({ messages, viewMode, onDeleteScheduled }: MessagesListProps) => {
    const filteredMessages = messages.filter(msg => {
        if (viewMode === 'scheduled') return msg.scheduledFor && msg.scheduledFor > new Date();
        if (viewMode === 'sent') return msg.isSent && !msg.scheduledFor;
        return !msg.scheduledFor; // chat view shows non-scheduled messages
    });

    if (filteredMessages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        {viewMode === 'scheduled' && 'No scheduled messages'}
                        {viewMode === 'sent' && 'No sent messages yet'}
                        {viewMode === 'chat' && 'Start a conversation'}
                    </p>
                </div>
            </div>
        );
    }

    if (viewMode === 'scheduled') {
        return (
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                    {filteredMessages.map((message) => (
                        <ScheduledMessageItem
                            key={message.id}
                            message={message}
                            onDelete={() => onDeleteScheduled?.(message.id)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
            <div className="space-y-4">
                {filteredMessages.map((message) => (
                    message.type === 'carousel' && message.carouselData ? (
                        <CarouselMessage
                            key={message.id}
                            cards={message.carouselData}
                            isSent={message.isSent}
                            time={message.time}
                            sender={message.sender}
                        />
                    ) : message.type === 'media' && message.mediaData ? (
                        <MediaMessage
                            key={message.id}
                            media={message.mediaData}
                            isSent={message.isSent}
                            time={message.time}
                            sender={message.sender}
                        />
                    ) : (
                        <MessageBubble
                            key={message.id}
                            content={message.content || ''}
                            isSent={message.isSent}
                            time={message.time}
                            sender={message.sender}
                            suggestions={message.suggestions}
                        />
                    )
                ))}
            </div>
        </div>
    );
};
