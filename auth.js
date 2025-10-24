import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS2MdSJ0zlAF6YlNfdAprjW0dhWBuVyX8",
  authDomain: "github-pages-login.firebaseapp.com",
  projectId: "github-pages-login",
  storageBucket: "github-pages-login.firebasestorage.app",
  messagingSenderId: "1033761045163",
  appId: "1:1033761045163:web:6042c6fd2aa21cd24795ee",
  measurementId: "G-6MWLMEB6SW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Check authentication state
onAuthStateChanged(auth, (user) => {
  const loginForm = document.getElementById('loginForm');
  const protectedContent = document.getElementById('protected');
  const loginError = document.getElementById('loginError');

  if (user) {
    // User is signed in
    if (loginForm) loginForm.style.display = 'none';
    if (protectedContent) protectedContent.style.display = 'block';
    if (loginError) loginError.classList.remove('show');
  } else {
    // User is signed out
    if (loginForm) loginForm.style.display = 'block';
    if (protectedContent) protectedContent.style.display = 'none';
  }
});

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
  const loginFormElement = document.getElementById('loginFormElement');
  
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginError = document.getElementById('loginError');
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        if (loginError) {
          loginError.textContent = '';
          loginError.classList.remove('show');
        }
      } catch (error) {
        console.error('Login error:', error);
        if (loginError) {
          loginError.textContent = error.message;
          loginError.classList.add('show');
        }
      }
    });
  }
});

// Logout function (global scope for onclick handlers)
window.logout = async () => {
  try {
    await signOut(auth);
    // Redirect to home or login page
    window.location.href = 'index.html#login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Refresh data function (global scope for onclick handlers)
window.refreshData = () => {
  const userCount = document.getElementById('userCount');
  const projectCount = document.getElementById('projectCount');
  const messageCount = document.getElementById('messageCount');
  const pageViews = document.getElementById('pageViews');
  const visitors = document.getElementById('visitors');

  if (userCount) userCount.textContent = Math.floor(Math.random() * 100) + 20;
  if (projectCount) projectCount.textContent = Math.floor(Math.random() * 30) + 10;
  if (messageCount) messageCount.textContent = Math.floor(Math.random() * 200) + 50;
  if (pageViews) pageViews.textContent = (Math.floor(Math.random() * 5000) + 1000).toLocaleString();
  if (visitors) visitors.textContent = (Math.floor(Math.random() * 3000) + 500).toLocaleString();
};