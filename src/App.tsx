import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import { getCopy } from './i18n/translations';
import type { ReadingAreaId } from './types/tarot';
import { AuthGate } from './components/AuthGate';
import { CelestialRecords } from './components/CelestialRecords';
import { CheckInVault } from './components/CheckInVault';
import { GlobalMusicPlayer } from './components/GlobalMusicPlayer';
import { ProfileEditor } from './components/ProfileEditor';
import { ReadingArchive } from './components/ReadingArchive';
import { SanctuaryHome } from './components/SanctuaryHome';
import { TarotReadingStudio } from './components/TarotReadingStudio';
import { TopNav, type NavTab } from './components/TopNav';

function AstralGrimoireShell() {
  const {
    user,
    authReady,
    isVerified,
    loadingData,
    profile,
    sanctuaryError,
    retrySanctuary,
    logout,
    language,
  } = useAuth();
  const t = getCopy(language);

  const [activeTab, setActiveTab] = useState<NavTab>('sanctuary');
  const [selectedAreaId, setSelectedAreaId] = useState<ReadingAreaId>('single_spark');
  const [inspectReadingId, setInspectReadingId] = useState<string | null>(null);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-[#ECE6D8] flex flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl sm:text-3xl font-semibold tracking-[0.14em] text-[#F4ECD8]">
          {t.brand}
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.26em] uppercase text-[#C9A86A]">
          {t.brandSubtitle}
        </p>
        <p className="mt-4 text-xs text-[#9E9689]">{t.common.loading}</p>
      </div>
    );
  }

  if (!user || !isVerified) {
    return <AuthGate />;
  }

  if (loadingData && !profile) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-[#ECE6D8] flex flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl sm:text-3xl font-semibold tracking-[0.14em] text-[#F4ECD8]">
          {t.brand}
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.26em] uppercase text-[#C9A86A]">
          {t.brandSubtitle}
        </p>
        <p className="mt-4 text-xs text-[#9E9689]">{t.common.loading}</p>
      </div>
    );
  }

  if (sanctuaryError && !profile) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-[#ECE6D8] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-[#C25450]/45 bg-[#131622] p-6 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-[#F4ECD8]">
            {language === 'vi' ? 'Không thể khởi tạo Huyền Thư' : 'Unable to Initialize Sanctuary'}
          </h1>
          <p className="text-xs leading-relaxed text-[#F3B7B5] break-words">{sanctuaryError}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={retrySanctuary}
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#090A0F] hover:bg-[#E2C25B] cursor-pointer"
            >
              {language === 'vi' ? 'Thử lại' : 'Retry'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[#C9A86A]/30 px-4 py-2 text-xs text-[#ECE6D8] hover:border-[#D4AF37] cursor-pointer"
            >
              {t.common.signOut}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#ECE6D8] pb-24">
      <TopNav activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'sanctuary' && (
          <SanctuaryHome
            onSelectAreaAndGo={(areaId) => {
              setSelectedAreaId(areaId);
              setActiveTab('readings');
            }}
            onNavigate={setActiveTab}
            onInspectReading={(readingId) => {
              setInspectReadingId(readingId);
              setActiveTab('archive');
            }}
          />
        )}

        {activeTab === 'readings' && (
          <TarotReadingStudio
            initialAreaId={selectedAreaId}
            onGoCheckIn={() => setActiveTab('checkin')}
          />
        )}

        {activeTab === 'archive' && (
          <ReadingArchive initialSelectedId={inspectReadingId} />
        )}

        {activeTab === 'records' && <CelestialRecords />}

        {activeTab === 'checkin' && <CheckInVault />}

        {activeTab === 'profile' && <ProfileEditor />}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8 border-t border-[#C9A86A]/15 text-xs text-[#8E8778] flex flex-wrap items-center justify-between gap-3">
        <span className="font-display tracking-[0.12em] text-[#C9A86A]">
          {t.brand} · {t.brandSubtitle}
        </span>
        <span>Mystical Manga Tarot (Rann &amp; Barbara Moore)</span>
      </footer>

      <GlobalMusicPlayer onOpenRecords={() => setActiveTab('records')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <AstralGrimoireShell />
      </MusicProvider>
    </AuthProvider>
  );
}
