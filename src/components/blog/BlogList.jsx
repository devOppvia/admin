import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBlogs, deleteBlog } from "../../store/slices/blogSlice";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Modal from "../modals/Modal";

const IMAGE_URL = import.meta.env.VITE_IMG_URL;

const BlogList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const filteredPosts = posts?.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.blogCategory?.categoryName
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteBlog(itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-brand-primary tracking-tight uppercase">
            All Blogs
          </h2>
          <p className="text-brand-primary/50 text-sm font-medium mt-1">
            View and manage your blog posts.
          </p>
        </div>
        <Link
          to="/blog/create"
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-brand-primary-light hover:shadow-hover transition-all"
        >
          <Plus className="w-4 h-4" /> Write New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
        <input
          type="text"
          placeholder="Search articles..."
          className="pl-12 pr-6 py-3 bg-brand-primary/3 border-none rounded-2xl text-sm w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-[40px] border border-brand-primary/5 shadow-soft overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-primary/3 border-b border-brand-primary/5">
                  <th className="text-left text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Image
                  </th>
                  <th className="text-left text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Title
                  </th>
                  <th className="text-left text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Date
                  </th>
                  {/* <th className="text-left text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Status
                  </th> */}
                  <th className="text-right text-[10px] font-black text-brand-primary uppercase tracking-widest px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-brand-primary/5 hover:bg-brand-primary/2 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden">
                        <img
                          src={`${IMAGE_URL}/${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-brand-primary line-clamp-1">
                        {post.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-primary/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-primary">
                        {post.blogCategory?.categoryName || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-brand-primary/50">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post?.scheduledDate || post.createdAt)}
                        {post?.scheduledDate && new Date(post.scheduledDate) > Date.now() && <span>(Scheduled)</span>}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div
                        className={`px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border flex items-center gap-1 w-fit ${
                          post.isScheduled
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : post.status === "PUBLISHED"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {post.isScheduled ? (
                          <Clock className="w-2.5 h-2.5" />
                        ) : post.status === "PUBLISHED" ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Clock className="w-2.5 h-2.5" />
                        )}
                        {post.isScheduled ? "Scheduled" : post.status}
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* <Link
                            to={`/blog/details/${post.id}`}
                            className="p-2 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary/10 hover:scale-110 transition-all"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link> */}
                        <Link
                          to={`/blog/create?id=${post.id}`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setItemToDelete(post);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-110 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-brand-primary/20 mx-auto mb-4" />
            <p className="text-brand-primary/40 text-sm">
              No blog posts found.
            </p>
          </div>
        )}
      </div>

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
                Remove this blog post?
              </h4>
              <p className="text-sm text-brand-primary/40 mt-1">
                You are about to delete{" "}
                <span className="font-bold text-brand-primary">
                  "{itemToDelete?.title}"
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

export default BlogList;
