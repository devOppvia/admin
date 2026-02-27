import React from 'react';

const StatusTabs = ({ tabs, activeTab, onTabChange, count = {} }) => {
    return (
        <div className="flex bg-brand-primary/3 p-1.5 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`
                            px-6 py-2.5 rounded-xl text-[11px] font-black transition-all tracking-wider uppercase flex items-center gap-2
                            ${activeTab === tab
                                ? 'bg-white text-brand-primary shadow-soft'
                                : 'text-brand-primary/40 hover:text-brand-primary'
                            }
                        `}
                    >
                        {tab}
                        {count[tab] !== undefined && (
                            <span className={`
                                px-2 py-0.5 rounded-lg text-[10px]
                                ${activeTab === tab ? 'bg-brand-primary/5 text-brand-primary' : 'bg-brand-primary/5 text-brand-primary/30'}
                            `}>
                                {count[tab]}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatusTabs;
