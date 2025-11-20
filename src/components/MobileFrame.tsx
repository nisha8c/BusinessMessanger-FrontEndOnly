import { Clock, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Button } from "./ui/button";
import * as React from "react";

interface MobileFrameProps {
    children: React.ReactNode;
}

const MIN_WIDTH = 320;
const MAX_WIDTH_PERCENTAGE = 0.9; // Use 90% of available width

const getAvailableWidth = () => {
    const viewportWidth = window.innerWidth;
    const padding = 32; // 2rem padding on both sides
    const maxWidth = (viewportWidth - padding) * MAX_WIDTH_PERCENTAGE;
    return Math.max(MIN_WIDTH, Math.min(maxWidth, 600)); // Max 600px for desktop
};

export const MobileFrame = ({ children }: MobileFrameProps) => {
    const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
    const [width, setWidth] = useState(getAvailableWidth());
    const [isResizing, setIsResizing] = useState(false);
    const frameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Update time every second
        const interval = setInterval(() => {
            setCurrentTime(dayjs().format('HH:mm'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Handle responsive width on window resize
        const handleResize = () => {
            if (!isResizing) {
                setWidth(getAvailableWidth());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isResizing]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !frameRef.current) return;

            const rect = frameRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const deltaX = Math.abs(e.clientX - centerX);
            const newWidth = Math.max(MIN_WIDTH, deltaX * 2);

            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing]);

    const handleReset = () => {
        setWidth(getAvailableWidth());
    };

    return (
        <div className="flex items-center justify-center h-screen bg-background p-4 relative">
            {/* Reset Button */}
            <Button
                size="icon"
                variant="outline"
                className="absolute top-6 right-6 z-50 rounded-full shadow-lg"
                onClick={handleReset}
                title="Reset width"
            >
                <RotateCcw className="w-4 h-4" />
            </Button>

            <div
                ref={frameRef}
                className="relative h-full max-h-[calc(100vh-2rem)] bg-mobile-frame rounded-[3rem] p-3 shadow-2xl shadow-glow border-2 border-border/20 transition-all duration-200"
                style={{ width: `${width}px` }}
            >
                {/* Left Resize Handle */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-primary/20 transition-colors z-50 group"
                    onMouseDown={() => setIsResizing(true)}
                >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-border group-hover:bg-primary rounded-full transition-colors" />
                </div>

                {/* Right Resize Handle */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-primary/20 transition-colors z-50 group"
                    onMouseDown={() => setIsResizing(true)}
                >
                    <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-border group-hover:bg-primary rounded-full transition-colors" />
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-background rounded-b-3xl flex items-center justify-center gap-2 px-4 z-10">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-foreground font-medium">{currentTime}</span>
                </div>

                {/* Screen */}
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                    {/* Status Bar */}
                    <div className="h-14 bg-card border-b border-border/50 flex items-end justify-center pb-2">
                        <h2 className="text-sm font-semibold bg-gradient-tech bg-clip-text text-transparent">
                            Variable Messenger
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
