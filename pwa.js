if ('serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.warn('No se pudo preparar el uso sin conexión:', error);
    });
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

let installPrompt;
const installButton = document.createElement('button');
installButton.type = 'button';
installButton.textContent = 'Instalar app';
installButton.hidden = true;
installButton.style.cssText = 'position:fixed;left:16px;bottom:20px;z-index:1000;background:#FF5A1F;color:#fff;border:0;border-radius:12px;padding:14px 20px;font:700 15px system-ui,sans-serif;box-shadow:0 4px 18px #0003;cursor:pointer';
document.body.append(installButton);

window.addEventListener('beforeinstallprompt', event => {
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installPrompt = undefined;
  installButton.hidden = true;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installButton.disabled = true;
  try {
    await installPrompt.prompt();
    await installPrompt.userChoice;
  } catch (error) {
    console.warn('No se pudo abrir la instalación:', error);
  } finally {
    installPrompt = undefined;
    installButton.hidden = true;
    installButton.disabled = false;
  }
});

