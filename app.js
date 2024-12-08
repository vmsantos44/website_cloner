// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    // Firebase config will be added here
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
                <p>Domain: ${data.domain}</p>
                <p>URLs Processed: ${data.urls_processed}</p>
                <p>Success Rate: ${((data.successful_downloads / data.urls_processed) * 100).toFixed(2)}%</p>
                <p>Duration: ${data.duration_seconds}s</p>
                <p>Time: ${new Date(data.timestamp.toDate()).toLocaleString()}</p>
            `;
            sessionsContainer.appendChild(sessionElement);
        });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        document.getElementById('recent-sessions').innerHTML = '<p class="error">Error loading sessions</p>';
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
            const errorElement = document.createElement('div');
            errorElement.className = 'error-card';
            errorElement.innerHTML = `
                <h3>Error in ${data.domain}</h3>
                <p>URL: ${data.url}</p>
                <p>Error: ${data.error_message}</p>
                <p>Time: ${new Date(data.timestamp.toDate()).toLocaleString()}</p>
            `;
            errorsContainer.appendChild(errorElement);
        });
    } catch (error) {
        console.error("Error fetching errors:", error);
        document.getElementById('recent-errors').innerHTML = '<p class="error">Error loading error logs</p>';
    }
}

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
