import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  addPost,
  updatePost,
  fetchTags,
  fetchCategories,
  fetchBlogs,
} from "../store/slices/blogSlice";
import { createBlogApi, updateBlogApi } from "../helper/api_helper";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
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
  Layout,
  ChevronDown,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const IMAGE_URL = import.meta.env.VITE_IMG_URL;

const CreateBlogPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { posts, categories, tags } = useSelector((state) => state.blogs);

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    categoryId: "",
    tags: [],
    description: "",
    image: null,
    status: "PUBLISHED",
    excerpt: "",
    isFeatured: false,
    slug: "",
    metaTitle: "",
    metaDescription: "",
    altTag: "",
    isScheduled: false,
    scheduledDate: "",
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    if (isEdit) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, isEdit]);

  useEffect(() => {
    if (isEdit && posts.length > 0) {
      const post = posts.find((p) => p.id === id || p.id === Number(id));

      if (post) {
        setFormData((prev) => ({
          ...prev,
          ...post,
          image: `${IMAGE_URL}/${post.image}` || null,
          slug: post.slug || "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          altTag: post.altTag || "",
          isScheduled: post.isScheduled || false,
          scheduledDate: post.scheduledDate || "",
          categoryId: post.blogCategory.id || post.category?.id || "",
          tags: post.blogTags || [],
        }));
        if (post.image && typeof post.image === "string") {
          setImagePreview(`${IMAGE_URL}/${post.image}`);
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

  const handleSave = async (status = "PUBLISHED") => {
    if (!formData.title || !formData.categoryId) {
      toast.error("Please fill in required fields");
      return;
    }
    if(formData.title.trim() === ""){
      toast.error("Please enter a title");
      return;
    }
    if(formData.categoryId.trim() === ""){
      toast.error("Please select a category");
      return;
    }

    if(formData.title.trim().length > 50){
      toast.error("Title must be less than 50 characters long");
      return;
    } 

    // if(formData.description.trim().length > 1500){
    //   toast.error("Description must be less than 1500 characters long");
    //   return;
    // }

    try {
      // Prepare form data for API
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug || "");
      formDataToSend.append("metaTitle", formData.metaTitle || "");
      formDataToSend.append("metaDescription", formData.metaDescription || "");
      formDataToSend.append("altTag", formData.altTag || "");
      formDataToSend.append("blogCategoryId", formData.categoryId);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("isScheduled", formData.isScheduled);
      formDataToSend.append("scheduledDate", formData.scheduledDate || "");

      // Append tags as blogTagIds
      const tagIds = (formData.tags || []).map((tag) => tag.id || tag);
      tagIds.forEach((tagId) => {
        formDataToSend.append("blogTagIds", tagId);
      });

      // Append image if it's a file
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      // Also dispatch to Redux for local state management
      const postData = {
        title: formData.title,
        categoryId: formData.categoryId,
        category: formData.category,
        tags: formData.tags,
        description: formData.description,
        status,
        excerpt: formData.excerpt,
        isFeatured: formData.isFeatured,
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        altTag: formData.altTag,
        isScheduled: formData.isScheduled,
        scheduledDate: formData.scheduledDate,
        date: isEdit ? formData.date : new Date().toISOString().split("T")[0],
        author: isEdit ? formData.author : "Admin",
        image:
          imagePreview ||
          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop",
        id: isEdit ? id : Date.now(),
      };

      if (isEdit) {
        await updateBlogApi(formDataToSend, id);
        dispatch(updatePost(postData));
      } else {
        await createBlogApi(formDataToSend);
        dispatch(addPost(postData));
      }

      navigate("/blog");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error(error.customMessage || "Failed to save blog post");
    }
  };

  const toggleTag = (tag) => {
  const currentTags = formData.tags || [];
  const exists = currentTags.some((t) => t.id === tag.id);

  if (exists) {
    setFormData((prev) => ({
      ...prev,
      tags: currentTags.filter((t) => t.id !== tag.id),
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      tags: [...currentTags, tag], // always object
    }));
  }
};

 const removeTag = (tagToRemove) => {
  setFormData((prev) => ({
    ...prev,
    tags: prev.tags.filter((t) => t.id !== tagToRemove.id),
  }));
};

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id === categoryId);
    setFormData((prev) => ({
      ...prev,
      categoryId,
      category: category?.categoryName || category?.name || "",
    }));
  };

  // TinyMCE handles its own modules and toolbar via the init prop

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1200px] mx-auto pb-20">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-primary/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/blog")}
            className="p-3 bg-white border border-brand-primary/10 rounded-2xl text-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-brand-primary tracking-tight uppercase leading-tight">
              {isEdit ? "Edit" : "Write New"}{" "}
              <span className="text-brand-primary/30">Post</span>
            </h1>
            <p className="text-brand-primary/50 text-xs font-black uppercase tracking-widest mt-1">
              {isEdit
                ? `Modifying: ${formData.title}`
                : "Create impactful content for the community"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("DRAFT")}
            className="px-6 py-3.5 bg-white border border-brand-primary/10 text-brand-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary/5 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Save as Draft
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-primary/5">
              <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                <Layers className="w-3.5 h-3.5" /> Content Description
              </label>
              <div className="quill-premium-wrapper h-[300px]">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, description: content }))
                  }
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "link",
                    "image",
                  ]}
                  style={{ height: "250px" }}
                />
              </div>
            </div>
          </div>

          {/* SEO & Meta Information */}
          <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-8">
            <div className="flex items-center justify-between border-b border-brand-primary/5 pb-4">
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                SEO & Meta Information
              </h3>
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
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
              />
            </div>
          </div>

          {/* Excerpt */}
          {/* <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
              Short Excerpt
            </label>
            <textarea
              rows="3"
              placeholder="Write a brief summary of this post..."
              className="w-full p-6 bg-brand-primary/3 border-none rounded-[24px] text-sm font-medium text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none resize-none"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
            />
          </div> */}
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
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                  />
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
                  <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
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
                onChange={(e) =>
                  setFormData({ ...formData, altTag: e.target.value })
                }
              />
            </div>
          </div>

          {/* Metadata & Publishing */}
          <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-soft space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                <Layout className="w-3.5 h-3.5" /> Category
              </label>
              <div className="relative">
                <select
                  className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-black text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none appearance-none"
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const catId = cat.id || cat;
                    const catName = cat.categoryName || cat.name || cat;
                    return (
                      <option key={catId} value={catId}>
                        {catName}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30 pointer-events-none" />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4 pt-4 border-t border-brand-primary/5">
              <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1">
                <Tag className="w-3.5 h-3.5" /> Tags
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-black text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none flex items-center justify-between"
                >
                  <span>
                    {formData.tags?.length > 0
                      ? `${formData.tags.length} tag(s) selected`
                      : "Select Tags"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showTagDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showTagDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-brand-primary/10 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
                    {tags && tags.length > 0 ? (
                      tags.map((tag) => {
                        const tagId = tag.id || tag;
                        const tagName = tag.tagName || tag.name || tag;
                        const isSelected = (formData.tags || []).some(
                          (t) => (t.id || t) === tagId,
                        );
                        return (
                          <div
                            key={tagId}
                            onClick={() => toggleTag(tag)}
                            className={`p-3 cursor-pointer flex items-center justify-between hover:bg-brand-primary/5 ${isSelected ? "bg-brand-primary/10" : ""}`}
                          >
                            <span className="text-xs font-black text-brand-primary">
                              {tagName}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-xs text-brand-primary/40">
                        No tags available
                      </div>
                    )}
                  </div>
                )}
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => {
                    const tagName = tag.tagName || tag.name || tag;
                    return (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-brand-primary/10 rounded-full text-[10px] font-black text-brand-primary"
                      >
                        {tagName}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-primary/5">
              <div className="flex items-center justify-between p-4 bg-brand-primary/3 rounded-2xl group cursor-pointer hover:bg-brand-primary/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-brand-primary/5">
                    <Calendar className="w-4 h-4 text-brand-primary/30" />
                  </div>
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    Schedule this blog for later?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isScheduled: !formData.isScheduled,
                    })
                  }
                  className={`w-10 h-6 rounded-full transition-all relative ${formData.isScheduled ? "bg-brand-primary" : "bg-brand-primary/10"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isScheduled ? "right-1" : "left-1"}`}
                  />
                </button>
              </div>

              {formData.isScheduled && (
                <div className="animate-slideDown">
                  <label className="flex items-center gap-2 text-[10px] font-black text-brand-primary/40 uppercase tracking-widest ml-1 mb-2">
                    Scheduled Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-4 bg-brand-primary/3 border-none rounded-2xl text-xs font-black text-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    value={formData.scheduledDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDate: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* <div className="flex items-center justify-between p-4 bg-brand-primary/3 rounded-2xl group cursor-pointer hover:bg-brand-primary/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-brand-primary/5">
                  <Tag className="w-4 h-4 text-brand-primary/30" />
                </div>
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                  Featured Post
                </span>
              </div>
              <button
                onClick={() =>
                  setFormData({ ...formData, isFeatured: !formData.isFeatured })
                }
                className={`w-10 h-6 rounded-full transition-all relative ${formData.isFeatured ? "bg-brand-primary" : "bg-brand-primary/10"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? "right-1" : "left-1"}`}
                />
              </button>
            </div> */}
          </div>

          {/* Preview Info */}
          {/* <div className="bg-brand-primary p-6 rounded-[32px] shadow-soft relative overflow-hidden group">
            <Eye className="w-12 h-12 text-white/5 absolute -right-2 -bottom-2 group-hover:scale-125 transition-transform duration-700" />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
              Status
            </p>
            <h4 className="text-sm font-black text-white mb-3 leading-tight italic">
              Estimated reading time: 5 mins
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                Post is ready to publish
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;
