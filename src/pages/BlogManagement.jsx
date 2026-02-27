import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deletePost } from '../store/slices/blogSlice';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Edit3,
    Trash2,
    Calendar,
    User as UserIcon,
    Tag,
    Eye,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/modals/Modal';

const BlogManagement = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.blogs);
    const [search, setSearch] = useState('');

    // Delete Confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            dispatch(deletePost(itemToDelete.id));
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        Blog Management
                    </h1>
                    <p className="text-brand-primary/50 text-sm font-medium mt-1">Create and manage articles for the Oppvia community.</p>
                </div>
                <Link
                    to="/blog/create"
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-brand-primary-light hover:shadow-hover transition-all"
                >
                    <Plus className="w-4 h-4" /> Write New Post
                </Link>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft">
                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-brand-primary/5">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
                        <input
                            type="text"
                            placeholder="Search articles or categories..."
                            className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="group flex flex-col h-full bg-white rounded-[32px] border border-brand-primary/5 hover:border-brand-primary/10 hover:shadow-premium transition-all duration-300 overflow-hidden">
                            {/* Image Part */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-primary shadow-sm border border-brand-primary/5">
                                        {post.category}
                                    </span>
                                    {post.isFeatured && (
                                        <span className="px-3 py-1 bg-brand-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                            <Tag className="w-2.5 h-2.5" /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-brand-primary/60 to-transparent flex items-center justify-end gap-2">
                                    <Link to={`/blog/edit/${post.id}`} className="p-2.5 bg-white text-brand-primary rounded-xl shadow-lg hover:scale-110 transition-all">
                                        <Edit3 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={(e) => { e.preventDefault(); setItemToDelete(post); setShowDeleteModal(true); }}
                                        className="p-2.5 bg-white text-red-500 rounded-xl shadow-lg hover:scale-110 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info Part */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-4 text-[9px] font-black text-brand-primary/20 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-40" /> {formatDate(post.date)}</span>
                                        <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5 opacity-40" /> {post.author}</span>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border flex items-center gap-1 ${post.isScheduled
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : post.status === 'PUBLISHED'
                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {post.isScheduled ? <Clock className="w-2.5 h-2.5" /> : post.status === 'PUBLISHED' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                        {post.isScheduled ? 'Scheduled' : post.status}
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-brand-primary leading-tight mb-3 group-hover:text-brand-primary-light transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-xs text-brand-primary/40 font-medium leading-relaxed line-clamp-3 mb-6">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-brand-primary/5 flex items-center justify-between">
                                    <Link to={`/blog/details/${post.id}`} className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-1 hover:gap-2 transition-all">
                                        Read Analysis <Plus className="w-3 h-3" />
                                    </Link>
                                    <div className="flex items-center -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-primary/10 flex items-center justify-center overflow-hidden">
                                            <Avatar placeholder={post.author} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
                            <h4 className="text-lg font-black text-brand-primary leading-tight">Remove this article?</h4>
                            <p className="text-sm text-brand-primary/40 mt-1">
                                You are about to delete <span className="font-bold text-brand-primary">"{itemToDelete?.title}"</span>. This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-6 py-4 bg-brand-primary/5 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
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

// Simple Avatar Component
const Avatar = ({ placeholder }) => (
    <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary">
        {placeholder?.charAt(0)}
    </div>
);

export default BlogManagement;
