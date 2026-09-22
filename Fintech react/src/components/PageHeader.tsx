import React from 'react';

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
    return (
        <header className="flex flex-col w-full bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm mb-space-xl border border-outline-variant">
            {title}
            {subtitle && <div className="mt-space-xs text-on-surface-variant font-body-md">{subtitle}</div>}
        </header>
    );
};

export default PageHeader;