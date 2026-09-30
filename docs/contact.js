const copyEmail = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
copyEmail.hidden = false;
copyEmail.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('gerardtrepat@gmail.com');
    copyStatus.textContent = 'Correo copiado.';
  } catch {
    copyStatus.textContent = 'No se pudo copiar. Selecciona la dirección y cópiala manualmente.';
  }
});
