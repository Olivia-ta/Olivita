import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Globe, KeyRound, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCopy } from '../i18n/translations';

export function AuthGate() {
  const {
    user,
    isVerified,
    language,
    setUiLanguage,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendPasswordReset,
    resendVerificationEmail,
    refreshVerificationStatus,
    logout,
  } = useAuth();

  const t = getCopy(language);

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const formatAuthError = (err: unknown): string => {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes('auth/operation-not-allowed')) {
      return language === 'vi'
        ? 'Nhà cung cấp Email/Mật khẩu chưa được bật trong Firebase Console. Vui lòng bật trong Authentication > Sign-in method hoặc sử dụng Google.'
        : 'Email/Password sign-in is not yet enabled in Firebase Console (Authentication > Sign-in method). Use Google Sign-In or enable Email/Password.';
    }
    if (raw.includes('auth/invalid-credential') || raw.includes('auth/wrong-password')) {
      return language === 'vi'
        ? 'Email hoặc mật khẩu không chính xác.'
        : 'Invalid email or password.';
    }
    if (raw.includes('auth/email-already-in-use')) {
      return language === 'vi'
        ? 'Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập.'
        : 'This email is already registered. Switch to Sign In.';
    }
    if (raw.includes('auth/weak-password')) {
      return language === 'vi'
        ? 'Mật khẩu cần tối thiểu 6 ký tự.'
        : 'Password must be at least 6 characters.';
    }
    if (raw.includes('auth/popup-closed-by-user')) {
      return language === 'vi' ? 'Cửa sổ đăng nhập Google đã đóng.' : 'Google sign-in popup was closed.';
    }
    return raw;
  };

  const handleGoogle = async () => {
    setBusy(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, displayName);
      }
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMsg(
        language === 'vi'
          ? 'Vui lòng nhập địa chỉ email trước khi đặt lại mật khẩu.'
          : 'Enter your email address first to reset your password.',
      );
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      await sendPasswordReset(email);
      setInfoMsg(t.auth.resetSent);
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResendVerification = async () => {
    setBusy(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      await resendVerificationEmail();
      setInfoMsg(t.auth.verifyResentOk);
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleCheckVerification = async () => {
    setBusy(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      const verified = await refreshVerificationStatus();
      if (!verified) {
        setErrorMsg(t.auth.verifyStillPending);
      }
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#ECE6D8] flex flex-col justify-between px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 border-b border-[#C9A86A]/20 pb-4">
        <div>
          <span className="block font-display text-xl sm:text-2xl font-semibold tracking-[0.12em] text-[#F4ECD8] leading-tight">
            {t.brand}
          </span>
          <span className="block text-[10px] tracking-[0.22em] text-[#C9A86A] uppercase mt-0.5">
            {t.brandSubtitle}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setUiLanguage(language === 'vi' ? 'en' : 'vi')}
          className="inline-flex items-center gap-2 rounded-lg border border-[#C9A86A]/30 bg-[#131622] px-3 py-1.5 text-xs font-medium text-[#ECE6D8] hover:border-[#D4AF37] cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>{language === 'vi' ? 'Tiếng Việt · Switch EN' : 'English · Chuyển VI'}</span>
        </button>
      </div>

      <main className="mx-auto my-10 grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-12 items-stretch">
        {/* Editorial Introduction */}
        <section className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-[#C9A86A]/20 bg-[#131622] p-8">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#C9A86A]">
              Mystical Manga Tarot · 78 Arcana
            </p>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl font-semibold tracking-[0.06em] leading-tight text-[#F4ECD8]">
              {t.auth.title}
            </h1>
            <p className="mt-1.5 text-xs font-medium tracking-[0.24em] uppercase text-[#C9A86A]">
              {t.brandSubtitle}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#B8B0A0]">
              {t.auth.subtitle}
            </p>
          </div>

          <div className="mt-8 border-t border-[#C9A86A]/15 pt-6 space-y-3 text-sm text-[#C8C0B0]">
            <div className="flex items-baseline justify-between">
              <span>{language === 'vi' ? 'Quà khai mở tài khoản' : 'Welcome Star Dust'}</span>
              <span className="font-mono tabular-nums text-[#D4AF37]">+500 SD</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span>{language === 'vi' ? 'Điểm danh mỗi ngày' : 'Daily Check-In'}</span>
              <span className="font-mono tabular-nums text-[#D4AF37]">+500 SD / day</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span>{language === 'vi' ? 'Thưởng chuỗi 7 ngày' : '7-Day Streak Bonus'}</span>
              <span className="font-mono tabular-nums text-[#D4AF37]">+1,000 SD</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span>{language === 'vi' ? 'Ba không gian trải bài' : 'Three Reading Tiers'}</span>
              <span className="font-mono tabular-nums text-[#ECE6D8]">100 · 300 · 500 SD</span>
            </div>
          </div>
        </section>

        {/* Auth or Verification Card */}
        <section className="lg:col-span-6 rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-8 flex flex-col justify-center">
          {user && !isVerified ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <Mail className="h-6 w-6 shrink-0" />
                <h2 className="font-display text-3xl font-semibold text-[#F4ECD8]">
                  {t.auth.verifyTitle}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[#B8B0A0]">
                {t.auth.verifyDesc}
              </p>
              <div className="rounded-lg border border-[#C9A86A]/20 bg-[#0D1018] px-4 py-3 text-sm font-mono text-[#F4ECD8]">
                {user.email}
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-lg border border-[#C25450]/40 bg-[#C25450]/10 p-3 text-xs text-[#F3B7B5]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {infoMsg && (
                <div className="flex items-start gap-2.5 rounded-lg border border-[#4B8F78]/40 bg-[#4B8F78]/10 p-3 text-xs text-[#A8DFCA]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleCheckVerification}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-[#090A0F] hover:bg-[#E2C25B] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                  <span>{t.auth.verifyCheck}</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleResendVerification}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9A86A]/35 bg-[#181C2A] px-4 py-2.5 text-sm font-medium text-[#ECE6D8] hover:border-[#D4AF37] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span>{t.auth.verifyResend}</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={logout}
                  className="text-xs text-[#B8B0A0] hover:text-[#ECE6D8] underline underline-offset-4 pt-1 cursor-pointer"
                >
                  {t.common.signOut}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                type="button"
                disabled={busy}
                onClick={handleGoogle}
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-[#F4ECD8] px-4 py-3 text-sm font-semibold text-[#131622] hover:bg-[#FFFFFF] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.22 1.18-3.24 0-5.99-2.19-6.97-5.13H1.04v3.14C3.05 21.17 7.21 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.03 14.04c-.25-.74-.39-1.53-.39-2.34s.14-1.6.39-2.34V6.22H1.04C.38 7.54 0 9.03 0 11.7s.38 4.16 1.04 5.48l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.62c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.09 15.3 0 12 0 7.21 0 3.05 2.83 1.04 6.96l3.99 3.14c.98-2.94 3.73-5.48 6.97-5.48Z"
                  />
                </svg>
                <span>{t.auth.googleBtn}</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-[#8E8778]">
                <div className="h-px flex-1 bg-[#C9A86A]/20" />
                <span>{language === 'vi' ? 'hoặc Email' : 'or Email'}</span>
                <div className="h-px flex-1 bg-[#C9A86A]/20" />
              </div>

              <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#0D1018] p-1 border border-[#C9A86A]/15">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className={`rounded-md py-2 text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-[#181C2A] text-[#D4AF37]'
                      : 'text-[#9E9689] hover:text-[#ECE6D8]'
                  }`}
                >
                  {t.auth.tabSignIn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className={`rounded-md py-2 text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-[#181C2A] text-[#D4AF37]'
                      : 'text-[#9E9689] hover:text-[#ECE6D8]'
                  }`}
                >
                  {t.auth.tabRegister}
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-[#C8C0B0] mb-1.5">
                      {t.auth.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#C8C0B0] mb-1.5">
                    {t.auth.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#C8C0B0]">
                      {t.auth.passwordLabel}
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#C9A86A] hover:text-[#D4AF37] cursor-pointer"
                      >
                        {t.auth.forgotPassword}
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-[#C25450]/40 bg-[#C25450]/10 p-3 text-xs text-[#F3B7B5]">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {infoMsg && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-[#4B8F78]/40 bg-[#4B8F78]/10 p-3 text-xs text-[#A8DFCA]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{infoMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-[#090A0F] hover:bg-[#E2C25B] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{mode === 'signin' ? t.auth.submitSignIn : t.auth.submitRegister}</span>
                </button>

                <p className="text-[11px] leading-relaxed text-[#8E8778]">
                  {t.auth.emailProviderHint}
                </p>
              </form>
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl border-t border-[#C9A86A]/15 pt-4 text-xs text-[#8E8778] flex flex-wrap items-center justify-between gap-4">
        <span>NHỮNG MIỀN MƠ MỘNG · The Realms of Dreams · Mystical Manga Tarot (Rann &amp; Barbara Moore)</span>
        <span>Cloud Firestore · Firebase Auth · Gemini</span>
      </footer>
    </div>
  );
}
