import { useSelector } from 'react-redux';
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Eye,
    ExternalLink,
    MapPin,
    Calendar
} from 'lucide-react';

const GalleryManagement = () => {
    const { sliders, exhibitions } = useSelector((state) => state.gallery);

    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                    Gallery & <span className="text-brand-accent">Media</span>
                </h1>
                <p className="text-brand-primary/50 text-sm font-medium mt-1">Manage landing page banners and event galleries.</p>
            </div>

            {/* Sliders Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-brand-primary tracking-tight uppercase flex items-center gap-3">
                        <span className="w-8 h-1 bg-brand-accent rounded-full" />
                        Active Sliders
                    </h2>
                    <button className="flex items-center gap-2 bg-brand-primary text-white p-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        <Plus className="w-4 h-4 text-brand-accent" /> Add Banner
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sliders.map((slider) => (
                        <div key={slider.id} className="relative group rounded-[40px] overflow-hidden border border-brand-primary/5 shadow-soft bg-white p-3">
                            <div className="aspect-[21/9] bg-brand-primary/[0.05] rounded-[32px] overflow-hidden relative">
                                <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent" />
                                <div className="absolute bottom-6 left-8 right-8">
                                    <p className="text-white font-black text-lg tracking-tight leading-tight">{slider.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 px-6 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${slider.active ? 'bg-green-500 pulse' : 'bg-red-500'}`} />
                                    <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">
                                        {slider.active ? 'Visible on Web' : 'Hidden'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-brand-primary/30 hover:text-brand-primary transition-colors"><Eye className="w-4 h-4" /></button>
                                    <button className="p-2 text-brand-primary/30 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Exhibitions Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-brand-primary tracking-tight uppercase flex items-center gap-3">
                        <span className="w-8 h-1 bg-brand-accent rounded-full" />
                        Events Gallery
                    </h2>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exhibitions.map((expo) => (
                            <div key={expo.id} className="p-6 bg-brand-primary/[0.02] border border-brand-primary/5 rounded-3xl hover:bg-brand-primary group transition-all duration-500">
                                <h4 className="text-base font-black text-brand-primary group-hover:text-white transition-colors uppercase tracking-tight mb-4">{expo.title}</h4>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40 group-hover:text-white/60">
                                        <Calendar className="w-4 h-4 text-brand-accent" /> {expo.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40 group-hover:text-white/60">
                                        <MapPin className="w-4 h-4 text-brand-accent" /> {expo.location}
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 group-hover:text-brand-accent hover:underline uppercase tracking-widest">
                                    Manage Photos <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GalleryManagement;
