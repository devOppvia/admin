import { useSelector, useDispatch } from 'react-redux';
import { updateResumeStatus } from '../store/slices/resumeSlice';
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    ShieldCheck,
    FileUser
} from 'lucide-react';
import { useState } from 'react';

const ResumeBank = () => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.resumes);
    const [search, setSearch] = useState('');

    const filteredResumes = list.filter(resume =>
        resume.internName.toLowerCase().includes(search.toLowerCase()) ||
        resume.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleStatusUpdate = (id, status) => {
        dispatch(updateResumeStatus({ id, status }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Resume <span className="text-brand-accent">Bank</span>
                    </h1>
                    <p className="text-brand-primary/60 text-sm font-medium mt-1">Manage and verify intern resumes for platform-wide visibility.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                {/* Search & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30 group-focus-within:text-brand-primary" />
                        <input
                            type="text"
                            placeholder="Search resumes..."
                            className="pl-12 pr-6 py-3.5 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2.5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium">
                            {list.length} Total Profiles
                        </div>
                    </div>
                </div>

                {/* Resume Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResumes.map((resume) => (
                        <div key={resume.id} className="p-6 bg-brand-primary/2 border border-brand-primary/5 rounded-3xl hover:border-brand-primary/10 transition-all group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-brand-primary/5 shadow-soft group-hover:scale-105 transition-transform">
                                        <FileUser className="w-8 h-8 opacity-20" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-brand-primary">{resume.internName}</h4>
                                        <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-wider">{resume.title}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`
                         px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase
                         ${resume.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                       `}>
                                                {resume.status}
                                            </span>
                                            <span className="text-[10px] text-brand-primary/20 flex items-center gap-1 font-bold italic">
                                                <Clock className="w-3 h-3" /> {resume.uploadedDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button className="p-2.5 bg-white text-brand-primary rounded-xl shadow-soft hover:bg-brand-primary hover:text-white transition-all">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2.5 bg-white text-brand-primary rounded-xl shadow-soft hover:bg-brand-primary hover:text-white transition-all">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-6 border-t border-brand-primary/5">
                                <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-widest">Profile actions</p>
                                <div className="flex items-center gap-2">
                                    {resume.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleStatusUpdate(resume.id, 'VERIFIED')}
                                            className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                        >
                                            <ShieldCheck className="w-3 h-3" /> Verify Now
                                        </button>
                                    )}
                                    <button className="p-2 text-brand-primary/20 hover:text-brand-primary transition-colors">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeBank;
