import { useSelector, useDispatch } from 'react-redux';
import { updateCompanyStatus } from '../store/slices/companySlice';
import {
    Building2,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Mail,
    Calendar,
    Eye
} from 'lucide-react';
import { useState, useMemo } from 'react';
import CompanyDetailsModal from '../components/modals/CompanyDetailsModal';
import StatusTabs from '../components/common/StatusTabs';
import EmptyState from '../components/common/EmptyState';
import Checkbox from '../components/common/Checkbox';

const CompanyManagement = () => {
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.companies);
    const [activeTab, setActiveTab] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedCompanies, setSelectedCompanies] = useState([]);

    // Calculate tab counts
    const tabCounts = useMemo(() => {
        return {
            ALL: list.length,
            PENDING: list.filter(c => c.status === 'PENDING').length,
            APPROVED: list.filter(c => c.status === 'APPROVED').length,
            REJECTED: list.filter(c => c.status === 'REJECTED').length,
        };
    }, [list]);

    const filteredCompanies = useMemo(() => {
        return list.filter(company => {
            const matchesTab = activeTab === 'ALL' || company.status === activeTab;
            const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.email.toLowerCase().includes(search.toLowerCase()) ||
                company.industry.toLowerCase().includes(search.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [list, activeTab, search]);

    const handleStatusUpdate = (id, status) => {
        dispatch(updateCompanyStatus({ id, status }));
        if (selectedCompany && selectedCompany.id === id) {
            setSelectedCompany(prev => ({ ...prev, status }));
        }
    };

    const handleSelectCompany = (id) => {
        setSelectedCompanies(prev =>
            prev.includes(id) ? prev.filter(compId => compId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedCompanies.length === filteredCompanies.length) {
            setSelectedCompanies([]);
        } else {
            setSelectedCompanies(filteredCompanies.map(comp => comp.id));
        }
    };

    const tabs = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Company Management
                    </h1>
                    <p className="text-brand-primary/60 text-sm font-medium mt-1">Review and approve partners joining the Oppvia network.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary-light transition-all shadow-premium">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats & Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-soft space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Common Tabs Component */}
                    <StatusTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        count={tabCounts}
                    />

                    {/* Search */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or industry..."
                                className="pl-12 pr-6 py-3 bg-brand-primary/3 border border-transparent rounded-2xl text-sm w-full md:w-80 focus:bg-white focus:border-brand-primary/10 focus:ring-4 focus:ring-brand-primary/5 transition-all text-brand-primary placeholder:text-brand-primary/30"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="p-3 bg-brand-primary/3 text-brand-primary/60 rounded-2xl hover:bg-brand-primary/10 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto no-scrollbar min-h-[400px]">
                    {filteredCompanies.length > 0 ? (
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-brand-primary/30 uppercase text-[10px] font-black tracking-[0.2em]">
                                    <th className="px-6 py-2">
                                        <Checkbox
                                            checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-2">Company Details</th>
                                    <th className="px-6 py-2">Industry</th>
                                    <th className="px-6 py-2">Registration Date</th>
                                    <th className="px-6 py-2 text-center">Status</th>
                                    <th className="px-6 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.map((company) => (
                                    <tr key={company.id} className="group hover:translate-x-1 transition-transform duration-300">
                                        <td className="bg-brand-primary/2 px-6 py-5 rounded-l-3xl border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                            <Checkbox
                                                checked={selectedCompanies.includes(company.id)}
                                                onChange={() => handleSelectCompany(company.id)}
                                            />
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft group-hover:scale-110 transition-transform">
                                                    <Building2 className="w-6 h-6 opacity-40" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-primary mb-0.5 uppercase tracking-tight">{company.name}</p>
                                                    <p className="text-[11px] text-brand-primary/40 flex items-center gap-1.5 font-medium">
                                                        <Mail className="w-3 h-3" /> {company.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                            <span className="text-xs font-bold text-brand-primary/60">{company.industry}</span>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {company.joinedDate}
                                            </div>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 text-center group-hover:border-brand-primary/10 transition-colors">
                                            <span className={`
                                                px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block
                                                ${company.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    company.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                                            `}>
                                                {company.status}
                                            </span>
                                        </td>
                                        <td className="bg-brand-primary/2 px-6 py-5 rounded-r-3xl border-y border-r border-brand-primary/5 text-right group-hover:border-brand-primary/10 transition-colors">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedCompany(company)}
                                                    className="p-2 text-brand-primary hover:bg-white hover:text-brand-accent rounded-xl transition-all shadow-hover-sm sm:shadow-none sm:hover:shadow-soft"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                {company.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(company.id, 'APPROVED')}
                                                            className="p-2 text-green-600 hover:bg-white rounded-xl transition-all shadow-hover-sm sm:shadow-none sm:hover:shadow-soft"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(company.id, 'REJECTED')}
                                                            className="p-2 text-red-600 hover:bg-white rounded-xl transition-all shadow-hover-sm sm:shadow-none sm:hover:shadow-soft"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            title={search ? "No matches found" : "No companies in this category"}
                            description={search ? `We couldn't find any company matching "${search}". Please try a different search term.` : "There are currently no companies available in this section."}
                            type="search"
                            action={search ? {
                                label: "Clear Search",
                                onClick: () => setSearch('')
                            } : null}
                        />
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedCompany && (
                <CompanyDetailsModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                    onApprove={(id) => handleStatusUpdate(id, 'APPROVED')}
                    onReject={(id) => handleStatusUpdate(id, 'REJECTED')}
                />
            )}
        </div>
    );
};

export default CompanyManagement;
