import { useEffect, useRef } from 'react';
import { Phone, MapPin, Calendar, ExternalLink, Share2, MessageSquare } from 'lucide-react';

import {setupDropdownPositioning} from "../lib/dropdownHelpers.ts";
import {Button} from "./ui/button.tsx";
import type {CarouselButton} from "../types/types.ts";

interface CarouselCardProps {
    image?: string;
    title: string;
    titleHtml?: string;
    description: string;
    descriptionHtml?: string;
    orientation?: 'horizontal' | 'vertical';
    buttons?: CarouselButton[];
}

export const CarouselCard = ({
                                 image,
                                 title,
                                 titleHtml,
                                 description,
                                 descriptionHtml,
                                 orientation = 'vertical',
                                 buttons = []
                             }: CarouselCardProps) => {
    const isHorizontal = orientation === 'horizontal';
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const setupChipDropdowns = (element: HTMLElement | null) => {
            if (!element) return;

            const chipContainers = element.querySelectorAll('.variable-chip-container');
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
        };

        const titleCleanup = setupChipDropdowns(titleRef.current);
        const descriptionCleanup = setupChipDropdowns(descriptionRef.current);

        return () => {
            titleCleanup?.();
            descriptionCleanup?.();
        };
    }, [titleHtml, descriptionHtml]);

    return (
        <div className={`
      bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg
      ${isHorizontal ? 'flex flex-row' : 'flex flex-col'}
      min-w-[280px] max-w-[280px]
    `}>
            {/* Image */}
            {image && (
                <div className={`
          bg-muted/30 flex items-center justify-center overflow-hidden
          ${isHorizontal ? 'w-24 h-full' : 'w-full h-40'}
        `}>
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className={`
        p-4 flex flex-col gap-2
        ${isHorizontal ? 'flex-1' : ''}
      `}
                 style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}
            >
                <h3
                    ref={titleRef}
                    className="font-semibold text-foreground text-sm line-clamp-2"
                    style={{ overflow: 'visible' }}
                    dangerouslySetInnerHTML={{ __html: titleHtml || title }}
                />
                <p
                    ref={descriptionRef}
                    className="text-xs text-muted-foreground line-clamp-3"
                    style={{ overflow: 'visible' }}
                    dangerouslySetInnerHTML={{ __html: descriptionHtml || description }}
                />

                {/* Buttons */}
                {buttons.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2">
                        {buttons.map((button) => {
                            const Icon = getButtonIcon(button.type);
                            return (
                                <Button
                                    key={button.id}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-center gap-2 h-8 text-xs"
                                    onClick={() => handleButtonClick(button)}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {button.text}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const getButtonIcon = (type: string) => {
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

const handleButtonClick = (button: CarouselButton) => {
    console.log('Button clicked:', button);

    switch (button.type) {
        case 'reply':
            // Dispatch custom event to populate message input
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
            // Create calendar event with value as event details
            if (button.value) {
                const eventData = button.value;
                // Google Calendar URL format
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(button.text)}&details=${encodeURIComponent(eventData)}`;
                window.open(calendarUrl, '_blank');
            }
            break;
        case 'openUrl':
            if (button.value) window.open(button.value, '_blank');
            break;
        case 'shareLocation':
            // Use Web Share API for location sharing
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
