import { MessageSquare, LayoutGrid, Video, Trash2, Send, Clock, ChevronDown, ChevronUp } from 'lucide-react';

import { useState } from 'react';
import type {ThreadMessage} from "../types/types.ts";
import {Separator} from "./ui/separator.tsx";
import {Button} from "./ui/button.tsx";



interface ThreadItemProps {
    thread: {
        id: string;
        name: string;
        messages: ThreadMessage[];
        createdAt?: Date;
        recipientCount?: number;
        selectedRecipientIds?: number[];
    };
    onDelete: () => void;
    onSend: () => void;
    onSchedule: () => void;
}

export const ThreadItem = ({ thread, onDelete, onSend, onSchedule }: ThreadItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getMessageIcon = (type: string) => {
        switch (type) {
            case 'carousel':
                return <LayoutGrid className="w-3 h-3" />;
            case 'media':
                return <Video className="w-3 h-3" />;
            default:
                return <MessageSquare className="w-3 h-3" />;
        }
    };

    const getMessagePreview = (message: ThreadMessage) => {
        if (message.type === 'carousel' && message.carouselData) {
            return `Carousel (${message.carouselData.length} cards)`;
        }
        if (message.type === 'media' && message.mediaData) {
            return `${message.mediaData.type === 'video' ? 'Video' : 'Voice'} message`;
        }
        if (message.content) {
            const div = document.createElement('div');
            div.innerHTML = message.content;
            return div.textContent?.slice(0, 50) || 'Text message';
        }
        return 'Message';
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div
                className="p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">{thread.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
                                {thread.recipientCount && thread.recipientCount > 1 && (
                                    <> · {thread.recipientCount} recipients</>
                                )}
                            </p>
                        </div>
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
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <>
                    <Separator />
                    <div className="p-4 bg-muted/20 space-y-3">
                        {/* Message List */}
                        <div className="space-y-2">
                            {thread.messages.map((message, index) => (
                                <div key={message.id} className="flex items-start gap-2 p-2 bg-background rounded-lg">
                                    <span className="text-xs text-muted-foreground font-medium mt-0.5">#{index + 1}</span>
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                        {getMessageIcon(message.type)}
                                        <span className="text-xs text-foreground truncate">
                      {getMessagePreview(message)}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSchedule();
                                }}
                                className="flex-1"
                            >
                                <Clock className="w-3 h-3 mr-1.5" />
                                Schedule
                            </Button>
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSend();
                                }}
                                className="flex-1"
                            >
                                <Send className="w-3 h-3 mr-1.5" />
                                Send Now
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="h-9 w-9"
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};