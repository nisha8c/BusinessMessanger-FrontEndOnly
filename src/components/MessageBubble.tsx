
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Phone, MapPin, Calendar, ExternalLink, Share2, MessageSquare } from 'lucide-react';
import type {SuggestionButton, SuggestionType} from "../types/types.ts";
import {Avatar, AvatarFallback} from "./ui/avatar.tsx";
import {Button} from "./ui/button.tsx";
import {setupDropdownPositioning} from "../lib/dropdownHelpers.ts";


interface MessageBubbleProps {
    content: string;
    isSent?: boolean;
    time?: string;
    sender?: string;
    suggestions?: SuggestionButton[];
}

export const MessageBubble = ({
                                  content,
                                  isSent = false,
                                  time = dayjs().format('h:mm A'),
                                  sender = isSent ? "You" : "Alex",
                                  suggestions = []
                              }: MessageBubbleProps) => {
    const initials = sender.substring(0, 2).toUpperCase();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const chipContainers = contentRef.current.querySelectorAll('.variable-chip-container');
        const cleanupFunctions: (() => void)[] = [];

        chipContainers.forEach((container) => {
            const stack = container.querySelector('.chip-stack') as HTMLElement;
            const dropdown = container.querySelector('.variable-dropdown') as HTMLElement;

            if (stack && dropdown) {
                if (dropdown.parentNode) {
                    dropdown.parentNode.removeChild(dropdown);
                }

                const cleanup = setupDropdownPositioning(stack, dropdown);
                cleanupFunctions.push(cleanup);
            }
        });

        return () => {
            cleanupFunctions.forEach(fn => fn());
        };
    }, [content]);

    return (
        <div className={`flex gap-2 animate-slide-up ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className={`w-8 h-8 ${isSent ? 'bg-primary' : 'bg-accent'}`}>
                <AvatarFallback className={isSent ? 'text-primary-foreground text-xs' : 'text-accent-foreground text-xs'}>
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col max-w-[70%] ${isSent ? 'items-end' : 'items-start'}`}>
                <div
                    ref={contentRef}
                    className={`px-4 py-2 rounded-2xl ${
                        isSent
                            ? 'bg-message-sent text-primary-foreground rounded-tr-sm'
                            : 'bg-message-received text-foreground rounded-tl-sm'
                    }`}
                    style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Suggestion Buttons */}
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                        {suggestions.map((suggestion) => {
                            const Icon = getButtonIcon(suggestion.type);
                            return (
                                <Button
                                    key={suggestion.id}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs gap-1.5 bg-card hover:bg-accent justify-center"
                                    onClick={() => handleButtonClick(suggestion)}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {suggestion.text}
                                </Button>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">{time}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{sender}</span>
                </div>
            </div>
        </div>
    );
};

const getButtonIcon = (type: SuggestionType) => {
    switch (type) {
        case 'reply':
            return MessageSquare;
        case 'dial':
            return Phone;
        case 'viewLocation':
            return MapPin;
        case 'createCalenderEvent':
            return Calendar;
        case 'openUrl':
            return ExternalLink;
        case 'shareLocation':
            return Share2;
        default:
            return MessageSquare;
    }
};

const handleButtonClick = (button: SuggestionButton) => {
    console.log('Suggestion clicked:', button);

    switch (button.type) {
        case 'reply':
            window.dispatchEvent(new CustomEvent('carousel-reply', {
                detail: { text: button.text }
            }));
            break;
        case 'dial':
            if (button.value) window.open(`tel:${button.value}`);
            break;
        case 'viewLocation':
            if (button.value) window.open(`https://maps.google.com/?q=${button.value}`);
            break;
        case 'createCalenderEvent':
            if (button.value) {
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(button.text)}&details=${encodeURIComponent(button.value)}`;
                window.open(calendarUrl, '_blank');
            }
            break;
        case 'openUrl':
            if (button.value) window.open(button.value, '_blank');
            break;
        case 'shareLocation':
            if (navigator.share && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const locationText = `My location: https://maps.google.com/?q=${latitude},${longitude}`;
                        navigator.share({
                            title: 'My Location',
                            text: locationText,
                        }).catch((error) => console.log('Error sharing:', error));
                    },
                    (error) => {
                        console.log('Error getting location:', error);
                        alert('Unable to get your location. Please enable location services.');
                    }
                );
            } else {
                alert('Location sharing is not supported on this device.');
            }
            break;
    }
};
