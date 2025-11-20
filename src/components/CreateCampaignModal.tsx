import { useState } from 'react';
import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import type {Thread} from "../types/types.ts";
import {Button} from "./ui/button.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";


interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (campaign: { name: string; threadId: string }) => void;
    threads: Thread[];
}

export const CreateCampaignModal = ({ isOpen, onClose, onCreate, threads }: CreateCampaignModalProps) => {
    const [campaignName, setCampaignName] = useState('');
    const [selectedThreadId, setSelectedThreadId] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!campaignName.trim() || !selectedThreadId) return;
        onCreate({ name: campaignName, threadId: selectedThreadId });
        setCampaignName('');
        setSelectedThreadId('');
    };

    const selectedThread = threads.find(t => t.id === selectedThreadId);

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Create Campaign</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="campaign-name">Campaign Name</Label>
                        <Input
                            id="campaign-name"
                            placeholder="e.g., Spring Sale 2024"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thread-select">Select Thread</Label>
                        <Select value={selectedThreadId} onValueChange={setSelectedThreadId}>
                            <SelectTrigger id="thread-select">
                                <SelectValue placeholder="Choose a thread" />
                            </SelectTrigger>
                            <SelectContent>
                                {threads.map((thread) => (
                                    <SelectItem key={thread.id} value={thread.id}>
                                        {thread.name} ({thread.messages.length} messages)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedThread && (
                        <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                            <div className="text-sm">
                                <span className="text-muted-foreground">Messages: </span>
                                <span className="font-medium">{selectedThread.messages.length}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Recipients: </span>
                                <span className="font-medium">{selectedThread.recipientCount}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 p-4 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!campaignName.trim() || !selectedThreadId}
                        className="flex-1"
                    >
                        Create Campaign
                    </Button>
                </div>
            </div>
        </div>
    );
};
