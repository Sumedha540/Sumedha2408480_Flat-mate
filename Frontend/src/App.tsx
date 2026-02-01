import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatInterface } from './components/ChatInterface';
import { LandingPage } from './pages/LandingPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { BeOwnerPage } from './pages/BeOwnerPage';
import { TenantDashboard } from './pages/TenantDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { FavoritesPage } from './pages/FavoritesPage';
import { MessagesPage } from './pages/MessagesPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { FindRoommatePage } from './pages/FindRoommatePage';
import { RoommateProfilePage } from './pages/RoommateProfilePage';
import { PostRoommatePage } from './pages/PostRoommatePage';
import { MatchSuggestionsPage } from './pages/MatchSuggestionsPage';
import { CompatibilityQuizPage } from './pages/CompatibilityQuizPage';
import { SavedRoommatesPage } from './pages/SavedRoommatesPage';
import { SafetyPage } from './pages/SafetyPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { RoommateFAQPage } from './pages/RoommateFAQPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { PostPropertyPage } from './pages/PostPropertyPage';
import { AuthProvider } from './contexts/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { VerifyEmail } from './pages/VerifyEmail';
export function App() {
  return <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-right" toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px'
          }
        }} />
          <Routes>
            {/* Full-screen auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/be-owner" element={<BeOwnerPage />} />

            {/* Dashboard pages without header/footer */}
            <Route path="/dashboard/tenant" element={<TenantDashboard />} />
            <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Pages with header/footer */}
            <Route path="*" element={<>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/properties" element={<PropertiesPage />} />
                      <Route path="/property/:id" element={<PropertyDetailPage />} />
                      <Route path="/category/:categoryId" element={<CategoryPage />} />
                      <Route path="/profile" element={<ProfileSettingsPage />} />
                      <Route path="/post-property" element={<PostPropertyPage />} />

                      {/* Roommate Routes */}
                      <Route path="/find-roommate" element={<FindRoommatePage />} />
                      <Route path="/roommate/:id" element={<RoommateProfilePage />} />
                      <Route path="/post-roommate" element={<PostRoommatePage />} />
                      <Route path="/match-suggestions" element={<MatchSuggestionsPage />} />
                      <Route path="/roommate-quiz" element={<CompatibilityQuizPage />} />
                      <Route path="/saved-roommates" element={<SavedRoommatesPage />} />
                      <Route path="/roommate-safety" element={<SafetyPage />} />
                      <Route path="/success-stories" element={<SuccessStoriesPage />} />
                      <Route path="/roommate-faq" element={<RoommateFAQPage />} />

                      {/* User Routes */}
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/messages" element={<MessagesPage />} />

                      {/* Footer Links */}
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ChatInterface />
                </>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>;
}