
import React from 'react';

interface TextProps {
    children: React.ReactNode;
    size?: 'body' | 'small' | 'highlight';
    style?: React.CSSProperties; 
}

const Text = ({ children, size = 'body', style }: TextProps) => {
    const sizeClasses = {
        body: 'font-body-md text-on-surface',
        small: 'font-body-sm text-on-surface-variant',
        highlight: 'font-body-md font-semibold text-on-surface',
    };

    return (
        <p className={`w-full flex-shrink-0 mt-2 leading-relaxed ${sizeClasses[size]}`} style={style}>
            {children}
        </p>
    );
};

export default Text;