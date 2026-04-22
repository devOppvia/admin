import { useSelector, useDispatch } from "react-redux";
import {
  updateCompanyStatus,
  fetchCompanies,
} from "../store/slices/companySlice";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Eye,
  Loader2,
  X,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import CompanyDetailsModal from "../components/modals/CompanyDetailsModal";
import StatusTabs from "../components/common/StatusTabs";
import EmptyState from "../components/common/EmptyState";

const companyStatus = [
  { label: "PENDING", value: "PENDING", icon: "mdi:progress-clock" },
  { label: "APPROVED", value: "APPROVED", icon: "mdi:check-circle-outline" },
  { label: "REJECTED", value: "REJECTED", icon: "mdi:account-cancel-outline" },
  { label: "PROFILE UPDATES", value: "PROFILEUPDATES", icon: "mdi:refresh" },
];

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.companies);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // company to reject

  // Fetch companies when activeTab changes
  useEffect(() => {
    dispatch(fetchCompanies(activeTab));
  }, [dispatch, activeTab]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: list.length,
      PENDING: list.filter((c) => c.companyStatus === "PENDING").length,
      APPROVED: list.filter((c) => c.companyStatus === "APPROVED").length,
      REJECTED: list.filter((c) => c.companyStatus === "REJECTED").length,
    };
  }, [list]);

  const filteredCompanies = useMemo(() => {
    return list.filter((company) => {
      const matchesSearch =
        company?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
        company?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
        company?.industryType?.toLowerCase()?.includes(search?.toLowerCase());
      return matchesSearch;
    });
  }, [list, search]);

  //   const handleStatusUpdate = (id, status) => {
  //     dispatch(updateCompanyStatus({ id, status }));
  //     if (selectedCompany && selectedCompany.id === id) {
  //       setSelectedCompany((prev) => ({ ...prev, companyStatus: status }));
  //     }
  //   };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleApprove = (id) => {
    dispatch(updateCompanyStatus({ id: id, status: "APPROVED" }));
    dispatch(fetchCompanies(activeTab));
  };

  // Open reject popup
  const handleRejectClick = (company) => {
    setRejectTarget(company);
  };

  // Confirm reject with reason
  const handleRejectConfirm = async (reason) => {
    await dispatch(
      updateCompanyStatus({ id: rejectTarget.id, status: "REJECTED", reason }),
    );
    setRejectTarget(null);
    dispatch(fetchCompanies(activeTab));
  };

  return (
    <>
      {" "}
      {rejectTarget && (
        <RejectReasonModal
          company={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
              Company Management
            </h1>
            <p className="text-brand-primary/60 text-sm font-medium mt-1">
              Review and approve partners joining the Oppvia network.
            </p>
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
              tabs={companyStatus}
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                <span className="ml-3 text-brand-primary/60">
                  Loading companies...
                </span>
              </div>
            ) : filteredCompanies.length > 0 ? (
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-brand-primary/30 uppercase text-[10px] font-black tracking-[0.2em]">
                    <th className="px-6 py-2">Company Details</th>
                    <th className="px-6 py-2">Industry</th>
                    <th className="px-6 py-2">Registration Date</th>
                    <th className="px-6 py-2 text-center">Status</th>
                    <th className="px-6 py-2 text-center">Score</th>
                    <th className="px-6 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="group hover:translate-x-1 transition-transform duration-300"
                    >
                      <td className="bg-brand-primary/2 px-6 py-5 rounded-l-3xl border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                        <div className="flex items-center gap-4">
                          {company.logo ? (
                            <img
                              src={`${import.meta.env.VITE_IMG_URL}/${company.logo}`}
                              alt={company.companyName}
                              className="w-12 h-12 rounded-2xl object-cover border border-brand-primary/5 shadow-soft group-hover:scale-110 transition-transform"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft group-hover:scale-110 transition-transform ${company.logo ? "hidden" : ""}`}
                          >
                            <Building2 className="w-6 h-6 opacity-40" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-primary mb-0.5 uppercase tracking-tight">
                              {company.companyName}
                            </p>
                            <p className="text-[11px] text-brand-primary/40 flex items-center gap-1.5 font-medium">
                              <Mail className="w-3 h-3" /> {company.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                        <span className="text-xs font-bold text-brand-primary/60">
                          {company.industryName || "-"}
                        </span>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/40">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(company.createdAt)}
                        </div>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 text-center group-hover:border-brand-primary/10 transition-colors">
                        <span
                          className={`
                                                px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block
                                                ${
                                                  company.companyStatus ===
                                                  "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : company.companyStatus ===
                                                        "PENDING"
                                                      ? "bg-amber-100 text-amber-700"
                                                      : "bg-red-100 text-red-700"
                                                }
                                            `}
                        >
                          {company.companyStatus}
                        </span>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 text-center group-hover:border-brand-primary/10 transition-colors">
                        <span
                          className={
                            "px-4 py-1.5 flex gap-1 items-center text-black bg-gray-100 rounded-full text-sm font-black tracking-widest uppercase "
                          }
                        >
                          <Star className="w-3.5 h-3.5 text-yellow-500" />
                          {company.AiScore}
                        </span>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 rounded-r-3xl border-y border-r border-brand-primary/5 text-right group-hover:border-brand-primary/10 transition-colors">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* <button
                          onClick={() => setSelectedCompany(company)}
                          className="p-2 text-brand-primary hover:bg-white hover:text-brand-accent rounded-xl transition-all shadow-hover-sm sm:shadow-none sm:hover:shadow-soft"
                          title="View Profile"
                        >
                          <Eye className="w-5 h-5" />
                        </button> */}
                          {company.companyStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(company.id)}
                                className="p-2 text-green-600 hover:bg-white rounded-xl transition-all shadow-hover-sm sm:shadow-none sm:hover:shadow-soft"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRejectClick(company)}
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
                title={
                  search ? "No matches found" : "No companies in this category"
                }
                description={
                  search
                    ? `We couldn't find any company matching "${search}". Please try a different search term.`
                    : "There are currently no companies available in this section."
                }
                type="search"
                action={
                  search
                    ? {
                        label: "Clear Search",
                        onClick: () => setSearch(""),
                      }
                    : null
                }
              />
            )}
          </div>
        </div>

        {/* Modal */}
        {/* {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onApprove={(id) => handleStatusUpdate(id, "APPROVED")}
          onReject={(id) => handleStatusUpdate(id, "REJECTED")}
        />
      )} */}
      </div>
    </>
  );
};

export default CompanyManagement;

const RejectReasonModal = ({ company, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const wordCount = reason.trim() ? reason.trim().split(/\s+/).length : 0;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }
    if (wordCount <= 5) {
      setError("Reason must be greater than 5 words.");
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <>
      {" "}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md mx-4 p-8 animate-fadeIn">
          {/* Close */}
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-2 rounded-xl text-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-black text-brand-primary uppercase tracking-tight mb-1">
            Reject Company
          </h2>
          <p className="text-sm text-brand-primary/50 font-medium mb-6">
            You are about to reject{" "}
            <span className="text-brand-primary font-bold">
              {company?.companyName}
            </span>
            . Please provide a reason.
          </p>

          {/* Textarea */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-brand-primary/40 uppercase tracking-widest">
                Reason for Rejection
              </label>
              <span
                className={`text-[10px] font-bold ${wordCount > 5 ? "text-green-500" : "text-brand-primary/40"}`}
              >
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="e.g. Incomplete documentation, unverifiable business details..."
              className={`w-full px-4 py-3 bg-brand-primary/3 border rounded-2xl text-sm text-brand-primary placeholder:text-brand-primary/30 resize-none focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all ${
                error
                  ? "border-red-300 focus:border-red-400"
                  : "border-transparent focus:border-brand-primary/10 focus:bg-white"
              }`}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 font-semibold">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl border border-brand-primary/10 text-brand-primary/60 text-sm font-bold hover:bg-brand-primary/3 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-sm"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
