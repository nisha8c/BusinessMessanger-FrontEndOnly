export type SuggestionType = 'reply' | 'dial' | 'viewLocation' | 'createCalenderEvent' | 'openUrl' | 'shareLocation';

export interface SuggestionButton {
    id: string;
    text: string;
    type: SuggestionType;
    value?: string;
}

export interface CarouselButton {
    id: string;
    text: string;
    type: SuggestionType;
    value?: string; // URL, phone number, location, etc.
}

export interface CarouselCardData {
    id: string;
    image?: string;
    title: string;
    titleHtml?: string;
    description: string;
    descriptionHtml?: string;
    orientation?: 'horizontal' | 'vertical';
    buttons?: CarouselButton[];
}

export interface MediaMessageData {
    url: string;
    type: 'video' | 'voice';
    duration?: string;
    thumbnail?: string;
}

export interface Campaign {
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