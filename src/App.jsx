
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout } from './layouts';
import HomePage from './pages/HomePage';
import DetailStreamPage from './pages/DetailStreamPage';
import StreamsPage from './pages/StreamsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Streaming from './pages/Streaming';
import StreamerHomePage from './pages/StreamerPages/StreamerHomePage';
import StreamerAboutPage from './pages/StreamerPages/StreamerAboutPage';
import StreamerStreamsPage from './pages/StreamerPages/StreamerStreamsPage';
import SettingProfilePage from './pages/SettingPages/SettingProfilePage';
import FollowingPage from './pages/FollowingPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/discover' element={<StreamsPage />} />
          <Route path='/live/:id' element={<DetailStreamPage />} />
          {/* <Route path='/profile' element={<ProfilePage />} /> */}
          <Route path='/streaming' element={<Streaming />} />
          <Route path='/settings/profile' element={<SettingProfilePage />} />
          <Route path='/following' element={<FollowingPage />} />
          <Route path='/:id/about' element={<StreamerAboutPage />} />
          <Route path='/:id/streams' element={<StreamerStreamsPage />} />
          <Route path='/:id' element={<StreamerHomePage />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App