
import { Volume2 } from 'lucide-react';
import dayjs from "dayjs";
import { useState, useRef } from 'react';
import {Avatar, AvatarFallback} from "./ui/avatar.tsx";
import type {MediaMessageData} from "../types/types.ts";



interface MediaMessageProps {
    media: MediaMessageData;
    isSent?: boolean;
    time?: string;
    sender?: string;
}

export const MediaMessage = ({
                                 media,
                                 isSent = false,
                                 time = dayjs().format('h:mm A'),
                                 sender = isSent ? "You" : "Alex"
                             }: MediaMessageProps) => {
    const initials = sender.substring(0, 2).toUpperCase();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudioPlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={`flex gap-2 animate-slide-up ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className={`w-8 h-8 ${isSent ? 'bg-primary' : 'bg-accent'}`}>
                <AvatarFallback className={isSent ? 'text-primary-foreground text-xs' : 'text-accent-foreground text-xs'}>
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col max-w-[85%] ${isSent ? 'items-end' : 'items-start'}`}>
                {/* Media Container */}
                <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                    {media.type === 'video' ? (
                        <div className="relative">
                            <video
                                controls
                                className="w-full h-48 object-cover bg-black"
                                poster={media.thumbnail}
                                preload="metadata"
                            >
                                <source src={media.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 cursor-pointer"
                            onClick={toggleAudioPlayback}
                        >
                            <div className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center transition-transform ${isPlaying ? 'scale-110' : ''}`}>
                                <Volume2 className={`w-6 h-6 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="flex-1">
                                <div className="h-8 bg-primary/30 rounded-full relative overflow-hidden">
                                    <div className={`h-full bg-primary/60 rounded-full transition-all ${isPlaying ? 'w-2/3' : 'w-0'}`}></div>
                                </div>
                            </div>
                            {media.duration && (
                                <span className="text-xs text-muted-foreground font-medium">
                  {media.duration}
                </span>
                            )}
                            <audio
                                ref={audioRef}
                                src={media.url}
                                onEnded={() => setIsPlaying(false)}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                            />
                        </div>
                    )}

                    {/* Media Link */}
                    <div className="p-3 bg-card border-t border-border/30">
                        <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline break-all"
                        >
                            {media.url}
                        </a>
                    </div>
                </div>

                {/* Time and sender */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">{time}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">{sender}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">
            {media.type === 'video' ? 'Video' : 'Voice'}
          </span>
                </div>
            </div>
        </div>
    );
};
