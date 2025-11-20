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

export interface Variable {
    id: string;
    text: string;
    sampleValues: string[];
}

export interface Thread {
    id: string;
    name: string;
    messages: any[];
    recipientCount: number;
    selectedRecipientIds: number[];
    createdAt: Date;
}

export interface MediaMessageData {
    url: string;
    type: 'video' | 'voice';
    duration?: string;
    thumbnail?: string;
}

export interface Message {
    id: number;
    content?: string;
    carouselData?: any[];
    mediaData?: any;
    suggestions?: any[];
    type: 'text' | 'carousel' | 'media';
    isSent: boolean;
    time: string;
    sender: string;
    scheduledFor?: Date;
}

export interface Recipient {
    id: number;
    name: string;
    email: string;
    mobile: string;
}
export interface ThreadMessage {
    id: string;
    type: 'text' | 'carousel' | 'media';
    content?: string;
    carouselData?: CarouselCardData[];
    mediaData?: MediaMessageData;
    suggestions?: SuggestionButton[];
}