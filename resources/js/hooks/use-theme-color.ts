import { useCallback, useEffect, useState } from 'react';

// Default Frost Cyan color
const DEFAULT_COLOR = '#06b6d4';

export function initializeThemeColor(serverColor?: string) {
    // If server color is provided, use it. Otherwise fall back to default.
    // We prioritize server color over localStorage to ensure Admin settings take effect globally.
    const color = serverColor || DEFAULT_COLOR;

    // We can still try to read from localStorage if we want user overrides, but the requirement implies Admin sets it.
    // For now, let's stick to the passed color.

    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--primary', color);
        document.documentElement.style.setProperty('--ring', color);
        document.documentElement.style.setProperty('--sidebar-primary', color);
        document.documentElement.style.setProperty('--sidebar-ring', color);
    }
}

export function useThemeColor() {
    const [color, setColor] = useState(DEFAULT_COLOR);

    const updateColor = useCallback((newColor: string) => {
        setColor(newColor);
        localStorage.setItem('theme-color', newColor);
        document.documentElement.style.setProperty('--primary', newColor);
        document.documentElement.style.setProperty('--ring', newColor);
        // Also update sidebar primary if needed, or other related vars
        document.documentElement.style.setProperty('--sidebar-primary', newColor);
        document.documentElement.style.setProperty('--sidebar-ring', newColor);

        // Update overlay colors / gradients helpers if possible?
        // Since we can't easily change `cyan-500` definition dynamically without a complex setup,
        // we will rely on Refactoring the UI to use `bg-primary`, `text-primary`.
    }, []);

    useEffect(() => {
        const savedColor = localStorage.getItem('theme-color');
        if (savedColor) {
            updateColor(savedColor);
        } else {
            // Apply default if no saved color, to ensure overrides happen
            // But we might want to respect the CSS default if it's not set? 
            // The user said "default what it have in css". 
            // If we assume "css" means the hardcoded values in welcome.tsx, then we strictly set it.
            // If we assume "app.css", that's black. 
            // Given the "Frost" nature, I'll default to the Cyan.
            updateColor(DEFAULT_COLOR);
        }
    }, [updateColor]);

    return { color, updateColor };
}
