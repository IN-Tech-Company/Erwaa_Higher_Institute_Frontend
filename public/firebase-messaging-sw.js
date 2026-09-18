/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAEv7C8G9oR630qeRx6iVLsk3VsIFw4XSY',
  authDomain: 'nabd-plus.firebaseapp.com',
  projectId: 'nabd-plus',
  storageBucket: 'nabd-plus.firebasestorage.app',
  messagingSenderId: '57625988530',
  appId: '1:57625988530:web:1522292faecd04e84228ab',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'Nabd Plus';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: (payload.notification && payload.notification.icon) || '/assets/images/logo/icon.png',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});
