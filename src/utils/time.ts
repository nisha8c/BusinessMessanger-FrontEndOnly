/**
 * Formats the current time in 12-hour format with AM/PM
 */
export const getCurrentTimeFormatted = (): string => {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Formats a given date in 12-hour format with AM/PM
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
