import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addPost, updatePost } from '../store/slices/blogSlice';
import { Editor } from '@tinymce/tinymce-react';
import {
    Save,
    X,
    Upload,
    ChevronLeft,
    Image as ImageIcon,
    Type,
    Layers,
    Tag,
    Eye,
    CheckCircle2,
    Clock,
    Globe,
    Search as SearchIcon,
    Calendar,
    Layout
} from 'lucide-react';

const CreateBlogPost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { posts, categories } = useSelector((state) => state.blogs);

    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: null,
        status: 'PUBLISHED',
        excerpt: '',
        isFeatured: false,
        slug: '',
        metaTitle: '',
        metaDescription: '',
        altTag: '',
        isScheduled: false,
        scheduledDate: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (isEdit && posts.length > 0) {
            const post = posts.find(p => p.id === Number(id));
            if (post) {
                setFormData(prev => ({
                    ...prev,
                    ...post,
                    image: post.image || null,
                    slug: post.slug || '',
                    metaTitle: post.metaTitle || '',
                    metaDescription: post.metaDescription || '',
                    altTag: post.altTag || '',
                    isScheduled: post.isScheduled || false,
                    scheduledDate: post.scheduledDate || ''
                }));
                if (post.image && typeof post.image === 'string') {
                    setImagePreview(post.image);
                }
            }
        }
    }, [id, posts, isEdit]);

    // TinyMCE configuration is handled in-line within the Editor component

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (status = 'PUBLISHED') => {
        if (!formData.title || !formData.category) {
            alert('Please fill in required fields');
            return;
        }

        console.log('Saving post with status:', status);

        const postData = {
            ...formData,
            status,
            date: isEdit ? formData.date : new Date().toISOString().split('T')[0],
            author: isEdit ? formData.author : 'Admin',
            image: imagePreview || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop',
            id: isEdit ? Number(id) : Date.now()
        };

        if (isEdit) {
            dispatch(updatePost(postData));
        } else {
            dispatch(addPost(postData));
        }
        navigate('/blog');
    };

    // TinyMCE handles its own modules and toolbar via the init prop

    return (
        <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-primary/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/blog')}
                        className="p-3 bg-white border border-brand-primary/10 rounded-2xl text-brand-primary hover:bg-brand-primary/5 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase leading-tight">
                            {isEdit ? 'Edit' : 'Write New'} <span className="text-brand-primary/30">Post</span>
                        </h1>
                        <p className="text-brand-primary/50 text-xs font-black uppercase tracking-widest mt-1">
                            {isEdit ? `Modifying: ${formData.title}` : 'Create impactful content for the community'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave('DRAFT')}
                        className="px-6 py-3.5 bg-white border border-brand-primary/10 text-brand-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary/5 transition-all flex items-center gap-2"
                    >
                        <Clock className="w-4 h-4" /> Save as Draft
                    </button>
                    <button
                        onClick={() => handleSave('PUBLISHED')}
                        className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-hover transition-all flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Publish Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Title Input */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-6">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                <Type className="w-3.5 h-3.5" /> Post Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter a catchy title..."
                                className="w-full text-2xl font-black text-brand-primary placeholder:text-brand-primary/10 border-none bg-transparent focus:ring-0 p-0"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4 pt-6 border-t border-brand-primary/5">
                            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                <Layers className="w-3.5 h-3.5" /> Content Description
                            </label>
                            <div className="quill-premium-wrapper min-h-[400px]">
                                <Editor
                                    apiKey='mhxnknaao8r4wkfysoxbma6z3498wxmt7i7o5f3h8luxf91a' // User can add their key here
                                    onInit={(evt, editor) => quillRef.current = editor}
                                    value={formData.description}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; color:#005A5B }',
                                        branding: false,
                                        promotion: false,
                                        skin: 'oxide',
                                        content_css: 'default',
                                        border: 'none'
                                    }}
                                    onEditorChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO & Meta Information */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-8">
                        <div className="flex items-center justify-between border-b border-brand-primary/5 pb-4">
                            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">SEO & Meta Information</h3>
                            <Globe className="w-4 h-4 text-brand-primary/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                    <Globe className="w-3.5 h-3.5" /> URL Slug
                                </label>
                                <input
                                    type="text"
                                    placeholder="post-url-slug"
                                    className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-bold text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                    <SearchIcon className="w-3.5 h-3.5" /> Meta Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter meta title..."
                                    className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-bold text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                Meta Description
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Enter meta description for search engines..."
                                className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-medium text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none resize-none"
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                            Short Excerpt
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Write a brief summary of this post..."
                            className="w-full p-6 bg-brand-primary/3 border-none rounded-[24px] text-sm font-medium text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none resize-none"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Thumbnail Upload */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-6">
                        <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                            <ImageIcon className="w-3.5 h-3.5" /> Featured Image
                        </label>

                        <div className="relative group aspect-16/10 bg-brand-primary/3 rounded-[32px] overflow-hidden border border-brand-primary/5 border-dashed hover:border-brand-primary/20 transition-all cursor-pointer">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-brand-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData({ ...formData, image: null });
                                            }}
                                            className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft border border-brand-primary/5 text-brand-primary/20">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">Upload Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                Alt Tag
                            </label>
                            <input
                                type="text"
                                placeholder="Image description..."
                                className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-bold text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                                value={formData.altTag}
                                onChange={(e) => setFormData({ ...formData, altTag: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Metadata & Publishing */}
                    <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-6">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                                <Layout className="w-3.5 h-3.5" /> Category
                            </label>
                            <select
                                className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-black text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-brand-primary/5">
                            <div className="flex items-center justify-between p-4 bg-brand-primary/3 rounded-2xl group cursor-pointer hover:bg-brand-primary/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl border border-brand-primary/5">
                                        <Calendar className="w-4 h-4 text-brand-primary/30" />
                                    </div>
                                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Schedule Post</span>
                                </div>
                                <button
                                    onClick={() => setFormData({ ...formData, isScheduled: !formData.isScheduled })}
                                    className={`w-10 h-6 rounded-full transition-all relative ${formData.isScheduled ? 'bg-brand-primary' : 'bg-brand-primary/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isScheduled ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            {formData.isScheduled && (
                                <div className="animate-slideDown">
                                    <input
                                        type="datetime-local"
                                        className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-black text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-brand-primary/3 rounded-2xl group cursor-pointer hover:bg-brand-primary/5 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl border border-brand-primary/5">
                                    <Tag className="w-4 h-4 text-brand-primary/30" />
                                </div>
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Featured Post</span>
                            </div>
                            <button
                                onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                className={`w-10 h-6 rounded-full transition-all relative ${formData.isFeatured ? 'bg-brand-primary' : 'bg-brand-primary/10'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Info */}
                    <div className="bg-brand-primary p-6 rounded-[32px] shadow-soft relative overflow-hidden group">
                        <Eye className="w-12 h-12 text-white/5 absolute -right-2 -bottom-2 group-hover:scale-125 transition-transform duration-700" />
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                        <h4 className="text-sm font-black text-white mb-3 leading-tight italic">Estimated reading time: 5 mins</h4>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Post is ready to publish</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBlogPost;
