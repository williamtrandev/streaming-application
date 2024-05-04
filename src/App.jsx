
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout } from './layouts';
import HomePage from './pages/HomePage';
import DetailStreamPage from './pages/DetailStreamPage';
import StreamsPage from './pages/StreamsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/lives' element={<StreamsPage />} />
          <Route path='/live/:id' element={<DetailStreamPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App