// Legacy App component - Not used in Next.js App Router
// This file is kept for reference but functionality is disabled

// import { useEffect } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { AppProviders } from './providers/AppProviders';
// import { AppRoutes } from './routes';
// import { ScrollToTop } from '../components/common/ScrollToTop';
// import { GlobalLoader } from '../components/common/GlobalLoader';
// import { useCmsLoading } from '../hooks/useCms';
// import { useLoading } from '../context/LoadingContext';

// function AppContent() {
//   const { showLoader, hideLoader } = useLoading();
//   const { isLoading: isCmsLoading } = useCmsLoading();

//   useEffect(() => {
//     // Sync global loader with CMS data loading
//     if (isCmsLoading) {
//       showLoader();
//     } else {
//       hideLoader();
//     }
//   }, [isCmsLoading, showLoader, hideLoader]);

//   return (
//     <>
//       <GlobalLoader />
//       <BrowserRouter>
//         <ScrollToTop />
//         <AppRoutes />
//       </BrowserRouter>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <AppProviders>
//       <AppContent />
//     </AppProviders>
//   );
// }

// This is legacy React code. The project now uses Next.js App Router.
// See app/ directory for the current application structure.

export default function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Legacy App Component</h1>
      <p>This component is not used in the Next.js App Router setup.</p>
      <p>The application runs from the <code>app/</code> directory.</p>
    </div>
  );
}
