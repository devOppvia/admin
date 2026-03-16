import { useState } from 'react';
import {
    FileText,
    FolderOpen,
    Tag
} from 'lucide-react';
import BlogCategories from '../components/blog/BlogCategories';
import BlogTags from '../components/blog/BlogTags';
import BlogList from '../components/blog/BlogList';

const BlogManagement = () => {
    const [activeTab, setActiveTab] = useState('blogs');

    const tabs = [
        { id: 'blogs', label: 'Blogs', icon: FileText },
        { id: 'categories', label: 'Categories', icon: FolderOpen },
        { id: 'tags', label: 'Tags', icon: Tag },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                    Blog Management
                </h1>
                <p className="text-brand-primary/50 text-sm font-medium mt-1">Create and manage articles for the Oppvia community.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-brand-primary/5 rounded-2xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-lg'
                                    : 'text-brand-primary/60 hover:text-brand-primary hover:bg-brand-primary/5'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                {activeTab === 'blogs' && <BlogList />}
                {activeTab === 'categories' && <BlogCategories />}
                {activeTab === 'tags' && <BlogTags />}
            </div>
        </div>
    );
};

export default BlogManagement;
