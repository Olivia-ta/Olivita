import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  LogOut,
  Save,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCopy } from '../i18n/translations';
import { updateUserProfile } from '../services/firestoreService';
import type { Language } from '../types/tarot';
import { AVATAR_PRESETS, compressAvatarFile } from '../utils/avatarUtils';
import { AvatarDisplay } from './AvatarDisplay';

export function ProfileEditor() {
  const { user, profile, language, setUiLanguage, logout } = useAuth();
  const t = getCopy(language);

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [mysticTitle, setMysticTitle] = useState(profile?.mysticTitle || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || 'preset:star');
  const [prefLang, setPrefLang] = useState<Language>(profile?.language || language);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setMysticTitle(profile.mysticTitle);
      setAvatarUrl(profile.avatarUrl);
      setPrefLang(profile.language);
    }
  }, [profile?.displayName, profile?.mysticTitle, profile?.avatarUrl, profile?.language]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setErrorMsg(null);
    setSavedMsg(null);
    try {
      const compressed = await compressAvatarFile(file);
      setAvatarUrl(compressed);
      if (user) {
        await updateUserProfile(user.uid, {
          displayName: displayName || profile?.displayName || 'Astral Seeker',
          mysticTitle: mysticTitle || profile?.mysticTitle || '',
          avatarUrl: compressed,
          language: prefLang,
        });
        setSavedMsg(t.profile.savedSuccess);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setErrorMsg(null);
    setSavedMsg(null);
    try {
      await updateUserProfile(user.uid, {
        displayName,
        mysticTitle,
        avatarUrl,
        language: prefLang,
      });
      setUiLanguage(prefLang);
      setSavedMsg(t.profile.savedSuccess);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#C9A86A]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F4ECD8]">
            {t.profile.title}
          </h1>
          <p className="mt-1 text-sm text-[#B8B0A0]">{t.profile.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-[#C25450]/40 bg-[#131622] px-4 py-2 text-xs font-medium text-[#F3B7B5] hover:bg-[#C25450]/15 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t.common.signOut}</span>
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-[#C9A86A]/25 bg-[#131622] p-6 sm:p-8 space-y-6"
      >
        {/* Avatar Section */}
        <div className="flex flex-wrap items-center gap-6 border-b border-[#C9A86A]/15 pb-6">
          <AvatarDisplay
            avatarUrl={avatarUrl}
            displayName={displayName}
            sizeClass="w-20 h-20"
          />

          <div className="flex-1 min-w-[240px] space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-lg border border-[#C9A86A]/35 bg-[#0D1018] px-3.5 py-2 text-xs font-semibold text-[#F4ECD8] hover:border-[#D4AF37] transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span>
                  {uploadingAvatar
                    ? t.common.saving
                    : t.profile.avatarUpload}
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-[#8E8778]">{t.profile.avatarHint}</p>

            <div className="pt-1">
              <p className="text-xs text-[#B8B0A0] mb-2">{t.profile.presetsLabel}</p>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((preset) => {
                  const selected = avatarUrl === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.id)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#D4AF37] bg-[#181C2A] text-[#D4AF37]'
                          : 'border-[#C9A86A]/20 bg-[#0D1018] text-[#C8C0B0] hover:border-[#C9A86A]/50'
                      }`}
                    >
                      <AvatarDisplay avatarUrl={preset.id} sizeClass="w-4 h-4" />
                      <span>{language === 'vi' ? preset.labelVi : preset.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Account Email (Read-Only Verified) */}
        <div className="rounded-lg border border-[#C9A86A]/15 bg-[#0D1018] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-[#8E8778]">{t.profile.accountEmail}</p>
            <p className="text-sm font-mono text-[#F4ECD8]">{profile?.email || user?.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#A8DFCA]">
            <ShieldCheck className="h-4 w-4" />
            <span>{t.profile.verifiedBadge}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-medium text-[#C8C0B0] mb-1.5">
              {t.profile.displayName}
            </label>
            <input
              id="profile-name"
              type="text"
              required
              maxLength={80}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="profile-title" className="block text-xs font-medium text-[#C8C0B0] mb-1.5">
              {t.profile.mysticTitle}
            </label>
            <input
              id="profile-title"
              type="text"
              maxLength={120}
              value={mysticTitle}
              onChange={(e) => setMysticTitle(e.target.value)}
              className="w-full rounded-lg border border-[#C9A86A]/25 bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4ECD8] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#C8C0B0] mb-2">
            {t.profile.language}
          </label>
          <div className="grid grid-cols-2 gap-2 max-w-xs rounded-lg bg-[#0D1018] p-1 border border-[#C9A86A]/15">
            <button
              type="button"
              onClick={() => setPrefLang('vi')}
              className={`rounded-md py-2 text-xs font-medium transition-colors cursor-pointer ${
                prefLang === 'vi' ? 'bg-[#181C2A] text-[#D4AF37]' : 'text-[#9E9689]'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setPrefLang('en')}
              className={`rounded-md py-2 text-xs font-medium transition-colors cursor-pointer ${
                prefLang === 'en' ? 'bg-[#181C2A] text-[#D4AF37]' : 'text-[#9E9689]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-[#C25450]/45 bg-[#C25450]/10 p-3 text-xs text-[#F3B7B5]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {savedMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-[#4B8F78]/45 bg-[#4B8F78]/10 p-3 text-xs text-[#A8DFCA]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#090A0F] hover:bg-[#E2C25B] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? t.common.saving : t.common.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
