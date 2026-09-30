// Public release metadata only. Never put a GitHub token in browser code.
const repository = 'GTREPAT/PhotoManager.Downloads';
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
      status.textContent = 'Todavía no hay un instalador público disponible. Consulta aquí las próximas versiones.';
      return;
    }
    if (!response.ok) throw new Error(`Release lookup: ${response.status}`);
    const release = await response.json();
    title.textContent = release.tag_name ? `PhotoManager ${release.tag_name}` : 'Última versión';
    const asset = (release.assets || []).find(item => /^PhotoManager-Setup-.*\.exe$/i.test(item.name));
    if (!asset) {
      status.textContent = 'La versión está publicada, pero todavía no incluye el instalador para Windows.';
      return;
    }
    const download = new URL(asset.browser_download_url);
    if (download.protocol !== 'https:' || download.hostname !== 'github.com' || !download.pathname.startsWith(`/${repository}/releases/download/`)) throw new Error('Unexpected download URL');
    link.href = download.href;
    link.textContent = 'Descargar para Windows';
    status.textContent = 'Última versión estable disponible.';
    const date = new Date(release.published_at);
    const size = Number.isFinite(asset.size) ? `${(asset.size / 1024 / 1024).toFixed(1)} MB` : 'EXE';
    meta.textContent = `${size} · Windows x64${Number.isNaN(date.getTime()) ? '' : ` · ${date.toLocaleDateString('es-ES')}`}`;
  } catch {
    status.textContent = 'No se ha podido comprobar la última versión. Consulta las descargas en GitHub.';
  }
}
loadRelease();
