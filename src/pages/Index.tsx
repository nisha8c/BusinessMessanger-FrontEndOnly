import { useState } from 'react';
import { MobileFrame } from '../components/MobileFrame';
import { TypingIndicator } from '../components/TypingIndicator';
import { VariableInput } from '../components/VariableInput';
import { CarouselBuilder } from '../components/CarouselBuilder';
import { MediaBuilder } from '../components/MediaBuilder';
import { SuggestionBuilder } from '../components/SuggestionBuilder';
import { ScheduleModal } from '../components/ScheduleModal';
import { ThreadBuilder } from '../components/ThreadBuilder';
import { ThreadItem } from '../components/ThreadItem';
import { CampaignItem } from '../components/CampaignItem';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import { ViewModeNav } from '../components/ViewModeNav';
import { Users, Layers, Megaphone } from 'lucide-react';
import {Button} from "../components/ui/button.tsx";
import type {CarouselCardData, MediaMessageData, Message, SuggestionButton} from "../types/types.ts";
import {createMessage} from "../utils/messageCreator.ts";
import {MessagesList} from "../components/MessageList.tsx";

interface Thread {
    id: string;
    name: string;
    messages: {
        id: string;
        type: 'text' | 'carousel' | 'media';
        content?: string;
        carouselData?: CarouselCardData[];
        mediaData?: MediaMessageData;
        suggestions?: SuggestionButton[];
    }[];
    recipientCount: number;
    selectedRecipientIds: number[];
    createdAt: Date;
}

interface Campaign {
    id: string;
    name: string;
    threadId: string;
    threadName: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    recipientCount: number;
    selectedRecipientIds: number[];
    scheduledFor?: Date;
    sentAt?: Date;
    createdAt: Date;
    stats?: {
        sent: number;
        delivered: number;
        read: number;
        failed: number;
    };
}

const Index = () => {
    const [recipientCount, setRecipientCount] = useState(1);
    const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([1]);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            content: 'Hey! Try typing a message with variables!',
            type: 'text',
            isSent: false,
            time: '10:30 AM',
            sender: 'Alex'
        },
        {
            id: 2,
            content: 'Type <span style="background: linear-gradient(135deg, hsl(195 100% 50%) 0%, hsl(280 100% 70%) 100%); color: hsl(220 25% 8%); padding: 2px 8px; border-radius: 6px; font-weight: 600; display: inline-block; margin: 0 2px;">{ </span> to insert variables. Click the <strong>group icon</strong> to send to multiple people!',
            type: 'text',
            isSent: false,
            time: '10:31 AM',
            sender: 'Alex'
        },
        {
            id: 3,
            type: 'carousel',
            carouselData: [
                {
                    id: '1',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                    title: 'Analytics Dashboard',
                    description: 'Track your business metrics in real-time with our powerful analytics tools.',
                    orientation: 'vertical'
                },
                {
                    id: '2',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                    title: 'Team Collaboration',
                    description: 'Work together seamlessly with built-in collaboration features.',
                    orientation: 'horizontal'
                },
                {
                    id: '3',
                    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400',
                    title: 'Secure & Reliable',
                    description: 'Your data is protected with enterprise-grade security.',
                    orientation: 'vertical'
                }
            ],
            isSent: false,
            time: '10:32 AM',
            sender: 'Alex'
        },
        {
            id: 4,
            content: 'Would you like to schedule a demo?',
            type: 'text',
            isSent: false,
            time: '10:33 AM',
            sender: 'Alex',
            suggestions: [
                { id: '1', text: 'Yes, please!', type: 'reply' },
                { id: '2', text: 'Call me', type: 'dial', value: '+1-555-0100' },
                { id: '3', text: 'View location', type: 'viewLocation', value: '37.7749,-122.4194' }
            ]
        }
    ]);
    const [showTyping, setShowTyping] = useState(false);
    const [showCarouselBuilder, setShowCarouselBuilder] = useState(false);
    const [showMediaBuilder, setShowMediaBuilder] = useState(false);
    const [showSuggestionBuilder, setShowSuggestionBuilder] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [pendingMessage, setPendingMessage] = useState<{ text: string; html: string } | null>(null);
    const [pendingSchedule, setPendingSchedule] = useState<{ message: Message; type: string } | null>(null);
    const [viewMode, setViewMode] = useState<'chat' | 'scheduled' | 'sent' | 'threads' | 'campaigns'>('chat');
    const [showRecipientSelector, setShowRecipientSelector] = useState(false);
    const [pendingSuggestions, setPendingSuggestions] = useState<SuggestionButton[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [showThreadBuilder, setShowThreadBuilder] = useState(false);
    const [editingThread, setEditingThread] = useState<Thread | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

    const handleSendMessage = (text: string, htmlContent: string, withSuggestions?: boolean, shouldSchedule?: boolean) => {
        if (withSuggestions) {
            setPendingMessage({ text, html: htmlContent });
            setShowSuggestionBuilder(true);
            return;
        }

        const newMessage = createMessage({
            content: htmlContent,
            type: 'text',
            isSent: !shouldSchedule,
            ...(pendingSuggestions.length > 0 && { suggestions: pendingSuggestions })
        });

        if (shouldSchedule) {
            setPendingSchedule({ message: newMessage, type: 'text' });
            setShowScheduleModal(true);
            setPendingSuggestions([]);
            setPendingMessage(null);
            return;
        }

        setMessages(prev => [...prev, newMessage]);
        setPendingSuggestions([]);
        setPendingMessage(null);

        // Simulate response
        setShowTyping(true);
        setTimeout(() => {
            setShowTyping(false);
            const response = recipientCount > 1
                ? `Awesome! Your message will be sent to ${recipientCount} people with personalized variables! 📨`
                : 'Nice! Your message looks great with those variables! 🎉';

            setMessages(prev => [...prev, createMessage({
                content: response,
                type: 'text',
                isSent: false,
                sender: 'Alex'
            })]);
        }, 1500);
    };

    const handleAddSuggestions = (suggestions: SuggestionButton[]) => {
        setPendingSuggestions(suggestions);
    };

    const handleSendMedia = (media: MediaMessageData, shouldSchedule?: boolean) => {
        const newMessage = createMessage({
            type: 'media',
            mediaData: media,
            isSent: !shouldSchedule
        });

        if (shouldSchedule) {
            setPendingSchedule({ message: newMessage, type: 'media' });
            setShowScheduleModal(true);
            return;
        }

        setMessages(prev => [...prev, newMessage]);

        // Simulate response
        setShowTyping(true);
        setTimeout(() => {
            setShowTyping(false);
            const response = media.type === 'video'
                ? 'Great video! 🎥 Media messages are perfect for engaging your audience!'
                : 'Nice voice message! 🎙️ Audio adds a personal touch to your communications!';

            setMessages(prev => [...prev, createMessage({
                content: response,
                type: 'text',
                isSent: false,
                sender: 'Alex'
            })]);
        }, 1500);
    };

    const handleSendCarousel = (cards: CarouselCardData[], shouldSchedule?: boolean) => {
        const newMessage = createMessage({
            type: 'carousel',
            carouselData: cards,
            isSent: !shouldSchedule
        });

        if (shouldSchedule) {
            setPendingSchedule({ message: newMessage, type: 'carousel' });
            setShowScheduleModal(true);
            return;
        }

        setMessages(prev => [...prev, newMessage]);

        // Simulate response
        setShowTyping(true);
        setTimeout(() => {
            setShowTyping(false);
            const response = recipientCount > 1
                ? `Amazing carousel! This will be sent to ${recipientCount} people! 🎨`
                : 'Great carousel! Your message looks stunning! 🎉';

            setMessages(prev => [...prev, createMessage({
                content: response,
                type: 'text',
                isSent: false,
                sender: 'Alex'
            })]);
        }, 1500);
    };

    const handleScheduleConfirm = (scheduledTime: Date) => {
        if (!pendingSchedule) return;

        const scheduledMessage = {
            ...pendingSchedule.message,
            scheduledFor: scheduledTime
        };

        setMessages(prev => [...prev, scheduledMessage]);
        setPendingSchedule(null);
        setShowScheduleModal(false);

        // Show confirmation
        setShowTyping(true);
        setTimeout(() => {
            setShowTyping(false);
            setMessages(prev => [...prev, createMessage({
                content: `Message scheduled for ${scheduledTime.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })}! 📅`,
                type: 'text',
                isSent: false,
                sender: 'Alex'
            })]);
        }, 500);
    };

    const handleDeleteScheduled = (id: number) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const handleSaveThread = (thread: { name: string; messages: any[] }) => {
        const newThread: Thread = {
            id: Date.now().toString(),
            name: thread.name,
            messages: thread.messages,
            recipientCount: recipientCount,
            selectedRecipientIds: selectedRecipientIds,
            createdAt: new Date()
        };
        setThreads(prev => [...prev, newThread]);
        setShowThreadBuilder(false);
    };

    const handleDeleteThread = (id: string) => {
        setThreads(prev => prev.filter(t => t.id !== id));
    };

    const handleSendThread = (threadId: string) => {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;

        // Send all messages in the thread
        thread.messages.forEach((msg, index) => {
            setTimeout(() => {
                const newMessage: Message = {
                    id: Date.now() + index,
                    content: msg.content,
                    carouselData: msg.carouselData,
                    mediaData: msg.mediaData,
                    suggestions: msg.suggestions,
                    type: msg.type,
                    isSent: true,
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    sender: 'You'
                };
                setMessages(prev => [...prev, newMessage]);
            }, index * 500); // Stagger messages by 500ms
        });

        setViewMode('chat');
    };

    const handleScheduleThread = (threadId: string) => {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;

        // For now, just convert first message to pending schedule
        // In real app, you'd handle all messages
        if (thread.messages.length > 0) {
            const firstMsg = thread.messages[0];
            const newMessage = createMessage({
                content: firstMsg.content,
                carouselData: firstMsg.carouselData,
                mediaData: firstMsg.mediaData,
                suggestions: firstMsg.suggestions,
                type: firstMsg.type,
                isSent: false
            });
            setPendingSchedule({ message: newMessage, type: 'thread' });
            setShowScheduleModal(true);
        }
    };

    const handleCreateCampaign = ({ name, threadId }: { name: string; threadId: string }) => {
        const thread = threads.find(t => t.id === threadId);
        if (!thread) return;

        const newCampaign: Campaign = {
            id: Date.now().toString(),
            name,
            threadId,
            threadName: thread.name,
            status: 'draft',
            recipientCount: thread.recipientCount,
            selectedRecipientIds: thread.selectedRecipientIds,
            createdAt: new Date()
        };

        setCampaigns(prev => [...prev, newCampaign]);
        setShowCreateCampaignModal(false);
        setViewMode('campaigns');
    };

    const handleDeleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const handleSendCampaign = (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        // Update campaign status to sending
        setCampaigns(prev => prev.map(c =>
            c.id === campaignId ? { ...c, status: 'sending' as const } : c
        ));

        // Simulate sending with progress
        setTimeout(() => {
            setCampaigns(prev => prev.map(c =>
                c.id === campaignId ? {
                    ...c,
                    status: 'sent' as const,
                    sentAt: new Date(),
                    stats: {
                        sent: c.recipientCount,
                        delivered: Math.floor(c.recipientCount * 0.95),
                        read: Math.floor(c.recipientCount * 0.7),
                        failed: Math.floor(c.recipientCount * 0.05)
                    }
                } : c
            ));
        }, 2000);
    };

    const handleScheduleCampaign = (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        // Create a pending schedule for the campaign
        const thread = threads.find(t => t.id === campaign.threadId);
        if (!thread || thread.messages.length === 0) return;

        const firstMsg = thread.messages[0];
        const newMessage = createMessage({
            content: firstMsg.content,
            carouselData: firstMsg.carouselData,
            mediaData: firstMsg.mediaData,
            suggestions: firstMsg.suggestions,
            type: firstMsg.type,
            isSent: false
        });

        setPendingSchedule({ message: newMessage, type: 'campaign-' + campaignId });
        setShowScheduleModal(true);
    };

    return (
        <MobileFrame>
            <div className="relative flex flex-col h-full">
                {!showCarouselBuilder && !showMediaBuilder && !showSuggestionBuilder && !showThreadBuilder ? (
                    <>
                        {/* Action Buttons Row */}
                        {viewMode === 'chat' && (
                            <div className="flex items-center justify-end gap-2 px-3 py-2 bg-card border-b border-border/50">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8"
                                    onClick={() => setShowRecipientSelector(true)}
                                >
                                    <Users className="w-4 h-4 mr-1.5" />
                                    Recipients ({recipientCount})
                                </Button>
                            </div>
                        )}

                        {/* View Mode Tabs */}
                        <ViewModeNav currentMode={viewMode} onModeChange={setViewMode} />

                        {viewMode === 'threads' ? (
                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                {threads.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <p className="text-muted-foreground text-sm mb-4">No threads created yet</p>
                                            <Button onClick={() => setShowThreadBuilder(true)}>
                                                <Layers className="w-4 h-4 mr-2" />
                                                Create Thread
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {threads.map((thread) => (
                                            <ThreadItem
                                                key={thread.id}
                                                thread={thread}
                                                onDelete={() => handleDeleteThread(thread.id)}
                                                onSend={() => handleSendThread(thread.id)}
                                                onSchedule={() => handleScheduleThread(thread.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : viewMode === 'campaigns' ? (
                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                {campaigns.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <p className="text-muted-foreground text-sm mb-4">No campaigns created yet</p>
                                            <Button
                                                onClick={() => setShowCreateCampaignModal(true)}
                                                disabled={threads.length === 0}
                                            >
                                                <Megaphone className="w-4 h-4 mr-2" />
                                                Create Campaign
                                            </Button>
                                            {threads.length === 0 && (
                                                <p className="text-xs text-muted-foreground mt-2">Create a thread first</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {campaigns.map((campaign) => (
                                            <CampaignItem
                                                key={campaign.id}
                                                campaign={campaign}
                                                onDelete={() => handleDeleteCampaign(campaign.id)}
                                                onSend={() => handleSendCampaign(campaign.id)}
                                                onSchedule={() => handleScheduleCampaign(campaign.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <MessagesList
                                    messages={messages}
                                    viewMode={viewMode}
                                    onDeleteScheduled={handleDeleteScheduled}
                                />
                                {viewMode === 'chat' && showTyping && (
                                    <div className="px-4 pb-2">
                                        <TypingIndicator />
                                    </div>
                                )}

                                {viewMode === 'chat' && (
                                    <VariableInput
                                        onSend={handleSendMessage}
                                        onSendCarousel={handleSendCarousel}
                                        onSendMedia={handleSendMedia}
                                        recipientCount={recipientCount}
                                        onRecipientCountChange={setRecipientCount}
                                        onOpenCarouselBuilder={() => setShowCarouselBuilder(true)}
                                        onOpenMediaBuilder={() => setShowMediaBuilder(true)}
                                        showRecipientSelector={showRecipientSelector}
                                        onCloseRecipientSelector={() => setShowRecipientSelector(false)}
                                        pendingSuggestionsCount={pendingSuggestions.length}
                                        onClearSuggestions={() => setPendingSuggestions([])}
                                        pendingMessageText={pendingMessage?.html}
                                        selectedRecipientIds={selectedRecipientIds}
                                        onSelectedRecipientsChange={setSelectedRecipientIds}
                                    />
                                )}
                            </>
                        )}

                        {viewMode === 'threads' && threads.length > 0 && (
                            <div className="p-4 border-t border-border bg-card">
                                <Button
                                    className="w-full"
                                    onClick={() => setShowThreadBuilder(true)}
                                >
                                    <Layers className="w-4 h-4 mr-2" />
                                    Create New Thread
                                </Button>
                            </div>
                        )}

                        {viewMode === 'campaigns' && campaigns.length > 0 && (
                            <div className="p-4 border-t border-border bg-card">
                                <Button
                                    className="w-full"
                                    onClick={() => setShowCreateCampaignModal(true)}
                                    disabled={threads.length === 0}
                                >
                                    <Megaphone className="w-4 h-4 mr-2" />
                                    Create New Campaign
                                </Button>
                            </div>
                        )}
                    </>
                ) : showThreadBuilder ? (
                    <ThreadBuilder
                        isOpen={showThreadBuilder}
                        onClose={() => {
                            setShowThreadBuilder(false);
                            setEditingThread(null);
                        }}
                        onSave={handleSaveThread}
                        editingThread={editingThread}
                        recipientCount={recipientCount}
                        selectedRecipientIds={selectedRecipientIds}
                    />
                ) : showCarouselBuilder ? (
                    <CarouselBuilder
                        isOpen={showCarouselBuilder}
                        onClose={() => setShowCarouselBuilder(false)}
                        onSend={handleSendCarousel}
                        recipientCount={recipientCount}
                    />
                ) : showMediaBuilder ? (
                    <MediaBuilder
                        isOpen={showMediaBuilder}
                        onClose={() => setShowMediaBuilder(false)}
                        onSend={handleSendMedia}
                    />
                ) : (
                    <SuggestionBuilder
                        isOpen={showSuggestionBuilder}
                        onClose={() => {
                            setShowSuggestionBuilder(false);
                        }}
                        onAdd={handleAddSuggestions}
                    />
                )}

                {showScheduleModal && (
                    <ScheduleModal
                        isOpen={showScheduleModal}
                        onClose={() => {
                            setShowScheduleModal(false);
                            setPendingSchedule(null);
                        }}
                        onSchedule={(date) => {
                            if (pendingSchedule?.type.startsWith('campaign-')) {
                                const campaignId = pendingSchedule.type.replace('campaign-', '');
                                setCampaigns(prev => prev.map(c =>
                                    c.id === campaignId ? { ...c, status: 'scheduled' as const, scheduledFor: date } : c
                                ));
                            } else {
                                handleScheduleConfirm(date);
                            }
                        }}
                        messageType={pendingSchedule?.type || 'message'}
                    />
                )}

                {showCreateCampaignModal && (
                    <CreateCampaignModal
                        isOpen={showCreateCampaignModal}
                        onClose={() => setShowCreateCampaignModal(false)}
                        onCreate={handleCreateCampaign}
                        threads={threads}
                    />
                )}
            </div>
        </MobileFrame>
    );
};

export default Index;
