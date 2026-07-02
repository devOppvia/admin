import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Video,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createInternSubscriptionPlan,
  deleteInternSubscriptionPlan,
  getInternSubscriptionPlans,
  updateInternSubscriptionPlan,
} from "../helper/api_helper";

const INTERVIEW_DURATION_OPTIONS = [
  { value: "MIN_3", label: "3 Minutes" },
  { value: "MIN_15", label: "15 Minutes" },
  { value: "MIN_30", label: "30 Minutes" },
  { value: "MIN_45", label: "45 Minutes" },
  { value: "MIN_60", label: "60 Minutes" },
];

const INTERVIEW_MODE_OPTIONS = [
  { value: "COMPANY", label: "Company Interview" },
  { value: "PRACTICE", label: "Practice Interview" },
];

const IDENTITY_OPTIONS = [
  { value: "ENABLE", label: "Enable" },
  { value: "DISABLE", label: "Disable" },
];

const emptyPlan = {
  id: null,
  planName: "",
  description: "",
  price: "",
  discountedPrice: "",
  isFreePlan: false,
  isDiscount: false,
  interviewCredits: "",
  duration: "",
  interviewDuration: [],
  interviewMode: [],
  interviewType: "",
  identityVerification: [],
  featuresText: "",
  isPopular: false,
};

const formatLabels = (values = [], options = []) =>
  values
    .map((value) => options.find((option) => option.value === value)?.label || value)
    .join(", ");

const MultiCheckbox = ({ label, icon: Icon, options, value, onChange }) => {
  const toggle = (optionValue) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <div className="space-y-3 md:col-span-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-all ${
              value.includes(option.value)
                ? "border-brand-primary bg-brand-primary/5"
                : "border-brand-primary/10 hover:border-brand-primary/20"
            }`}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="w-4 h-4 accent-brand-primary"
            />
            <span className="text-xs font-bold text-brand-primary">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const InternSubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyPlan);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const activePlanCount = plans.filter((plan) => !plan.isDelete).length;
  const canCreatePlan = activePlanCount < 3;

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getInternSubscriptionPlans();
      if (response?.status) {
        setPlans(response.data || []);
      } else {
        toast.error(response?.message || "Failed to fetch interview plans");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to fetch interview plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = useMemo(
    () =>
      plans.filter((plan) =>
        plan.planName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [plans, searchQuery],
  );

  const openModal = (plan = null) => {
    if (!plan && !canCreatePlan) {
      toast.error("Only three interview plans can be created");
      return;
    }

    if (plan) {
      setForm({
        id: plan.id,
        planName: plan.planName || "",
        description: plan.description || "",
        price: plan.price ?? "",
        discountedPrice: plan.isDiscount ? (plan.discountedPrice ?? "") : "",
        isFreePlan: Boolean(plan.isFreePlan),
        isDiscount: Boolean(plan.isDiscount),
        interviewCredits: plan.interviewCredits ?? "",
        duration: plan.duration ?? "",
        interviewDuration: plan.interviewDuration || [],
        interviewMode: plan.interviewMode || [],
        interviewType: plan.interviewType ?? "",
        identityVerification: plan.identityVerification || [],
        featuresText: Array.isArray(plan.features)
          ? plan.features.join("\n")
          : "",
        isPopular: Boolean(plan.isPopular),
      });
      setIsEdit(true);
    } else {
      setForm(emptyPlan);
      setIsEdit(false);
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setForm(emptyPlan);
  };

  const validateForm = () => {
    if (!form.planName.trim()) return "Plan name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.isFreePlan && (!form.price || Number(form.price) <= 0)) {
      return "Price is required";
    }
    if (!form.isFreePlan && form.isDiscount) {
      if (!form.discountedPrice || Number(form.discountedPrice) <= 0) {
        return "Discount price is required";
      }
      if (Number(form.price) <= Number(form.discountedPrice)) {
        return "Price must be greater than discount price";
      }
    }
    if (!form.interviewCredits || Number(form.interviewCredits) <= 0) {
      return "Interview credits is required";
    }
    if (!form.duration || Number(form.duration) <= 0) {
      return "Plan duration is required";
    }
    if (!form.interviewDuration.length) return "Select interview duration";
    if (!form.interviewMode.length) return "Select interview mode";
    if (
      !form.interviewType ||
      Number(form.interviewType) < 1 ||
      Number(form.interviewType) > 9
    ) {
      return "Interview type limit must be between 1 and 9";
    }
    if (!form.identityVerification.length) {
      return "Select identity verification option";
    }
    if (!form.featuresText.trim()) return "Features are required";
    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      planName: form.planName.trim(),
      description: form.description.trim(),
      price: form.isFreePlan ? 0 : Number(form.price),
      discountedPrice: form.isFreePlan
        ? 0
        : form.isDiscount
        ? Number(form.discountedPrice)
        : Number(form.price),
      isFreePlan: form.isFreePlan,
      isDiscount: form.isFreePlan ? false : form.isDiscount,
      interviewCredits: Number(form.interviewCredits),
      duration: Number(form.duration),
      interviewDuration: form.interviewDuration,
      interviewMode: form.interviewMode,
      interviewType: Number(form.interviewType),
      identityVerification: form.identityVerification,
      features: form.featuresText
        .split(/\r?\n|[•·,;|]/)
        .map((feature) => feature.trim())
        .filter(Boolean),
      isPopular: form.isPopular,
    };

    setSaving(true);
    try {
      const response = isEdit
        ? await updateInternSubscriptionPlan(form.id, payload)
        : await createInternSubscriptionPlan(payload);

      if (response?.status) {
        toast.success(isEdit ? "Plan updated" : "Plan created");
        closeModal();
        fetchPlans();
      } else {
        toast.error(response?.message || "Failed to save plan");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteInternSubscriptionPlan(deleteConfirm.id);
      if (response?.status) {
        toast.success("Plan deleted");
        setDeleteConfirm({ show: false, id: null });
        fetchPlans();
      } else {
        toast.error(response?.message || "Failed to delete plan");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete plan");
    }
  };

  return (
    <>


     {modalOpen && (
      <div>
          <div className="absolute top-0 left-0  bottom-0 inset-0 bg-brand-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white h-[80vh] pb-20 rounded-[40px] w-full max-w-4xl border border-brand-primary/10 shadow-premium overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between p-8 border-b border-brand-primary/5">
              <div>
                <h3 className="text-xl font-black text-brand-primary tracking-tight uppercase">
                  {isEdit ? "Edit" : "Create"}{" "}
                  <span className="text-brand-primary/30">Interview Plan</span>
                </h3>
                <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest mt-1">
                  Configure AI interview access
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 hover:bg-brand-primary/5 rounded-xl transition-all text-brand-primary/40 hover:text-brand-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 pb-40 max-h-[72vh] overflow-y-auto no-scrollbar">
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={(e) => e.preventDefault()}
              >
                <TextField
                  label="Plan Name"
                  value={form.planName}
                  onChange={(value) => setForm({ ...form, planName: value })}
                  className="md:col-span-2"
                />
                <TextAreaField
                  label="Description"
                  value={form.description}
                  onChange={(value) => setForm({ ...form, description: value })}
                  className="md:col-span-2"
                />
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.isFreePlan}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFreePlan: e.target.checked,
                        isDiscount: e.target.checked ? false : form.isDiscount,
                        price: e.target.checked ? "0" : form.price,
                        discountedPrice: e.target.checked
                          ? ""
                          : form.discountedPrice,
                      })
                    }
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <span className="text-sm font-bold text-brand-primary">
                    Free Plan
                  </span>
                </label>
                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.isDiscount}
                    disabled={form.isFreePlan}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isDiscount: e.target.checked,
                        discountedPrice: e.target.checked
                          ? form.discountedPrice
                          : "",
                      })
                    }
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <span className="text-sm font-bold text-brand-primary">
                    Is Discount
                  </span>
                </label>

                <NumberField
                  label="Price (₹)"
                  value={form.isFreePlan ? "0" : form.price}
                  onChange={(value) => setForm({ ...form, price: value })}
                  disabled={form.isFreePlan}
                />
                {form.isDiscount && !form.isFreePlan && (
                  <NumberField
                    label="Discount Price (₹)"
                    value={form.discountedPrice}
                    onChange={(value) =>
                      setForm({ ...form, discountedPrice: value })
                    }
                  />
                )}
                <NumberField
                  label="Interview Credits"
                  value={form.interviewCredits}
                  onChange={(value) =>
                    setForm({ ...form, interviewCredits: value })
                  }
                />
                <NumberField
                  label="Plan Duration (Days)"
                  value={form.duration}
                  onChange={(value) => setForm({ ...form, duration: value })}
                />

                <MultiCheckbox
                  label="Interview Duration"
                  icon={Clock}
                  options={INTERVIEW_DURATION_OPTIONS}
                  value={form.interviewDuration}
                  onChange={(value) =>
                    setForm({ ...form, interviewDuration: value })
                  }
                />
                <MultiCheckbox
                  label="Interview Mode"
                  icon={Video}
                  options={INTERVIEW_MODE_OPTIONS}
                  value={form.interviewMode}
                  onChange={(value) =>
                    setForm({ ...form, interviewMode: value })
                  }
                />
                <NumberField
                  label="Interview Type Limit"
                  value={form.interviewType}
                  onChange={(value) => setForm({ ...form, interviewType: value })}
                  min="1"
                  max="9"
                />
                <MultiCheckbox
                  label="Identity Verification"
                  icon={ShieldCheck}
                  options={IDENTITY_OPTIONS}
                  value={form.identityVerification}
                  onChange={(value) =>
                    setForm({ ...form, identityVerification: value })
                  }
                />

                <TextAreaField
                  label="Features"
                  value={form.featuresText}
                  onChange={(value) => setForm({ ...form, featuresText: value })}
                  placeholder="Write one feature per line or separate with commas"
                  className="md:col-span-2"
                />

                <label className="md:col-span-2 flex items-center gap-3 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) =>
                      setForm({ ...form, isPopular: e.target.checked })
                    }
                    className="w-4 h-4 accent-brand-primary"
                  />
                  <span className="text-sm font-bold text-brand-primary">
                    Mark as Popular
                  </span>
                </label>
              </form>
            </div>

            <div className="absolute w-full bg-white bottom-0 p-6 border-t border-brand-primary/5 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-brand-primary/5 text-brand-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-60"
              >
                {saving ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-primary/5">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase leading-tight">
            Interview{" "}
            <span className="text-brand-primary/30">Plans</span>
          </h1>
          <p className="text-brand-primary/50 text-xs font-black uppercase tracking-widest mt-1">
            Manage AI interview plans
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group/search">
            <Search className="w-4 h-4 text-brand-primary/30 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="Search plans..."
              className="w-full md:w-64 pl-11 pr-4 py-3.5 bg-white border border-brand-primary/10 rounded-2xl text-xs font-bold text-brand-primary placeholder:text-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => openModal()}
            disabled={!canCreatePlan}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Plus className="w-4 h-4" /> Add Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-primary/50 font-medium">
            No interview plans found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const payablePrice = plan.isFreePlan
              ? 0
              : plan.isDiscount
              ? plan.discountedPrice
              : plan.price;

            return (
              <div
                key={plan.id}
                className="bg-white rounded-[32px] p-8 border border-brand-primary/5 shadow-soft relative overflow-hidden group hover:border-brand-primary/20 transition-all"
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-8 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl">
                    Popular
                  </div>
                )}
                {plan.isFreePlan && (
                  <div className="absolute top-0 left-8 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl">
                    Free
                  </div>
                )}
                {plan.isDelete && (
                  <div className="absolute top-0 left-8 bg-red-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-b-xl">
                    Deleted
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-2 border border-brand-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    {plan.planName}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(plan)}
                      className="p-2 text-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ show: true, id: plan.id })
                      }
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-black text-brand-primary tracking-tight">
                      {plan.isFreePlan ? "FREE" : `₹${payablePrice}`}
                    </h3>
                    {plan.isDiscount && !plan.isFreePlan && (
                      <span className="text-sm font-bold text-brand-primary/30 line-through">
                        ₹{plan.price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-brand-primary/50 mt-2 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <InfoRow
                    icon={Video}
                    label="Credits"
                    value={`${plan.interviewCredits} Interviews`}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Validity"
                    value={`${plan.duration} Days`}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Durations"
                    value={formatLabels(
                      plan.interviewDuration,
                      INTERVIEW_DURATION_OPTIONS,
                    )}
                  />
                  <InfoRow
                    icon={Sparkles}
                    label="Modes"
                    value={formatLabels(
                      plan.interviewMode,
                      INTERVIEW_MODE_OPTIONS,
                    )}
                  />
                  <InfoRow
                    icon={Sparkles}
                    label="Type Selection"
                    value={`Up to ${plan.interviewType || 1} types`}
                  />
                  <InfoRow
                    icon={ShieldCheck}
                    label="Identity"
                    value={formatLabels(
                      plan.identityVerification,
                      IDENTITY_OPTIONS,
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-brand-primary/20 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full border border-brand-primary/10 shadow-premium animate-slideUp text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-brand-primary mb-2">
              Delete Plan?
            </h3>
            <p className="text-xs font-medium text-brand-primary/50 mb-8">
              This will permanently delete the plan.
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
    </>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-brand-primary/5 rounded-xl">
      <Icon className="w-4 h-4 text-brand-primary" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
        {label}
      </p>
      <p className="text-sm font-bold text-brand-primary">{value || "-"}</p>
    </div>
  </div>
);

const TextField = ({ label, value, onChange, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
      {label}
    </label>
    <input
      type="text"
      className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const NumberField = ({ label, value, onChange, min = "1", max, disabled = false }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
      {label}
    </label>
    <input
      type="number"
      min={min}
      max={max}
      disabled={disabled}
      className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) =>
        ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
      }
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
}) => (
  <div className={`space-y-3 ${className}`}>
    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 ml-1">
      {label}
    </label>
    <textarea
      rows={4}
      placeholder={placeholder}
      className="w-full p-4 bg-brand-primary/3 border border-transparent rounded-2xl text-sm font-bold text-brand-primary focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default InternSubscriptionManagement;
