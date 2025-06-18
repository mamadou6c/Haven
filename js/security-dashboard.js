/* Security Dashboard JavaScript */
'use strict';

let sessionStart = Date.now();

function refreshData() {
    const logs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
    updateStats(logs);
    displayLogs(logs);
}

function updateStats(logs) {
    document.getElementById('total-events').textContent = logs.length;
    document.getElementById('violations').textContent = logs.filter(l => l.event === 'csp_violation').length;
    document.getElementById('blocked-attempts').textContent = logs.filter(l => l.event.includes('blocked') || l.event.includes('prevented')).length;
    
    const sessionMinutes = Math.floor((Date.now() - sessionStart) / 60000);
    document.getElementById('session-time').textContent = sessionMinutes + 'm';
}

function displayLogs(logs) {
    const container = document.getElementById('logs-container');
    
    if (logs.length === 0) {
        container.innerHTML = '<p class="no-events">No security events logged yet</p>';
        return;
    }

    container.innerHTML = logs.slice(-20).reverse().map(log => {
        const severity = getSeverity(log.event);
        return `
            <div class="log-entry ${severity}">
                <div class="log-timestamp">${new Date(log.timestamp).toLocaleString()}</div>
                <div class="log-message">
                    <strong>${log.event.replace(/_/g, ' ').toUpperCase()}</strong>
                    ${log.details ? ': ' + JSON.stringify(log.details) : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getSeverity(event) {
    if (event.includes('violation') || event.includes('tampering') || event.includes('injection')) {
        return 'error';
    }
    if (event.includes('blocked') || event.includes('prevented') || event.includes('suspicious')) {
        return 'warning';
    }
    return 'info';
}

function clearLogs() {
    if (confirm('Are you sure you want to clear all security logs?')) {
        sessionStorage.removeItem('securityLogs');
        refreshData();
    }
}

function exportLogs() {
    const logs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function checkForAlerts() {
    const logs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
    const recentLogs = logs.filter(l => Date.now() - new Date(l.timestamp).getTime() < 300000); // Last 5 minutes
    
    const alertsContainer = document.getElementById('alerts');
    alertsContainer.innerHTML = '';

    if (recentLogs.filter(l => l.event === 'csp_violation').length > 3) {
        alertsContainer.innerHTML += '<div class="alert">High number of CSP violations detected in the last 5 minutes</div>';
    }

    if (recentLogs.filter(l => l.event === 'dev_tools_attempts').length > 0) {
        alertsContainer.innerHTML += '<div class="alert">Developer tools access attempts detected</div>';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    refreshData();
    checkForAlerts();
    
    // Auto-refresh every 5 seconds
    setInterval(() => {
        refreshData();
        checkForAlerts();
    }, 5000);
});