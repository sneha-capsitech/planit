import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './app/LandingPage';
import SignInPage from './app/Auth/SignInPage';
import SignUpPage from './app/Auth/SignUpPage';
import DashboardPage from './app/Dashboard/DashboardPage';
import { getToken } from './lib/auth/api';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getToken();
  if (!token) return <Navigate to="/auth/sign-in" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
