// Helper functions for dropdown positioning and event handling

export const calculateDropdownPosition = (
    stackRect: DOMRect,
    dropdownHeight: number,
    dropdownWidth: number
): { top: number; left: number } => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceAbove = stackRect.top;
    const spaceBelow = viewportHeight - stackRect.bottom;

    let top: number;
    let left: number = stackRect.left;

    // Position below if not enough space above or more space below
    if (spaceAbove < dropdownHeight + 8 || spaceBelow > spaceAbove) {
        top = stackRect.bottom + scrollTop + 8;
    } else {
        top = stackRect.top + scrollTop - dropdownHeight - 8;
    }

    // Keep dropdown within horizontal viewport bounds
    if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth - 8;
    }
    if (left < 8) {
        left = 8;
    }

    return { top, left };
};

export const showDropdown = (dropdown: HTMLElement) => {
    dropdown.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-1');
    dropdown.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
};

export const hideDropdown = (dropdown: HTMLElement) => {
    dropdown.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    dropdown.classList.add('opacity-0', 'pointer-events-none', 'translate-y-1');
};

export const setupDropdownPositioning = (
    stack: HTMLElement,
    dropdown: HTMLElement
): (() => void) => {
    const updateDropdownPosition = () => {
        const rect = stack.getBoundingClientRect();
        const { top, left } = calculateDropdownPosition(
            rect,
            dropdown.offsetHeight,
            dropdown.offsetWidth
        );

        dropdown.style.left = `${left}px`;
        dropdown.style.top = `${top}px`;
    };

    const handleShowDropdown = () => {
        document.body.appendChild(dropdown);
        updateDropdownPosition();

        const scrollContainer = stack.closest('.overflow-y-auto') || window;
        const handleScroll = () => updateDropdownPosition();

        scrollContainer.addEventListener('scroll', handleScroll);
        dropdown.dataset.scrollCleanup = 'true';

        setTimeout(() => showDropdown(dropdown), 10);
    };

    const handleHideDropdown = () => {
        hideDropdown(dropdown);

        const scrollContainer = stack.closest('.overflow-y-auto') || window;
        if (dropdown.dataset.scrollCleanup) {
            scrollContainer.removeEventListener('scroll', updateDropdownPosition);
            delete dropdown.dataset.scrollCleanup;
        }

        setTimeout(() => {
            if (dropdown.parentNode === document.body) {
                document.body.removeChild(dropdown);
            }
        }, 300);
    };

    const handleStackEnter = () => handleShowDropdown();
    const handleStackLeave = () => {
        setTimeout(() => {
            if (!dropdown.matches(':hover')) {
                handleHideDropdown();
            }
        }, 100);
    };
    const handleDropdownEnter = () => showDropdown(dropdown);
    const handleDropdownLeave = () => handleHideDropdown();

    stack.addEventListener('mouseenter', handleStackEnter);
    stack.addEventListener('mouseleave', handleStackLeave);
    dropdown.addEventListener('mouseenter', handleDropdownEnter);
    dropdown.addEventListener('mouseleave', handleDropdownLeave);

    // Return cleanup function
    return () => {
        stack.removeEventListener('mouseenter', handleStackEnter);
        stack.removeEventListener('mouseleave', handleStackLeave);
        dropdown.removeEventListener('mouseenter', handleDropdownEnter);
        dropdown.removeEventListener('mouseleave', handleDropdownLeave);
        if (dropdown.parentNode === document.body) {
            document.body.removeChild(dropdown);
        }
    };
};
