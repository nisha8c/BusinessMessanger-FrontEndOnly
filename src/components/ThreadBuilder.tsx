import { useState } from 'react';
import {X, Plus, Trash2, MessageSquare, LayoutGrid, Video, Send, Clock, Sparkles} from 'lucide-react';

import { CarouselMessage } from './CarouselMessage';
import { MediaMessage } from './MediaMessage';
import { CarouselBuilder } from './CarouselBuilder';
import { MediaBuilder } from './MediaBuilder';
import { SuggestionBuilder } from './SuggestionBuilder';
import { CarouselFieldInput } from './CarouselFieldInput';
import type {CarouselCardData, MediaMessageData, SuggestionButton, ThreadMessage} from "../types/types.ts";
import {Input} from "./ui/input.tsx";
import {Button} from "./ui/button.tsx";
import {Card} from "./ui/card.tsx";
import {Badge} from "./ui/badge.tsx";



interface ThreadBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (thread: { name: string; messages: ThreadMessage[] }) => void;
    editingThread?: { id: string; name: string; messages: ThreadMessage[] } | null;
    recipientCount: number;
    selectedRecipientIds: number[];
}

export const ThreadBuilder = ({ isOpen, onClose, onSave, editingThread, recipientCount, selectedRecipientIds }: ThreadBuilderProps) => {
    const [threadName, setThreadName] = useState(editingThread?.name || '');
    const [messages, setMessages] = useState<ThreadMessage[]>(editingThread?.messages || []);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showCarouselBuilder, setShowCarouselBuilder] = useState(false);
    const [showMediaBuilder, setShowMediaBuilder] = useState(false);
    const [showSuggestionBuilder, setShowSuggestionBuilder] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    const addTextMessage = () => {
        setMessages([...messages, {
            id: Date.now().toString(),
            type: 'text',
            content: ''
        }]);
        setShowAddMenu(false);
    };

    const removeMessage = (id: string) => {
        setMessages(messages.filter(m => m.id !== id));
    };

    const updateTextMessage = (id: string, content: string) => {
        setMessages(messages.map(m =>
            m.id === id ? { ...m, content } : m
        ));
    };

    const addSuggestionsToMessage = (id: string, suggestions: SuggestionButton[]) => {
        setMessages(messages.map(m =>
            m.id === id ? { ...m, suggestions } : m
        ));
    };

    const openSuggestionBuilder = (messageId: string) => {
        setEditingMessageId(messageId);
        setShowSuggestionBuilder(true);
    };

    const handleAddSuggestions = (suggestions: SuggestionButton[]) => {
        if (editingMessageId) {
            addSuggestionsToMessage(editingMessageId, suggestions);
        }
        setShowSuggestionBuilder(false);
        setEditingMessageId(null);
    };

    const handleAddCarousel = (cards: CarouselCardData[]) => {
        setMessages([...messages, {
            id: Date.now().toString(),
            type: 'carousel',
            carouselData: cards
        }]);
        setShowCarouselBuilder(false);
    };

    const handleAddMedia = (media: MediaMessageData) => {
        setMessages([...messages, {
            id: Date.now().toString(),
            type: 'media',
            mediaData: media
        }]);
        setShowMediaBuilder(false);
    };

    const handleSave = () => {
        if (!threadName.trim() || messages.length === 0) return;

        const validMessages = messages.filter(m => {
            if (m.type === 'text') return m.content?.trim();
            if (m.type === 'carousel') return m.carouselData && m.carouselData.length > 0;
            if (m.type === 'media') return m.mediaData;
            return false;
        });

        if (validMessages.length === 0) return;

        onSave({
            name: threadName,
            messages: validMessages
        });

        setThreadName('');
        setMessages([]);
    };

    if (!isOpen) return null;

    if (showSuggestionBuilder) {
        return (
            <SuggestionBuilder
                isOpen={true}
                onClose={() => {
                    setShowSuggestionBuilder(false);
                    setEditingMessageId(null);
                }}
                onAdd={handleAddSuggestions}
            />
        );
    }

    if (showCarouselBuilder) {
        return (
            <CarouselBuilder
                isOpen={true}
                onClose={() => setShowCarouselBuilder(false)}
                onSend={(cards) => handleAddCarousel(cards)}
                recipientCount={recipientCount}
            />
        );
    }

    if (showMediaBuilder) {
        return (
            <MediaBuilder
                isOpen={true}
                onClose={() => setShowMediaBuilder(false)}
                onSend={(media) => handleAddMedia(media)}
            />
        );
    }

    return (
        <div className="absolute inset-0 z-50 bg-background flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <div className="flex-1">
                    <Input
                        placeholder="Thread name..."
                        value={threadName}
                        onChange={(e) => setThreadName(e.target.value)}
                        className="border-none bg-transparent text-lg font-semibold focus-visible:ring-0 px-0"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-muted-foreground text-sm mb-4">No messages in this thread yet</p>
                            <Button onClick={() => setShowAddMenu(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Message
                            </Button>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <Card key={message.id} className="p-4 relative">
                            <div className="absolute top-2 right-2 flex gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  #{index + 1}
                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMessage(message.id)}
                                    className="h-7 w-7"
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>

                            {message.type === 'text' && (
                                <div className="pr-20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Text Message</span>
                                    </div>
                                    <CarouselFieldInput
                                        label=""
                                        value={message.content || ''}
                                        onChange={(text, html) => updateTextMessage(message.id, html)}
                                        placeholder="Type your message..."
                                        multiline={true}
                                        recipientCount={recipientCount}
                                        editingCardIndex={0}
                                    />
                                    <div className="mt-3 flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openSuggestionBuilder(message.id)}
                                            className="h-8"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                            {message.suggestions && message.suggestions.length > 0
                                                ? `Edit Suggestions (${message.suggestions.length})`
                                                : 'Add Suggestions'
                                            }
                                        </Button>
                                        {message.suggestions && message.suggestions.length > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {message.suggestions.length} suggestion{message.suggestions.length !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {message.type === 'carousel' && message.carouselData && (
                                <div className="pr-20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Carousel ({message.carouselData.length} cards)</span>
                                    </div>
                                    <CarouselMessage
                                        cards={message.carouselData}
                                        isSent={true}
                                        time="Preview"
                                        sender="You"
                                    />
                                </div>
                            )}

                            {message.type === 'media' && message.mediaData && (
                                <div className="pr-20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Video className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Media Message</span>
                                    </div>
                                    <MediaMessage
                                        media={message.mediaData}
                                        isSent={true}
                                        time="Preview"
                                        sender="You"
                                    />
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {/* Add Menu */}
            {showAddMenu && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={addTextMessage}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Text Message
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            setShowAddMenu(false);
                            setShowCarouselBuilder(true);
                        }}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Carousel
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                            setShowAddMenu(false);
                            setShowMediaBuilder(true);
                        }}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Media
                    </Button>
                </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card space-y-2">
                {messages.length > 0 && !showAddMenu && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowAddMenu(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Message
                    </Button>
                )}

                {showAddMenu && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowAddMenu(false)}
                    >
                        Cancel
                    </Button>
                )}

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleSave}
                        disabled={!threadName.trim() || messages.length === 0}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Save & Schedule
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleSave}
                        disabled={!threadName.trim() || messages.length === 0}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Save Thread
                    </Button>
                </div>
            </div>
        </div>
    );
};