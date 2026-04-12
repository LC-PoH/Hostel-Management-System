// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    
    // Store user data in sessionStorage
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userName', username);

    // Show notification
    showNotification(`Welcome ${username}! Logging in as ${role}...`, 'success');
    
    // Redirect based on role
    setTimeout(() => {
        if (role === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (role === 'owner') {
            window.location.href = 'owner-dashboard.html';
        } else if (role === 'receptionist') {
            window.location.href = 'receptionist-dashboard.html';
        }
    }, 1000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        showNotification('You have been logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
}

// Check authentication
function checkAuth() {
    const userRole = sessionStorage.getItem('userRole');
    if (!userRole) {
        window.location.href = 'index.html';
    }
    return userRole;
}

// Get user name
function getUserName() {
    return sessionStorage.getItem('userName') || 'User';
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: #ffffff;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
        font-size: 0.95rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle form submissions
function handleCheckIn(event) {
    event.preventDefault();
    showNotification('✓ Student checked in successfully!', 'success');
    closeModal('checkInModal');
    event.target.reset();
}

function handleCheckOut(event) {
    event.preventDefault();
    showNotification('✓ Student checked out successfully!', 'success');
    closeModal('checkOutModal');
    event.target.reset();
}

function handleRegister(event) {
    event.preventDefault();
    showNotification('✓ Student registered successfully!', 'success');
    closeModal('registerModal');
    event.target.reset();
}

function handlePayment(event) {
    event.preventDefault();
    showNotification('✓ Payment processed successfully!', 'success');
    closeModal('paymentModal');
    event.target.reset();
}

function handleRoomAdd(event) {
    event.preventDefault();
    showNotification('✓ Room added successfully!', 'success');
    closeModal('addRoomModal');
    event.target.reset();
}

function handleStudentAdd(event) {
    event.preventDefault();
    showNotification('✓ Student registered successfully!', 'success');
    closeModal('addStudentModal');
    event.target.reset();
}

function handleRoomChange(event) {
    event.preventDefault();
    showNotification('✓ Room change request submitted!', 'success');
    closeModal('roomChangeModal');
    event.target.reset();
}

function handleComplaint(event) {
    event.preventDefault();
    showNotification('✓ Your complaint has been submitted!', 'success');
    closeModal('complaintModal');
    event.target.reset();
}

// Navigation
function setActivePage(event, pageId) {
    if (event) {
        event.preventDefault();
    }

    // Remove active class from all nav items
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show current page
    const currentPage = document.getElementById(pageId);
    if (currentPage) {
        currentPage.style.display = 'block';
        currentPage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize dashboard
function initDashboard() {
    const userName = getUserName();
    const userRole = checkAuth();
    
    // Update user info in navbar
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl) userNameEl.textContent = userName ?? 'User';
    if (userRoleEl) userRoleEl.textContent = userRole ?? 'Role';
    
    // Show dashboard page by default
    setTimeout(() => {
        const dashboardBtn = document.querySelector('[data-page="dashboardPage"]');
        if (dashboardBtn) {
            setActivePage(null, 'dashboardPage');
        }
    }, 100);
}

// Utility function to format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Utility function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Table search functionality
function filterTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const table = document.getElementById(tableId);
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
        }
    }
}

// Chart initialization (requires Chart.js library)
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Revenue',
                    data: [180000, 195000, 225000, 210000, 240000, 225000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value / 1000 + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Print functionality
function printContent(elementId) {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<pre>' + document.getElementById(elementId).innerHTML + '</pre>');
    printWindow.document.close();
    printWindow.print();
}

// Export to CSV
function exportToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    let csv = [];
    
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push('"' + cell.innerText + '"');
        }
        csv.push(rowData.join(','));
    }
    
    let csvContent = csv.join('\n');
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', filename || 'export.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Initialize on page load if not a login page
window.addEventListener('load', () => {
    if (document.body.classList.contains('dashboard')) {
        setTimeout(initDashboard, 200);
    }
});