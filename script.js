// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
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

// // Logout function
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


//Close modal when clicking outside
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
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
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
    showNotification('Student checked in successfully!');
    closeModal('checkInModal');
    event.target.reset();
}

function handleCheckOut(event) {
    event.preventDefault();
    showNotification('Student checked out successfully!');
    closeModal('checkOutModal');
    event.target.reset();
}

function handleRegister(event) {
    event.preventDefault();
    showNotification('Student registered successfully!');
    closeModal('registerModal');
    event.target.reset();
}

function handlePayment(event) {
    event.preventDefault();
    showNotification('Payment processed successfully!');
    closeModal('paymentModal');
    event.target.reset();
}

function handleRoomAdd(event) {
    event.preventDefault();
    showNotification('Room added successfully!');
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
    
    if (userNameEl) userNameEl.textContent = userName;
    if (userRoleEl) userRoleEl.textContent = userRole;
    
    // Show dashboard page by default
    setTimeout(() => {
        const dashboardBtn = document.querySelector('[data-page="dashboardPage"]');
        if (dashboardBtn) {
            setActivePage(null, 'dashboardPage');
        }
    }, 100);
}

// Initialize Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Revenue',
                    data: [175000, 182000, 190000, 195000, 201000, 225000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: 2,
                    tension: 0.4, // Adds a smooth curve to the line
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Hide legend for a cleaner look
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + (value / 1000) + 'k'; // Format as ₹100k
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize pages on load
document.addEventListener('DOMContentLoaded', function() {
    // Only run on dashboard pages
    if (document.querySelector('.dashboard-container')) {
        initDashboard();
        initRevenueChart();
    }
});

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
