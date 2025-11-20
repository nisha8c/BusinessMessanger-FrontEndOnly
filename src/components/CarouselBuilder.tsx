import { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, GripVertical, Clock } from 'lucide-react';

import { CarouselCardData, CarouselButton, SuggestionType } from './CarouselMessage';

import { CarouselFieldInput } from './CarouselFieldInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {Button} from "./ui/button.tsx";
import {Input} from "./ui/input.tsx";
import {Label} from "./ui/label.tsx";
import {ScrollArea} from "./ui/scroll-area.tsx";

interface CarouselBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (cards: CarouselCardData[], shouldSchedule?: boolean) => void;
    recipientCount?: number;
}

export const CarouselBuilder = ({ isOpen, onClose, onSend, recipientCount = 1 }: CarouselBuilderProps) => {
    const [cards, setCards] = useState<CarouselCardData[]>([
        { id: '1', title: '', titleHtml: '', description: '', descriptionHtml: '', image: '', orientation: 'vertical', buttons: [] }
    ]);
    const [editingCardIndex, setEditingCardIndex] = useState(0);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const addCard = () => {
        setCards([...cards, {
            id: Date.now().toString(),
            title: '',
            titleHtml: '',
            description: '',
            descriptionHtml: '',
            image: '',
            orientation: 'vertical',
            buttons: []
        }]);
        setEditingCardIndex(cards.length);
    };

    const addButton = () => {
        const newCards = [...cards];
        const button: CarouselButton = {
            id: Date.now().toString(),
            text: '',
            type: 'reply'
        };
        newCards[editingCardIndex].buttons = [...(newCards[editingCardIndex].buttons || []), button];
        setCards(newCards);
    };

    const removeButton = (buttonIndex: number) => {
        const newCards = [...cards];
        newCards[editingCardIndex].buttons = newCards[editingCardIndex].buttons?.filter((_, i) => i !== buttonIndex) || [];
        setCards(newCards);
    };

    const updateButton = (buttonIndex: number, field: keyof CarouselButton, value: string) => {
        const newCards = [...cards];
        const buttons = newCards[editingCardIndex].buttons || [];
        buttons[buttonIndex] = { ...buttons[buttonIndex], [field]: value };
        newCards[editingCardIndex].buttons = buttons;
        setCards(newCards);
    };

    const removeCard = (index: number) => {
        if (cards.length > 1) {
            setCards(cards.filter((_, i) => i !== index));
            if (editingCardIndex >= cards.length - 1) {
                setEditingCardIndex(Math.max(0, cards.length - 2));
            }
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newCards = [...cards];
        const draggedCard = newCards[draggedIndex];
        newCards.splice(draggedIndex, 1);
        newCards.splice(index, 0, draggedCard);

        setCards(newCards);
        setDraggedIndex(index);

        // Update editing index if the currently edited card was moved
        if (editingCardIndex === draggedIndex) {
            setEditingCardIndex(index);
        } else if (draggedIndex < editingCardIndex && index >= editingCardIndex) {
            setEditingCardIndex(editingCardIndex - 1);
        } else if (draggedIndex > editingCardIndex && index <= editingCardIndex) {
            setEditingCardIndex(editingCardIndex + 1);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const updateCard = (index: number, field: keyof CarouselCardData, value: string, htmlValue?: string) => {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], [field]: value };
        if (htmlValue !== undefined && (field === 'title' || field === 'description')) {
            const htmlField = field === 'title' ? 'titleHtml' : 'descriptionHtml';
            newCards[index] = { ...newCards[index], [htmlField]: htmlValue };
        }
        setCards(newCards);
    };

    const handleSend = (shouldSchedule = false) => {
        const validCards = cards.filter(card => card.title.trim() || card.description.trim());
        if (validCards.length > 0) {
            onSend(validCards, shouldSchedule);

            if (!shouldSchedule) {
                onClose();
                // Reset
                setCards([{ id: '1', title: '', titleHtml: '', description: '', descriptionHtml: '', image: '', orientation: 'vertical', buttons: [] }]);
                setEditingCardIndex(0);
            }
        }
    };

    const currentCard = cards[editingCardIndex];

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-background">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                    <h2 className="text-lg font-semibold text-foreground">Create Carousel</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Card Selector */}
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <ScrollArea className="w-full">
                        <div className="flex gap-2 pb-2">
                            {cards.map((card, index) => (
                                <div
                                    key={card.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center gap-1 flex-shrink-0 cursor-move transition-all ${
                                        draggedIndex === index ? 'opacity-50 scale-95' : ''
                                    }`}
                                >
                                    <GripVertical className="w-3 h-3 text-muted-foreground" />
                                    <button
                                        onClick={() => setEditingCardIndex(index)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                            editingCardIndex === index
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                                        }`}
                                    >
                                        Card {index + 1}
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addCard}
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </ScrollArea>
                </div>

                {/* Card Editor */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Image URL */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Image URL</Label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={currentCard.image}
                                    onChange={(e) => updateCard(editingCardIndex, 'image', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {currentCard.image && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={currentCard.image}
                                        alt="Preview"
                                        className="w-full h-32 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <CarouselFieldInput
                            label="Title"
                            value={currentCard.titleHtml || currentCard.title}
                            onChange={(text, html) => updateCard(editingCardIndex, 'title', text, html)}
                            placeholder="Enter card title"
                            recipientCount={recipientCount}
                            editingCardIndex={editingCardIndex}
                        />

                        {/* Description */}
                        <CarouselFieldInput
                            label="Description"
                            value={currentCard.descriptionHtml || currentCard.description}
                            onChange={(text, html) => updateCard(editingCardIndex, 'description', text, html)}
                            placeholder="Enter card description"
                            multiline
                            recipientCount={recipientCount}
                            editingCardIndex={editingCardIndex}
                        />

                        {/* Orientation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Card Layout</Label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateCard(editingCardIndex, 'orientation', 'vertical')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                        currentCard.orientation === 'vertical'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                    }`}
                                >
                                    Vertical
                                </button>
                                <button
                                    onClick={() => updateCard(editingCardIndex, 'orientation', 'horizontal')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                        currentCard.orientation === 'horizontal'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                    }`}
                                >
                                    Horizontal
                                </button>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Buttons</Label>
                                <Button
                                    onClick={addButton}
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Button
                                </Button>
                            </div>

                            {(currentCard.buttons || []).map((button, index) => (
                                <div key={button.id} className="p-3 border border-border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-muted-foreground">Button {index + 1}</span>
                                        <Button
                                            onClick={() => removeButton(index)}
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Button text"
                                            value={button.text}
                                            onChange={(e) => updateButton(index, 'text', e.target.value)}
                                            className="text-sm"
                                        />

                                        <Select
                                            value={button.type}
                                            onValueChange={(value) => updateButton(index, 'type', value as SuggestionType)}
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

                                        {['dial', 'viewLocation', 'openUrl', 'createCalenderEvent'].includes(button.type) && (
                                            <Input
                                                placeholder={
                                                    button.type === 'dial' ? 'Phone number' :
                                                        button.type === 'viewLocation' ? 'Location coordinates or address' :
                                                            button.type === 'createCalenderEvent' ? 'Event details' :
                                                                'URL'
                                                }
                                                value={button.value || ''}
                                                onChange={(e) => updateButton(index, 'value', e.target.value)}
                                                className="text-sm"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delete Card Button */}
                        {cards.length > 1 && (
                            <Button
                                variant="destructive"
                                onClick={() => removeCard(editingCardIndex)}
                                className="w-full"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Card
                            </Button>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-card flex gap-2">
                    <Button
                        onClick={() => handleSend(true)}
                        variant="outline"
                        className="flex-1"
                        disabled={!cards.some(card => card.title.trim() || card.description.trim())}
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule
                    </Button>
                    <Button
                        onClick={() => handleSend(false)}
                        className="flex-1"
                        disabled={!cards.some(card => card.title.trim() || card.description.trim())}
                    >
                        Send ({cards.length})
                    </Button>
                </div>
            </div>
        </div>
    );
};
