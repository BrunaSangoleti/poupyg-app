import React from 'react';

const DashboardContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen w-full p-space-md sm:p-space-xl lg:p-space-2xl page-background">
            {children}
        </div>
    );
};

export default DashboardContainer;