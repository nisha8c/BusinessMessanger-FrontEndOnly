import { useRef, useEffect, useState } from 'react';

import { VariableItem } from './VariableItem';


import type {Variable} from "../types/types.ts";
import {
    createDropdownHeader, createDropdownItem,
    createMoreChip,
    createSingleChip,
    createStackedChip,
    getVariableType
} from "../lib/chipHelpers.ts";
import {setupDropdownPositioning} from "../lib/dropdownHelpers.ts";
import {Label} from "./ui/label.tsx";



const VARIABLES: Variable[] = [
    { id: 'firstName', text: 'First Name', sampleValues: ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Maria', 'Alex', 'Sophie', 'Ryan', 'Emma', 'Jack', 'Olivia', 'Noah', 'Ava', 'Liam', 'Isabella'] },
    { id: 'lastName', text: 'Last Name', sampleValues: ['Doe', 'Smith', 'Johnson', 'Davis', 'Brown', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez'] },
    { id: 'email', text: 'Email', sampleValues: ['john@email.com', 'sarah@email.com', 'mike@email.com', 'emily@email.com', 'david@email.com', 'lisa@email.com', 'tom@email.com', 'anna@email.com', 'chris@email.com', 'maria@email.com', 'alex@email.com', 'sophie@email.com', 'ryan@email.com', 'emma@email.com', 'jack@email.com', 'olivia@email.com', 'noah@email.com', 'ava@email.com', 'liam@email.com', 'isabella@email.com'] },
    { id: 'phone', text: 'Phone Number', sampleValues: ['+1-555-0123', '+1-555-0456', '+1-555-0789', '+1-555-0321', '+1-555-0654', '+1-555-0987', '+1-555-0111', '+1-555-0222', '+1-555-0333', '+1-555-0444', '+1-555-0555', '+1-555-0666', '+1-555-0777', '+1-555-0888', '+1-555-0999', '+1-555-1111', '+1-555-2222', '+1-555-3333', '+1-555-4444', '+1-555-5555'] },
    { id: 'company', text: 'Company', sampleValues: ['TechCorp', 'InnovateCo', 'StartupXYZ', 'DataSys', 'CloudNet', 'WebFlow', 'AppWorks', 'CodeLabs', 'DevHub', 'ByteForce', 'NetCore', 'SoftGen', 'DigiTech', 'InfoSys', 'TechVision', 'CyberTech', 'SmartSoft', 'ProDev', 'CodeCraft', 'TechNova'] },
    { id: 'orderDate', text: 'Order Date', sampleValues: ['Jan 15, 2024', 'Feb 20, 2024', 'Mar 10, 2024', 'Apr 5, 2024', 'May 12, 2024', 'Jun 8, 2024', 'Jul 22, 2024', 'Aug 17, 2024', 'Sep 3, 2024', 'Oct 11, 2024', 'Nov 7, 2024', 'Dec 25, 2024', 'Jan 30, 2024', 'Feb 14, 2024', 'Mar 25, 2024', 'Apr 18, 2024', 'May 29, 2024', 'Jun 15, 2024', 'Jul 4, 2024', 'Aug 9, 2024'] },
    { id: 'orderTotal', text: 'Order Total', sampleValues: ['$299.99', '$499.99', '$899.99', '$199.99', '$699.99', '$1299.99', '$149.99', '$599.99', '$999.99', '$399.99', '$799.99', '$1499.99', '$249.99', '$549.99', '$1199.99', '$349.99', '$649.99', '$1099.99', '$449.99', '$849.99'] },
    { id: 'productName', text: 'Product Name', sampleValues: ['Pro Plan', 'Enterprise Plan', 'Basic Plan', 'Starter Pack', 'Premium Suite', 'Business Plus', 'Developer Kit', 'Team Bundle', 'Ultimate Package', 'Standard Plan', 'Advanced Plan', 'Elite Tier', 'Growth Plan', 'Scale Package', 'Unlimited Plan', 'Professional', 'Corporate Plan', 'Mega Bundle', 'Power Suite', 'Deluxe Edition'] },
    { id: 'companyName', text: 'Company Name', sampleValues: ['Acme Corporation'] },
    { id: 'companyAddress', text: 'Company Address', sampleValues: ['123 Business St'] },
    { id: 'currentDate', text: 'Current Date', sampleValues: ['March 15, 2024'] },
    { id: 'currentTime', text: 'Current Time', sampleValues: ['2:30 PM'] },
];

interface CarouselFieldInputProps {
    label: string;
    value: string;
    onChange: (text: string, html: string) => void;
    placeholder: string;
    multiline?: boolean;
    recipientCount?: number;
    editingCardIndex?: number;
}

export const CarouselFieldInput = ({
                                       label,
                                       value,
                                       onChange,
                                       placeholder,
                                       multiline = false,
                                       recipientCount = 1,
                                       editingCardIndex = 0
                                   }: CarouselFieldInputProps) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [showVariables, setShowVariables] = useState(false);
    const variablesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                variablesRef.current &&
                !variablesRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowVariables(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPlainText = (html: string): string => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };

    /*
    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount || !inputRef.current) return null;

        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(inputRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        return preSelectionRange.toString().length;
    };

    const restoreCursorPosition = (position: number) => {
        if (!inputRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;

        const createRange = (node: Node, chars: { count: number }): Range | null => {
            if (chars.count === 0) {
                const range = document.createRange();
                range.setStart(node, 0);
                range.setEnd(node, 0);
                return range;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                const textLength = node.textContent?.length || 0;
                if (chars.count <= textLength) {
                    const range = document.createRange();
                    range.setStart(node, chars.count);
                    range.setEnd(node, chars.count);
                    return range;
                } else {
                    chars.count -= textLength;
                }
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    const range = createRange(node.childNodes[i], chars);
                    if (range) return range;
                }
            }
            return null;
        };

        const range = createRange(inputRef.current, { count: position });
        if (range) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }; */

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || '';
        const html = e.currentTarget.innerHTML || '';

        if (text.endsWith('{')) {
            setShowVariables(true);
        } else if (!text.includes('{')) {
            setShowVariables(false);
        }

        onChange(text, html);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
        }
    };

    const insertVariable = (variable: Variable) => {
        if (!inputRef.current) return;

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Delete the '{' character
        const textBeforeCursor = range.startContainer.textContent || '';
        const openBraceIndex = textBeforeCursor.lastIndexOf('{');

        if (openBraceIndex !== -1) {
            const deleteRange = document.createRange();
            deleteRange.setStart(range.startContainer, openBraceIndex);
            deleteRange.setEnd(range.startContainer, openBraceIndex + 1);
            deleteRange.deleteContents();

            // Reset range to after deletion
            range.setStart(range.startContainer, openBraceIndex);
            range.collapse(true);
        }

        // Create chip container
        const container = document.createElement('span');
        container.className = 'variable-chip-container inline-flex items-center mx-0.5 relative';
        container.contentEditable = 'false';

        const type = getVariableType(variable.id);

        // Single recipient: show single chip only
        if (!recipientCount || recipientCount <= 1) {
            const singleValue = variable.sampleValues[0];
            container.appendChild(createSingleChip(singleValue, type));
        }
        // Multiple recipients: show stacked chips
        else if (recipientCount > 1) {
            const values = variable.sampleValues.slice(0, recipientCount);
            const stack = document.createElement('span');
            stack.className = 'chip-stack inline-flex relative cursor-pointer';

            // Add stacked chips (show only 3)
            values.slice(0, 3).forEach((val, idx) => {
                stack.appendChild(createStackedChip(val, idx, type));
            });

            // Add "more" indicator if needed
            if (values.length > 3) {
                stack.appendChild(createMoreChip(values.length - 3));
            }

            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'variable-dropdown absolute left-1/2 -translate-x-1/2 mt-2 bg-card border-2 border-primary/40 rounded-xl shadow-2xl z-[100] opacity-0 pointer-events-none translate-y-1 transition-all duration-300 backdrop-blur-sm min-w-[180px] max-w-[280px] overflow-hidden';

            dropdown.appendChild(createDropdownHeader(values.length));

            const list = document.createElement('div');
            list.className = 'max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent';

            values.forEach((val, idx) => {
                list.appendChild(createDropdownItem(val, idx, values.length, type));
            });

            dropdown.appendChild(list);
            container.appendChild(dropdown);

            // Setup dropdown positioning
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

        // Insert chip container
        range.insertNode(container);

        // Add space after chip
        const spaceNode = document.createTextNode('\u00A0');
        range.setStartAfter(container);
        range.insertNode(spaceNode);
        range.setStartAfter(spaceNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

        setShowVariables(false);

        const text = getPlainText(inputRef.current.innerHTML);
        const html = inputRef.current.innerHTML;
        onChange(text, html);
    };

    useEffect(() => {
        // Only update innerHTML when switching cards, not during normal typing
        if (inputRef.current && inputRef.current !== document.activeElement) {
            inputRef.current.innerHTML = value;
        }
    }, [editingCardIndex]);

    return (
        <div className="space-y-2 relative">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="relative">
                <div
                    ref={inputRef}
                    contentEditable
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        multiline ? 'min-h-[80px]' : ''
                    }`}
                    style={{
                        overflow: multiline ? 'auto' : 'hidden',
                        whiteSpace: multiline ? 'pre-wrap' : 'nowrap'
                    }}
                    data-placeholder={placeholder}
                    suppressContentEditableWarning
                />

                {showVariables && (
                    <div
                        ref={variablesRef}
                        className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
                    >
                        <div className="p-2 space-y-1">
                            {VARIABLES.map((variable) => {
                                const varType = getVariableType(variable.id);
                                const displayType = varType === 'name' || varType === 'contact' ? 'user' : varType === 'data' ? 'datetime' : 'company';
                                return (
                                    <VariableItem
                                        key={variable.id}
                                        text={variable.text}
                                        type={displayType as 'user' | 'company' | 'datetime'}
                                        sampleValue={variable.sampleValues[0]}
                                        onClick={() => insertVariable(variable)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }
      `}</style>
        </div>
    );
};