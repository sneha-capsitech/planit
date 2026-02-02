import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="authPage">
      <div className="authTop">
        <Link to="/" className="authBack">
          <span className="authBackIcon">←</span>
          <span>Back to home</span>
        </Link>
      </div>

      <div className="authCard">{children}</div>
    </div>
  );
}
