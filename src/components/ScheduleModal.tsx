import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import {Button} from "./ui/button.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";


interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (scheduledTime: Date) => void;
    messageType: string;
}

export const ScheduleModal = ({ isOpen, onClose, onSchedule, messageType }: ScheduleModalProps) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSchedule = () => {
        if (date && time) {
            const scheduledDateTime = new Date(`${date}T${time}`);
            if (scheduledDateTime > new Date()) {
                onSchedule(scheduledDateTime);
                onClose();
                setDate('');
                setTime('');
            } else {
                alert('Please select a future date and time');
            }
        }
    };

    const getMinDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border border-border rounded-2xl w-[90%] max-w-md shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Schedule Message</h2>
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
                <div className="p-4 space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Scheduling a <span className="font-semibold text-foreground">{messageType}</span> message
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Date
                        </Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={getMinDateTime()}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Time
                        </Label>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {date && time && (
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm text-foreground">
                                Message will be sent on{' '}
                                <span className="font-semibold">
                  {new Date(`${date}T${time}`).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                  })}
                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSchedule}
                        disabled={!date || !time}
                        className="flex-1"
                    >
                        Schedule
                    </Button>
                </div>
            </div>
        </div>
    );
};
