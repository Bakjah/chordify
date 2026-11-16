import { Route, Routes } from 'react-router-dom'
import { ROLES } from '../constants/roles.js'
import { ROUTES } from '../constants/routes.js'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import MainLayout from '../components/layout/MainLayout.jsx'
import GuestRoute from './GuestRoute.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import WelcomeLandingPage from '../pages/public/WelcomeLandingPage.jsx'
import LoginPage from '../pages/public/LoginPage.jsx'
import RegisterPage from '../pages/public/RegisterPage.jsx'
import HomePage from '../pages/public/HomePage.jsx'
import SongLibraryPage from '../pages/public/SongLibraryPage.jsx'
import SongDetailPage from '../pages/public/SongDetailPage.jsx'
import NotFoundPage from '../pages/public/NotFoundPage.jsx'

import PersonalLibraryPage from '../pages/member/PersonalLibraryPage.jsx'
import MyContributionsPage from '../pages/member/MyContributionsPage.jsx'
import AddSongPage from '../pages/member/AddSongPage.jsx'
import EditSongPage from '../pages/member/EditSongPage.jsx'
import PublicContributorProfilePage from '../pages/member/PublicContributorProfilePage.jsx'
import VerificationRequestPage from '../pages/member/VerificationRequestPage.jsx'
import NotificationsPage from '../pages/member/NotificationsPage.jsx'

import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import AdminManageSongsPage from '../pages/admin/AdminManageSongsPage.jsx'
import AdminManageArtistsPage from '../pages/admin/AdminManageArtistsPage.jsx'
import AdminManageGenresPage from '../pages/admin/AdminManageGenresPage.jsx'
import AdminManageUsersPage from '../pages/admin/AdminManageUsersPage.jsx'
import AdminManageReportsPage from '../pages/admin/AdminManageReportsPage.jsx'
import AdminManageVerificationPage from '../pages/admin/AdminManageVerificationPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.WELCOME} element={<WelcomeLandingPage />} />

      {/* Khusus tamu */}
      <Route element={<GuestRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Bisa diakses guest, member, dan admin */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SONGS} element={<SongLibraryPage />} />
        <Route path={ROUTES.SONG_DETAIL()} element={<SongDetailPage />} />
        <Route path={ROUTES.PROFILE()} element={<PublicContributorProfilePage />} />

        {/* Wajib login (member & admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.LIBRARY} element={<PersonalLibraryPage />} />
          <Route path={ROUTES.FAVORITES} element={<PersonalLibraryPage />} />
          <Route path={ROUTES.PLAYLISTS} element={<PersonalLibraryPage />} />
          <Route path={ROUTES.SETLISTS} element={<PersonalLibraryPage />} />
          <Route path={ROUTES.CONTRIBUTIONS} element={<MyContributionsPage />} />
          <Route path={ROUTES.ADD_SONG} element={<AddSongPage />} />
          <Route path={ROUTES.EDIT_SONG()} element={<EditSongPage />} />
          <Route path={ROUTES.VERIFICATION} element={<VerificationRequestPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Khusus admin */}
      <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_SONGS} element={<AdminManageSongsPage />} />
          <Route path={ROUTES.ADMIN_ARTISTS} element={<AdminManageArtistsPage />} />
          <Route path={ROUTES.ADMIN_GENRES} element={<AdminManageGenresPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminManageUsersPage />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<AdminManageReportsPage />} />
          <Route path={ROUTES.ADMIN_VERIFICATION} element={<AdminManageVerificationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
