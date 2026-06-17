const fallbackProductImageSrc = "/window.svg";
const allowedRemoteImageHosts = new Set(["img.danuri.io"]);

export function isSupportedProductImageUrl(imageUrl: string) {
  if (imageUrl.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(imageUrl);
    return url.protocol === "https:" && allowedRemoteImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}

export function getProductImageSrc(imageUrl: string) {
  if (isSupportedProductImageUrl(imageUrl)) {
    return imageUrl;
  }

  return fallbackProductImageSrc;
}
