<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Login Demo</title>
  <script type="module">
    // Firebase SDK importieren
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

    // TODO: Hier dein eigenes Firebase-Config-Objekt einsetzen:
    const firebaseConfig = {
      apiKey: "DEIN_API_KEY",
      authDomain: "deinprojekt.firebaseapp.com",
      projectId: "deinprojekt",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Login-Handler
    async function login() {
      const email = document.getElementById("email").value;
      const pw = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, pw);
      } catch (e) {
        alert(e.message);
      }
    }

    // Logout
    function logout() { signOut(auth); }

    // Auth-Status beobachten
    onAuthStateChanged(auth, user => {
      document.getElementById("protected").style.display = user ? "block" : "none";
      document.getElementById("loginForm").style.display = user ? "none" : "block";
    });

    window.login = login;
    window.logout = logout;
  </script>
</head>
<body>
  <div id="loginForm">
    <input id="email" placeholder="Email"><br>
    <input id="password" type="password" placeholder="Passwort"><br>
    <button onclick="login()">Login</button>
  </div>

  <div id="protected" style="display:none;">
    <p>Geheime Inhalte nur für angemeldete Nutzer.</p>
    <button onclick="logout()">Logout</button>
  </div>
</body>
</html>
