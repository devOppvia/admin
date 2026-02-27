import { useSelector } from 'react-redux';
import {
    HelpCircle,
    Search,
    Plus,
    ChevronDown,
    Edit2,
    Trash2,
    Bookmark
} from 'lucide-react';
import { useState } from 'react';

const FaqManagement = () => {
    const { items, categories } = useSelector((state) => state.faq);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [openId, setOpenId] = useState(null);

    const filteredFaqs = items.filter(faq =>
        activeCategory === 'ALL' || faq.category === activeCategory
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        FAQ <span className="text-brand-accent">Management</span>
                    </h1>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">Manage the knowledge base for companies and interns.</p>
                </div>
                <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium transition-all">
                    <Plus className="w-4 h-4 text-brand-accent" /> Add New FAQ
                </button>
            </div>

            {/* Categories Bar */}
            <div className="flex bg-white p-2 rounded-[32px] border border-brand-primary/5 shadow-soft overflow-x-auto no-scrollbar gap-2">
                <button
                    onClick={() => setActiveCategory('ALL')}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'ALL' ? 'bg-brand-primary text-white' : 'text-brand-primary/40 hover:bg-brand-primary/5'}`}
                >
                    ALL TOPICS
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-brand-primary text-white' : 'text-brand-primary/40 hover:bg-brand-primary/5'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-[32px] border border-brand-primary/5 shadow-soft overflow-hidden transition-all group hover:border-brand-primary/20">
                        <button
                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-8 text-left group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 bg-brand-primary/[0.03] rounded-xl flex items-center justify-center text-brand-primary/40 group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest mb-1 block">{faq.category}</span>
                                    <h3 className="text-base font-black text-brand-primary tracking-tight leading-tight">{faq.question}</h3>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg bg-brand-primary/[0.03] transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4 text-brand-primary/40" />
                            </div>
                        </button>

                        {openId === faq.id && (
                            <div className="px-8 pb-8 animate-fadeIn">
                                <div className="p-8 bg-brand-primary/[0.03] rounded-[24px] relative">
                                    <p className="text-sm font-medium text-brand-primary/60 leading-relaxed max-w-3xl">
                                        {faq.answer}
                                    </p>
                                    <div className="mt-8 flex items-center gap-4">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-premium">
                                            <Edit2 className="w-3 h-3 text-brand-accent" /> Edit Content
                                        </button>
                                        <button className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FaqManagement;
