import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthShell from './AuthShell';
import { Divider, Field, PrimaryButton,Icons } from './AuthUI';
import { api, setToken } from '../../lib/auth/api';

export default function SignUpPage() {
  const nav = useNavigate();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [touched, setTouched] = React.useState({ fullName: false, email: false, password: false });
  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const nErr = touched.fullName && fullName.trim().length < 2 ? 'Full name required.' : '';
  const eErr = touched.email && !email.trim() ? 'Email required.' : '';
  const pErr = touched.password && password.length < 6 ? 'Min 6 characters.' : '';
  const canSubmit = fullName.trim().length >= 2 && !!email.trim() && password.length >= 6;

  async function submit() {
    setTouched({ fullName: true, email: true, password: true });
    if (!canSubmit || loading) return;

    setLoading(true);
    setServerError(null);
    try {
      const out = await api<{ token: string }>(`/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
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
        <div className="authTitle">Create account</div>
        <div className="authSubtitle">Start organizing your life today</div>

        {serverError ? <div className="authServerError">{serverError}</div> : null}

        <Field
          label="Full Name"
          value={fullName}
          onChange={setFullName}
          placeholder="John Doe"
          icon={Icons.user}
          error={nErr}
          onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
          autoComplete="name"
        />
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          icon={Icons.mail}
          error={eErr}
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
          error={pErr}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          autoComplete="new-password"
        />

        <PrimaryButton onClick={submit} loading={loading} disabled={!canSubmit}>
          Create account
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
                  setServerError('Google sign-in failed: missing credential');
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
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="authLink">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
