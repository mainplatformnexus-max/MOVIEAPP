const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "https://ruopqthulidyyeilpcli.supabase.co") as string;

// A list of domains known to allow cross-origin playback (extend as needed)
const CORS_FRIENDLY_DOMAINS = [
  "commondatastorage.googleapis.com",
  "storage.googleapis.com",
  "supabase.co",
  "cloudflare-ipfs.com",
  "cdn.jsdelivr.net",
];

function isCORSFriendly(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    // Google Drive is NOT CORS friendly for direct playback but we handle it via proxy
    if (hostname.includes("drive.google.com")) return false;
    return CORS_FRIENDLY_DOMAINS.some((d) => hostname.endsWith(d));
  } catch {
    return false;
  }
}

/**
 * Converts a Google Drive share link to a direct download link
 */
function formatGoogleDriveUrl(url: string): string {
  if (url.includes("drive.google.com")) {
    // Handle various formats of Google Drive links
    const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^\&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
}

/**
 * Given a video URL, return a playable URL:
 * - If the host is known CORS-friendly, return as-is.
 * - Otherwise proxy through the Cloud edge function.
 */
export function getPlayableVideoUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return undefined;

  let url = formatGoogleDriveUrl(rawUrl);

  // Directly return if it's a common video format to speed up loading
  if (url.endsWith('.mp4') || url.endsWith('.m3u8') || url.includes('.mp4?')) {
    return url;
  }

  if (isCORSFriendly(url)) {
    return url;
  }

  // Encode and proxy via edge function
  const proxyUrl = `${SUPABASE_URL}/functions/v1/video-proxy`;
  return `${proxyUrl}?url=${encodeURIComponent(url)}`;
}
