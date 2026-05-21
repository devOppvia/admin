import { useState, useEffect, useCallback } from "react";
import { Building2, Search, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { getPendingProfileCompaniesApi } from "../helper/api_helper";
import EmptyState from "../components/common/EmptyState";

const ITEMS_PER_PAGE = 10;

const IncompleteProfileCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchCompanies = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPendingProfileCompaniesApi(page, ITEMS_PER_PAGE);
      setCompanies(response?.data ?? []);
      setPagination(response?.pagination ?? { total: 0, totalPages: 1 });
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage, fetchCompanies]);

  const filteredCompanies = companies.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.companyName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.hrAndRecruiterName?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
            Incomplete Profile Companies
          </h1>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            Companies that registered but haven't completed their profile.
          </p>
        </div>
        <div className="px-5 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest">
              Total Pending
            </p>
            <p className="text-lg font-black text-amber-700 leading-none">
              {pagination.total}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
        {/* Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-brand-primary/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No incomplete profiles found"
              description={
                search
                  ? "Try adjusting your search criteria"
                  : "All registered companies have completed their profiles"
              }
            />
          ) : (
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em]">
                  <th className="text-left px-6 py-2">#</th>
                  <th className="text-left px-6 py-2">Company</th>
                  <th className="text-left px-6 py-2">Contact Person</th>
                  <th className="text-left px-6 py-2">Email</th>
                  <th className="text-left px-6 py-2">Phone</th>
                  <th className="text-left px-6 py-2">Registered On</th>
                  <th className="text-left px-6 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((item, index) => (
                  <tr
                    key={item.id}
                    className="group hover:scale-[1.01] transition-transform duration-300"
                  >
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 rounded-l-[24px] border-y border-l border-brand-primary/5">
                      <span className="text-xs font-black text-brand-primary/30">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </span>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-brand-primary/5 overflow-hidden shrink-0">
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-4 h-4 text-brand-primary/40" />
                          )}
                        </div>
                        <span className="text-sm font-black text-brand-primary whitespace-nowrap">
                          {item.companyName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                      <div>
                        <p className="text-sm font-semibold text-brand-primary">
                          {item.hrAndRecruiterName || "—"}
                        </p>
                        {item.designation && (
                          <p className="text-xs text-brand-primary/40 mt-0.5">
                            {item.designation}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                      <div className="flex items-center gap-2 text-brand-primary/60">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-medium">{item.email || "—"}</span>
                        {item.isEmailVerified && (
                          <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-green-100">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                      <div className="flex items-center gap-2 text-brand-primary/60">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-medium">
                          {item.phoneNumber
                            ? `${item.countryCode || ""} ${item.phoneNumber}`
                            : "—"}
                        </span>
                        {item.isMobileVerified && (
                          <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-green-100">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 border-y border-brand-primary/5">
                      <div className="flex items-center gap-2 text-brand-primary/50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="bg-brand-primary/2 group-hover:bg-brand-primary/4 px-6 py-5 rounded-r-[24px] border-y border-r border-brand-primary/5">
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                        Incomplete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-8 mt-4 border-t border-brand-primary/5">
            <p className="text-xs font-medium text-brand-primary/40">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of{" "}
              {pagination.total} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-xs text-brand-primary/30"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        currentPage === p
                          ? "bg-brand-primary text-white shadow-premium"
                          : "text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncompleteProfileCompanies;
