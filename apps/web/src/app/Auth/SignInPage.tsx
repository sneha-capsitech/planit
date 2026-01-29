import React, { type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import { Divider, Field, GoogleButton, Icons, PrimaryButton } from './AuthUI';
import { auth } from '../../lib/auth/AuthService';

function validateEmail(v: string): string {
  const s = v.trim().toLowerCase();
  if (!s) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'Enter a valid email.';
  return '';
}

function validatePassword(v: string): string {
  if (!v) return 'Password is required.';
  return '';
}

export default function SignInPage(): JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const emailError = touched.email ? validateEmail(email) : '';
  const passwordError = touched.password ? validatePassword(password) : '';

  const canSubmit =
    validateEmail(email) === '' && validatePassword(password) === '';

  async function submit(): Promise<void> {
    setTouched({ email: true, password: true });
    if (!canSubmit || loading) return;

    setLoading(true);
    setServerError(null);

    try {
      await auth.signIn(email, password);
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
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">
          Sign in to continue to <span className="auth-accent">PlanIt</span>
        </div>

        {serverError && <div className="auth-serverError">{serverError}</div>}

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
          autoComplete="current-password"
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />

        <PrimaryButton loading={loading} disabled={!canSubmit} onClick={submit}>
          Sign in
        </PrimaryButton>

        <Divider text="or continue with" />

        <GoogleButton onClick={() => alert('Google OAuth later')} />

        <div className="auth-bottomText">
          Don&apos;t have an account?{' '}
          <Link to="/auth/sign-up" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
