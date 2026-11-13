import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ensureUserSanctuary } from '../services/firestoreService';
import type {
  Language,
  PlaylistTrack,
  StarDustTransaction,
  TarotReading,
  UserProfile,
} from '../types/tarot';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isVerified: boolean;
  profile: UserProfile | null;
  transactions: StarDustTransaction[];
  readings: TarotReading[];
  playlists: PlaylistTrack[];
  loadingData: boolean;
  sanctuaryError: string | null;
  retrySanctuary: () => void;
  language: Language;
  setUiLanguage: (lang: Language) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshVerificationStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
}

function getCreatedAtMs(ts: unknown): number {
  if (ts && typeof ts === 'object') {
    const maybe = ts as { toMillis?: () => number };
    if (typeof maybe.toMillis === 'function') {
      return maybe.toMillis();
    }
  }
  // Pending local serverTimestamp() resolves shortly; treat as newest.
  return Number.MAX_SAFE_INTEGER;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerifiedFlag, setEmailVerifiedFlag] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<StarDustTransaction[]>([]);
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistTrack[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [sanctuaryError, setSanctuaryError] = useState<string | null>(null);
  const [sanctuaryRetryTick, setSanctuaryRetryTick] = useState(0);
  const [uiLanguage, setUiLanguageState] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('ag_lang') : null;
    return saved === 'en' ? 'en' : 'vi';
  });

  const setUiLanguage = (lang: Language) => {
    setUiLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ag_lang', lang);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setEmailVerifiedFlag(Boolean(nextUser?.emailVerified));
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isVerified = Boolean(user && (emailVerifiedFlag || user.emailVerified));

  useEffect(() => {
    if (!authReady || !user || !isVerified) {
      setProfile(null);
      setTransactions([]);
      setReadings([]);
      setPlaylists([]);
      setSanctuaryError(null);
      setLoadingData(false);
      return;
    }

    let cancelled = false;
    let unsubProfile: (() => void) | undefined;
    let unsubTx: (() => void) | undefined;
    let unsubReadings: (() => void) | undefined;
    let unsubPlaylists: (() => void) | undefined;

    setLoadingData(true);
    setSanctuaryError(null);

    ensureUserSanctuary(user, uiLanguage)
      .then(() => {
        if (cancelled) return;

        const userPath = `users/${user.uid}`;
        unsubProfile = onSnapshot(
          doc(db, 'users', user.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              setProfile(data);
              if (data.language === 'vi' || data.language === 'en') {
                setUiLanguageState(data.language);
              }
            }
            setLoadingData(false);
          },
          (err) => handleFirestoreError(err, OperationType.GET, userPath),
        );

        const txPath = `users/${user.uid}/transactions`;
        unsubTx = onSnapshot(
          query(collection(db, 'users', user.uid, 'transactions'), where('userId', '==', user.uid)),
          (snap) => {
            const list = snap.docs.map((d) => d.data() as StarDustTransaction);
            list.sort((a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt));
            setTransactions(list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, txPath),
        );

        const rdPath = `users/${user.uid}/readings`;
        unsubReadings = onSnapshot(
          query(collection(db, 'users', user.uid, 'readings'), where('userId', '==', user.uid)),
          (snap) => {
            const list = snap.docs.map((d) => d.data() as TarotReading);
            list.sort((a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt));
            setReadings(list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, rdPath),
        );

        const plPath = `users/${user.uid}/playlists`;
        unsubPlaylists = onSnapshot(
          query(collection(db, 'users', user.uid, 'playlists'), where('userId', '==', user.uid)),
          (snap) => {
            const list = snap.docs.map((d) => d.data() as PlaylistTrack);
            list.sort((a, b) => getCreatedAtMs(a.createdAt) - getCreatedAtMs(b.createdAt));
            setPlaylists(list);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, plPath),
        );
      })
      .catch((err) => {
        console.error('Sanctuary initialization failed:', err);
        if (!cancelled) {
          setSanctuaryError(err instanceof Error ? err.message : String(err));
          setLoadingData(false);
        }
      });

    return () => {
      cancelled = true;
      unsubProfile?.();
      unsubTx?.();
      unsubReadings?.();
      unsubPlaylists?.();
    };
  }, [authReady, user?.uid, isVerified, sanctuaryRetryTick]);

  const retrySanctuary = () => {
    setSanctuaryRetryTick((n) => n + 1);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim().slice(0, 80) });
    }
    await sendEmailVerification(cred.user);
    await reload(cred.user);
    setUser(auth.currentUser);
    setEmailVerifiedFlag(Boolean(auth.currentUser?.emailVerified));
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  };

  const refreshVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    const verifiedNow = Boolean(auth.currentUser.emailVerified);
    setUser(auth.currentUser);
    setEmailVerifiedFlag(verifiedNow);
    return verifiedNow;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const language: Language = profile?.language || uiLanguage;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authReady,
      isVerified,
      profile,
      transactions,
      readings,
      playlists,
      loadingData,
      sanctuaryError,
      retrySanctuary,
      language,
      setUiLanguage,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      sendPasswordReset,
      resendVerificationEmail,
      refreshVerificationStatus,
      logout,
    }),
    [
      user,
      authReady,
      isVerified,
      profile,
      transactions,
      readings,
      playlists,
      loadingData,
      sanctuaryError,
      language,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
