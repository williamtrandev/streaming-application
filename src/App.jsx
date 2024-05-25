
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout, StudioLayout } from './layouts';
import HomePage from './pages/HomePage';
import DetailStreamPage from './pages/DetailStreamPage';
import Streaming from './pages/Streaming';
import StudioPage from './pages/StudioPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnalyticsPage from './pages/AnalyticsPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import StreamerHomePage from './pages/StreamerPages/StreamerHomePage';
import StreamerAboutPage from './pages/StreamerPages/StreamerAboutPage';
import StreamerStreamsPage from './pages/StreamerPages/StreamerStreamsPage';
import SettingProfilePage from './pages/SettingPages/SettingProfilePage';
import FollowingPage from './pages/FollowingPage';
import HistoryPage from './pages/HistoryPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/live/:id' element={<DetailStreamPage />} />
          <Route path='/streaming' element={<Streaming />} />
          <Route path='/settings/profile' element={<SettingProfilePage />} />
          <Route path='/following' element={<FollowingPage />} />
          <Route path='/:id/about' element={<StreamerAboutPage />} />
          <Route path='/:id/streams' element={<StreamerStreamsPage />} />
          <Route path='/:id' element={<StreamerHomePage />} />
        </Route>
        <Route path='/studio' element={<StudioLayout />}>
          <Route path='manager' element={<StudioPage />} />
          <Route path='analytics' element={<AnalyticsPage />} />
          <Route path='community' element={<CommunityPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App