
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
  SettingsPage,
  StudioPage
} from './pages/StreamerPages';
import { SettingProfilePage } from './pages/CommonPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/live/:id' element={<DetailStreamPage />} />
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