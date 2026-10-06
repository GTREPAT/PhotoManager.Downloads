const repository = websiteMessages.repository;
const title = document.querySelector('#release-title');
const status = document.querySelector('#release-status');
const link = document.querySelector('#download-link');
const meta = document.querySelector('#release-meta');
async function loadRelease() {
  try {
    const response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(8000)
    });
    if (response.status === 404) {
      status.textContent = websiteMessages.unavailable;
      return;
    }
    if (!response.ok) throw new Error(`Release lookup: ${response.status}`);
    const release = await response.json();
    const asset = (release.assets || []).find(item => /^PhotoManager-Setup-.*\.exe$/i.test(item.name));
    if (!asset) {
      status.textContent = websiteMessages.missing;
      return;
    }
    const download = new URL(asset.browser_download_url);
    if (download.protocol !== 'https:' || download.hostname !== 'github.com'
      || !download.pathname.startsWith(`/${repository}/releases/download/`)) throw new Error('Unexpected download URL');
    title.textContent = release.tag_name ? `PhotoManager ${release.tag_name}` : websiteMessages.latestTitle;
    link.href = download.href;
    link.textContent = websiteMessages.download;
    status.textContent = websiteMessages.latest;
    const date = new Date(release.published_at);
    const size = Number.isFinite(asset.size)
      ? `${new Intl.NumberFormat(websiteMessages.dateLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(asset.size / 1024 / 1024)} MB` : 'EXE';
    meta.textContent = `${size} · Windows x64${Number.isNaN(date.getTime()) ? '' : ` · ${date.toLocaleDateString(websiteMessages.dateLocale)}`}`;
  } catch {
    status.textContent = websiteMessages.error;
  }
}
loadRelease();
