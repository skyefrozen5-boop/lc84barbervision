// ---- Firebase Cloud Messaging (notificações push) ----
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBuvvgURlutS_yxeAPh9rdQ8bXDI3Vrg58",
  authDomain: "lc84barbervision.firebaseapp.com",
  projectId: "lc84barbervision",
  storageBucket: "lc84barbervision.firebasestorage.app",
  messagingSenderId: "879396679098",
  appId: "1:879396679098:web:89d625af9db65c647b4183",
});

const messaging = firebase.messaging();

// Mensagem recebida com a app fechada/em segundo plano
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "LC.84 Barber Vision";
  const body = payload.notification?.body || "";
  const data = payload.data || {};
  self.registration.showNotification(title, {
    body,
    icon: "/favicon-192.png",
    badge: "/favicon-192.png",
    data,
  });
});

// Clique na notificação -> abrir/focar a app na conversa certa
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  let url = "/";
  if (data.type === "chat" && data.barberId) {
    url = `/?openChat=${encodeURIComponent(data.barberId)}__${encodeURIComponent(data.clientKey || "")}`;
  }
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

const CACHE_NAME = "lc84-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estratégia simples: tenta a rede primeiro, cai para cache se offline (sem cache de dados da API)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // não intercetar chamadas ao Supabase

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
