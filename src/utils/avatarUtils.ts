export interface AvatarPreset {
  id: string;
  labelVi: string;
  labelEn: string;
  bg: string;
  accent: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'preset:star', labelVi: 'Ngôi Sao Bắc Đẩu', labelEn: 'North Star', bg: '#131622', accent: '#D4AF37' },
  { id: 'preset:moon', labelVi: 'Trăng Huyền Bí', labelEn: 'Crescent Moon', bg: '#111827', accent: '#E5C98B' },
  { id: 'preset:sun', labelVi: 'Thái Dương Vàng', labelEn: 'Solar Sigil', bg: '#1F1612', accent: '#F0C75E' },
  { id: 'preset:eclipse', labelVi: 'Nhật Thực Đêm', labelEn: 'Midnight Eclipse', bg: '#0E121B', accent: '#C9A86A' },
];

export async function compressAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (PNG, JPG, WebP).');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image file is too large (max 8 MB before compression).');
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Failed to decode image file.'));
      el.src = imageUrl;
    });

    const size = 160;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context unavailable.');
    }

    const minSide = Math.min(img.width, img.height);
    const sx = (img.width - minSide) / 2;
    const sy = (img.height - minSide) / 2;
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

    let dataUrl = canvas.toDataURL('image/webp', 0.8);
    if (dataUrl.length > 95000 || !dataUrl.startsWith('data:image/webp')) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.78);
    }
    if (dataUrl.length > 115000) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    }
    if (dataUrl.length > 119000) {
      throw new Error('Compressed avatar exceeds storage limit. Choose a simpler image.');
    }
    return dataUrl;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
