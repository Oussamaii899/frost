import { useThemeColor } from '@/hooks/use-theme-color';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export default function ThemeColorPicker({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    const { color, updateColor } = useThemeColor();

    return (
        <div className={cn('space-y-2', className)} {...props}>
            <Label htmlFor="theme-color">Theme Color</Label>
            <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center p-1 border rounded-lg h-10 w-20 overflow-hidden">
                    <Input
                        id="theme-color"
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(e.target.value)}
                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                    />
                </div>
                <span className="text-sm text-muted-foreground font-mono">{color.toUpperCase()}</span>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
                Customize the primary color of the website.
            </p>
        </div>
    );
}
