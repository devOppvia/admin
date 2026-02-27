import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-brand-primary/[0.02]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Header */}
                <Header />

                {/* Global Mesh Backgrounds (Subtle) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-primary/[0.03] blur-[120px] rounded-full" />
                    <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-accent/[0.02] blur-[120px] rounded-full" />
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto relative p-4 lg:p-8 no-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
