export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDJ3lptbYFs_lI4pYlKD267e2HeVBuEmkI",
    authDomain: "salle-de-spectacle.firebaseapp.com",
    projectId: "salle-de-spectacle",
    storageBucket: "salle-de-spectacle.firebasestorage.app",
    messagingSenderId: "269015091100",
    appId: "1:269015091100:web:c07b716cbd17a9977c6a59",
    measurementId: "G-6JTLLPQ4XN"
  },
  useEmulators: false,
  emulatorConfig: {
    firestore: {
      host: '127.0.0.1',
      port: 8080
    },
    auth: {
      host: '127.0.0.1',
      port: 9099
    },
    hosting: {
      host: '127.0.0.1',
      port: 5003
    }
  }
};
