import { MessageSquare, Calendar, Send as SendIcon, Layers, Megaphone } from 'lucide-react';
import * as React from "react";
import {cn} from "../lib/utils.ts";


type ViewMode = 'chat' | 'scheduled' | 'sent' | 'threads' | 'campaigns';

interface ViewModeNavProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

interface NavItem {
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    mobileIcon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        id: 'chat',
        label: 'Chat',
        icon: <><MessageSquare className="w-4 h-4 mr-2" />Chat</>,
        mobileIcon: <MessageSquare className="w-4 h-4" />
    },
    {
        id: 'scheduled',
        label: 'Scheduled',
        icon: <><Calendar className="w-4 h-4 mr-2" />Scheduled</>,
        mobileIcon: <Calendar className="w-4 h-4" />
    },
    {
        id: 'sent',
        label: 'Sent',
        icon: <><SendIcon className="w-4 h-4 mr-2" />Sent</>,
        mobileIcon: <SendIcon className="w-4 h-4" />
    },
    {
        id: 'threads',
        label: 'Threads',
        icon: <><Layers className="w-4 h-4 mr-2" />Threads</>,
        mobileIcon: <Layers className="w-4 h-4" />
    },
    {
        id: 'campaigns',
        label: 'Campaigns',
        icon: <><Megaphone className="w-4 h-4 mr-2" />Campaigns</>,
        mobileIcon: <Megaphone className="w-4 h-4" />
    }
];

export const ViewModeNav = ({ currentMode, onModeChange }: ViewModeNavProps) => {
    return (
        <div className="flex border-b border-border bg-card">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => onModeChange(item.id)}
                    className={cn(
                        "flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2",
                        currentMode === item.id
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                >
          <span className="hidden sm:flex items-center justify-center">
            {item.icon}
          </span>
                    <span className="flex sm:hidden items-center justify-center">
            {item.mobileIcon}
          </span>
                </button>
            ))}
        </div>
    );
};
