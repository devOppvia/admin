import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Layers,
  MapPin,
  Clock,
  DollarSign,
  MoreVertical,
  Trash2,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import StatusTabs from "../components/common/StatusTabs";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/modals/Modal";
import Checkbox from "../components/common/Checkbox";
import JobDetailsModal from "../components/modals/JobDetailsModal";
import {
  getJobPositions,
  changeJobStatus,
  deleteJobPosition,
} from "../helper/api_helper";

const ITEMS_PER_PAGE = 5;

const internStatus = [
  { label: "All", value: "", icon: "mdi:briefcase-search-outline" },
  { label: "Review", value: "REVIEW", icon: "mdi:eye-check-outline" },
  { label: "Approved", value: "APPROVED", icon: "mdi:check-circle-outline" },
  { label: "Paused", value: "PAUSED", icon: "mdi:pause-circle-outline" },
  {
    label: "Completed",
    value: "COMPLETED",
    icon: "mdi:check-decagram-outline",
  },
  { label: "Rejected", value: "REJECTED", icon: "mdi:close-circle-outline" },
];

const JobManagement = () => {
  // API State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  // UI State
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentJobToReject, setCurrentJobToReject] = useState(null);
  const [selectedJobView, setSelectedJobView] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // ─── Fetch Jobs ───────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async (status, page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getJobPositions(
        status, // "" for ALL, or "REVIEW", "APPROVED", etc.
        ITEMS_PER_PAGE,
        page,
      );

      // 👇 Check this log to find the exact field name for total count
      console.log("getJobPositions response:", response);

      const jobsList = response?.data?.jobs ?? response?.jobs ?? [];

      // Debug: Log first job's status to verify field name
      if (jobsList.length > 0) {
        console.log("First job status field:", jobsList[0]);
      }

      const total = response?.data?.totalJobs;
      jobsList.length; // fallback: keeps pagination working even if field name is unknown

      setJobs(jobsList);
      setTotalItems(total);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error("getJobPositions error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on tab or page change
  useEffect(() => {
    setSelectedJobs([]);
    setOpenDropdownId(null);
    fetchJobs(activeTab, currentPage);
  }, [activeTab, currentPage, fetchJobs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Reset to page 1 when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Client-side search filter (optional — remove if server handles search)
  const filteredJobs = search
    ? jobs.filter((job) => {
        const q = search.toLowerCase();
        return (
          job.jobTitle?.toLowerCase().includes(q) ||
          job.company?.companyName?.toLowerCase().includes(q) ||
          job.jobCategory?.categoryName?.toLowerCase().includes(q)
        );
      })
    : jobs;

  // ─── Action Handlers ──────────────────────────────────────────────────────────
  const handleRejectClick = (job) => {
    setCurrentJobToReject(job);
    setIsRejectModalOpen(true);
  };

  const handleStatusUpdate = async (id, status) => {
    if (status === "REJECTED") {
      const job = jobs.find((j) => j.id === id);
      handleRejectClick(job);
      return;
    }
    try {
      setUpdatingJobId(id); // 👈 start loading

      await changeJobStatus(id, status);
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, jobStatus: status } : j)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingJobId(null); // 👈 stop loading
    }
  };

  const handleRejectSubmit = async () => {
    console.log("resosne : ", rejectReason);
    if (!rejectReason.trim()) return;
    try {
      await changeJobStatus(
        currentJobToReject.id,
        "REJECTED",
        rejectReason.trim(),
      );
      setJobs((prev) =>
        prev.map((j) =>
          j.id === currentJobToReject.id
            ? { ...j, jobStatus: "REJECTED", rejectReason: rejectReason.trim() }
            : j,
        ),
      );
      setIsRejectModalOpen(false);
      setRejectReason("");
      setCurrentJobToReject(null);
      if (selectedJobView) setSelectedJobView(null);
    } catch (err) {
      console.error("Error rejecting job:", err);
    }
  };

  const handleApproveFromModal = async (id) => {
    try {
      await changeJobStatus(id, "APPROVED");
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, jobStatus: "APPROVED" } : j)),
      );
      setSelectedJobView(null);
    } catch (err) {
      console.error("Error approving job:", err);
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REVIEW":
        return "bg-amber-100 text-amber-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PAUSED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ─── Pagination helpers ───────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      if (start > 1) pages.push(1, "...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) pages.push("...", totalPages);
    }
    return pages;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
            Job Management
          </h1>
          <p className="text-brand-primary/60 text-sm font-medium mt-1">
            Monitor and manage internship opportunities across the network.
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          {selectedJobs.length > 0 && (
            <div className="flex items-center gap-2 animate-slideIn">
              <span className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mr-2">
                {selectedJobs.length} selected
              </span>
              <div className="relative group">
                <button className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary-light transition-all shadow-premium">
                  Bulk Actions <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-primary/5 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => handleBulkStatusChange("APPROVED")}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold text-green-600 hover:bg-green-50 uppercase tracking-wider"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("PAUSED")}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 uppercase tracking-wider"
                  >
                    Pause Selected
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("COMPLETED")}
                    className="w-full text-left px-4 py-2 text-[10px] font-bold text-purple-600 hover:bg-purple-50 uppercase tracking-wider"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            </div>
          )}
        </div> */}
      </div>

      {/* Stats & Filters */}
      <div className="bg-white p-6 rounded-[32px] border border-brand-primary/5 shadow-soft space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <StatusTabs
            tabs={internStatus}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="Search roles, companies or categories..."
                className="pl-12 pr-6 py-3 bg-brand-primary/2 border border-transparent rounded-2xl text-sm w-full md:w-60 focus:bg-white focus:border-brand-primary/10 transition-all text-brand-primary placeholder:text-brand-primary/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest">
                  Loading Jobs...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center space-y-3">
                <p className="text-sm font-bold text-red-500">{error}</p>
                <button
                  onClick={() => fetchJobs(activeTab, currentPage)}
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-brand-primary/30 uppercase text-[10px] font-black tracking-[0.2em]">
                  {/* <th className="px-6 py-2">
                    <Checkbox
                      checked={
                        selectedJobs.length === filteredJobs.length &&
                        filteredJobs.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th> */}
                  <th className="px-6 py-2">Job & Company</th>
                  <th className="px-6 py-2">Details</th>
                  <th className="px-6 py-2">Compensation</th>
                  {(activeTab === "REVIEW" || activeTab === "") && (
                    <th className="px-6 py-2">AI Score</th>
                  )}
                  <th className="px-6 py-2 text-center">Status</th>
                  <th className="px-6 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => {
                  const jobStatus = job.jobStatus || job.status;

                  return (
                    <tr
                      key={job.id}
                      className="group hover:translate-x-1 transition-transform duration-300"
                    >
                      {/* <td className="bg-brand-primary/2 px-6 py-5 rounded-l-3xl border-y border-brand-primary/5">
                        <Checkbox
                          checked={selectedJobs.includes(job.id)}
                          onChange={() => handleSelectJob(job.id)}
                        />
                      </td> */}
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-soft transition-transform group-hover:scale-110">
                            <Briefcase className="w-6 h-6 opacity-40" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-primary mb-1 uppercase tracking-tight">
                              {job.jobTitle}
                            </p>
                            <p className="text-[10px] text-brand-primary/40 flex items-center gap-1.5 font-black uppercase tracking-widest">
                              <Building2 className="w-3 h-3" />{" "}
                              {job.company?.companyName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary/60">
                            <Layers className="w-3 h-3" />{" "}
                            {job.jobCategory?.categoryName}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-primary/40">
                            <MapPin className="w-3 h-3" /> {job.jobType}
                          </div>
                        </div>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                        <div className="space-y-1.5 font-bold">
                          <div className="flex items-center gap-2 text-[11px] text-brand-primary">
                            <IndianRupee className="w-3.5 h-3.5 text-brand-primary" />{" "}
                            {job.stipend === "YES"
                              ? "Paid"
                              : (job.stipend ?? "Unpaid")}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-brand-primary/40">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {job.internshipDuration}
                          </div>
                        </div>
                      </td>
                      {(activeTab === "REVIEW" || activeTab === "") && (
                        <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5">
                          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full w-fit border border-brand-primary/5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-brand-primary">
                              {job.score ?? "N/A"}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="bg-brand-primary/2 px-6 py-5 border-y border-brand-primary/5 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase inline-block ${getStatusStyle(
                            jobStatus,
                          )}`}
                        >
                          {jobStatus}
                        </span>
                      </td>
                      <td className="bg-brand-primary/2 px-6 py-5 rounded-r-3xl border-y border-brand-primary/5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* <button
                            onClick={() => setSelectedJobView(job)}
                            className="p-2 text-brand-primary hover:bg-white rounded-xl transition-all shadow-hover-sm"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button> */}
                          <div className="relative inline-block">
                            {jobStatus !== "REJECTED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(
                                    openDropdownId === job.id ? null : job.id,  
                                  );
                                }}
                                disabled={updatingJobId === job.id}
                                className="p-2 text-brand-primary/40 hover:bg-white rounded-xl transition-all shadow-hover-sm"
                              >
                                {updatingJobId === job.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <MoreVertical className="w-5 h-5" />
                                )}
                              </button>
                            )}  

                            {openDropdownId === job.id && (
                              <div className="absolute right-0  -bottom-12  mb-2 w-44 bg-white rounded-2xl shadow-xl border border-brand-primary/5 py-2 z-10">
                                {jobStatus === "REVIEW" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "APPROVED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-green-600 hover:bg-green-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "REJECTED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                  </>
                                )}

                                {jobStatus === "APPROVED" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "PAUSED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <Clock className="w-3.5 h-3.5" /> Pause
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "COMPLETED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-brand-primary hover:bg-brand-primary/5 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <Layers className="w-3.5 h-3.5" />{" "}
                                      Complete
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "REJECTED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                  </>
                                )}

                                {jobStatus === "PAUSED" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "COMPLETED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-brand-primary hover:bg-brand-primary/5 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <Layers className="w-3.5 h-3.5" />{" "}
                                      Complete
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleStatusUpdate(job.id, "REJECTED")
                                      }
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                  </>
                                )}

                                {jobStatus === "COMPLETED" && (
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(job.id, "REJECTED")
                                    }
                                    className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                  </button>
                                )}

                                {/* No actions for REJECTED */}

                                {jobStatus !== "REJECTED" && (
                                  <>
                                    <div className="h-px bg-brand-primary/5 my-1 mx-2" />
                                    <button
                                      onClick={async () => {
                                        try {
                                          await deleteJobPosition(job.id);
                                          fetchJobs(activeTab, currentPage);
                                        } catch (err) {
                                          console.error(
                                            "Error deleting job:",
                                            err,
                                          );
                                        }
                                      }}
                                      className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-400 hover:bg-red-50 uppercase tracking-wider flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                      Entry
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title={search ? "No results found" : "No jobs in this category"}
              description={
                search
                  ? `We couldn't find any job matching "${search}". Try refining your search terms.`
                  : "There are no jobs currently listed under this status."
              }
              type="search"
              action={
                search
                  ? { label: "Clear Search", onClick: () => setSearch("") }
                  : null
              }
            />
          )}
        </div>

        {/* ─── Pagination ─────────────────────────────────────────────────────── */}
        {!loading && !error && jobs.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-brand-primary/5">
            <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">
              Showing{" "}
              <span className="text-brand-primary/60">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              </span>{" "}
              of <span className="text-brand-primary/60">{totalItems}</span>{" "}
              jobs
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl text-brand-primary/40 hover:bg-brand-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 text-center text-[10px] font-black text-brand-primary/30"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      currentPage === page
                        ? "bg-brand-primary text-white shadow-premium"
                        : "text-brand-primary/40 hover:bg-brand-primary/5"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl text-brand-primary/40 hover:bg-brand-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        // <Modal
        //   isOpen={isRejectModalOpen}
        //   onClose={() => {
        //     setIsRejectModalOpen(false);
        //     setRejectReason("");
        //   }}
        //   title="Reject Job Posting"
        // >
        //   <div className="space-y-4 py-4 px-6">
        //     <div className="p-4 bg-red-50 rounded-2xl flex items-start gap-3 border border-red-100">
        //       <XCircle className="w-5 h-5 text-red-600 shrink-0" />
        //       <div>
        //         <p className="text-xs font-bold text-red-900 uppercase tracking-tight">
        //           You are rejecting: {currentJobToReject?.jobTitle}
        //         </p>
        //         <p className="text-[10px] text-red-700/70 font-medium">
        //           Please provide a reason. This will be shared with the company.
        //         </p>
        //       </div>
        //     </div>
        //     <div>
        //       <label className="block text-[10px] font-black text-brand-primary/40 uppercase tracking-[0.2em] mb-3 ml-1">
        //         Rejection Reason
        //       </label>
        //       <textarea
        //         value={rejectReason}
        //         onChange={(e) => setRejectReason(e.target.value)}
        //         className="w-full bg-brand-primary/3 border border-transparent rounded-2xl p-4 text-sm text-brand-primary placeholder:text-brand-primary/20 focus:bg-white focus:border-brand-primary/10 transition-all min-h-[120px]"
        //         placeholder="E.g., Incomplete job description, skills mismatch, suspicious content..."
        //       />
        //     </div>
        //     <div className="flex gap-3 w-full">
        //       <button
        //         onClick={() => setIsRejectModalOpen(false)}
        //         className="flex-1 py-3 bg-brand-primary/5 text-brand-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
        //       >
        //         Cancel
        //       </button>
        //       <button
        //         onClick={handleRejectSubmit}
        //         disabled={!rejectReason.trim()}
        //         className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-premium hover:bg-red-700 transition-all disabled:opacity-50"
        //       >
        //         Confirm Rejection
        //       </button>
        //     </div>
        //   </div>
        // </Modal>

        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setRejectReason("");
          }}
          title="Reject Job Posting"
          maxWidth="600px"
        >
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-brand-primary leading-tight">
                  Reject this job posting?
                </h4>
                <p className="text-sm text-brand-primary/40 mt-1">
                  You are about to reject the job posting for{" "}
                  <span className="font-bold text-brand-primary">
                    "
                    {currentJobToReject?.jobTitle ||
                      currentJobToReject?.name ||
                      currentJobToReject}
                    "
                  </span>
                  . This will notify the company with your reason.
                </p>

                <div className="flex flex-col gap-2 mt-4 items-start">
                  <label className="block text-[10px] font-black text-brand-primary/40 uppercase tracking-[0.2em] mb-3 ml-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-brand-primary/3 border border-transparent rounded-2xl p-4 text-sm text-brand-primary placeholder:text-brand-primary/20 focus:bg-white focus:border-brand-primary/10 transition-all min-h-[120px]"
                    placeholder="E.g., Incomplete job description, skills mismatch, suspicious content..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                Confirm Rejection
              </button>
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
