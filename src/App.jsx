
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout, StudioLayout } from './layouts';
import HomePage from './pages/HomePage';
import DetailStreamPage from './pages/DetailStreamPage';
import StreamsPage from './pages/StreamsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import Streaming from './pages/Streaming';
import StreamerPage from './pages/StreamerPage';
import StudioPage from './pages/StudioPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='discover' element={<StreamsPage />} />
          <Route path='live/:id' element={<DetailStreamPage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='streaming' element={<Streaming />} />
          <Route path=':id' element={<StreamerPage />} />
        </Route>
        <Route path='/studio' element={<StudioLayout />}>
          <Route path='manager' element={<StudioPage />} />
          <Route path='analytics' element={<AnalyticsPage />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App