import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Home } from "lucide-react";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import CompanyManagement from "./pages/CompanyManagement";
import JobManagement from "./pages/JobManagement";
import ResumeBank from "./pages/ResumeBank";
import TaxonomyManagement from "./pages/TaxonomyManagement";
import BlogManagement from "./pages/BlogManagement";
import CreateBlogPost from "./pages/CreateBlogPost";
import GalleryManagement from "./pages/GalleryManagement";
import FaqManagement from "./pages/FaqManagement";
import ChatMessage from "./pages/ChatMessage";
import ContactInquiry from "./pages/ContactInquiry";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import LoginPage from "./pages/LoginPage";
import SkillsManagement from "./pages/SkillsManagement";
import ProtectedRoute from "./authRoute/ProtectedRoute";
import { CookiesProvider } from "react-cookie";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] w-full flex flex-col justify-center items-center bg-brand-primary/2">
      <div className="w-28 h-28 bg-brand-primary/5 rounded-[40px] flex items-center justify-center text-brand-primary mb-8 ring-8 ring-brand-primary/5">
        <Home className="w-14 h-14" />
      </div>
      <h1 className="text-5xl font-black text-brand-primary tracking-tighter mb-4">
        404
      </h1>
      <h2 className="text-2xl font-black text-brand-primary/60 uppercase tracking-widest mb-3">
        Page Not Found
      </h2>
      <p className="text-brand-primary/40 text-sm font-medium max-w-sm mx-auto mb-10 text-center leading-relaxed">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-hover transition-all flex items-center gap-3"
      >
        <Home className="w-4 h-4" />
        Go to Dashboard
      </button>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="companies" element={<CompanyManagement />} />
              <Route path="jobs" element={<JobManagement />} />
              {/* <Route path="resume-bank" element={<ResumeBank />} /> */}
              <Route path="job-category" element={<TaxonomyManagement />} />
              <Route path="skill-management" element={<SkillsManagement />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/create" element={<CreateBlogPost />} />
              <Route path="blog/edit/:id" element={<CreateBlogPost />} />
              <Route path="slider-management" element={<GalleryManagement />} />
              <Route path="faqs" element={<FaqManagement />} />
              <Route path="chat-message" element={<ChatMessage />} />
              <Route path="contact-inquiry" element={<ContactInquiry />} />
              <Route path="pricing" element={<SubscriptionManagement />} />
              {/* Add more routes based on SRS */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
