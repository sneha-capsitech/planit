import { Link } from 'react-router-dom';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link to="/" className="auth-back">
          <span className="auth-back-ic">←</span>
          <span>Back to home</span>
        </Link>
      </div>

      <div className="auth-card">{children}</div>
    </div>
  );
}
