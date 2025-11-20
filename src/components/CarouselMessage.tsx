import { CarouselCard } from './CarouselCard';
import dayjs from "dayjs";
import type {CarouselCardData} from "../types/types.ts";
import {Avatar, AvatarFallback} from "./ui/avatar.tsx";



interface CarouselMessageProps {
    cards: CarouselCardData[];
    isSent?: boolean;
    time?: string;
    sender?: string;
}

export const CarouselMessage = ({
                                    cards,
                                    isSent = false,
                                    time = dayjs().format('h:mm A'),
                                    sender = isSent ? "You" : "Alex"
                                }: CarouselMessageProps) => {
    const initials = sender.substring(0, 2).toUpperCase();

    return (
        <div className={`flex gap-2 animate-slide-up ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className={`w-8 h-8 ${isSent ? 'bg-primary' : 'bg-accent'}`}>
                <AvatarFallback className={isSent ? 'text-primary-foreground text-xs' : 'text-accent-foreground text-xs'}>
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col max-w-[85%] ${isSent ? 'items-end' : 'items-start'}`}>
                {/* Carousel Container - Horizontally Scrollable */}
                <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent w-full">
                    <div className="flex gap-3 pb-3 px-1">
                        {cards.map((card) => (
                            <CarouselCard
                                key={card.id}
                                image={card.image}
                                title={card.title}
                                titleHtml={card.titleHtml}
                                description={card.description}
                                descriptionHtml={card.descriptionHtml}
                                orientation={card.orientation || 'vertical'}
                                buttons={card.buttons}
                            />
                        ))}
                    </div>
                </div>

                {/* Time, sender and card counter */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">{time}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{sender}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">
            {cards.length} card{cards.length !== 1 ? 's' : ''}
          </span>
                </div>
            </div>
        </div>
    );
};
