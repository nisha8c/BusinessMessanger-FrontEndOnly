import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, LayoutGrid, Video, Plus, Clock } from 'lucide-react';

import { RecipientSelector } from './RecipientSelector';
import { VariableItem } from './VariableItem';
import { SectionHeader } from './SectionHeader';
import {
    getVariableType,
    createSingleChip,
    createStackedChip,
    createMoreChip,
    createDropdownHeader,
    createDropdownItem
} from '../lib/chipHelpers';
import { setupDropdownPositioning } from '../lib/dropdownHelpers';
import type {CarouselCardData, Variable} from "../types/types.ts";
import {Card} from "./ui/card.tsx";
import {Button} from "./ui/button.tsx";



const VARIABLES: Variable[] = [
    { id: 'firstName', text: 'First Name', type: 'user', sampleValues: ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Maria', 'Alex', 'Sophie', 'Ryan', 'Emma', 'Jack', 'Olivia', 'Noah', 'Ava', 'Liam', 'Isabella', 'James', 'Mia'] },
    { id: 'lastName', text: 'Last Name', type: 'user', sampleValues: ['Doe', 'Smith', 'Johnson', 'Davis', 'Brown', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee'] },
    { id: 'email', text: 'Email', type: 'user', sampleValues: ['john@email.com', 'sarah@email.com', 'mike@email.com', 'emily@email.com', 'david@email.com', 'lisa@email.com', 'tom@email.com', 'anna@email.com', 'chris@email.com', 'maria@email.com', 'alex@email.com', 'sophie@email.com', 'ryan@email.com', 'emma@email.com', 'jack@email.com', 'olivia@email.com', 'noah@email.com', 'ava@email.com', 'liam@email.com', 'isabella@email.com', 'james@email.com', 'mia@email.com'] },
    { id: 'phone', text: 'Phone Number', type: 'user', sampleValues: ['+1-555-0123', '+1-555-0456', '+1-555-0789', '+1-555-0321', '+1-555-0654', '+1-555-0987', '+1-555-0111', '+1-555-0222', '+1-555-0333', '+1-555-0444', '+1-555-0555', '+1-555-0666', '+1-555-0777', '+1-555-0888', '+1-555-0999', '+1-555-1111', '+1-555-2222', '+1-555-3333', '+1-555-4444', '+1-555-5555', '+1-555-6666', '+1-555-7777'] },
    { id: 'company', text: 'Company', type: 'user', sampleValues: ['TechCorp', 'InnovateCo', 'StartupXYZ', 'DataSys', 'CloudNet', 'WebFlow', 'AppWorks', 'CodeLabs', 'DevHub', 'ByteForce', 'NetCore', 'SoftGen', 'DigiTech', 'InfoSys', 'TechVision', 'CyberTech', 'SmartSoft', 'ProDev', 'CodeCraft', 'TechNova', 'FutureSoft', 'NexGen'] },
    { id: 'orderDate', text: 'Order Date', type: 'user', sampleValues: ['Jan 15, 2024', 'Feb 20, 2024', 'Mar 10, 2024', 'Apr 5, 2024', 'May 12, 2024', 'Jun 8, 2024', 'Jul 22, 2024', 'Aug 17, 2024', 'Sep 3, 2024', 'Oct 11, 2024', 'Nov 7, 2024', 'Dec 25, 2024', 'Jan 30, 2024', 'Feb 14, 2024', 'Mar 25, 2024', 'Apr 18, 2024', 'May 29, 2024', 'Jun 15, 2024', 'Jul 4, 2024', 'Aug 9, 2024', 'Sep 21, 2024', 'Oct 31, 2024'] },
    { id: 'orderTotal', text: 'Order Total', type: 'user', sampleValues: ['$299.99', '$499.99', '$899.99', '$199.99', '$699.99', '$1299.99', '$149.99', '$599.99', '$999.99', '$399.99', '$799.99', '$1499.99', '$249.99', '$549.99', '$1199.99', '$349.99', '$649.99', '$1099.99', '$449.99', '$849.99', '$1599.99', '$179.99'] },
    { id: 'productName', text: 'Product Name', type: 'user', sampleValues: ['Pro Plan', 'Enterprise Plan', 'Basic Plan', 'Starter Pack', 'Premium Suite', 'Business Plus', 'Developer Kit', 'Team Bundle', 'Ultimate Package', 'Standard Plan', 'Advanced Plan', 'Elite Tier', 'Growth Plan', 'Scale Package', 'Unlimited Plan', 'Professional', 'Corporate Plan', 'Mega Bundle', 'Power Suite', 'Deluxe Edition', 'Executive Plan', 'Master Pack'] },
    // Company-specific variables
    { id: 'companyName', text: 'Company Name', type: 'company', sampleValues: ['Acme Corporation'] },
    { id: 'companyAddress', text: 'Company Address', type: 'company', sampleValues: ['123 Business St, City, State 12345'] },
    { id: 'companyPhone', text: 'Company Phone', type: 'company', sampleValues: ['+1-800-555-0100'] },
    { id: 'companyEmail', text: 'Company Email', type: 'company', sampleValues: ['contact@acmecorp.com'] },
    { id: 'companySupportEmail', text: 'Support Email', type: 'company', sampleValues: ['support@acmecorp.com'] },
    // Date/time variables
    { id: 'currentDate', text: 'Current Date', type: 'datetime', sampleValues: ['March 15, 2024'] },
    { id: 'currentTime', text: 'Current Time', type: 'datetime', sampleValues: ['2:30 PM'] },
    { id: 'currentYear', text: 'Current Year', type: 'datetime', sampleValues: ['2024'] },
    { id: 'currentMonth', text: 'Current Month', type: 'datetime', sampleValues: ['March'] },
];

interface VariableInputProps {
    onSend: (text: string, htmlContent: string, withSuggestions?: boolean, shouldSchedule?: boolean) => void;
    onSendCarousel?: (cards: CarouselCardData[], shouldSchedule?: boolean) => void;
    onSendMedia?: (media: any, shouldSchedule?: boolean) => void;
    recipientCount: number;
    onRecipientCountChange: (count: number) => void;
    onOpenCarouselBuilder?: () => void;
    onOpenMediaBuilder?: () => void;
    showRecipientSelector: boolean;
    onCloseRecipientSelector: () => void;
    onScheduleClick?: () => void;
    pendingSuggestionsCount?: number;
    onClearSuggestions?: () => void;
    pendingMessageText?: string;
    selectedRecipientIds?: number[];
    onSelectedRecipientsChange?: (ids: number[]) => void;
}

// Sample recipients data
const INITIAL_RECIPIENTS = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Maria', 'Alex', 'Sophie', 'Ryan', 'Emma', 'Jack', 'Olivia', 'Noah', 'Ava', 'Liam', 'Isabella'][i] + ' ' +
        ['Doe', 'Smith', 'Johnson', 'Davis', 'Brown', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez'][i],
    email: ['john', 'sarah', 'mike', 'emily', 'david', 'lisa', 'tom', 'anna', 'chris', 'maria', 'alex', 'sophie', 'ryan', 'emma', 'jack', 'olivia', 'noah', 'ava', 'liam', 'isabella'][i] + '@email.com',
    mobile: ['+1-555-0123', '+1-555-0456', '+1-555-0789', '+1-555-0321', '+1-555-0654', '+1-555-0987', '+1-555-0111', '+1-555-0222', '+1-555-0333', '+1-555-0444', '+1-555-0555', '+1-555-0666', '+1-555-0777', '+1-555-0888', '+1-555-0999', '+1-555-1111', '+1-555-2222', '+1-555-3333', '+1-555-4444', '+1-555-5555'][i],
}));

export const VariableInput = ({ onSend, onSendCarousel, onSendMedia, recipientCount, onRecipientCountChange, onOpenCarouselBuilder, onOpenMediaBuilder, showRecipientSelector, onCloseRecipientSelector, onScheduleClick, pendingSuggestionsCount = 0, onClearSuggestions, pendingMessageText, selectedRecipientIds = [1], onSelectedRecipientsChange }: VariableInputProps) => {
    const [input, setInput] = useState('');
    const [showVariables, setShowVariables] = useState(false);
    const [filteredVariables, setFilteredVariables] = useState<Variable[]>([]);
    const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS);
    const [messageType, setMessageType] = useState<'text' | 'carousel'>('text');
    const inputRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Restore pending message text when coming back from suggestion builder
    useEffect(() => {
        if (pendingMessageText && inputRef.current) {
            inputRef.current.innerHTML = pendingMessageText;
            setInput(inputRef.current.textContent || '');
        }
    }, [pendingMessageText]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowVariables(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Listen for carousel reply button clicks
    useEffect(() => {
        const handleCarouselReply = (event: CustomEvent<{ text: string }>) => {
            if (inputRef.current) {
                inputRef.current.textContent = event.detail.text;
                setInput(event.detail.text);
                inputRef.current.focus();
            }
        };

        window.addEventListener('carousel-reply', handleCarouselReply as EventListener);
        return () => window.removeEventListener('carousel-reply', handleCarouselReply as EventListener);
    }, []);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || '';
        setInput(text);

        if (text.endsWith('{')) {
            setShowVariables(true);
            setFilteredVariables(VARIABLES);
        } else if (showVariables) {
            const lastBraceIndex = text.lastIndexOf('{');
            if (lastBraceIndex !== -1) {
                const searchText = text.substring(lastBraceIndex + 1).toLowerCase();
                const filtered = VARIABLES.filter(v =>
                    v.text.toLowerCase().includes(searchText)
                );
                setFilteredVariables(filtered);
                if (filtered.length === 0) {
                    setShowVariables(false);
                }
            } else {
                setShowVariables(false);
            }
        }
    };

    const createVariableChip = (variable: Variable, count: number) => {
        const container = document.createElement('span');
        container.className = 'variable-chip-container inline-flex items-center mx-0.5 relative';
        container.contentEditable = 'false';

        const isUserVariable = variable.type === 'user';

        // Use actual recipient data instead of sample values
        let values: string[];
        if (isUserVariable && selectedRecipientIds.length > 0) {
            const selectedRecipientData = recipients.filter(r => selectedRecipientIds.includes(r.id));

            // Map variable to recipient field
            values = selectedRecipientData.map(recipient => {
                if (variable.id === 'firstName') {
                    return recipient.name.split(' ')[0];
                } else if (variable.id === 'lastName') {
                    return recipient.name.split(' ').slice(1).join(' ') || recipient.name;
                } else if (variable.id === 'email') {
                    return recipient.email;
                } else if (variable.id === 'phone') {
                    return recipient.mobile;
                }
                // For other user variables, use sample values
                return variable.sampleValues[selectedRecipientIds.indexOf(recipient.id) % variable.sampleValues.length];
            });
        } else {
            values = isUserVariable ? variable.sampleValues.slice(0, count) : [variable.sampleValues[0]];
        }

        const type = getVariableType(variable.id);

        if (values.length === 1 || !isUserVariable) {
            container.appendChild(createSingleChip(values[0], type));
        } else {
            const stack = document.createElement('span');
            stack.className = 'chip-stack inline-flex relative cursor-pointer';

            // Add stacked chips (show only 3)
            values.slice(0, 3).forEach((value, idx) => {
                stack.appendChild(createStackedChip(value, idx, type));
            });

            // Add "more" indicator if needed
            if (values.length > 3) {
                stack.appendChild(createMoreChip(values.length - 3));
            }

            // Create dropdown list
            const dropdown = createDropdownList(values, type);
            container.appendChild(dropdown);

            // Setup dropdown event handlers
            setupDropdownPositioning(stack, dropdown);

            // Add mouse hover handlers for dropdown visibility
            dropdown.onmouseenter = () => {
                dropdown.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-1');
                dropdown.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            };
            dropdown.onmouseleave = () => {
                dropdown.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                dropdown.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
            };

            container.appendChild(stack);
        }

        return container;
    };

    const createDropdownList = (values: string[], type: 'name' | 'contact' | 'data'): HTMLDivElement => {
        const dropdown = document.createElement('div');
        dropdown.className = 'variable-dropdown fixed bg-[hsl(220,20%,18%)] border-2 border-primary rounded-xl shadow-[0_0_30px_hsl(195,100%,50%,0.4),0_10px_40px_rgba(0,0,0,0.8)] min-w-[200px] max-w-[280px] max-h-80 overflow-y-auto overflow-x-hidden z-[99999] opacity-0 pointer-events-none translate-y-1 transition-all duration-300';

        dropdown.appendChild(createDropdownHeader(values.length));

        values.forEach((value, idx) => {
            dropdown.appendChild(createDropdownItem(value, idx, values.length, type));
        });

        return dropdown;
    };

    const insertVariable = (variable: Variable) => {
        if (!inputRef.current) return;

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const text = inputRef.current.textContent || '';
        const lastBraceIndex = text.lastIndexOf('{');

        if (lastBraceIndex === -1) return;

        const variableChip = createVariableChip(variable, recipientCount);

        let charCount = 0;
        let targetNode: Node | null = null;
        let targetOffset = 0;

        const findBracePosition = (node: Node): boolean => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textContent = node.textContent || '';
                if (charCount + textContent.length > lastBraceIndex) {
                    targetNode = node;
                    targetOffset = lastBraceIndex - charCount;
                    return true;
                }
                charCount += textContent.length;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (let child of Array.from(node.childNodes)) {
                    if (findBracePosition(child)) return true;
                }
            }
            return false;
        };

        findBracePosition(inputRef.current);

        if (targetNode) {
            const range = document.createRange();
            range.setStart(targetNode, targetOffset);
            range.setEnd(targetNode, (targetNode.textContent || '').length);
            range.deleteContents();

            range.insertNode(document.createTextNode(' '));
            range.insertNode(variableChip);

            range.setStartAfter(variableChip.nextSibling || variableChip);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        setInput(inputRef.current.textContent || '');
        setShowVariables(false);
        inputRef.current.focus();
    };

    const handleSend = (withSuggestions = false, shouldSchedule = false) => {
        if (input.trim() && inputRef.current) {
            const html = inputRef.current.innerHTML;
            const text = inputRef.current.textContent || '';
            onSend(text, html, withSuggestions, shouldSchedule);

            if (!withSuggestions) {
                inputRef.current.innerHTML = '';
                setInput('');
                onClearSuggestions?.();
            }
            setShowVariables(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAddRecipient = (newRecipient: { name: string; email: string; mobile: string }) => {
        const newId = Math.max(...recipients.map(r => r.id)) + 1;
        const recipient = { ...newRecipient, id: newId };
        setRecipients(prev => [...prev, recipient]);
        onSelectedRecipientsChange?.([...selectedRecipientIds, newId]);
    };

    return (
        <div ref={containerRef} className="relative">
            {showVariables && filteredVariables.length > 0 && (
                <Card className="absolute bottom-full left-3 right-3 mb-2 z-[100] overflow-hidden animate-slide-up bg-card border-border shadow-xl">
                    <div className="max-h-48 overflow-y-auto">
                        {/* User Variables Section */}
                        {filteredVariables.some(v => v.type === 'user') && (
                            <>
                                <SectionHeader title="User Variables" />
                                {filteredVariables.filter(v => v.type === 'user').map((variable) => (
                                    <VariableItem
                                        key={variable.id}
                                        text={variable.text}
                                        sampleValue={variable.sampleValues[0]}
                                        type={variable.type}
                                        onClick={() => insertVariable(variable)}
                                    />
                                ))}
                            </>
                        )}

                        {/* Company Variables Section */}
                        {filteredVariables.some(v => v.type === 'company') && (
                            <>
                                <div className="border-t border-border/30">
                                    <SectionHeader title="Company Variables" icon="🏢" />
                                </div>
                                {filteredVariables.filter(v => v.type === 'company').map((variable) => (
                                    <VariableItem
                                        key={variable.id}
                                        text={variable.text}
                                        sampleValue={variable.sampleValues[0]}
                                        type={variable.type}
                                        onClick={() => insertVariable(variable)}
                                    />
                                ))}
                            </>
                        )}

                        {/* System Variables Section */}
                        {filteredVariables.some(v => v.type === 'datetime') && (
                            <>
                                <div className="border-t border-border/30">
                                    <SectionHeader title="System Variables" icon="📅" />
                                </div>
                                {filteredVariables.filter(v => v.type === 'datetime').map((variable) => (
                                    <VariableItem
                                        key={variable.id}
                                        text={variable.text}
                                        sampleValue={variable.sampleValues[0]}
                                        type={variable.type}
                                        onClick={() => insertVariable(variable)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </Card>
            )}

            <RecipientSelector
                isOpen={showRecipientSelector}
                onClose={() => {
                    onCloseRecipientSelector();
                    onRecipientCountChange(selectedRecipientIds.length);
                }}
                recipients={recipients}
                selectedIds={selectedRecipientIds}
                onSelectionChange={(ids) => onSelectedRecipientsChange?.(ids)}
                onAddRecipient={handleAddRecipient}
            />

            <div className="flex items-center gap-2 px-3 py-2 bg-card border-t border-border/50">
                {/* Message type toggle */}
                <button
                    onClick={() => setMessageType(messageType === 'text' ? 'carousel' : 'text')}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors active:scale-95 ${
                        messageType === 'carousel'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                    title={messageType === 'text' ? 'Switch to Carousel' : 'Switch to Text'}
                >
                    {messageType === 'text' ? (
                        <MessageSquare className="w-4 h-4" />
                    ) : (
                        <LayoutGrid className="w-4 h-4" />
                    )}
                </button>

                {messageType === 'text' ? (
                    <>
                        <div className="flex-1 bg-secondary rounded-2xl overflow-hidden min-h-[44px] flex items-center">
                            <div
                                ref={inputRef}
                                contentEditable
                                onInput={handleInput}
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-4 py-3 outline-none text-foreground text-sm max-h-32 overflow-y-auto"
                                style={{
                                    minHeight: '44px',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                }}
                                data-placeholder="Type { to insert variables..."
                            />
                        </div>

                        <div className="relative">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleSend(true)}
                                disabled={!input.trim()}
                                className="rounded-full"
                                title={pendingSuggestionsCount > 0 ? "Edit suggestions" : "Add suggestions"}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            {pendingSuggestionsCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClearSuggestions?.();
                                    }}
                                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center hover:bg-primary/80 transition-colors"
                                    title="Clear suggestions"
                                >
                                    {pendingSuggestionsCount}
                                </button>
                            )}
                        </div>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleSend(false, true)}
                            disabled={!input.trim()}
                            className="rounded-full"
                            title="Schedule message"
                        >
                            <Clock className="w-4 h-4" />
                        </Button>

                        <Button
                            size="icon"
                            onClick={() => handleSend(false, false)}
                            disabled={!input.trim()}
                            className="rounded-full bg-primary hover:bg-primary/90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <div className="flex-1 flex items-center gap-2 justify-center py-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenCarouselBuilder?.()}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Carousel
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenMediaBuilder?.()}
                        >
                            <Video className="w-4 h-4 mr-2" />
                            Media
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
