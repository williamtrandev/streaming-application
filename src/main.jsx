import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ModalProvider } from './contexts/ModalContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <AuthProvider>
          <UserProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </UserProvider>
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
