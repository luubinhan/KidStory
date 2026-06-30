const CACHE_NAME = "kidstory-audio-v1";

const blobUrlByOriginal = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

async function fetchAndStore(url: string): Promise<Blob> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(url);
  if (cached?.ok) {
    return cached.blob();
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio: ${response.status}`);
  }

  await cache.put(url, response.clone());
  return response.blob();
}

async function resolveAudioSrcInternal(url: string): Promise<string> {
  const existing = blobUrlByOriginal.get(url);
  if (existing) return existing;

  try {
    const blob = await fetchAndStore(url);
    const blobUrl = URL.createObjectURL(blob);
    blobUrlByOriginal.set(url, blobUrl);
    return blobUrl;
  } catch {
    return url;
  }
}

/** Returns a blob URL for playback; fetches and caches the file once per browser. */
export function resolveAudioSrc(url: string): Promise<string> {
  const cached = blobUrlByOriginal.get(url);
  if (cached) return Promise.resolve(cached);

  const pending = inFlight.get(url);
  if (pending) return pending;

  const promise = resolveAudioSrcInternal(url).finally(() => {
    inFlight.delete(url);
  });
  inFlight.set(url, promise);
  return promise;
}

/** Warms the audio cache for a list of URLs (fire-and-forget). */
export function prefetchAudioUrls(urls: readonly string[]): void {
  for (const url of urls) {
    if (url) void resolveAudioSrc(url);
  }
}
