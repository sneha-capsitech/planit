import React from 'react';

/* =========================
   ICONS
========================= */

export const Icons = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16v12H4V6Zm0 0 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  ),
};

/* =========================
   FIELD
========================= */

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  error,
  autoComplete,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  error?: string;
  autoComplete?: string;
  onBlur?: () => void;
}) {
  return (
    <div className="auth-field">
      <div className="auth-label">{label}</div>

      <div className={`auth-inputWrap ${error ? 'auth-inputWrap--error' : ''}`}>
        <span className="auth-inputIcon">{icon}</span>
        <input
          className="auth-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
        />
      </div>

      {error && <div className="auth-error">{error}</div>}
    </div>
  );
}

/* =========================
   BUTTONS
========================= */

export function PrimaryButton({
  children,
  onClick,
  loading,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className="auth-btn auth-btn--primary"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="auth-btn auth-btn--google" onClick={onClick}>
      <span className="google-icon">G</span>
      Continue with Google
    </button>
  );
}

/* =========================
   DIVIDER
========================= */

export function Divider({ text }: { text: string }) {
  return (
    <div className="auth-divider">
      <span>{text}</span>
    </div>
  );
}
