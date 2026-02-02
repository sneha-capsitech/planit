import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthShell from './AuthShell';
import { Divider, Field, PrimaryButton,Icons } from './AuthUI';
import { api, setToken } from '../../lib/auth/api';

export default function SignInPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const emailErr = touched.email && !email.trim() ? 'Email is required.' : '';
  const passErr = touched.password && !password ? 'Password is required.' : '';
const canSubmit = Boolean(email.trim() && password);

  async function submit() {
    setTouched({ email: true, password: true });
    if (!canSubmit || loading) return;

    setLoading(true);
    setServerError(null);
    try {
      const out = await api<{ token: string }>(`/api/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(out.token);
      nav('/dashboard');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="authForm" onKeyDown={(e) => e.key === 'Enter' && submit()}>
        <div className="authTitle">Welcome back</div>
        <div className="authSubtitle">
          Sign in to continue to <span className="authAccent">PlanIt</span>
        </div>

        {serverError ? <div className="authServerError">{serverError}</div> : null}

        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          icon={Icons.mail}
          error={emailErr}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          autoComplete="email"
        />

        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          type="password"
          icon={Icons.lock}
          error={passErr}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          autoComplete="current-password"
        />

        <PrimaryButton onClick={submit} loading={loading} disabled={!canSubmit}>
          Sign in
        </PrimaryButton>

        <Divider text="or continue with" />

        {/* ✅ Google OAuth (ID token -> backend -> your JWT -> dashboard) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                setServerError(null);

                const credential = cred.credential ?? '';
                if (!credential) {
                  setServerError('Google login failed: missing credential');
                  return;
                }

                const out = await api<{ token: string }>(`/api/auth/google`, {
                  method: 'POST',
                  body: JSON.stringify({ credential }),
                });

                setToken(out.token);
                nav('/dashboard');
              } catch (e) {
                setServerError(e instanceof Error ? e.message : 'Google sign-in failed');
              }
            }}
            onError={() => setServerError('Google sign-in failed')}
          />
        </div>

        <div className="authBottomText">
          Don&apos;t have an account?{' '}
          <Link to="/auth/sign-up" className="authLink">
            Sign up
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
