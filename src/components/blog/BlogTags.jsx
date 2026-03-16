import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTags, createTag, updateTagAsync, deleteTagAsync } from '../../store/slices/blogSlice';
import {
    Tag,
    Plus,
    Search,
    Edit3,
    Trash2,
    AlertCircle
} from 'lucide-react';
import Modal from '../modals/Modal';

const BlogTags = () => {
    const dispatch = useDispatch();
    const { tags, loading, error } = useSelector((state) => state.blogs);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [newTag, setNewTag] = useState('');
    const [editTag, setEditTag] = useState('');

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    const filteredTags = tags.filter((tag) => {
        if (!tag || typeof tag !== 'object') return false;
        const tagName = tag.tagName || tag.name || '';
        return typeof tagName === 'string' && tagName.length > 0 && tagName.toLowerCase().includes(search.toLowerCase());
    });

    const handleAddTag = async () => {
        if (newTag.trim()) {
            await dispatch(createTag({ tagName: newTag.trim() }));
            dispatch(fetchTags());
            setNewTag('');
            setShowAddModal(false);
        }
    };

    const handleUpdateTag = async () => {
        if (editTag.trim() && itemToEdit) {
            await dispatch(updateTagAsync({ id: itemToEdit.id, tagName: editTag.trim() }));
            dispatch(fetchTags());
            setEditTag('');
            setItemToEdit(null);
            setShowEditModal(false);
        }
    };

    const handleDeleteTag = async () => {
        if (itemToDelete) {
            await dispatch(deleteTagAsync(itemToDelete.id));
            dispatch(fetchTags());
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const openEditModal = (tag) => {
        setItemToEdit(tag);
        setEditTag(tag?.tagName || tag?.name || '');
        setShowEditModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-brand-primary tracking-tight uppercase">
                        Blog Tags
                    </h2>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">
                        Manage your blog post tags.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-brand-primary-light hover:shadow-hover transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Tag
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
                <input
                    type="text"
                    placeholder="Search tags..."
                    className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Tags Grid */}
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
                <div className="flex flex-wrap gap-4">
                    {filteredTags.map((tag, index) => {
                        const tagName = tag.tagName || tag.name || tag;
                        const tagId = tag.id || index;
                        return (
                        <div
                            key={tagId}
                            className="flex items-center gap-3 px-5 py-3 bg-brand-primary/3 rounded-2xl border border-brand-primary/5 hover:border-brand-primary/10 hover:shadow-premium transition-all group"
                        >
                            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                                <Tag className="w-4 h-4 text-brand-primary" />
                            </div>
                            <span className="text-sm font-black text-brand-primary uppercase tracking-wide">
                                {tagName}
                            </span>
                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(tag)}
                                    className="p-1.5 bg-brand-primary/5 text-brand-primary rounded-lg hover:bg-brand-primary/10 hover:scale-110 transition-all"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => { setItemToDelete(tag); setShowDeleteModal(true); }}
                                    className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:scale-110 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
                )}

                {!loading && !error && filteredTags.length === 0 && (
                    <div className="text-center py-12">
                        <Tag className="w-12 h-12 text-brand-primary/20 mx-auto mb-4" />
                        <p className="text-brand-primary/40 text-sm">No tags found.</p>
                    </div>
                )}
            </div>

            {/* Add Tag Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => { setShowAddModal(false); setNewTag(''); }}
                title="Add New Tag"
                maxWidth="400px"
            >
                <div className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2 block">
                            Tag Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter tag name"
                            className="w-full px-4 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowAddModal(false); setNewTag(''); }}
                            className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddTag}
                            className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-brand-primary-light transition-all"
                        >
                            Add Tag
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Tag Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setEditTag(''); setItemToEdit(null); }}
                title="Edit Tag"
                maxWidth="400px"
            >
                <div className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-black text-brand-primary uppercase tracking-widest mb-2 block">
                            Tag Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter tag name"
                            className="w-full px-4 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                            value={editTag}
                            onChange={(e) => setEditTag(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowEditModal(false); setEditTag(''); setItemToEdit(null); }}
                            className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateTag}
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
                onClose={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                title="Confirm Deletion"
                maxWidth="400px"
            >
                <div className="p-8 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-brand-primary leading-tight">Remove this tag?</h4>
                            <p className="text-sm text-brand-primary/40 mt-1">
                                You are about to delete <span className="font-bold text-brand-primary">"{itemToDelete?.tagName || itemToDelete?.name || itemToDelete}"</span>. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                            className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteTag}
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

export default BlogTags;