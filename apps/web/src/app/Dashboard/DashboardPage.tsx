import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/auth/AuthService';

export default function DashboardPage() {
  const nav = useNavigate();
  const user = auth.getCurrentUser();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0 }}>Dashboard</h2>
      <p style={{ color: '#6f7280' }}>
        Logged in as: <b>{user?.fullName}</b> ({user?.email})
      </p>

      <button
        onClick={() => {
          auth.logout();
          nav('/');
        }}
        style={{
          borderRadius: 10,
          padding: '10px 14px',
          border: '1px solid rgba(0,0,0,0.1)',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
}
