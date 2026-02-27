import { useDispatch } from 'react-redux';
import {
    CreditCard,
    Check,
    Plus,
    Trash2,
    Edit3,
    Zap,
    Star,
    ShieldCheck
} from 'lucide-react';

const PricingManagement = () => {
    // Reusing gallery state for demo or adding to store

    const mockPlans = [
        { id: 1, name: 'Basic', price: '$49', features: ['5 Job Postings', 'Standard Support', 'Basic Analytics'], color: 'blue' },
        { id: 2, name: 'Pro', price: '$149', features: ['Unlimited Jobs', 'Priority Support', 'Advanced Analytics', 'Resume Access'], color: 'brand' },
        { id: 3, name: 'Enterprise', price: '$499', features: ['Everything in Pro', 'Dedicated Manager', 'API Access', 'Custom Branding'], color: 'dark' },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Pricing <span className="text-brand-accent">Management</span>
                    </h1>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">Configure subscription packages and pricing tiers for companies.</p>
                </div>
                <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-brand-accent/20 transition-all">
                    <Plus className="w-4 h-4 text-brand-accent" /> Create New Plan
                </button>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mockPlans.map((plan) => (
                    <div key={plan.id} className={`bg-white rounded-[44px] p-8 border border-brand-primary/5 shadow-soft relative overflow-hidden group hover:border-brand-primary/20 transition-all ${plan.name === 'Pro' ? 'ring-2 ring-brand-accent ring-offset-8 ring-offset-transparent' : ''}`}>
                        {plan.name === 'Pro' && (
                            <div className="absolute top-8 -right-12 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest px-12 py-2 rotate-45 shadow-sm">
                                Most Popular
                            </div>
                        )}

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.name === 'Pro' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-primary/[0.03] text-brand-primary/40'}`}>
                            {plan.name === 'Basic' ? <Zap className="w-6 h-6" /> : plan.name === 'Pro' ? <Star className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                        </div>

                        <h3 className="text-2xl font-black text-brand-primary tracking-tight mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-brand-primary tracking-tighter">{plan.price}</span>
                            <span className="text-xs font-bold text-brand-primary/30 uppercase tracking-widest">/ Month</span>
                        </div>

                        <div className="space-y-4 mb-10">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-primary/[0.03] flex items-center justify-center group-hover:bg-brand-accent transition-colors">
                                        <Check className="w-3 h-3 text-brand-primary/40 group-hover:text-brand-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-brand-primary/60">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-3.5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary-light transition-all shadow-premium">
                                Edit Plan
                            </button>
                            <button className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Card */}
            <div className="bg-brand-primary p-12 rounded-[48px] shadow-soft relative overflow-hidden group mt-12">
                <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] bg-brand-accent/5 blur-[120px] rounded-full group-hover:bg-brand-accent/10 transition-all duration-1000" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-4">Subscription analytics is ready to be linked</h2>
                        <p className="text-white/40 text-lg font-medium leading-relaxed">Monitor your MRR, churn rate, and plan distribution directly from the revenue dashboard.</p>
                    </div>
                    <button className="px-12 py-5 bg-brand-accent text-brand-primary rounded-[24px] font-black text-sm uppercase tracking-widest shadow-premium hover:scale-105 transition-transform flex items-center gap-4">
                        <CreditCard className="w-5 h-5" /> View Revenue Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingManagement;
