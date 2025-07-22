// VolunteerConnect Platform JavaScript

// Sample data
const opportunities = [
    {
        id: 1,
        title: "Reading Tutor for Children",
        organization: "Community Learning Center",
        description: "Help elementary students improve their reading skills through one-on-one tutoring sessions.",
        location: "Downtown",
        timeCommitment: "2 hrs/week",
        category: "education",
        icon: "fas fa-book-open",
        requirements: ["Background check required", "Good with children", "Flexible schedule"],
        skills: ["Teaching", "Patience", "Communication"]
    },
    {
        id: 2,
        title: "Community Garden Volunteer",
        organization: "Green City Initiative",
        description: "Join our team in maintaining community gardens and teaching sustainable farming practices.",
        location: "Riverside Park",
        timeCommitment: "Flexible",
        category: "environment",
        icon: "fas fa-seedling",
        requirements: ["Physical activity", "Outdoor work", "Weekend availability"],
        skills: ["Gardening", "Physical fitness", "Environmental awareness"]
    },
    {
        id: 3,
        title: "Food Bank Assistant",
        organization: "City Food Bank",
        description: "Help sort, pack, and distribute food to families in need in our community.",
        location: "Central District",
        timeCommitment: "3 hrs/week",
        category: "food",
        icon: "fas fa-utensils",
        requirements: ["Able to lift 25 lbs", "Team player", "Reliable"],
        skills: ["Organization", "Customer service", "Physical stamina"]
    },
    {
        id: 4,
        title: "Senior Companion",
        organization: "Golden Years Care",
        description: "Provide companionship and social interaction for elderly residents in our care facility.",
        location: "Westside",
        timeCommitment: "2 hrs/week",
        category: "seniors",
        icon: "fas fa-heart",
        requirements: ["Compassionate", "Good listener", "Background check"],
        skills: ["Empathy", "Communication", "Patience"]
    },
    {
        id: 5,
        title: "Youth Mentor",
        organization: "Future Leaders Program",
        description: "Guide and support at-risk youth in developing life skills and career planning.",
        location: "Community Center",
        timeCommitment: "4 hrs/week",
        category: "youth",
        icon: "fas fa-graduation-cap",
        requirements: ["College degree preferred", "Mentoring experience", "Background check"],
        skills: ["Leadership", "Counseling", "Career guidance"]
    },
    {
        id: 6,
        title: "Animal Shelter Helper",
        organization: "Pets & Paws Rescue",
        description: "Care for rescued animals, assist with adoptions, and help with shelter maintenance.",
        location: "Animal Shelter",
        timeCommitment: "Flexible",
        category: "animals",
        icon: "fas fa-paw",
        requirements: ["Love for animals", "Physical activity", "Weekend availability"],
        skills: ["Animal care", "Cleaning", "Customer service"]
    }
];

const organizations = [
    {
        id: 1,
        name: "Community Learning Center",
        description: "Providing educational support to underserved communities for over 15 years.",
        volunteers: "1,200+",
        impact: "5,000+ students helped",
        icon: "fas fa-graduation-cap",
        opportunities: 12
    },
    {
        id: 2,
        name: "Green City Initiative",
        description: "Working towards a sustainable future through environmental conservation and education.",
        volunteers: "800+",
        impact: "50+ projects completed",
        icon: "fas fa-leaf",
        opportunities: 8
    },
    {
        id: 3,
        name: "City Food Bank",
        description: "Fighting hunger in our community by providing food assistance to those in need.",
        volunteers: "2,000+",
        impact: "100,000+ meals served",
        icon: "fas fa-hands-helping",
        opportunities: 15
    }
];

// Global state
let currentUser = null;
let userStats = {
    hoursVolunteered: 0,
    eventsCompleted: 0,
    organizationsHelped: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadOpportunities();
    loadOrganizations();
    loadCommunityFeed();
    updateStats();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                showSection(targetId);
            }
        });
    });

    // Search functionality
    document.getElementById('search-keywords').addEventListener('input', debounce(searchOpportunities, 300));
    document.getElementById('location-filter').addEventListener('change', searchOpportunities);
    document.getElementById('category-filter').addEventListener('change', searchOpportunities);
    document.getElementById('time-filter').addEventListener('change', searchOpportunities);

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = ['home', 'opportunities', 'organizations', 'community', 'dashboard'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === sectionId) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Special handling for dashboard
    if (sectionId === 'dashboard') {
        if (!currentUser) {
            showModal('login-modal');
            return;
        }
        document.getElementById('dashboard').style.display = 'block';
        loadDashboard();
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Load opportunities
function loadOpportunities() {
    const grid = document.getElementById('opportunities-grid');
    grid.innerHTML = opportunities.map(opp => createOpportunityCard(opp)).join('');
}

function createOpportunityCard(opportunity) {
    return `
        <div class="opportunity-card" data-category="${opportunity.category}">
            <div class="opportunity-image">
                <i class="${opportunity.icon}"></i>
            </div>
            <div class="opportunity-content">
                <h3>${opportunity.title}</h3>
                <p class="organization">${opportunity.organization}</p>
                <p class="description">${opportunity.description}</p>
                <div class="opportunity-details">
                    <span class="location"><i class="fas fa-map-marker-alt"></i> ${opportunity.location}</span>
                    <span class="time"><i class="fas fa-clock"></i> ${opportunity.timeCommitment}</span>
                    <span class="category"><i class="fas fa-tag"></i> ${capitalizeFirst(opportunity.category)}</span>
                </div>
                <div class="opportunity-actions">
                    <button class="btn btn-primary" onclick="applyForOpportunity(${opportunity.id})">Apply Now</button>
                    <button class="btn btn-outline" onclick="saveOpportunity(${opportunity.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Load organizations
function loadOrganizations() {
    const grid = document.getElementById('organizations-grid');
    grid.innerHTML = organizations.map(org => createOrganizationCard(org)).join('');
}

function createOrganizationCard(org) {
    return `
        <div class="org-card">
            <div class="org-logo">
                <i class="${org.icon}"></i>
            </div>
            <div class="opportunity-content">
                <h3>${org.name}</h3>
                <p class="description">${org.description}</p>
                <div class="org-stats">
                    <span><strong>${org.volunteers}</strong> volunteers</span>
                    <span><strong>${org.impact}</strong></span>
                </div>
                <button class="btn btn-outline" onclick="viewOrganization(${org.id})">
                    View ${org.opportunities} Opportunities
                </button>
            </div>
        </div>
    `;
}

// Search functionality
function searchOpportunities() {
    const keywords = document.getElementById('search-keywords').value.toLowerCase();
    const location = document.getElementById('location-filter').value;
    const category = document.getElementById('category-filter').value;
    const timeCommitment = document.getElementById('time-filter').value;

    let filteredOpportunities = opportunities.filter(opp => {
        const matchesKeywords = !keywords || 
            opp.title.toLowerCase().includes(keywords) ||
            opp.organization.toLowerCase().includes(keywords) ||
            opp.description.toLowerCase().includes(keywords);
        
        const matchesCategory = !category || opp.category === category;
        
        // For demo purposes, we'll do simple matching
        const matchesLocation = !location || true;
        const matchesTime = !timeCommitment || true;

        return matchesKeywords && matchesCategory && matchesLocation && matchesTime;
    });

    const grid = document.getElementById('opportunities-grid');
    if (filteredOpportunities.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No opportunities found</h3>
                <p>Try adjusting your search criteria or browse all opportunities.</p>
                <button class="btn btn-primary" onclick="clearSearch()">Clear Search</button>
            </div>
        `;
    } else {
        grid.innerHTML = filteredOpportunities.map(opp => createOpportunityCard(opp)).join('');
    }
}

function clearSearch() {
    document.getElementById('search-keywords').value = '';
    document.getElementById('location-filter').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('time-filter').value = '';
    loadOpportunities();
}

// Application and interaction functions
function applyForOpportunity(opportunityId) {
    if (!currentUser) {
        showModal('login-modal');
        return;
    }

    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    if (opportunity) {
        showNotification(`Applied for ${opportunity.title}!`, 'success');
        // Here you would typically send data to a server
        userStats.eventsCompleted++;
        updateDashboard();
    }
}

function saveOpportunity(opportunityId) {
    const button = event.target;
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Opportunity saved!', 'success');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Opportunity removed from saved!', 'info');
    }
}

function viewOrganization(orgId) {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
        // Filter opportunities by organization
        document.getElementById('search-keywords').value = org.name;
        searchOpportunities();
        showSection('opportunities');
    }
}

// Load more functionality
function loadMoreOpportunities() {
    // In a real app, this would load more data from the server
    showNotification('All current opportunities are displayed!', 'info');
}

// Community feed
function loadCommunityFeed() {
    const feed = document.getElementById('community-feed');
    const feedItems = [
        {
            user: "Sarah Johnson",
            action: "completed 10 hours of tutoring at Community Learning Center!",
            time: "2 hours ago"
        },
        {
            user: "Mike Chen",
            action: "earned the 'Environmental Hero' badge for 50 hours of conservation work!",
            time: "5 hours ago"
        },
        {
            user: "Emily Rodriguez",
            action: "joined the Food Security Volunteers group",
            time: "1 day ago"
        },
        {
            user: "David Park",
            action: "completed their first volunteer session at Golden Years Care!",
            time: "2 days ago"
        },
        {
            user: "Lisa Wang",
            action: "organized a successful community garden workshop",
            time: "3 days ago"
        }
    ];

    const feedHTML = `
        <h3>Recent Community Activity</h3>
        ${feedItems.map(item => `
            <div class="feed-item">
                <div class="feed-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="feed-content">
                    <p><strong>${item.user}</strong> ${item.action}</p>
                    <span class="feed-time">${item.time}</span>
                </div>
            </div>
        `).join('')}
    `;
    
    feed.innerHTML = feedHTML;
}

// Dashboard functionality
function loadDashboard() {
    updateDashboard();
    loadUpcomingCommitments();
    loadAchievements();
    loadRecommendations();
}

function updateDashboard() {
    if (!currentUser) return;

    document.querySelector('#dashboard .stat-number').textContent = userStats.hoursVolunteered;
    document.querySelectorAll('#dashboard .stat-number')[1].textContent = userStats.eventsCompleted;
    document.querySelectorAll('#dashboard .stat-number')[2].textContent = userStats.organizationsHelped;
}

function loadUpcomingCommitments() {
    const container = document.getElementById('upcoming-commitments');
    const commitments = [
        {
            title: "Reading Tutor Session",
            organization: "Community Learning Center",
            date: "Tomorrow, 3:00 PM"
        },
        {
            title: "Food Bank Volunteer",
            organization: "City Food Bank",
            date: "Saturday, 9:00 AM"
        }
    ];

    container.innerHTML = commitments.map(commitment => `
        <div class="commitment-item">
            <h4>${commitment.title}</h4>
            <p>${commitment.organization}</p>
            <span class="commitment-date">${commitment.date}</span>
        </div>
    `).join('');
}

function loadAchievements() {
    const container = document.getElementById('user-achievements');
    const achievements = [
        { icon: "fas fa-medal", name: "First Volunteer" },
        { icon: "fas fa-clock", name: "25 Hours" },
        { icon: "fas fa-star", name: "Top Contributor" }
    ];

    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-badge">
            <i class="${achievement.icon}"></i>
            <span>${achievement.name}</span>
        </div>
    `).join('');
}

function loadRecommendations() {
    const container = document.getElementById('recommendations');
    const recommendations = [
        {
            title: "Senior Companion",
            reason: "Based on your interest in community work"
        },
        {
            title: "Youth Mentor",
            reason: "Perfect match for your education background"
        }
    ];

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <h4>${rec.title}</h4>
            <p>${rec.reason}</p>
        </div>
    `).join('');
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    showModal(targetModalId);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple demo authentication
    if (email && password) {
        currentUser = {
            email: email,
            firstName: 'John',
            lastName: 'Doe'
        };
        
        userStats = {
            hoursVolunteered: 42,
            eventsCompleted: 8,
            organizationsHelped: 3
        };

        closeModal('login-modal');
        showNotification('Welcome back, ' + currentUser.firstName + '!', 'success');
        updateNavigation();
    } else {
        showNotification('Please enter valid credentials', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (firstName && lastName && email && password) {
        currentUser = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        userStats = {
            hoursVolunteered: 0,
            eventsCompleted: 0,
            organizationsHelped: 0
        };

        closeModal('signup-modal');
        showNotification('Welcome to VolunteerConnect, ' + firstName + '!', 'success');
        updateNavigation();
    } else {
        showNotification('Please fill in all required fields', 'error');
    }
}

function updateNavigation() {
    // Update navigation based on login status
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.firstName}`;
        signupBtn.style.display = 'none';
    }
}

// Stats animation
function updateStats() {
    animateNumber('volunteer-count', 15429);
    animateNumber('hours-count', 284391);
    animateNumber('org-count', 1247);
}

function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = targetNumber / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification-success { border-left: 4px solid var(--secondary-color); }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid var(--primary-color); }
            .notification button {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
