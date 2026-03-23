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
  generateSubCategory,
  getJobCategory,
  getJobSubCategory,
  updateJobCategory,
  updateJobSubCategory,
} from "../helper/api_helper";
import Checkbox from "../components/common/Checkbox";
import toast from "react-hot-toast";
const TABS = [
  { key: "CATEGORIES", name: "Categories", icon: LayoutGrid },
  { key: "SUBCATEGORIES", name: "Sub-Categories", icon: Layers },
];

const TaxonomyManagement = () => {
  const dispatch = useDispatch();
  const { categories, subCategories } = useSelector((state) => state.taxonomy);
  const [activeTab, setActiveTab] = useState("CATEGORIES");

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

  const [categoryPage, setCategoryPage] = useState(1);
  const [subCategoryPage, setSubCategoryPage] = useState(1);
  const itemsPerPage = 10;
  const [totalCategoryPages, setTotalCategoryPages] = useState(1);
  const [totalSubCategoryPages, setTotalSubCategoryPages] = useState(1);

  // AI Suggestion States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  // Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const currentTabTitle = useMemo(
    () => TABS.find((t) => t.key === activeTab).name.slice(0, -1),
    [activeTab],
  );

  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true);
      const res = await generateSubCategory(newItem.categoryId);
      setAiSuggestions(res.data);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  const toggleSuggestion = (suggestion) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestion)
        ? prev.filter((s) => s !== suggestion)
        : [...prev, suggestion],
    );
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);

    if (activeTab === "CATEGORIES") {
      setNewItem({
        categoryName: item.categoryName,
        categoryId: "",
        subCategoryId: "",
      });
    } else if (activeTab === "SUBCATEGORIES") {
      setNewItem({
        categoryName: item.name || item.subCategoryName,
        categoryId: item.jobCategory.id?.toString() || "",
        subCategoryId: item.id?.toString() || "",
      });
    }

    setShowAddModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        if (activeTab === "CATEGORIES") {
          await updateJobCategory(editingId, newItem.categoryName);
          fetchJobCategory(categoryPage);
        } else if (activeTab === "SUBCATEGORIES") {
          await updateJobSubCategory(
            editingId,
            newItem.categoryName,
            newItem.categoryId,
          );
          fetchJobSubCategory(newItem.categoryId, subCategoryPage);
        }
      } else {
        const itemsToAdd =
          selectedSuggestions.length > 0
            ? selectedSuggestions
            : [newItem.categoryName];

        for (const name of itemsToAdd) {
          if (!name?.trim()) continue;

          if (activeTab === "CATEGORIES") {
            await createJobCategory({
              categoryName: name,
              currentPage: categoryPage,
              itemsPerPage: itemsPerPage,
            });
            fetchJobCategory(categoryPage);
          }

          if (activeTab === "SUBCATEGORIES") {
            await createJobSubCategory({
              subCategoryName: { subCategoryName: [name] },
              jobCategoryId: newItem.categoryId,
            });
            fetchJobSubCategory(newItem.categoryId, subCategoryPage);
          }
        }
      }

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (activeTab === "CATEGORIES") {
        await deleteJobCategory(itemToDelete);
        fetchJobCategory(categoryPage);
      } else if (activeTab === "SUBCATEGORIES") {
        await deleteJobSubCategory(itemToDelete);
        fetchJobSubCategory(itemToDelete.categoryId, subCategoryPage);
      }

      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err);
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

  const fetchJobCategory = async (page = 1) => {
    try {
      const res = await getJobCategory(page, itemsPerPage);

      dispatch(setCategories(res.data.jobCategories));

      const total = res.data.totalCategories;
      setTotalCategoryPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobSubCategory = async (categoryId, page = 1) => {
    try {
      const res = await getJobSubCategory(categoryId, page, itemsPerPage);

      dispatch(setSubCategories(res.data.jobSubCategories));

      const total = res.data.totalSubCategories;
      setTotalSubCategoryPages(Math.ceil(total / itemsPerPage));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sub) =>
      sub.subCategoryName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [subCategories, searchTerm]);

  useEffect(() => {
    if (activeTab === "CATEGORIES") {
      fetchJobCategory(categoryPage);
    }
  }, [activeTab, categoryPage]);

  useEffect(() => {
    if (activeTab === "SUBCATEGORIES") {
      fetchJobSubCategory("", subCategoryPage);
    }
  }, [activeTab, subCategoryPage]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
            Job Taxonomy
          </h1>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            Define structural categories and skills used across the platform.
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
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-3 rounded-[32px] border border-brand-primary/5 shadow-soft">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center mb-2 justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === tab.key
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "text-brand-primary/50 hover:bg-brand-primary/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon
                    className={`w-5 h-5 ${activeTab === tab.key ? "text-white" : "opacity-40"}`}
                  />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {tab.name}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform ${activeTab === tab.key ? "opacity-100" : ""}`}
                />
              </button>
            ))}
          </div>

          {/* <div className="bg-brand-primary p-6 rounded-[32px] shadow-soft relative overflow-hidden group">
                        <Sparkles className="w-12 h-12 text-white/5 absolute -right-2 -bottom-2 group-hover:scale-125 transition-transform duration-700" />
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">AI Assistant</p>
                        <h4 className="text-sm font-black text-white mb-3 leading-tight">Generate missing skills automatically</h4>
                        <button className="w-full py-2.5 bg-white/10 text-white border border-white/10 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-premium hover:bg-white/20 transition-all">
                            Run AI Tool
                        </button>
                    </div> */}
        </div>

        {/* List View */}
        <div className="lg:col-span-9 bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft min-h-[600px]">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-primary/5">
            <h3 className="text-xl font-black text-brand-primary tracking-tight">
              {TABS.find((t) => t.key === activeTab).name}{" "}
              <span className="text-brand-primary/20 ml-2">LIST</span>
            </h3>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
              <input
                type="text"
                placeholder="Fast search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-brand-primary/3 border-none rounded-xl text-xs font-bold w-48 focus:w-64 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === "CATEGORIES" &&
              filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-5 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl flex items-center justify-between group hover:border-brand-primary/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-primary/5 shadow-soft">
                      <LayoutGrid className="w-5 h-5 text-brand-primary/40" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm break-words sm:max-w-24 md:max-w-24 lg:max-w-60 font-black text-brand-primary tracking-tight mb-1">
                        {cat.categoryName}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />{" "}
                          {formatDate(cat.createdAt)}
                        </p>
                        {/* <div className="w-1 h-1 bg-brand-primary/10 rounded-full" />
                        <p className="text-[9px] font-black text-green-600/60 uppercase tracking-widest">
                          {cat.subCategoriesCount}
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 text-brand-primary/40 hover:text-brand-primary transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(cat);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {activeTab === "SUBCATEGORIES" &&
              filteredSubCategories.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl flex items-center justify-between group hover:border-brand-primary/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-primary/5 shadow-soft">
                      <Layers className="w-5 h-5 text-brand-primary/40" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-brand-primary tracking-tight mb-1">
                        {sub.subCategoryName}
                      </p>
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black text-brand-primary/40 uppercase tracking-widest">
                          In {sub.jobCategory?.categoryName}
                        </p>
                        <div className="w-1 h-1 bg-brand-primary/10 rounded-full" />

                        <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />{" "}
                          {formatDate(sub.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-2 text-brand-primary/40 hover:text-brand-primary transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(sub);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {activeTab === "CATEGORIES" && (
            <Pagination
              currentPage={categoryPage}
              totalPages={totalCategoryPages}
              onPageChange={setCategoryPage}
            />
          )}

          {activeTab === "SUBCATEGORIES" && (
            <Pagination
              currentPage={subCategoryPage}
              totalPages={totalSubCategoryPages}
              onPageChange={setSubCategoryPage}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={
          isEditing ? `Edit ${currentTabTitle}` : `Add New ${currentTabTitle}`
        }
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            {/* Parent Category Selection (for Subs and Skills) */}
            {activeTab === "SUBCATEGORIES" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest ml-1">
                  Select Parent Category
                </label>
                <select
                  className="w-full p-4 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl text-sm font-black text-brand-primary focus:bg-white focus:border-brand-primary/10 transition-all outline-none appearance-none"
                  value={newItem.categoryId || newItem?.jobCategory?.id}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      categoryId: e.target.value,
                      subCategoryId: "",
                    })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Main Interaction UI: Manual or AI */}
            <div className="space-y-4 pt-4 border-t border-brand-primary/5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                  {currentTabTitle} Name
                </label>
                {!isEditing && activeTab === "SUBCATEGORIES" && (
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={
                      isGenerating ||
                      (activeTab === "SKILLS" && !newItem.subCategoryId) ||
                      (activeTab === "SUBCATEGORIES" && !newItem.categoryId)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary-light transition-all disabled:opacity-30"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    Generate Suggestions
                  </button>
                )}
              </div>

              {/* Manual Input */}
              {selectedSuggestions.length === 0 && (
                <input
                  type="text"
                  placeholder={`Enter ${currentTabTitle.toLowerCase()} name...`}
                  className="w-full p-4 bg-brand-primary/2 border border-brand-primary/5 rounded-2xl text-sm font-black text-brand-primary placeholder:text-brand-primary/20 focus:bg-white focus:border-brand-primary/10 transition-all outline-none"
                  value={newItem?.categoryName}
                  onChange={(e) =>
                    setNewItem({ ...newItem, categoryName: e.target.value })
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
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !newItem?.categoryName?.trim() &&
                selectedSuggestions.length === 0
              }
              className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isEditing
                ? "Save Changes"
                : selectedSuggestions.length > 1
                  ? `Save ${selectedSuggestions.length} Entries`
                  : "Save Entry"}
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
                  "{itemToDelete?.name}"
                </span>
                .
                {activeTab === "CATEGORIES" &&
                  " This will also remove any linked sub-categories."}
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

export default TaxonomyManagement;

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
