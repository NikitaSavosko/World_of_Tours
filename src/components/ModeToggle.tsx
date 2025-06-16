'use client';
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}


export function ModeToggle({ className }: Props) {

    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant={'outline'}
            size={'icon'}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn('cursor-pointer', className)}
        >
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span className='sr-only'>Сменить тему</span>
        </Button>
    )
}