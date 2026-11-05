import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './a3/Home';
import { useRouteScroll } from './a3/scroll';
import { AskProvider, Header } from './a3/ui';

const CasePage = lazy(() => import('./a3/CasePage'));
const About = lazy(() => import('./a3/About'));
const Resume = lazy(() => import('./a3/Resume'));
const NotFound = lazy(() => import('./a3/NotFound'));

const TITLES: Record<string, string> = {
  '/': 'Saksham Shukla — Product Designer',
  '/about': 'About — Saksham Shukla',
  '/resume': 'Résumé — Saksham Shukla',
};

export default function App() {
  const { pathname } = useLocation();
  useRouteScroll();

  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname];
    else if (!pathname.startsWith('/work/')) document.title = 'Not found — Saksham Shukla';
  }, [pathname]);

  return (
    <AskProvider>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page" style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Navigate to="/#work" replace />} />
            <Route path="/work/:slug" element={<CasePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </AskProvider>
  );
}
