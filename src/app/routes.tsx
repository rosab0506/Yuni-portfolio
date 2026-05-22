// Legacy routing file - Not used in Next.js App Router
// This file is kept for reference but imports are disabled to avoid errors

// import { Navigate, Route, Routes } from 'react-router-dom';
// import { AdminLayout } from './layouts/AdminLayout';
// import { PublicLayout } from './layouts/PublicLayout';
// import { AdminOnlyRoute } from './guards/AdminOnlyRoute';
// import { ProtectedRoute } from './guards/ProtectedRoute';
// Note: The following page components don't exist in the expected paths
// They are in src/views/ instead of src/pages/
// import { HomePage } from '../pages/Home/HomePage';
// import { AboutPage } from '../pages/About/AboutPage';
// import { PortfolioPage } from '../pages/Portfolio/PortfolioPage';
// import { BlogListPage } from '../pages/Blog/BlogListPage';
// import { BlogPostPage } from '../pages/Blog/BlogPostPage';
// import { ContactPage } from '../pages/Contact/ContactPage';
// import { ProjectDetailPage } from '../pages/Projects/ProjectDetailPage';
// import { PublicationsPage } from '../pages/Publications/PublicationsPage';
// import { NotFoundPage } from '../pages/NotFound/NotFoundPage';
import { AdminLoginPage } from '../admin/pages/Login/AdminLoginPage';
import { AuthCallbackPage } from '../admin/pages/AuthCallback/AuthCallbackPage';
import { DashboardHomePage } from '../admin/pages/Dashboard/DashboardHomePage';
import { ContactMessagesPage } from '../admin/pages/messages/ContactMessagesPage';
import { ContactMessageDetailPage } from '../admin/pages/messages/ContactMessageDetailPage';
import { AdminPortfolioPage } from '../admin/pages/Portfolio/AdminPortfolioPage';
import { ResumeLibraryPage } from '../admin/pages/resume/ResumeLibraryPage';
import { CmsSectionEditor } from '../admin/pages/cms/CmsSectionEditor';

// export function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route element={<PublicLayout />}>
//         <Route index element={<HomePage />} />
//         <Route path="about" element={<AboutPage />} />
//         <Route path="portfolio" element={<PortfolioPage />} />
//         <Route path="portfolio/:slug" element={<ProjectDetailPage />} />
//         <Route path="publications" element={<PublicationsPage />} />
//         {/* <Route path="blog" element={<BlogListPage />} /> */}
//         <Route path="blog/:slug" element={<BlogPostPage />} />
//         {/* <Route path="services" element={<ServicesPage />} /> */}
//         <Route path="contact" element={<ContactPage />} />
//         <Route path="*" element={<NotFoundPage />} />
//       </Route>

//       {/* Admin (no Supabase yet; guarded by mock auth context) */}
//       <Route path="mhe-control-center/login" element={<AdminLoginPage />} />
//       <Route path="mhe-control-center/auth/callback" element={<AuthCallbackPage />} />

//       <Route path="mhe-control-center" element={<Navigate to="/mhe-control-center/login" replace />} />

//       <Route
//         path="mhe-control-center"
//         element={
//           <ProtectedRoute redirectTo="/mhe-control-center/login">
//             <AdminOnlyRoute>
//               <AdminLayout />
//             </AdminOnlyRoute>
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="/mhe-control-center/dashboard" replace />} />
//         <Route path="dashboard" element={<DashboardHomePage />} />
//         <Route path="cms/hero" element={<CmsSectionEditor sectionKey="hero" />} />
//         <Route path="cms/about" element={<CmsSectionEditor sectionKey="about" />} />
//         <Route path="cms/contact" element={<CmsSectionEditor sectionKey="contact" />} />
//         <Route path="cms/education" element={<CmsSectionEditor sectionKey="education" />} />
//         <Route path="cms/core-skills" element={<CmsSectionEditor sectionKey="skills" />} />
//         <Route path="cms/experience" element={<CmsSectionEditor sectionKey="experience" />} />
//         <Route path="cms/certifications" element={<CmsSectionEditor sectionKey="certifications" />} />
//         <Route path="cms/skills" element={<CmsSectionEditor sectionKey="techStackCategories" />} />
//         {/* <Route path="cms/services" element={<CmsSectionEditor sectionKey="services" />} /> */}
//         <Route path="cms/blogs" element={<CmsSectionEditor sectionKey="blogs" />} />
//         <Route path="cms/testimonials" element={<CmsSectionEditor sectionKey="testimonials" />} />
//         <Route path="cms/clients" element={<CmsSectionEditor sectionKey="clients" />} />
//         <Route path="cms/resume" element={<ResumeLibraryPage />} />
//         <Route path="cms/projects" element={<CmsSectionEditor sectionKey="projects" />} />
//         <Route path="cms/publications" element={<CmsSectionEditor sectionKey="publications" />} />
//         <Route path="cms/achievements" element={<CmsSectionEditor sectionKey="achievements" />} />
//         <Route path="portfolio" element={<AdminPortfolioPage />} />
//         <Route path="messages" element={<ContactMessagesPage />} />
//         <Route path="messages/:id" element={<ContactMessageDetailPage />} />
//       </Route>
//     </Routes>
//   );
// }

// This file is legacy React Router code. The project now uses Next.js App Router.
// See app/ directory for current routing.
