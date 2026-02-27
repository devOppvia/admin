import React from 'react';
import { Search, FolderOpen, AlertCircle } from 'lucide-react';

const EmptyState = ({
    icon: Icon = FolderOpen,
    title = "No results found",
    description = "Try adjusting your search or filters to find what you're looking for.",
    action,
    type = "search" // search, table, error
}) => {
    const icons = {
        search: Search,
        table: FolderOpen,
        error: AlertCircle
    };

    const DisplayIcon = type ? icons[type] : Icon;

    return (
        <div className="flex flex-col items-center justify-center p-12 lg:p-20 text-center animate-fadeIn">
            <div className="w-24 h-24 bg-brand-primary/3 rounded-[32px] flex items-center justify-center text-brand-primary mb-6 ring-8 ring-brand-primary/1">
                <DisplayIcon className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-xl font-black text-brand-primary tracking-tight uppercase mb-2">
                {title}
            </h3>
            <p className="text-brand-primary/40 text-sm font-medium max-w-sm mx-auto leading-relaxed mb-8">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-brand-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-premium hover:shadow-hover transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
