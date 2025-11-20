import { useState } from 'react';
import { X, Search, Plus, Mail, User, Phone } from 'lucide-react';

import type {Recipient} from "../types/types.ts";
import {Button} from "./ui/button.tsx";
import {Input} from "./ui/input.tsx";
import {RecipientItem} from "./RecipientItem.tsx";



interface RecipientSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    recipients: Recipient[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onAddRecipient?: (recipient: Omit<Recipient, 'id'>) => void;
}

export const RecipientSelector = ({
                                      isOpen,
                                      onClose,
                                      recipients,
                                      selectedIds,
                                      onSelectionChange,
                                      onAddRecipient,
                                  }: RecipientSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newMobile, setNewMobile] = useState('');

    const filteredRecipients = recipients.filter(
        (r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleRecipient = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((i) => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const selectAll = () => {
        onSelectionChange(filteredRecipients.map((r) => r.id));
    };

    const deselectAll = () => {
        onSelectionChange([]);
    };

    const handleAddContact = () => {
        if (newName.trim() && newEmail.trim() && newMobile.trim() && onAddRecipient) {
            onAddRecipient({ name: newName.trim(), email: newEmail.trim(), mobile: newMobile.trim() });
            setNewName('');
            setNewEmail('');
            setNewMobile('');
            setShowAddForm(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-[100] bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-3xl shadow-2xl animate-slide-in-bottom h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background rounded-t-3xl flex-shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">
                        Select Recipients
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Add Contact Form */}
                {showAddForm && (
                    <div className="px-4 py-3 border-b border-border bg-muted/30 flex-shrink-0 animate-fade-in">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="pl-10 rounded-full bg-background border-border"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Mobile Number"
                                    type="tel"
                                    value={newMobile}
                                    onChange={(e) => setNewMobile(e.target.value)}
                                    className="pl-10 rounded-full bg-background border-border"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="pl-10 rounded-full bg-background border-border"
                                />
                            </div>
                            <Button
                                onClick={handleAddContact}
                                disabled={!newName.trim() || !newEmail.trim() || !newMobile.trim()}
                                className="w-full rounded-full"
                                size="sm"
                            >
                                Add Contact
                            </Button>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="px-4 py-3 border-b border-border bg-background flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-full bg-secondary border-none"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="rounded-full flex-shrink-0"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Selection actions */}
                <div className="px-4 py-2 flex items-center justify-between bg-muted/50 border-b border-border flex-shrink-0">
          <span className="text-sm text-muted-foreground">
            {selectedIds.length} selected
          </span>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectAll}
                            className="h-7 text-xs"
                        >
                            Select All
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={deselectAll}
                            className="h-7 text-xs"
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Recipients List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-2">
                        {filteredRecipients.map((recipient) => (
                            <RecipientItem
                                key={recipient.id}
                                name={recipient.name}
                                email={recipient.email}
                                mobile={recipient.mobile}
                                isSelected={selectedIds.includes(recipient.id)}
                                onClick={() => toggleRecipient(recipient.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Done Button */}
                <div className="px-4 py-3 border-t border-border bg-background flex-shrink-0">
                    <Button
                        onClick={onClose}
                        disabled={selectedIds.length === 0}
                        className="w-full rounded-full h-12 font-semibold"
                    >
                        Done ({selectedIds.length})
                    </Button>
                </div>
            </div>
        </div>
    );
};
