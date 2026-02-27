import { useSelector, useDispatch } from 'react-redux';
import { updateJobStatus, deleteJob, updateBulkJobStatus } from '../store/slices/jobSlice';
import {
    Briefcase,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    Building2,
    Calendar,
    Layers,
    MapPin,
    Clock,
    UserPlus,
    DollarSign,
    MoreVertical,
    Trash2,
    Star,
    ChevronDown
} from 'lucide-react';
import { useState, useMemo } from 'react';
import StatusTabs from '../components/common/StatusTabs';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/modals/Modal';
import Checkbox from '../components/common/Checkbox';
import JobDetailsModal from '../components/modals/JobDetailsModal';

const JobManagement = () => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.jobs);
    const [activeTab, setActiveTab] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentJobToReject, setCurrentJobToReject] = useState(null);
    const [selectedJobView, setSelectedJobView] = useState(null);

    // Filter Logic
    const filteredJobs = useMemo(() => {
        return list.filter(job => {
            const matchesTab = activeTab === 'ALL' || job.status === activeTab;
            const matchesSearch =
                job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                job.company.companyName.toLowerCase().includes(search.toLowerCase()) ||
                job.jobCategory.categoryName.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [list, activeTab, search]);

    // Tab Counts
    const tabCounts = useMemo(() => {
        return {
            ALL: list.length,
            REVIEW: list.filter(j => j.status === 'REVIEW').length,
            APPROVED: list.filter(j => j.status === 'APPROVED').length,
            PAUSED: list.filter(j => j.status === 'PAUSED').length,
            COMPLETED: list.filter(j => j.status === 'COMPLETED').length,
            REJECTED: list.filter(j => j.status === 'REJECTED').length,
        };
    }, [list]);

    const tabs = ['ALL', 'REVIEW', 'APPROVED', 'PAUSED', 'COMPLETED', 'REJECTED'];

    // Action Handlers
    const handleRejectClick = (job) => {
        setCurrentJobToReject(job);
        setIsRejectModalOpen(true);
    };

    const handleStatusUpdate = (id, status) => {
        if (status === 'REJECTED') {
            const job = list.find(j => j.id === id);
            handleRejectClick(job);
            return;
        }
        dispatch(updateJobStatus({ id, status }));
    };

    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) return;
        dispatch(updateJobStatus({
            id: currentJobToReject.id,
            status: 'REJECTED',
            rejectReason: rejectReason.trim()
        }));
        setIsRejectModalOpen(false);
        setRejectReason('');
        setCurrentJobToReject(null);
        if (selectedJobView) setSelectedJobView(null);
    };

    const handleApproveFromModal = (id) => {
        dispatch(updateJobStatus({ id, status: 'APPROVED' }));
        setSelectedJobView(null);
    };

    const handleBulkStatusChange = (status) => {
        dispatch(updateBulkJobStatus({ ids: selectedJobs, status }));
        setSelectedJobs([]);
    };

    const handleSelectJob = (id) => {
        setSelectedJobs(prev =>
            prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedJobs.length === filteredJobs.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(filteredJobs.map(job => job.id));
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REVIEW': return 'bg-amber-100 text-amber-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'PAUSED': return 'bg-blue-100 text-blue-700';
            case 'COMPLETED': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Job Management
                    </h1>
                    <p className="text-brand-primary/60 text-sm font-medium mt-1">Monitor and manage internship opportunities across the network.</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedJobs.length > 0 && (
                        <div className="flex items-center gap-2 animate-slideIn">
                            <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mr-2">{selectedJobs.length} selected</span>
                            <div className="relative group">
                                <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary-light transition-all shadow-premium">
                                    Bulk Actions <ChevronDown className="w-3 h-3" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-primary/5 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <button onClick={() => handleBulkStatusChange('APPROVED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-green-600 hover:bg-green-50 uppercase tracking-wider">Approve Selected</button>
                                    <button onClick={() => handleBulkStatusChange('PAUSED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 uppercase tracking-wider">Pause Selected</button>
                                    <button onClick={() => handleBulkStatusChange('COMPLETED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-purple-600 hover:bg-purple-50 uppercase tracking-wider">Mark Completed</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <button className="flex items-center gap-2 bg-brand-primary/3 text-brand-primary px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white border border-brand-primary/5 transition-all">
                        Job Reports
                    </button>
                </div>
            </div>

            {/* Stats & Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-soft space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <StatusTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        count={tabCounts}
                    />

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search roles, companies or categories..."
                                className="pl-12 pr-6 py-3 bg-brand-primary/2 border border-transparent rounded-2xl text-sm w-full md:w-80 focus:bg-white focus:border-brand-primary/10 transition-all text-brand-primary placeholder:text-brand-primary/30"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto no-scrollbar min-h-[400px]">
                    {filteredJobs.length > 0 ? (
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-brand-primary/30 uppercase text-[10px] font-black tracking-[0.2em]">
                                    <th className="px-6 py-2">
                                        <Checkbox
                                            checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-2">Job & Company</th>
                                    <th className="px-6 py-2">Details</th>
                                    <th className="px-6 py-2">Compensation</th>
                                    {activeTab === 'REVIEW' && <th className="px-6 py-2">AI Score</th>}
                                    <th className="px-6 py-2 text-center">Status</th>
                                    <th className="px-6 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((job) => (
                                    <tr key={job.id} className="group hover:translate-x-1 transition-transform duration-300">
                                        <td className="bg-brand-primary/2 px-6 py-5 rounded-l-3xl border-y border-brand-primary/5">
                                            <Checkbox
                                                checked={selectedJobs.includes(job.id)}
                                                onChange={() => handleSelectJob(job.id)}
                                            />
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft transition-transform group-hover:scale-110">
                                                    <Briefcase className="w-6 h-6 opacity-40" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-primary mb-1 uppercase tracking-tight">{job.jobTitle}</p>
                                                    <p className="text-[10px] text-brand-primary/40 flex items-center gap-1.5 font-black uppercase tracking-widest">
                                                        <Building2 className="w-3 h-3" /> {job.company.companyName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary/60">
                                                    <Layers className="w-3 h-3" /> {job.jobCategory.categoryName}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary/40">
                                                    <MapPin className="w-3 h-3" /> {job.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                                            <div className="space-y-1.5 font-bold">
                                                <div className="flex items-center gap-2 text-[11px] text-brand-primary">
                                                    <DollarSign className="w-3.5 h-3.5 text-brand-accent" /> {job.stipend}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-brand-primary/40">
                                                    <Clock className="w-3.5 h-3.5" /> {job.internshipDuration}
                                                </div>
                                            </div>
                                        </td>
                                        {activeTab === 'REVIEW' && (
                                            <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                                                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full w-fit border border-brand-primary/5">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-xs font-black text-brand-primary">{job.score}</span>
                                                </div>
                                            </td>
                                        )}
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${getStatusStyle(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 rounded-r-3xl border-y border-brand-primary/5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedJobView(job)}
                                                    className="p-2 text-brand-primary hover:bg-white rounded-xl transition-all shadow-hover-sm"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <div className="relative group/actions inline-block">
                                                    <button className="p-2 text-brand-primary/40 hover:bg-white rounded-xl transition-all shadow-hover-sm">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl shadow-xl border border-brand-primary/5 py-2 z-20 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all">
                                                        {job.status === 'REVIEW' && (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(job.id, 'APPROVED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-green-600 hover:bg-green-50 uppercase tracking-wider flex items-center gap-2">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Job
                                                                </button>
                                                                <button onClick={() => handleStatusUpdate(job.id, 'REJECTED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2">
                                                                    <XCircle className="w-3.5 h-3.5" /> Reject Job
                                                                </button>
                                                            </>
                                                        )}
                                                        {job.status === 'APPROVED' && (
                                                            <>
                                                                <button onClick={() => handleStatusUpdate(job.id, 'PAUSED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 uppercase tracking-wider flex items-center gap-2">
                                                                    <Clock className="w-3.5 h-3.5" /> Pause Tracking
                                                                </button>
                                                                <button onClick={() => handleStatusUpdate(job.id, 'COMPLETED')} className="w-full text-left px-4 py-2 text-[10px] font-bold text-brand-primary hover:bg-brand-primary/5 uppercase tracking-wider flex items-center gap-2">
                                                                    <Layers className="w-3.5 h-3.5" /> Mark Completed
                                                                </button>
                                                            </>
                                                        )}
                                                        <div className="h-px bg-brand-primary/5 my-1 mx-2" />
                                                        <button onClick={() => dispatch(deleteJob(job.id))} className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-400 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2">
                                                            <Trash2 className="w-3.5 h-3.5" /> Delete Entry
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            title={search ? "No results found" : "No jobs in this category"}
                            description={search ? `We couldn't find any job matching "${search}". Try refining your search terms.` : "There are no jobs currently listed under this status."}
                            type="search"
                            action={search ? { label: "Clear Search", onClick: () => setSearch('') } : null}
                        />
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {isRejectModalOpen && (
                <Modal
                    isOpen={isRejectModalOpen}
                    onClose={() => {
                        setIsRejectModalOpen(false);
                        setRejectReason('');
                    }}
                    title="Reject Job Posting"
                    footer={
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="flex-1 py-3 bg-brand-primary/5 text-brand-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim()}
                                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-premium hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-4 py-2">
                        <div className="p-4 bg-red-50 rounded-2xl flex items-start gap-3 border border-red-100">
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-red-900 uppercase tracking-tight">You are rejecting: {currentJobToReject?.jobTitle}</p>
                                <p className="text-[10px] text-red-700/70 font-medium">Please provide a reason. This will be shared with the company.</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-brand-primary/40 uppercase tracking-[0.2em] mb-3 ml-1">Rejection Reason</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full bg-brand-primary/3 border border-transparent rounded-2xl p-4 text-sm text-brand-primary placeholder:text-brand-primary/20 focus:bg-white focus:border-brand-primary/10 transition-all min-h-[120px]"
                                placeholder="E.g., Incomplete job description, skills mismatch, suspicious content..."
                            />
                        </div>
                    </div>
                </Modal>
            )}
            {/* Job Details Modal */}
            {selectedJobView && (
                <JobDetailsModal
                    job={selectedJobView}
                    onClose={() => setSelectedJobView(null)}
                    onApprove={handleApproveFromModal}
                    onReject={handleRejectClick}
                />
            )}
        </div>
    );
};

export default JobManagement;
