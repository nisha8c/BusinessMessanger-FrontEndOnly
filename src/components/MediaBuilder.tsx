import { useState } from 'react';
import { X, Link as LinkIcon, Video, Volume2, Clock } from 'lucide-react';


import {Button} from "./ui/button.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import type {MediaMessageData} from "../types/types.ts";

interface MediaBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (media: MediaMessageData, shouldSchedule?: boolean) => void;
}

export const MediaBuilder = ({ isOpen, onClose, onSend }: MediaBuilderProps) => {
    const [mediaType, setMediaType] = useState<'video' | 'voice'>('video');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const handleSend = (shouldSchedule = false) => {
        if (url.trim()) {
            onSend({
                type: mediaType,
                url: url.trim(),
                duration: duration.trim() || undefined,
                thumbnail: thumbnail.trim() || undefined
            }, shouldSchedule);

            if (!shouldSchedule) {
                onClose();
                // Reset
                setUrl('');
                setDuration('');
                setThumbnail('');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-background">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                    <h2 className="text-lg font-semibold text-foreground">Send Media</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Media Type Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Media Type</Label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMediaType('video')}
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                    mediaType === 'video'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                                }`}
                            >
                                <Video className="w-4 h-4" />
                                Video Clip
                            </button>
                            <button
                                onClick={() => setMediaType('voice')}
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                    mediaType === 'voice'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                                }`}
                            >
                                <Volume2 className="w-4 h-4" />
                                Voice Message
                            </button>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Media URL *</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="https://example.com/media.mp4"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Duration (optional)</Label>
                        <Input
                            placeholder="0:30"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Format: 0:30 or 1:25</p>
                    </div>

                    {/* Thumbnail (Video only) */}
                    {mediaType === 'video' && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Thumbnail URL (optional)</Label>
                            <Input
                                placeholder="https://example.com/thumbnail.jpg"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                            />
                            {thumbnail && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-full h-32 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card flex gap-2">
                    <Button
                        onClick={() => handleSend(true)}
                        disabled={!url.trim()}
                        variant="outline"
                        className="flex-1"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule
                    </Button>
                    <Button
                        onClick={() => handleSend(false)}
                        disabled={!url.trim()}
                        className="flex-1"
                    >
                        Send {mediaType === 'video' ? 'Video' : 'Voice'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
