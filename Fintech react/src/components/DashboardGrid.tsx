import React from 'react';

const DashboardGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg w-full mb-space-xl">
            {children}
        </div>
    );
};

export default DashboardGrid;