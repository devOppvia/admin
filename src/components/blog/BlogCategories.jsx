import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategoryAsync,
  deleteCategoryAsync,
} from "../../store/slices/blogSlice";
import {
  FolderOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Modal from "../modals/Modal";

const BlogCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.blogs);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter((cat) => {
    const categoryName = cat.name || cat.categoryName || cat;
    return (
      typeof categoryName === "string" &&
      categoryName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await dispatch(createCategory({ categoryName: newCategory.trim() }));
      dispatch(fetchCategories());
      setNewCategory("");
      setShowAddModal(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (editCategory.trim() && itemToEdit) {
      await dispatch(
        updateCategoryAsync({
          id: itemToEdit.id,
          categoryName: editCategory.trim(),
        }),
      );
      setEditCategory("");
      setItemToEdit(null);
      setShowEditModal(false);
      dispatch(fetchCategories());
    }
  };

  const handleDeleteCategory = async () => {
    if (itemToDelete) {
      await dispatch(deleteCategoryAsync(itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
      dispatch(fetchCategories());
    }
  };

  const openEditModal = (category) => {
    setItemToEdit(category);
    setEditCategory(category.categoryName || category);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-brand-primary tracking-tight uppercase">
            Blog Categories
          </h2>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            Manage your blog post categories.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-brand-primary-light hover:shadow-hover transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
        <input
          type="text"
          placeholder="Search categories..."
          className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Grid */}
      <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            {filteredCategories.map((category, index) => {
              const categoryName = category.categoryName || category;
              const categoryId = category.id || index;
              return (
                <div
                  key={categoryId}
                  className="flex items-center justify-between p-5 bg-brand-primary/3 rounded-2xl border border-brand-primary/5 hover:border-brand-primary/10 hover:shadow-premium transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-sm font-black text-brand-primary uppercase tracking-wide">
                      {categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary/10 hover:scale-110 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(category);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-110 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-brand-primary/20 mx-auto mb-4" />
            <p className="text-brand-primary/40 text-sm">
              No categories found.
            </p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewCategory("");
        }}
        title="Add New Category"
        maxWidth="400px"
      >
        <div className="p-8 space-y-6">
          <div>
            <label className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2 block">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewCategory("");
              }}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-brand-primary-light transition-all"
            >
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditCategory("");
          setItemToEdit(null);
        }}
        title="Edit Category"
        maxWidth="400px"
      >
        <div className="p-8 space-y-6">
          <div>
            <label className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2 block">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className="w-full px-4 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditCategory("");
                setItemToEdit(null);
              }}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCategory}
              className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-brand-primary-light transition-all"
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
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
                Remove this category?
              </h4>
              <p className="text-sm text-brand-primary/40 mt-1">
                You are about to delete{" "}
                <span className="font-bold text-brand-primary">
                  "{itemToDelete?.categoryName || itemToDelete?.name || itemToDelete}"
                </span>
                . This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setItemToDelete(null);
              }}
              className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCategory}
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

export default BlogCategories;
