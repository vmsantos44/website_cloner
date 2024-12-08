// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDaEYMMxr2ZoFbimp_jmEbVv2s94AIpkcM",
    authDomain: "clone-websites.firebaseapp.com",
    projectId: "clone-websites",
    storageBucket: "clone-websites.firebasestorage.app",
    messagingSenderId: "885061123776",
    appId: "1:885061123776:web:5ebd43a3b7a936ddad7725"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchRecentSessions() {
    try {
        const sessionsRef = collection(db, 'cloning_sessions');
        const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const sessionsContainer = document.getElementById('recent-sessions');
        sessionsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const sessionElement = document.createElement('div');
            sessionElement.className = 'session-card';
            sessionElement.innerHTML = `
                <h3>Session ${doc.id}</h3>
                <p>Domain: ${data.domain || 'N/A'}</p>
                <p>URLs Processed: ${data.urls_processed || 0}</p>
                <p>Success Rate: ${data.successful_downloads ? ((data.successful_downloads / data.urls_processed) * 100).toFixed(2) : 0}%</p>
                <p>Duration: ${data.duration_seconds || 0}s</p>
                <p>Time: ${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'}</p>
            `;
            sessionsContainer.appendChild(sessionElement);
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        document.getElementById('recent-sessions').innerHTML = `<p class="error">Error loading sessions: ${error.message}</p>`;
    }
}

async function fetchRecentErrors() {
    try {
        const errorsRef = collection(db, 'error_logs');
        const q = query(errorsRef, orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const errorsContainer = document.getElementById('recent-errors');
        errorsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Skip entries with undefined error_message
            if (!data.error_message) return;
            
            const errorElement = document.createElement('div');
            errorElement.className = 'error-card';
            
            // Format the error message for better readability
            const errorMessage = data.error_message.split(' for url:')[0];
            const urlMessage = data.error_message.includes(' for url:') ? 
                data.error_message.split(' for url:')[1].trim() : '';
            
            errorElement.innerHTML = `
                <div class="error-header">
                    <h3>${data.error_type || 'Unknown Error'}</h3>
                    <span class="error-time">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'}</span>
                </div>
                <div class="error-content">
                    <p class="error-message">${errorMessage}</p>
                    ${urlMessage ? `<p class="error-url">URL: ${urlMessage}</p>` : ''}
                    <p class="error-domain">Domain: ${data.domain || 'Unknown Domain'}</p>
                </div>
            `;
            errorsContainer.appendChild(errorElement);
        });
        
        // Show message if no errors
        if (errorsContainer.children.length === 0) {
            errorsContainer.innerHTML = '<p class="no-data">No errors found</p>';
        }
    } catch (error) {
        console.error("Error fetching errors:", error);
        document.getElementById('recent-errors').innerHTML = `<p class="error">Error loading error logs: ${error.message}</p>`;
    }
}

// Add loading indicators
document.getElementById('recent-sessions').innerHTML = '<p class="loading">Loading sessions...</p>';
document.getElementById('recent-errors').innerHTML = '<p class="loading">Loading errors...</p>';

// Refresh data every 30 seconds
setInterval(() => {
    fetchRecentSessions();
    fetchRecentErrors();
}, 30000);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchRecentSessions();
    fetchRecentErrors();
});
