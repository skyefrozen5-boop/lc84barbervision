import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Quando uma nova versão assume o controlo, recarrega automaticamente
      // (a nossa sw.js já ativa a nova versão sozinha via skipWaiting/clients.claim,
      //  isto só falta dizer à página aberta para ir buscar o código novo)
      let alreadyRefreshed = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (alreadyRefreshed) return;
        alreadyRefreshed = true;
        window.location.reload();
      });
      // verifica se há versão nova: ao voltar a abrir a app, e de vez em quando enquanto está aberta
      const checkForUpdate = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
      setInterval(checkForUpdate, 15 * 60 * 1000); // a cada 15 minutos
    }).catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
