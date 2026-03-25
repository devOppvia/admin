import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPackages,
  setLoading,
  setError,
} from "../store/slices/subscriptionSlice";
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPackage,
  deleteSubscriptionPlan,
} from "../helper/api_helper";
import {
  Plus,
  X,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

const SubscriptionManagement = () => {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector(
    (state) => state.subscription,
  );

  const [isPackageToggle, setIsPackageToggle] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newPackage, setNewPackage] = useState({
    id: null,
    packageName: "",
    actualPrice: "",
    discountedPrice: "",
    numberOfJobPosting: "",
    numberOfResumeAccess: "",
    jobDaysActive: "",
    expireDaysPackage: "",
    isRecommended: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getSubscriptionPlans();
        if (response.status) {
          dispatch(setPackages(response.data));
        } else {
          dispatch(setError(response.message));
        }
      } catch (err) {
        dispatch(setError(err.message || "Failed to fetch subscription plans"));
      }
    };
    fetchSubscriptionPlans();
  }, [dispatch]);

  const handleOpenModal = (pack = null) => {
    if (pack) {
      setNewPackage(pack);
      setIsEdit(true);
    } else {
      setNewPackage({
        id: null,
        packageName: "",
        actualPrice: "",
        discountedPrice: "",
        numberOfJobPosting: "",
        numberOfResumeAccess: "",
        jobDaysActive: "",
        expireDaysPackage: "",
        isRecommended: false,
      });
      setIsEdit(false);
    }
    setIsPackageToggle(true);
  };

  const handleCloseModal = () => {
    setIsPackageToggle(false);
    setIsEdit(false);
  };

  const validateForm = () => {
    const {
      packageName,
      actualPrice,
      discountedPrice,
      numberOfJobPosting,
      numberOfResumeAccess,
      jobDaysActive,
      expireDaysPackage,
    } = newPackage;

    if (!packageName || packageName.trim().length < 3)
      return "Package name must be at least 3 characters long.";
    if (packageName.trim().length > 20)
      return "Package name cannot exceed 20 characters.";
    if (!/^[A-Za-z\s]+$/.test(packageName))
      return "Package name cannot contain digits or special characters.";
    if (packageName.trim().split(/\s+/).length > 3)
      return "Package name cannot exceed 3 words.";

    if (!actualPrice || isNaN(actualPrice) || Number(actualPrice) <= 0)
      return "Valid Actual Price is required.";
    if (
      !discountedPrice ||
      isNaN(discountedPrice) ||
      Number(discountedPrice) <= 0
    )
      return "Valid Discounted Price is required.";
    if (Number(actualPrice) <= Number(discountedPrice))
      return "Actual Price must be greater than Discounted Price.";

    if (
      !numberOfJobPosting ||
      isNaN(numberOfJobPosting) ||
      Number(numberOfJobPosting) <= 0
    )
      return "Number of Job Postings is required.";
    if (
      !numberOfResumeAccess ||
      isNaN(numberOfResumeAccess) ||
      Number(numberOfResumeAccess) <= 0
    )
      return "Resume Access Limit is required.";
    if (!jobDaysActive || isNaN(jobDaysActive) || Number(jobDaysActive) <= 0)
      return "Job Post Validity is required.";
    if (
      !expireDaysPackage ||
      isNaN(expireDaysPackage) ||
      Number(expireDaysPackage) <= 0
    )
      return "Package Expiry Duration is required.";

    return null;
  };

  const handleSave = async () => {
    try {
      const error = validateForm();
      if (error) {
        toast.error(error);
        return;
      }
    } catch (err) {
      console.error("Validation error:", err);
      toast.error("Validation failed. Please check your inputs.");
      return;
    }

    const payload = {
      ...newPackage,
      actualPrice: Number(newPackage.actualPrice),
      discountedPrice: Number(newPackage.discountedPrice),
      numberOfJobPosting: Number(newPackage.numberOfJobPosting),
      numberOfResumeAccess: Number(newPackage.numberOfResumeAccess),
      jobDaysActive: Number(newPackage.jobDaysActive),
      expireDaysPackage: Number(newPackage.expireDaysPackage),
    };

    try {
      let response;
      if (isEdit) {
        response = await updateSubscriptionPackage(newPackage.id, payload);
      } else {
        response = await createSubscriptionPlan(payload);
      }

      if (response.status) {
        handleCloseModal();
        // Refetch all plans
        const plansResponse = await getSubscriptionPlans();
        if (plansResponse.status) {
          dispatch(setPackages(plansResponse.data));
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save package");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSubscriptionPlan(deleteConfirm.id);
      if (response.status) {
        setDeleteConfirm({ show: false, id: null });
        // Refetch all plans
        const plansResponse = await getSubscriptionPlans();
        if (plansResponse.status) {
          dispatch(setPackages(plansResponse.data));
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete package");
    }
  };

  const filteredPackages = packages.filter((p) =>
    p.packageName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {" "}
      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-20">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-primary/5">
          <div>
            <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase leading-tight">
              Subscription{" "}
              <span className="text-brand-primary/30">Management</span>
            </h1>
            <p className="text-brand-primary/50 text-xs font-black uppercase tracking-widest mt-1">
              Manage Pricing Plans and Packages
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group/search">
              <Search className="w-4 h-4 text-brand-primary/30 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full md:w-64 pl-11 pr-4 py-3.5 bg-white border border-brand-primary/10 rounded-2xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-hover hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Plan
            </button>
          </div>
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-primary/50 font-medium">
              No subscription plans found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-[32px] p-8 border border-brand-primary/5 shadow-soft relative overflow-hidden group hover:border-brand-primary/20 transition-all"
              >
                {/* Recommended Badge */}
                {pack.isRecommended && (
                  <div className="absolute top-0 right-8 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl">
                    Recommended
                  </div>
                )}
                {/* Package Header */}
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-2 border border-brand-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    {pack.packageName}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(pack)}
                      className="p-2 text-brand-primary/40 hover:text-brand-primary bg-brand-primary/0 hover:bg-brand-primary/5 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ show: true, id: pack.id })
                      }
                      className="p-2 text-red-400 hover:text-red-500 bg-red-500/0 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Area */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-black text-brand-primary tracking-tight">
                      ₹{pack.discountedPrice}
                    </h3>
                    {pack.actualPrice > pack.discountedPrice && (
                      <span className="text-sm font-bold text-brand-primary/30 line-through">
                        ₹{pack.actualPrice}
                      </span>
                    )}
                  </div>
                  {pack.sortDescription && (
                    <p className="text-xs font-medium text-brand-primary/50 mt-2 line-clamp-2">
                      {pack.sortDescription}
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                      <Briefcase className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                        Job Postings
                      </p>
                      <p className="text-sm font-bold text-brand-primary">
                        {pack.numberOfJobPosting} Posts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                      <Users className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                        Resume Access
                      </p>
                      <p className="text-sm font-bold text-brand-primary">
                        {pack.numberOfResumeAccess} Views/Job
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                        Job Validity
                      </p>
                      <p className="text-sm font-bold text-brand-primary">
                        {pack.jobDaysActive} Days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-primary/5 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                        Package Expiry
                      </p>
                      <p className="text-sm font-bold text-brand-primary">
                        {pack.expireDaysPackage} Days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}

        {/* Delete Confirmation */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-brand-primary/20 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full border border-brand-primary/10 shadow-premium animate-slideUp text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary mb-2">
                Delete Package?
              </h3>
              <p className="text-xs font-medium text-brand-primary/50 mb-8">
                This action cannot be undone. Any active subscriptions on this
                plan will remain valid until expiry.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 py-3.5 bg-brand-primary/5 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-primary/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3.5 bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isPackageToggle && (
        <div className="fixed inset-0 bg-brand-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-3xl border border-brand-primary/10 shadow-premium overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-brand-primary/5">
              <div>
                <h3 className="text-xl font-black text-brand-primary tracking-tight uppercase">
                  {isEdit ? "Edit" : "Create"}{" "}
                  <span className="text-brand-primary/30">Package</span>
                </h3>
                <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mt-1">
                  Configure subscription tiers
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-3 hover:bg-brand-primary/5 rounded-xl transition-all text-brand-primary/40 hover:text-brand-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 pb-12 max-h-[70vh] overflow-y-auto no-scrollbar">
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Full Width */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Premium Enterprise"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.packageName}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        packageName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                      })
                    }
                  />
                </div>

                {/* Half Width */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Actual Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.actualPrice}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        actualPrice: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Discounted Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.discountedPrice}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        discountedPrice: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Job Postings Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Count"
                    min="0"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.numberOfJobPosting}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        numberOfJobPosting: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Resume Access (Per Job)
                  </label>
                  <input
                    type="number"
                    placeholder="Count"
                    min="0"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.numberOfResumeAccess}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        numberOfResumeAccess: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Job Post Validity (Days)
                  </label>
                  <input
                    type="number"
                    placeholder="Days"
                    min="1"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.jobDaysActive}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        jobDaysActive: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
                    Package Expiry (Days)
                  </label>
                  <input
                    type="number"
                    placeholder="Days"
                    min="1"
                    className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={newPackage.expireDaysPackage}
                    onChange={(e) =>
                      setNewPackage({
                        ...newPackage,
                        expireDaysPackage: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                  />
                </div>

                {/* Is Recommended */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer group/check w-fit">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={newPackage.isRecommended}
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            isRecommended: e.target.checked,
                          })
                        }
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                          newPackage.isRecommended
                            ? "bg-brand-primary border-brand-primary"
                            : "bg-white border-brand-primary/20 group-hover/check:border-brand-primary/40"
                        }`}
                      >
                        {newPackage.isRecommended && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-brand-primary">
                      Mark as Recommended
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                      (shows badge on plan card)
                    </span>
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-brand-primary/5 bg-brand-primary/3 flex justify-end gap-3 rounded-b-[40px]">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3.5 bg-white border border-brand-primary/10 text-brand-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-hover transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />{" "}
                {isEdit ? "Update Package" : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionManagement;
