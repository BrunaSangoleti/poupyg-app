
import React from 'react';

interface TitleProps {
    children: React.ReactNode;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; 
    style?: React.CSSProperties; 
}

const Title = ({ children, level = 'h1', style }: TitleProps) => {
    const Tag = level;
    
    const sizeClasses = {
        h1: 'font-headline-lg text-headline-lg font-bold',
        h2: 'font-headline-md text-headline-md font-semibold',
        h3: 'font-headline-sm text-headline-sm font-semibold',
        h4: 'font-body-lg text-body-lg font-semibold',
        h5: 'font-body-md text-body-md font-medium',
        h6: 'font-body-sm text-body-sm font-medium',
    };

    return (
        <Tag className={`text-on-surface mb-2 tracking-tight ${sizeClasses[level]}`} style={style}>
            {children}
        </Tag>
    );
};

export default Title;