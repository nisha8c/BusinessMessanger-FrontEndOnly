import { useState } from 'react';
import {
    Send,
    Trash2,
    ChevronDown,
    ChevronUp,
    Users,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2
} from 'lucide-react';
import type {Campaign} from "../types/types.ts";
import {Card} from "./ui/card.tsx";
import {Button} from "./ui/button.tsx";
import {Badge} from "./ui/badge.tsx";



interface CampaignItemProps {
    campaign: Campaign;
    onDelete: () => void;
    onSend: () => void;
    onSchedule: () => void;
}

export const CampaignItem = ({ campaign, onDelete, onSend, onSchedule }: CampaignItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusBadge = () => {
        switch (campaign.status) {
            case 'draft':
                return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
            case 'scheduled':
                return <Badge variant="outline" className="text-xs border-blue-500 text-blue-500"><Calendar className="w-3 h-3 mr-1" />Scheduled</Badge>;
            case 'sending':
                return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Sending</Badge>;
            case 'sent':
                return <Badge variant="outline" className="text-xs border-green-500 text-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Sent</Badge>;
            case 'failed':
                return <Badge variant="destructive" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base truncate">{campaign.name}</h3>
                            {getStatusBadge()}
                        </div>
                        <p className="text-xs text-muted-foreground">Thread: {campaign.threadName}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-8 w-8 p-0 shrink-0"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{campaign.recipientCount} recipients</span>
                    </div>
                    {campaign.scheduledFor && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                {new Date(campaign.scheduledFor).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
              </span>
                        </div>
                    )}
                    {campaign.sentAt && (
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                {new Date(campaign.sentAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })}
              </span>
                        </div>
                    )}
                </div>

                {isExpanded && campaign.stats && (
                    <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                            <div className="text-lg font-semibold">{campaign.stats.sent}</div>
                            <div className="text-xs text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">{campaign.stats.delivered}</div>
                            <div className="text-xs text-muted-foreground">Delivered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold">{campaign.stats.read}</div>
                            <div className="text-xs text-muted-foreground">Read</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-destructive">{campaign.stats.failed}</div>
                            <div className="text-xs text-muted-foreground">Failed</div>
                        </div>
                    </div>
                )}

                {campaign.status === 'draft' && (
                    <div className="flex gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onSchedule}
                            className="flex-1 h-8"
                        >
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            Schedule
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSend}
                            className="flex-1 h-8"
                        >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            Send Now
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {campaign.status === 'scheduled' && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDelete}
                            className="flex-1 h-8 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};
