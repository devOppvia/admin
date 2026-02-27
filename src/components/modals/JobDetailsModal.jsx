import React from 'react';
import {
    Briefcase,
    Building2,
    MapPin,
    Clock,
    Layers,
    DollarSign,
    UserPlus,
    Calendar,
    Star,
    ShieldCheck,
    Ban,
    ExternalLink,
    Zap,
    Trophy
} from 'lucide-react';
import Modal from './Modal';

const DetailItem = ({ icon: Icon, label, value, isBadge }) => (
    <div className="flex flex-col gap-1.5 p-4 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl group hover:border-brand-primary/10 transition-all">
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-brand-primary/30 group-hover:text-brand-primary/60 transition-colors" />
            <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">{label}</span>
        </div>
        {isBadge ? (
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                    {value}
                </span>
            </div>
        ) : (
            <p className="text-[13px] font-bold text-brand-primary">{value || 'N/A'}</p>
        )}
    </div>
);

const JobDetailsModal = ({ job, onClose, onApprove, onReject }) => {
    if (!job) return null;

    return (
        <Modal
            isOpen={!!job}
            onClose={onClose}
            maxWidth="1000px"
        >
            <div className="flex flex-col animate-fadeIn">
                {/* Header Section */}
                <div className="p-8 lg:p-12 border-b border-brand-primary/5 bg-linear-to-br from-brand-primary/3 to-transparent relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft ring-4 ring-brand-primary/5 shrink-0">
                            <Briefcase className="w-10 h-10 opacity-20" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-3xl font-black text-brand-primary tracking-tighter uppercase leading-none">
                                    {job.jobTitle}
                                </h1>
                                <span className={`
                                    px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                                    ${job.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        job.status === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
                                            job.status === 'PAUSED' ? 'bg-blue-100 text-blue-700' :
                                                job.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-red-100 text-red-700'}
                                `}>
                                    {job.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                <p className="text-brand-primary/60 flex items-center gap-2 font-bold text-sm uppercase tracking-tight">
                                    <Building2 className="w-4 h-4 text-brand-primary/40" strokeWidth={3} /> {job.company.companyName}
                                </p>
                                <div className="h-4 w-px bg-brand-primary/10" />
                                <p className="text-brand-primary/40 flex items-center gap-2 font-bold text-sm uppercase tracking-tight">
                                    <Calendar className="w-4 h-4" /> Posted on {job.joinedDate}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 lg:p-12 space-y-12 h-[60vh] overflow-y-auto no-scrollbar">
                    {/* Quick Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 bg-brand-primary/3 rounded-[32px] border border-brand-primary/5 flex flex-col gap-3 group hover:border-brand-primary/10 transition-all">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft shadow-brand-primary/5">
                                <DollarSign className="w-5 h-5 text-brand-primary/40" strokeWidth={3} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">Stipend / Salary</p>
                                <p className="text-xl font-black text-brand-primary">{job.stipend}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-brand-primary/3 rounded-[32px] border border-brand-primary/5 flex flex-col gap-3 group hover:border-brand-primary/10 transition-all">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft shadow-brand-primary/5">
                                <Clock className="w-5 h-5 text-brand-primary/40" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">Duration</p>
                                <p className="text-xl font-black text-brand-primary">{job.internshipDuration}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-brand-primary/3 rounded-[32px] border border-brand-primary/5 flex flex-col gap-3 group hover:border-brand-primary/10 transition-all">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft shadow-brand-primary/5">
                                <Zap className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">AI Match Score</p>
                                <p className="text-xl font-black text-brand-primary">{job.score || 'N/A'}<span className="text-xs text-brand-primary/40 ml-1">/10</span></p>
                            </div>
                        </div>
                        <div className="p-6 bg-brand-primary/3 rounded-[32px] border border-brand-primary/5 flex flex-col gap-3 group hover:border-brand-primary/10 transition-all">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft shadow-brand-primary/5">
                                <Trophy className="w-5 h-5 text-brand-primary/40" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">Openings</p>
                                <p className="text-xl font-black text-brand-primary">{job.numberOfOpenings} Vacancies</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Details Grid */}
                    <div className="space-y-8">
                        <h4 className="text-[11px] font-black text-brand-primary/20 uppercase tracking-[0.3em] flex items-center gap-4">
                            <div className="w-12 h-px bg-brand-primary/10" /> Detailed Specifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem icon={Layers} label="Category" value={job.jobCategory.categoryName} />
                            <DetailItem icon={MapPin} label="Work Location" value={job.location} />
                            <DetailItem icon={Briefcase} label="Employment Type" value={job.jobType} isBadge />
                            <DetailItem icon={Clock} label="Working Hours" value={job.workingHours} />
                            <DetailItem icon={Calendar} label="Engagement Date" value={job.joinedDate} />
                        </div>
                    </div>

                    {/* Skills Requirements */}
                    <div className="space-y-6 p-10 bg-brand-primary text-white rounded-[40px] shadow-premium relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -mr-32 group-hover:scale-125 transition-transform duration-700" />
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-4 relative z-10">
                            Required Professional Skills
                        </h4>
                        <div className="flex flex-wrap gap-2.5 relative z-10">
                            {job.skills?.length > 0 ? job.skills.map((skill, index) => (
                                <span key={index} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white/80 hover:bg-white/10 transition-colors cursor-default">
                                    {skill}
                                </span>
                            )) : (
                                <p className="text-xs text-white/40 italic">No specific skills listed.</p>
                            )}
                        </div>
                    </div>

                    {job.rejectReason && (
                        <div className="p-8 bg-red-50 rounded-[32px] border border-red-100 flex items-start gap-4">
                            <Ban className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                            <div className="space-y-2">
                                <p className="text-xs font-black text-red-900 uppercase tracking-widest">Rejection Reason</p>
                                <p className="text-sm font-medium text-red-800/80 leading-relaxed italic">"{job.rejectReason}"</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="p-8 lg:p-10 border-t border-brand-primary/5 bg-brand-primary/1 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${job.status === 'REVIEW' ? 'bg-brand-accent' : 'bg-green-500'}`} />
                        <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
                            {job.status === 'REVIEW' ? 'Pending Approval' : 'System Verified'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {job.status === 'REVIEW' && (
                            <>
                                <button
                                    onClick={() => onReject(job.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-500 border border-red-100 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all shadow-soft"
                                >
                                    <Ban className="w-4 h-4" /> Reject
                                </button>
                                <button
                                    onClick={() => onApprove(job.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-brand-primary text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:shadow-hover transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4" /> Approve
                                </button>
                            </>
                        )}
                        {job.status !== 'REVIEW' && (
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium"
                            >
                                Close Details
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default JobDetailsModal;
