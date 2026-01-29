import React from 'react';

export const Icons = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 11h12v10H6V11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
};

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
    <div className="authField">
      <div className="authLabel">{label}</div>

      <div className={`authInputWrap ${error ? 'authInputWrapError' : ''}`}>
        <span className="authInputIcon">{icon}</span>
        <input
          className="authInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
        />
      </div>

      {error ? <div className="authError">{error}</div> : null}
    </div>
  );
}

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
    <button className="authPrimary" onClick={onClick} disabled={disabled || loading}>
      {loading ? <span className="authSpinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="authDivider">
      <div className="authDividerLine" />
      <div className="authDividerText">{text}</div>
      <div className="authDividerLine" />
    </div>
  );
}

function GoogleG() {
  // simple google "G" mark using 4 colors
  return (
    <svg width="18" height="18" viewBox="0 0 256 262" aria-hidden="true">
      <path fill="#4285F4" d="M255.68 133.5c0-11.1-1-22.2-3.1-33H130.5v62.5h69.9c-3 16.2-12.3 30-26.1 39.2v32.6h42.2c24.7-22.7 39.2-56.1 39.2-103.3z"/>
      <path fill="#34A853" d="M130.5 261.1c35.3 0 65-11.6 86.6-31.4l-42.2-32.6c-11.7 8-26.7 12.6-44.4 12.6-34 0-62.8-22.9-73.1-53.7H13.8v33.7c21.5 42.7 65.6 71.4 116.7 71.4z"/>
      <path fill="#FBBC05" d="M57.4 155.9c-2.7-8-4.2-16.6-4.2-25.4s1.5-17.4 4.2-25.4V71.4H13.8C5 88.9 0 109.4 0 130.5s5 41.6 13.8 59.1l43.6-33.7z"/>
      <path fill="#EA4335" d="M130.5 50.7c19.2 0 36.5 6.6 50.1 19.6l37.4-37.4C195.5 12.2 165.8 0 130.5 0 79.4 0 35.3 28.7 13.8 71.4l43.6 33.7c10.3-30.8 39.1-54.4 73.1-54.4z"/>
    </svg>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="authGoogle" type="button" onClick={onClick}>
      <span className="authGoogleIcon">
        <GoogleG />
      </span>
      <span>Continue with Google</span>
    </button>
  );
}
