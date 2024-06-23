
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout, StudioLayout } from './layouts';
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
      socket.emit('logged', auth?.user?.userId);
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
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App