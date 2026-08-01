// lib/photo-config.ts
export interface PhotoConfig {
  objectPosition: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  transform?: string;
  transformOrigin?: string;
  // Optional override applied only on mobile (below Tailwind's `sm` 640px
  // breakpoint). The Gallery photo box has a different shape on mobile
  // (min-h-[320px] w-full) than on desktop (aspect-[653/785]), so a crop
  // tuned for one often looks wrong on the other — set `mobile` on a
  // photo to give it its own crop instead of reusing the desktop one.
  // Any field left out here falls back to the desktop value above it.
  mobile?: Partial<Omit<PhotoConfig, "mobile">>;
}

// Cấu hình cho từng ảnh - dùng tên file
export const photoConfigs: Record<string, PhotoConfig> = {
  // Định dạng: "tên-file.webp": { objectPosition: "giá trị", mobile: { objectPosition: "giá trị khác cho mobile" } }
  "gallery-03.webp": { objectPosition: "center 80%" },
  "gallery-04.webp": { objectPosition: "bottom" },
  "gallery-05.webp": {
    objectPosition: "center -65%",
    transform: 'scale(1.5) translateX(32px)',
    transformOrigin: "bottom", // <-- Rất quan trọng để khi zoom ảnh không bị lệch tâm
    mobile:{
      transform: 'scale(1.5) translateX(20px)',
    }
  },
  "gallery-06.webp": { objectPosition: "bottom" },
  "gallery-07.webp": { objectPosition: "center 65%" },
  "gallery-08.webp": { objectPosition: "bottom" },
  "gallery-09.webp": { objectPosition: "bottom" },
  "gallery-10.webp": { objectPosition: "bottom" },
};

const DEFAULT_PHOTO_CONFIG: PhotoConfig = { objectFit: "cover", objectPosition: "center" };

// Tra cứu config theo tên file (lấy từ cuối đường dẫn, vd "/images/gallery-03.webp" -> "gallery-03.webp").
// Không có entry thì dùng mặc định object-cover/center như trước giờ.
// `isMobile`: true thì lấy thêm override trong `mobile` (nếu có) đè lên trên.
export function getPhotoConfig(src: string, isMobile = false): PhotoConfig {
  const filename = src.split("/").pop() ?? src;
  const config = photoConfigs[filename];
  const merged = { ...DEFAULT_PHOTO_CONFIG, ...config };
  if (isMobile && config?.mobile) {
    return { ...merged, ...config.mobile };
  }
  return merged;
}
