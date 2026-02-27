import { Check } from 'lucide-react';

const Checkbox = ({ checked, onChange, label, className = "" }) => {
    return (
        <label className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                />
                <div className={`
                    w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
                    ${checked
                        ? 'bg-brand-primary border-brand-primary shadow-premium'
                        : 'bg-white border-brand-primary/10 group-hover:border-brand-primary/30 group-hover:shadow-soft'
                    }
                `}>
                    <Check
                        className={`w-3.5 h-3.5 text-white transition-all duration-300 transform
                            ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                        `}
                        strokeWidth={4}
                    />
                </div>
            </div>
            {label && (
                <span className={`text-xs font-bold transition-colors ${checked ? 'text-brand-primary' : 'text-brand-primary/40 group-hover:text-brand-primary/60'}`}>
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
