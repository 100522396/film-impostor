import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
    const baseStyles = "w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white shadow-gray-500/30",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30",
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        />
    );
}
