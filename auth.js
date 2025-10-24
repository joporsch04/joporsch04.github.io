// Import Firebase modules from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Function to fetch protected data from Firestore
async function fetchDashboardData(userId) {
  try {
    const docRef = doc(db, 'dashboard', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No dashboard data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}

// Function to populate dashboard with fetched data
function populateDashboard(data) {
  if (!data) return;
  
  // Update stats
  const userCount = document.getElementById('userCount');
  const projectCount = document.getElementById('projectCount');
  const messageCount = document.getElementById('messageCount');
  const revenueCount = document.getElementById('revenueCount');
  
  if (userCount) userCount.textContent = data.users || '0';
  if (projectCount) projectCount.textContent = data.projects || '0';
  if (messageCount) messageCount.textContent = data.messages || '0';
  if (revenueCount) revenueCount.textContent = data.revenue || '$0';
  
  // Update analytics
  const pageViews = document.getElementById('pageViews');
  const visitors = document.getElementById('visitors');
  const bounceRate = document.getElementById('bounceRate');
  const avgSession = document.getElementById('avgSession');
  
  if (pageViews) pageViews.textContent = data.pageViews?.toLocaleString() || '0';
  if (visitors) visitors.textContent = data.visitors?.toLocaleString() || '0';
  if (bounceRate) bounceRate.textContent = data.bounceRate || '0%';
  if (avgSession) avgSession.textContent = data.avgSession || '0:00';
  
  // Update activity list
  const activityList = document.getElementById('activityList');
  if (activityList && data.activities) {
    activityList.innerHTML = data.activities.map(activity => `
      <div class="activity-item">
        <span class="activity-user">${activity.user}</span>
        <span class="activity-text">${activity.action}</span>
        <span class="activity-time">${activity.time}</span>
      </div>
    `).join('');
  }
}

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  const loginForm = document.getElementById('loginForm');
  const protectedContent = document.getElementById('protected');
  const loginError = document.getElementById('loginError');

  if (user) {
    // User is signed in - fetch protected data
    const dashboardData = await fetchDashboardData(user.uid);
    
    if (dashboardData) {
      populateDashboard(dashboardData);
      if (loginForm) loginForm.style.display = 'none';
      if (protectedContent) protectedContent.style.display = 'block';
      if (loginError) loginError.classList.remove('show');
    } else {
      // If no data found, show error and sign out
      if (loginError) {
        loginError.textContent = 'Access denied: No dashboard data available';
        loginError.classList.add('show');
      }
      await signOut(auth);
    }
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
          loginError.textContent = 'Invalid credentials';
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
    window.location.href = 'index.html#login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Refresh data function - fetch from Firestore
window.refreshData = async () => {
  const user = auth.currentUser;
  if (user) {
    const dashboardData = await fetchDashboardData(user.uid);
    if (dashboardData) {
      populateDashboard(dashboardData);
    }
  }
};