import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { supabase } from "./supabaseClient";

// Mesma configuração que está guardada na consola do Firebase
// (Configurações do projeto → Geral)
const firebaseConfig = {
  apiKey: "AIzaSyBuvvgURlutS_yxeAPh9rdQ8bXDI3Vrg58",
  authDomain: "lc84barbervision.firebaseapp.com",
  projectId: "lc84barbervision",
  storageBucket: "lc84barbervision.firebasestorage.app",
  messagingSenderId: "879396679098",
  appId: "1:879396679098:web:89d625af9db65c647b4183",
};

// Chave VAPID (Configurações do projeto → Cloud Messaging → Certificados push da Web)
const VAPID_KEY =
  "BCwPU1fJLWJa19jeagbGSlIRJFAqWpZ6GA9mVsbm5PPpuf_lcaU_Pa6cIZY3qvvuQWcXvf_n8IWBo0mzUfEqw2s";

let firebaseApp = null;
function getFirebaseApp() {
  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

// Pede permissão de notificações ao barbeiro e guarda o "token" deste
// telemóvel na tabela device_tokens, associado à loja e ao barbeiro.
// Falha em silêncio (não interrompe o login) se algo correr mal —
// por exemplo browsers/dispositivos sem suporte a notificações push.
export async function registerPushForBarber(shopId, barberId) {
  try {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return;
    if (!shopId || !barberId) return;
    if (!(window.isSecureContext)) return; // push só funciona em HTTPS

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;


    await supabase.from("device_tokens").upsert(
      {
        shop_id: shopId,
        barber_id: String(barberId),
        token,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "token" },
    );
  } catch (e) {
    console.log("Falha ao registar notificações push:", e);
  }
}

// Quando a app está ABERTA em primeiro plano, o Firebase não mostra a
// notificação do sistema sozinho — é preciso ouvir e decidir o que fazer.
// Devolve uma função para cancelar a subscrição, se for preciso.
export function listenForegroundPush(onPush) {
  try {
    const messaging = getMessaging(getFirebaseApp());
    return onMessage(messaging, (payload) => {
      onPush?.(payload);
    });
  } catch (e) {
    console.log("Falha a ouvir notificações em primeiro plano:", e);
    return () => {};
  }
}

// Pede permissão de notificações ao cliente e guarda o "token" deste
// telemóvel na tabela device_tokens, associado à loja e ao telefone
// que o cliente usa no chat (client_key).
// Falha em silêncio (não interrompe o chat) se algo correr mal.
export async function registerPushForClient(shopId, clientKey) {
  try {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return;
    if (!shopId || !clientKey) return;
    if (!(window.isSecureContext)) return; // push só funciona em HTTPS

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const messaging = getMessaging(getFirebaseApp());
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;

    await supabase.from("device_tokens").upsert(
      {
        shop_id: shopId,
        client_key: String(clientKey),
        token,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "token" },
    );
  } catch (e) {
    console.log("Falha ao registar notificações push (cliente):", e);
  }
}
