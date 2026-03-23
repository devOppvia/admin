import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategories,
  setSubCategories,
} from "../store/slices/taxonomySlice";
import {
  LayoutGrid,
  Layers,
  Tag,
  Plus,
  ChevronRight,
  Sparkles,
  Search,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle2,
  Wand2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Modal from "../components/modals/Modal";
import {
  createJobCategory,
  createJobSubCategory,
  deleteJobCategory,
  deleteJobSubCategory,
  getJobCategory,
  getJobSkills,
  getJobSubCategory,
  updateJobCategory,
  updateJobSubCategory,
} from "../helper/api_helper";

import {
  createJobSkills,
  updateJobSkills,
  deleteJobSkill,
} from "../helper/api_helper";
import toast from "react-hot-toast";

const SkillsManagement = () => {
  const dispatch = useDispatch();
  const { categories, subCategories } = useSelector((state) => state.taxonomy);

  const [formData, setFormData] = useState({
    skillName: "",
    jobCategoryId: "",
    jobSubCategoryId: "",
  });
  const [skills, setSkills] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  // Form/Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({
    categoryName: "",
    categoryId: "",
    subCategoryId: "",
  });

  // AI Suggestion States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  // Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const toggleSuggestion = (suggestion) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestion)
        ? prev.filter((s) => s !== suggestion)
        : [...prev, suggestion],
    );
  };

  const handleOpenEdit = (skill) => {
    setIsEditing(true);
    setEditingId(skill.id);

    setFormData({
      skillName: skill.skillName,
      jobCategoryId: skill.jobCategory?.id,
      jobSubCategoryId: skill.jobSubCategory?.id,
    });

    setShowAddModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateJobSkills(editingId, {
          jobCategoryId: formData.jobCategoryId,
          jobSubCategoryId: formData.jobSubCategoryId,
          skillName: formData.skillName,
        });
      } else {
        await createJobSkills({
          skillName: [formData.skillName],
          jobCategoryId: formData.jobCategoryId,
          jobSubCategoryId: formData.jobSubCategoryId,
        });
      }

      fetchSkills(page);
      setShowAddModal(false);
      resetForm();
      setFormData({
        skillName: "",
        jobCategoryId: "",
        jobSubCategoryId: "",
      });
    } catch (err) {
      toast.error(err);
      console.log("eror is. : ", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteJobSkill(itemToDelete);

      fetchSkills(page);

      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err);

      console.log(err);
    }
  };

  const resetForm = () => {
    setNewItem({
      categoryName: "",
      categoryId: "",
      subCategoryId: "",
    });
    setAiSuggestions([]);
    setSelectedSuggestions([]);
    setIsEditing(false);
    setEditingId(null);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) =>
      skill.skillName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [skills, searchTerm]);

  const fetchJobCategory = async (page = 1) => {
    try {
      const res = await getJobCategory(page, itemsPerPage);

      dispatch(setCategories(res.data.jobCategories));

      const total = res.data.totalCategories;
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobSubCategory = async (categoryId, page = 1) => {
    try {
      const res = await getJobSubCategory(categoryId, page, itemsPerPage);

      dispatch(setSubCategories(res.data.jobSubCategories));

      const total = res.data.totalSubCategories;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSkills = async (page = 1) => {
    try {
      const payload = {
        jobCategoryId: "",
        jobSubCategoryId: "",
        currentPage: page,
        itemsPerPage: itemsPerPage,
      };

      const res = await getJobSkills(payload);

      setSkills(res.data.skills);
      setTotalPages(Math.ceil(res.data.totalSkills / itemsPerPage));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchJobCategory(1);
  }, []);

  useEffect(() => {
    fetchJobSubCategory("");
  }, []);

  useEffect(() => {
    fetchSkills(page);
  }, [page]);
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
            Skills management
          </h1>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            Define skills used across the platform.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-brand-primary-light transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}

        {/* List View */}
        <div className="lg:col-span-9 bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl flex items-center justify-between group hover:border-brand-primary/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-primary/5 shadow-soft">
                    <LayoutGrid className="w-5 h-5 text-brand-primary/40" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-black text-brand-primary tracking-tight">
                      {skill.skillName}
                    </p>

                    <p className="text-xs text-brand-primary/50">
                      {skill.jobCategory?.categoryName}
                    </p>

                    <p className="text-xs text-brand-primary/40">
                      {skill.jobSubCategory?.subCategoryName}
                    </p>

                    <p className="text-[9px] text-brand-primary/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(skill.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-2 text-brand-primary/40 hover:text-brand-primary"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setItemToDelete(skill);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-500/40 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          resetForm();

          setFormData({
            skillName: "",
            jobCategoryId: "",
            jobSubCategoryId: "",
          });
          setShowAddModal(false);
        }}
        title={isEditing ? `Edit Skill` : `Add New Skill`}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            {/* Main Interaction UI: Manual or AI */}
            <div className="space-y-4 pt-4 border-t border-brand-primary/5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                  Skill Name
                </label>
              </div>
              <select
                className="w-full p-4 rounded-xl border"
                value={formData.jobCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, jobCategoryId: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-4 rounded-xl border"
                value={formData.jobSubCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, jobSubCategoryId: e.target.value })
                }
                required
              >
                <option value="">Select SubCategory</option>

                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subCategoryName}
                  </option>
                ))}
              </select>

              {/* Manual Input */}
              {selectedSuggestions.length === 0 && (
                <input
                  type="text"
                  placeholder={`Enter Skill name...`}
                  className="w-full p-4 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl text-sm font-black text-brand-primary placeholder:text-brand-primary/20 focus:bg-white focus:border-brand-primary/10 transition-all outline-none"
                  value={formData.skillName}
                  onChange={(e) =>
                    setFormData({ ...formData, skillName: e.target.value })
                  }
                  required={selectedSuggestions.length === 0}
                />
              )}

              {/* AI Suggestions List */}
              {!isEditing && aiSuggestions.length > 0 && (
                <div className="space-y-3 animate-slideDown">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-brand-primary-light uppercase tracking-widest italic">
                      AI Suggested Results:
                    </span>
                    {selectedSuggestions.length > 0 && (
                      <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">
                        {selectedSuggestions.length} Selected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => toggleSuggestion(suggestion)}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          selectedSuggestions.includes(suggestion)
                            ? "bg-brand-primary/5 border-brand-primary/20 ring-1 ring-brand-primary/10"
                            : "bg-white border-brand-primary/5 hover:border-brand-primary/20"
                        }`}
                      >
                        <Checkbox
                          checked={selectedSuggestions.includes(suggestion)}
                          onChange={() => {}}
                        />
                        <span
                          className={`text-[10px] font-bold ${selectedSuggestions.includes(suggestion) ? "text-brand-primary" : "text-brand-primary/60"}`}
                        >
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-brand-primary/5">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormData({ skillName: "", jobCategoryId: "", jobSubCategoryId: "" });
                setShowAddModal(false);
              }}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !formData.skillName?.trim() ||
                !formData.jobCategoryId ||
                !formData.jobSubCategoryId
              }
              className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? "Save Changes" : "Save Entry"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              <h4 className="text-lg font-black text-brand-primary leading-tight">
                Are you absolutely sure?
              </h4>
              <p className="text-sm text-brand-primary/40 mt-1">
                You are about to delete{" "}
                <span className="font-bold text-brand-primary">
                  "{itemToDelete?.skillName}"{" "}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              No, Keep it
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsManagement;

{
  /* Pagination Component - add this above your return */
}
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const btnBase =
    "min-w-[36px] h-9 rounded-xl border border-brand-primary/10 bg-white text-[11px] font-black text-brand-primary/50 hover:bg-brand-primary/5 hover:text-brand-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed px-3";
  const activeBtn =
    "min-w-[36px] h-9 rounded-xl bg-brand-primary text-white text-[11px] font-black px-3";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-brand-primary/5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={btnBase}
      >
        ← Prev
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`dots-${i}`}
            className="text-brand-primary/30 text-[11px] font-black px-1"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? activeBtn : btnBase}
          >
            {page}
          </button>
        ),
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={btnBase}
      >
        Next →
      </button>
    </div>
  );
};
