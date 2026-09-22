import React from 'react';

interface CardProps {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large'; 
}

const Card = ({ children, size = 'small' }: CardProps) => {
    const sizePadding = {
        small: 'p-4 sm:p-5',
        medium: 'p-6 sm:p-8',
        large: 'p-8 sm:p-10',
    };

    return (
        <div className={`bg-surface-container-lowest text-on-surface rounded-xl border border-outline-variant border-l-4 border-l-primary shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 min-w-0 break-words ${sizePadding[size]}`}>
            {children}
        </div>
    );
};

export default Card;