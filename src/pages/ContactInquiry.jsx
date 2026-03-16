import { useState, useEffect, useCallback } from 'react';
import {
    MessageSquare,
    Search,
    Trash2,
    Eye,
    Mail,
    Phone,
    Globe,
    Calendar,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { getContactInquiryAPi } from '../helper/api_helper';
import Modal from '../components/modals/Modal';
import EmptyState from '../components/common/EmptyState';

const ContactInquiry = () => {
    // API State
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // UI State
    const [search, setSearch] = useState('');
    const [viewInquiry, setViewInquiry] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch Inquiries
    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getContactInquiryAPi();
            const data = response?.data ?? [];
            setInquiries(data);
        } catch (err) {
            setError('Failed to load inquiries. Please try again.');
            console.error('getContactInquiryAPi error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const filteredInquiries = inquiries.filter(item =>
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase())
    );

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setInquiries(prev => prev.filter(item => item.id !== itemToDelete.id));
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Contact Inquiries
                    </h1>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">Review and manage messages from the contact form.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                {/* Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-brand-primary/5">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
                        <input
                            type="text"
                            placeholder="Search by name, email or reason..."
                            className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto no-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 text-sm font-medium">{error}</p>
                        </div>
                    ) : filteredInquiries.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="No inquiries found"
                            description={search ? "Try adjusting your search criteria" : "Contact inquiries will appear here"}
                        />
                    ) : (
                        <table className="w-full border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">
                                <th className="text-left px-6 py-2">Date</th>
                                <th className="text-left px-6 py-2">Full Name</th>
                                <th className="text-left px-6 py-2">Email</th>
                                <th className="text-left px-6 py-2">Reason</th>
                                <th className="text-right px-6 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInquiries.map((item) => (
                                <tr key={item.id} className="group hover:scale-[1.01] transition-transform duration-300">
                                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 rounded-l-[24px] border-y border-l border-brand-primary/5 first:border-l">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary/40 shadow-sm transition-colors group-hover:text-brand-primary">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-brand-primary">{formatDate(item.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                                        <span className="text-sm font-black text-brand-primary">{item.fullName}</span>
                                    </td>
                                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                                        <div className="flex items-center gap-2 text-brand-primary/50 group-hover:text-brand-primary transition-colors">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{item.email}</span>
                                        </div>
                                    </td>
                                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                                        <span className="px-3 py-1 bg-white/50 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/5 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                            {item.reason}
                                        </span>
                                    </td>
                                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 rounded-r-[24px] border-y border-r border-brand-primary/5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setViewInquiry(item)}
                                                className="p-2.5 bg-white text-brand-primary rounded-xl shadow-sm hover:scale-110 transition-all border border-brand-primary/5"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setItemToDelete(item); setShowDeleteModal(true); }}
                                                className="p-2.5 bg-white text-red-500 rounded-xl shadow-sm hover:scale-110 transition-all border border-brand-primary/5"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

            {/* View Modal */}
            <Modal
                isOpen={!!viewInquiry}
                onClose={() => setViewInquiry(null)}
                title="Inquiry Details"
                maxWidth="600px"
            >
                {viewInquiry && (
                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-6 pb-8 border-b border-brand-primary/5">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Full Name</span>
                                <p className="text-sm font-black text-brand-primary">{viewInquiry.fullName}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Contact Reason</span>
                                <p className="text-sm font-black text-brand-primary">{viewInquiry.reason}</p>
                            </div>
                            <div className="space-y-1 flex flex-col">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Email</span>
                                <div className="flex items-center gap-2 text-brand-primary">
                                    <Mail className="w-3.5 h-3.5 opacity-30" />
                                    <span className="text-sm font-medium">{viewInquiry.email}</span>
                                </div>
                            </div>
                            <div className="space-y-1 flex flex-col">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Phone</span>
                                <div className="flex items-center gap-2 text-brand-primary">
                                    <Phone className="w-3.5 h-3.5 opacity-30" />
                                    <span className="text-sm font-medium">{viewInquiry.phoneNumber}</span>
                                </div>
                            </div>
                            <div className="space-y-1 flex flex-col">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Country</span>
                                <div className="flex items-center gap-2 text-brand-primary">
                                    <Globe className="w-3.5 h-3.5 opacity-30" />
                                    <span className="text-sm font-medium">{viewInquiry.country}</span>
                                </div>
                            </div>
                            <div className="space-y-1 flex flex-col">
                                <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Received On</span>
                                <div className="flex items-center gap-2 text-brand-primary">
                                    <Calendar className="w-3.5 h-3.5 opacity-30" />
                                    <span className="text-sm font-medium">{formatDate(viewInquiry.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">Message Body</span>
                            <div className="p-6 bg-brand-primary/3 rounded-[24px] text-sm text-brand-primary/70 leading-relaxed italic font-medium">
                                "{viewInquiry.message}"
                            </div>
                        </div>

                        <button
                            onClick={() => setViewInquiry(null)}
                            className="w-full py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium transition-all"
                        >
                            Mark as Read & Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Deletion"
                maxWidth="400px"
            >
                <div className="p-8 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-brand-primary leading-tight">Remove Inquiry?</h4>
                            <p className="text-sm text-brand-primary/40 mt-1">
                                You are about to delete the inquiry from <span className="font-bold text-brand-primary">{itemToDelete?.fullName}</span>.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ContactInquiry;
