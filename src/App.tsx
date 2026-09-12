import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './Layout'
import { AboutPage } from './pages/AboutPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { CaseStudiesPage } from './pages/CaseStudiesPage'
import { ContactPage } from './pages/ContactPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductsPage } from './pages/ProductsPage'
import { privacyPolicy, termsAndConditions } from './content/legal'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* /work was merged into /about; keep the path alive for anyone
            holding an old link. */}
        <Route path="work" element={<Navigate to="/about" replace />} />
        <Route path="case-studies" element={<CaseStudiesPage />} />
        <Route path="case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="about" element={<AboutPage />} />
        {/* Linked from the footer and the contact form since day one; these
            were 404s on every page until the documents were ported. */}
        <Route path="privacy-policy" element={<LegalPage doc={privacyPolicy} />} />
        <Route path="terms-and-conditions" element={<LegalPage doc={termsAndConditions} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
