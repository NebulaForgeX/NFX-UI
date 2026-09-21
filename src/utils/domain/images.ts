import { API_ENDPOINTS, URL_PATHS } from "../../apis/ip";

export const DEFAULT_AVATAR_SRC = "/default-avatar.png";

export const buildImageUrl = (imageId: Nilable<string>): string => {
  if (!imageId) return "";
  if (imageId.startsWith("http://") || imageId.startsWith("https://")) {
    return imageId;
  }
  return `${API_ENDPOINTS.IDENTITY}${URL_PATHS.ASSET.Images.fileById(imageId)}`;
};

export function buildAvatarImageSrc(avatarImageId: Nilable<string>): string {
  return avatarImageId ? buildImageUrl(avatarImageId) : DEFAULT_AVATAR_SRC;
}

export const resolveAvatarSrc = (imageId: Nilable<string>): string => buildImageUrl(imageId) || DEFAULT_AVATAR_SRC;

async function compressImageBlob(file: File, maxSize: number = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to compress image"));
        },
        "image/png",
        0.9,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
}

export async function compressImage(file: File): Promise<File> {
  const compressedBlob = await compressImageBlob(file, 800);
  return new File([compressedBlob], `avatar_${Date.now()}.png`, {
    type: "image/png",
  });
}
