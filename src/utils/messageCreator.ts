
import type {CarouselCardData, MediaMessageData, SuggestionButton} from "../types/types.ts";
import {getCurrentTimeFormatted} from "./time.ts";

export interface Message {
    id: number;
    content?: string;
    carouselData?: CarouselCardData[];
    mediaData?: MediaMessageData;
    suggestions?: SuggestionButton[];
    type: 'text' | 'carousel' | 'media';
    isSent: boolean;
    time: string;
    sender: string;
    scheduledFor?: Date;
}

interface CreateMessageParams {
    content?: string;
    carouselData?: CarouselCardData[];
    mediaData?: MediaMessageData;
    suggestions?: SuggestionButton[];
    type: 'text' | 'carousel' | 'media';
    isSent?: boolean;
    sender?: string;
}

/**
 * Creates a new message with default values
 */
export const createMessage = ({
                                  content,
                                  carouselData,
                                  mediaData,
                                  suggestions,
                                  type,
                                  isSent = true,
                                  sender = 'You'
                              }: CreateMessageParams): Message => {
    return {
        id: Date.now(),
        content,
        carouselData,
        mediaData,
        suggestions,
        type,
        isSent,
        time: getCurrentTimeFormatted(),
        sender
    };
};
