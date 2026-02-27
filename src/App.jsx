import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CompanyManagement from './pages/CompanyManagement';
import JobManagement from './pages/JobManagement';
import ResumeBank from './pages/ResumeBank';
import TaxonomyManagement from './pages/TaxonomyManagement';
import BlogManagement from './pages/BlogManagement';
import CreateBlogPost from './pages/CreateBlogPost';
import GalleryManagement from './pages/GalleryManagement';
import FaqManagement from './pages/FaqManagement';
import ChatMessage from './pages/ChatMessage';
import ContactInquiry from './pages/ContactInquiry';
import SubscriptionManagement from './pages/SubscriptionManagement';
import LoginPage from './pages/LoginPage';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<CompanyManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          {/* <Route path="resume-bank" element={<ResumeBank />} /> */}
          <Route path="job-category" element={<TaxonomyManagement />} />
          <Route path="skill-management" element={<TaxonomyManagement />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="blog/create" element={<CreateBlogPost />} />
          <Route path="blog/edit/:id" element={<CreateBlogPost />} />
          <Route path="slider-management" element={<GalleryManagement />} />
          <Route path="faqs" element={<FaqManagement />} />
          <Route path="chat-message" element={<ChatMessage />} />
          <Route path="contact-inquiry" element={<ContactInquiry />} />
          <Route path="pricing" element={<SubscriptionManagement />} />
          {/* Add more routes based on SRS */}
          <Route path="*" element={<div>Module Under Implementation</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
