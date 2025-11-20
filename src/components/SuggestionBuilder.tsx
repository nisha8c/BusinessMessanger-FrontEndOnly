import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type {SuggestionButton, SuggestionType} from "../types/types.ts";
import {Button} from "./ui/button.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";



interface SuggestionBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (suggestions: SuggestionButton[]) => void;
}

export const SuggestionBuilder = ({ isOpen, onClose, onAdd }: SuggestionBuilderProps) => {
    const [suggestions, setSuggestions] = useState<SuggestionButton[]>([
        { id: '1', text: '', type: 'reply' }
    ]);

    const addSuggestion = () => {
        setSuggestions([...suggestions, {
            id: Date.now().toString(),
            text: '',
            type: 'reply'
        }]);
    };

    const removeSuggestion = (index: number) => {
        if (suggestions.length > 1) {
            setSuggestions(suggestions.filter((_, i) => i !== index));
        }
    };

    const updateSuggestion = (index: number, field: keyof SuggestionButton, value: string) => {
        const newSuggestions = [...suggestions];
        newSuggestions[index] = { ...newSuggestions[index], [field]: value };
        setSuggestions(newSuggestions);
    };

    const handleAdd = () => {
        const validSuggestions = suggestions.filter(s => s.text.trim());
        if (validSuggestions.length > 0) {
            onAdd(validSuggestions);
            onClose();
            // Reset
            setSuggestions([{ id: '1', text: '', type: 'reply' }]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-background">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                    <h2 className="text-lg font-semibold text-foreground">Add Suggestions</h2>
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
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                            Add suggestion buttons to your message
                        </p>
                        <Button
                            onClick={addSuggestion}
                            size="sm"
                            variant="outline"
                            disabled={suggestions.length >= 6}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </div>

                    {suggestions.map((suggestion, index) => (
                        <div key={suggestion.id} className="p-4 border border-border rounded-lg space-y-3 bg-card">
                            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Suggestion {index + 1}
                </span>
                                {suggestions.length > 1 && (
                                    <Button
                                        onClick={() => removeSuggestion(index)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Button Text *</Label>
                                <Input
                                    placeholder="e.g., Yes, I'm interested"
                                    value={suggestion.text}
                                    onChange={(e) => updateSuggestion(index, 'text', e.target.value)}
                                    className="text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Action Type</Label>
                                <Select
                                    value={suggestion.type}
                                    onValueChange={(value) => updateSuggestion(index, 'type', value as SuggestionType)}
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reply">Reply</SelectItem>
                                        <SelectItem value="dial">Dial Phone</SelectItem>
                                        <SelectItem value="viewLocation">View Location</SelectItem>
                                        <SelectItem value="createCalenderEvent">Create Calendar Event</SelectItem>
                                        <SelectItem value="openUrl">Open URL</SelectItem>
                                        <SelectItem value="shareLocation">Share Location</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {['dial', 'viewLocation', 'openUrl', 'createCalenderEvent'].includes(suggestion.type) && (
                                <div className="space-y-2">
                                    <Label className="text-xs">Value</Label>
                                    <Input
                                        placeholder={
                                            suggestion.type === 'dial' ? 'Phone number' :
                                                suggestion.type === 'viewLocation' ? 'Location coordinates or address' :
                                                    suggestion.type === 'createCalenderEvent' ? 'Event details' :
                                                        'URL'
                                        }
                                        value={suggestion.value || ''}
                                        onChange={(e) => updateSuggestion(index, 'value', e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {suggestions.length >= 6 && (
                        <p className="text-xs text-muted-foreground text-center">
                            Maximum 6 suggestions allowed
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card">
                    <Button
                        type="button"
                        onClick={handleAdd}
                        disabled={!suggestions.some(s => s.text.trim())}
                        className="w-full"
                    >
                        Add Suggestions
                    </Button>
                </div>
            </div>
        </div>
    );
};
