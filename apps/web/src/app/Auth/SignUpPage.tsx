import React, { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import { Divider, Field, GoogleButton, Icons, PrimaryButton } from './AuthUI';
import { auth } from '../../lib/auth/AuthService';

function validateFullName(v: string): string {
  if (!v.trim()) return 'Full name is required.';
  if (v.trim().length < 2) return 'Full name is too short.';
  return '';
}

function validateEmail(v: string): string {
  const s = v.trim().toLowerCase();
  if (!s) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'Enter a valid email.';
  return '';
}

function validatePassword(v: string): string {
  if (!v) return 'Password is required.';
  if (v.length < 6) return 'Minimum 6 characters.';
  return '';
}

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [touched, setTouched] = React.useState({
    fullName: false,
    email: false,
    password: false,
  });

  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const fullNameError = touched.fullName ? validateFullName(fullName) : '';
  const emailError = touched.email ? validateEmail(email) : '';
  const passwordError = touched.password ? validatePassword(password) : '';

  const canSubmit =
    validateFullName(fullName) === '' &&
    validateEmail(email) === '' &&
    validatePassword(password) === '';

  async function submit(): Promise<void> {
    setTouched({ fullName: true, email: true, password: true });
    if (!canSubmit || loading) return;

    setLoading(true);
    setServerError(null);

    try {
      await auth.signUp(fullName, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === 'Enter') submit();
  }

  return (
    <AuthShell>
      <div className="auth-form" onKeyDown={onKeyDown}>
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Start organizing your life today</div>

        {serverError && <div className="auth-serverError">{serverError}</div>}

        <Field
          label="Full Name"
          value={fullName}
          onChange={setFullName}
          placeholder="John Doe"
          icon={Icons.user}
          error={fullNameError}
          autoComplete="name"
          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
        />

        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          icon={Icons.mail}
          error={emailError}
          autoComplete="email"
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />

        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          type="password"
          icon={Icons.lock}
          error={passwordError}
          autoComplete="new-password"
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />

        <PrimaryButton loading={loading} disabled={!canSubmit} onClick={submit}>
          Create account
        </PrimaryButton>

        <Divider text="or continue with" />

        <GoogleButton onClick={() => alert('Google OAuth later')} />

        <div className="auth-bottomText">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
