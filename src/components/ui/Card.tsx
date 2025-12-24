import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={clsx("bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl", className)} {...props}>
            {children}
        </div>
    );
}
