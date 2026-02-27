import React from 'react';
import {
    Building2,
    MapPin,
    Globe,
    Linkedin,
    Instagram,
    Youtube,
    Mail,
    Phone,
    User,
    ShieldCheck,
    Ban,
    Calendar,
    Layers,
    ExternalLink
} from 'lucide-react';
import Modal from './Modal';

const DetailItem = ({ icon: Icon, label, value, isLink, linkPrefix = '' }) => (
    <div className="flex flex-col gap-1.5 p-4 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl group hover:border-brand-primary/10 transition-all">
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-brand-primary/30 group-hover:text-brand-primary/60 transition-colors" />
            <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">{label}</span>
        </div>
        {isLink ? (
            <a
                href={`${linkPrefix}${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1.5"
            >
                {value} <ExternalLink className="w-3 h-3 opacity-30" />
            </a>
        ) : (
            <p className="text-[13px] font-bold text-brand-primary">{value || 'N/A'}</p>
        )}
    </div>
);

const CompanyDetailsModal = ({ company, onClose, onApprove, onReject }) => {
    if (!company) return null;

    return (
        <Modal
            isOpen={!!company}
            onClose={onClose}
            maxWidth="1000px"
        >
            <div className="flex flex-col animate-fadeIn">
                {/* Header Section */}
                <div className="p-8 lg:p-12 border-b border-brand-primary/5 bg-linear-to-br from-brand-primary/3 to-transparent relative">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft ring-4 ring-brand-primary/5 shrink-0">
                            <Building2 className="w-10 h-10 opacity-20" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h2 className="text-3xl font-black text-brand-primary tracking-tighter uppercase">{company.name}</h2>
                                <span className={`
                                    px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase
                                    ${company.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        company.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'}
                                `}>
                                    {company.status}
                                </span>
                            </div>
                            <p className="text-brand-primary/40 font-bold text-sm max-w-2xl leading-relaxed">
                                {company.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="p-8 lg:p-12 space-y-12">
                    {/* Company Information */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-brand-primary/20 uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-8 h-px bg-brand-primary/10" /> Company Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DetailItem icon={User} label="Contact Person" value={company.contactName} />
                            <DetailItem icon={ShieldCheck} label="Job Title" value={company.designation} />
                            <DetailItem icon={Mail} label="Email Address" value={company.email} isLink linkPrefix="mailto:" />
                            <DetailItem icon={Phone} label="Primary Line" value={company.phone} />
                            <DetailItem icon={Layers} label="Industry" value={company.industry} />
                            <DetailItem icon={Building2} label="Company Size" value={company.companySize} />
                            <DetailItem icon={Globe} label="Website" value={company.website} isLink />
                            <DetailItem icon={Calendar} label="Date Joined" value={company.joinedDate} />
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-brand-primary/20 uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-8 h-px bg-brand-primary/10" /> Location Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem icon={MapPin} label="Address" value={company.address} />
                            <DetailItem icon={Globe} label="City & State" value={`${company.city}, ${company.state}`} />
                            <DetailItem icon={Globe} label="Zip & Country" value={`${company.zipCode}, ${company.country}`} />
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-brand-primary/20 uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-8 h-px bg-brand-primary/10" /> Social Media
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DetailItem icon={Linkedin} label="LinkedIn" value={company.linkedin} isLink linkPrefix="https://" />
                            <DetailItem icon={Instagram} label="Instagram" value={company.instagram} isLink linkPrefix="https://instagram.com/" />
                            <DetailItem icon={Youtube} label="YouTube" value={company.youtube} isLink linkPrefix="https://" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 lg:p-10 border-t border-brand-primary/5 bg-brand-primary/1 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">Pending Verification</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {company.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={() => onReject(company.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-500 border border-red-100 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all shadow-soft"
                                >
                                    <Ban className="w-4 h-4" /> Reject
                                </button>
                                <button
                                    onClick={() => onApprove(company.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-brand-primary text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:shadow-hover transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4" /> Approve
                                </button>
                            </>
                        )}
                        {company.status !== 'PENDING' && (
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CompanyDetailsModal;
