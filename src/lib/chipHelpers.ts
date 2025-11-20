// Helper functions for creating variable chips

export type VariableType = 'name' | 'contact' | 'data';

export const getVariableType = (variableId: string): VariableType => {
    if (variableId.toLowerCase().includes('name')) return 'name';
    if (variableId.toLowerCase().includes('email') || variableId.toLowerCase().includes('phone')) return 'contact';
    return 'data';
};

export const createAvatar = (value: string): HTMLSpanElement => {
    const avatar = document.createElement('span');
    avatar.className = 'inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[8px] border border-white/20 flex-shrink-0';
    avatar.textContent = value.substring(0, 2).toUpperCase();
    return avatar;
};

export const createSingleChip = (value: string, type: VariableType): HTMLSpanElement => {
    const chip = document.createElement('span');
    chip.className = 'inline-flex items-center gap-1 bg-gradient-tech text-[hsl(220,25%,8%)] px-3 py-1 rounded-full text-xs font-semibold shadow-glow';

    if (type === 'name') {
        chip.appendChild(createAvatar(value));
    }

    chip.appendChild(document.createTextNode(value));
    return chip;
};

export const createStackedChip = (value: string, idx: number, type: VariableType): HTMLSpanElement => {
    const chip = document.createElement('span');
    chip.className = 'inline-flex items-center gap-1 stacked-chip bg-gradient-tech text-[hsl(220,25%,8%)] px-3 py-1 rounded-full text-xs font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-2 border-[hsl(220,25%,8%)] relative transition-all duration-300 whitespace-nowrap overflow-hidden';
    chip.style.zIndex = `${10 - idx}`;
    chip.style.marginLeft = idx === 0 ? '0' : '-30px';
    chip.style.maxWidth = idx === 0 ? '100%' : idx === 1 ? '45px' : '30px';

    if (type === 'name') {
        chip.appendChild(createAvatar(value));
    }

    chip.appendChild(document.createTextNode(value));
    return chip;
};

export const createMoreChip = (remainingCount: number): HTMLSpanElement => {
    const more = document.createElement('span');
    more.className = 'inline-flex items-center justify-center bg-gradient-tech-reverse px-2 py-1 rounded-full text-xs font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-2 border-[hsl(220,25%,8%)] z-0 transition-all duration-300 text-[hsl(220,25%,8%)]';
    more.style.marginLeft = '-30px';
    more.textContent = `+${remainingCount}`;
    return more;
};

export const createDropdownHeader = (count: number): HTMLDivElement => {
    const header = document.createElement('div');
    header.className = 'px-3 py-2.5 text-[0.7rem] font-bold text-primary border-b-2 border-primary/30 uppercase tracking-wider sticky top-0 bg-[hsl(220,20%,18%)] z-10';
    header.textContent = `${count} Recipient${count !== 1 ? 's' : ''}`;
    return header;
};

export const createDropdownItem = (value: string, idx: number, total: number, type: VariableType): HTMLDivElement => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 cursor-default hover:bg-primary/25 hover:translate-x-1';

    if (idx !== total - 1) {
        item.classList.add('border-b', 'border-primary/15');
    }

    if (type === 'name') {
        const avatar = document.createElement('span');
        avatar.className = 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-tech text-[hsl(220,25%,8%)] text-[10px] font-bold flex-shrink-0';
        avatar.textContent = value.substring(0, 2).toUpperCase();
        item.appendChild(avatar);
    }

    const text = document.createElement('span');
    text.textContent = value;
    text.className = 'flex-1';
    item.appendChild(text);

    return item;
};
