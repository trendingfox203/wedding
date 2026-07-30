// lib/photo-config.ts
export interface PhotoConfig {
  objectPosition: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  transform?: string;
  transformOrigin?: string;
}

// Cấu hình cho từng ảnh - dùng tên file
export const photoConfigs: Record<string, PhotoConfig> = {
  // Định dạng: "tên-file.webp": { objectPosition: "giá trị" }
  "gallery-03.webp": { objectPosition: "center 80%" },
  "gallery-04.webp": { objectPosition: "bottom" },
  "gallery-05.webp": { 
    objectPosition: "center -100%", 
    transform: 'scale(2) translateX(20px)',
    transformOrigin: "bottom" // <-- Rất quan trọng để khi zoom ảnh không bị lệch tâm
  },
  "gallery-06.webp": { objectPosition: "bottom" },
  "gallery-07.webp": { objectPosition: "bottom" },
  "gallery-08.webp": { objectPosition: "bottom" },
  "gallery-09.webp": { objectPosition: "bottom" },
  "gallery-10.webp": { objectPosition: "bottom" },
};

const DEFAULT_PHOTO_CONFIG: PhotoConfig = { objectFit: "cover", objectPosition: "center" };

// Tra cứu config theo tên file (lấy từ cuối đường dẫn, vd "/images/gallery-03.webp" -> "gallery-03.webp").
// Không có entry thì dùng mặc định object-cover/center như trước giờ.
export function getPhotoConfig(src: string): PhotoConfig {
  const filename = src.split("/").pop() ?? src;
  // Dùng spread (...) để gộp default và custom config (Nếu custom có transform, nó sẽ đè lên default)
  return { ...DEFAULT_PHOTO_CONFIG, ...photoConfigs[filename] };
}