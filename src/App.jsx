
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AdminLayout, MainLayout, StudioLayout } from './layouts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  HomePage,
  HistoryPage,
  DetailStreamPage,
  FollowingPage,
  StreamerAboutPage,
  StreamerStreamsPage,
  StreamerHomePage
} from './pages/ViewerPages';
import {
  AnalyticsPage,
  CommunityPage,
  StudioPage,
  StreamPage
} from './pages/StreamerPages';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSocket, selectSocket } from './redux/slices/socketSlice';
import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { SettingProfilePage, SettingSecurityPage } from './pages/CommonPages';
import StreamerInfoTabs from './layouts/StreamerInfoTabs';
import ViewerSettingTabs from './layouts/ViewerSettingTabs';
import LikedPage from './pages/ViewerPages/LikedPage';
import SearchPage from './pages/ViewerPages/SearchPage';
import SavedStreamsPage from './pages/StreamerPages/SavedStreamsPage';
import NotFoundPage from './pages/CommonPages/NotFoundPage';
import StreamAdminPage from './pages/AdminPages/StreamAdminPage';
import AccountPage from './pages/AdminPages/AccountPage';
import AnalyticsAdminPage from './pages/AdminPages/AnalyticsAdminPage';
import LoginPage from './pages/AdminPages/LoginPage';
import SettingsAdminPage from './pages/AdminPages/SettingsAdminPage';
import ForgotPasswordPage from './pages/AdminPages/ForgotPasswordPage';

function App() {
  const { auth } = useAuth();
  const isLogged = auth !== null;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeSocket());
  }, [dispatch]);
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if (isLogged && socket) {
      socket.emit('logged', auth?.user?._id);
    }
  }, [isLogged, socket]);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/liked' element={<LikedPage />} />
          <Route path='/live/:streamId' element={<DetailStreamPage />} />
          <Route path='/following' element={<FollowingPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/:username' element={<StreamerInfoTabs />}>
            <Route path='about' element={<StreamerAboutPage />} />
            <Route path='streams' element={<StreamerStreamsPage />} />
            <Route path='' element={<StreamerHomePage />} />
          </Route>
          <Route path='/settings' element={<ViewerSettingTabs />}>
            <Route path='profile' element={<SettingProfilePage />} />
            <Route path='security' element={<SettingSecurityPage />} />
          </Route>
          <Route path='*' element={<NotFoundPage />} />
        </Route>
        <Route path='/studio' element={<StudioLayout />}>
          <Route path='manager' element={<StudioPage />} />
          <Route path='stream/:streamId' element={<StreamPage />} />
          <Route path='analytics' element={<AnalyticsPage />} />
          <Route path='community' element={<CommunityPage />} />
          <Route path='saved' element={<SavedStreamsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
        <Route path='/admin-login' element={<LoginPage />} />
        <Route path='/admin-forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='streams' element={<StreamAdminPage />} />
          <Route path='account' element={<AccountPage />} />
          <Route path='analytics' element={<AnalyticsAdminPage />} />
          <Route path='settings' element={<SettingsAdminPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App