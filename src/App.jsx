import { Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import { SiteDataProvider } from "./context/SiteDataContext";
import SeoRoute from "./components/SeoRoute";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import TeamPage from "./pages/TeamPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ContactPage from "./pages/ContactPage";
import AppointmentPage from "./pages/AppointmentPage";
import FAQPage from "./pages/FAQPage";
import PricingPage from "./pages/PricingPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminApp from "./admin/AdminApp";
import "./styles/pages.css";

export default function App() {
  return (
    <ShopProvider>
      <SiteDataProvider>
      <SeoRoute />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<MainLayout />}>
          <Route index element={<HomePage variant={4} />} />
          <Route path="home/web-agency" element={<HomePage variant={1} />} />
          <Route path="home/startup-agency" element={<HomePage variant={2} />} />
          <Route path="home/digital-agency" element={<HomePage variant={3} />} />
          <Route path="home/it-solution" element={<HomePage variant={4} />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="team/:id" element={<TeamDetailPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="blog" element={<BlogPage layout="grid" />} />
          <Route path="blog/list" element={<BlogPage layout="list" />} />
          <Route path="blog/:slugOrId" element={<BlogDetailPage />} />
          <Route path="shop" element={<Navigate to="/services" replace />} />
          <Route path="shop/:id" element={<Navigate to="/services" replace />} />
          <Route path="cart" element={<Navigate to="/pricing" replace />} />
          <Route path="checkout" element={<Navigate to="/pricing" replace />} />
          <Route path="wishlist" element={<Navigate to="/pricing" replace />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </SiteDataProvider>
    </ShopProvider>
  );
}
