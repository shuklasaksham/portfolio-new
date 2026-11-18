import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './a3/Home';
import { useRouteScroll } from './a3/scroll';

const CasePage = lazy(() => import('./a3/CasePage'));
const About = lazy(() => import('./a3/About'));
const Resume = lazy(() => import('./a3/Resume'));
const NotFound = lazy(() => import('./a3/NotFound'));

const TITLES: Record<string, string> = {
  '/': 'Saksham Shukla — Product Designer',
  '/about': 'About — Saksham Shukla',
  '/posts': 'Posts — Saksham Shukla',
  '/reviews': 'Reviews — Saksham Shukla',
  '/resume': 'Résumé — Saksham Shukla',
};

export default function App() {
  const path = useLocation().pathname;
  const pathname = path.length > 1 ? path.replace(/\/+$/, '') : path;
  useRouteScroll();

  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname];
    else if (!pathname.startsWith('/work/')) document.title = 'Not found — Saksham Shukla';
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page" style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Home tab="posts" />} />
            <Route path="/reviews" element={<Home tab="reviews" />} />
            <Route path="/work" element={<Navigate to="/" replace />} />
            <Route path="/work/:slug" element={<CasePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
