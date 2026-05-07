import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import App from './App'
import './index.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

const AppRouter = () => {
  const [authView, setAuthView] = useState('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    if (authView === 'login') {
      return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />;
    }
    return <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
