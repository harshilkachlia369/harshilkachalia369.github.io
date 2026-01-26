// ====================================
// TAB SWITCHING FUNCTIONALITY
// ====================================

// Get all navigation tabs and content sections
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Function to switch between tabs
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    navTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// Add click event listeners to all navigation tabs
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// ====================================
// CTA BUTTON - Navigate to Analyzer
// ====================================
const ctaButton = document.getElementById('analyze-cta');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        switchTab('analyzer');
    });
}

// ====================================
// ANALYZER FORM - Button Selection
// ====================================

// Handle CPU button selection
const cpuButtons = document.querySelectorAll('#analyzer-tab .button-group:not(.storage-buttons) .option-button');
const cpuInput = document.getElementById('cpu-input');

cpuButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove selected class from all CPU buttons
        cpuButtons.forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        button.classList.add('selected');
        // Store value in hidden input
        cpuInput.value = button.getAttribute('data-value');
    });
});

// Handle Storage button selection
const storageButtons = document.querySelectorAll('.storage-buttons .option-button');
const storageInput = document.getElementById('storage-input');

storageButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove selected class from all storage buttons
        storageButtons.forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        button.classList.add('selected');
        // Store value in hidden input
        storageInput.value = button.getAttribute('data-value');
    });
});

// ====================================
// SYSTEM DETAILS BUTTON
// ====================================

const systemDetailsButton = document.getElementById('system-details-button');

if (systemDetailsButton) {
    systemDetailsButton.addEventListener('click', () => {
        // Detect user's operating system
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        
        let systemURL = '';
        let systemName = '';
        
        // Windows detection
        if (userAgent.indexOf('win') !== -1 || platform.indexOf('win') !== -1) {
            systemURL = 'ms-settings:about';
            systemName = 'Windows Settings';
        }
        // macOS detection
        else if (userAgent.indexOf('mac') !== -1 || platform.indexOf('mac') !== -1) {
            systemURL = 'x-apple.systempreferences:com.apple.SystemProfiler';
            systemName = 'System Information';
        }
        // Linux detection
        else if (userAgent.indexOf('linux') !== -1 || platform.indexOf('linux') !== -1) {
            // Linux doesn't have a universal settings URL, show instructions
            alert('On Linux, you can view system details by:\n\n• Opening System Settings\n• Running "sudo lshw -short" in Terminal\n• Using "neofetch" or "screenfetch"');
            return;
        }
        // Fallback for other systems
        else {
            alert('Unable to detect your operating system.\n\nTo view system details:\n• Windows: Settings → System → About\n• macOS: Apple menu → About This Mac\n• Linux: System Settings or Terminal commands');
            return;
        }
        
        // Try to open system settings
        const newWindow = window.open(systemURL, '_blank');
        
        // Fallback if URL scheme doesn't work
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            alert(`To view your system details:\n\nOpen ${systemName} and navigate to the "About" section to see your:\n• RAM (Memory)\n• CPU (Processor)\n• Storage type and capacity\n\nThen come back here and enter those details!`);
        }
    });
}

// ====================================
// PERFORMANCE CALCULATION LOGIC
// ====================================

const analyzeButton = document.getElementById('analyze-button');

analyzeButton.addEventListener('click', () => {
    // Get form values
    const ram = document.getElementById('ram-select').value;
    const cpu = cpuInput.value;
    const storage = storageInput.value;
    const usage = document.getElementById('usage-select').value;
    
    // Validate all fields are filled
    if (!ram || !cpu || !storage || !usage) {
        alert('Please fill in all fields before analyzing.');
        return;
    }
    
    // Calculate performance score
    const results = calculatePerformance(parseInt(ram), cpu, storage, usage);
    
    // Display results
    displayResults(results);
});

// Main calculation function
function calculatePerformance(ram, cpu, storage, usage) {
    let score = 0;
    
    // RAM scoring (max 35 points)
    if (ram >= 32) score += 35;
    else if (ram >= 16) score += 28;
    else if (ram >= 8) score += 20;
    else if (ram >= 4) score += 12;
    else score += 5;
    
    // CPU scoring (max 35 points)
    if (cpu === 'high') score += 35;
    else if (cpu === 'medium') score += 22;
    else score += 10;
    
    // Storage scoring (max 20 points)
    if (storage === 'ssd') score += 20;
    else score += 8;
    
    // Usage multiplier
    const usageMultipliers = {
        browsing: 1.1,
        coding: 1.0,
        gaming: 0.95,
        videoediting: 0.85
    };
    
    score = Math.min(100, Math.round(score * usageMultipliers[usage]));
    
    // Determine capabilities based on specs
    const canHandle = [];
    const mightStruggle = [];
    const notRecommended = [];
    const upgrades = [];
    
    // High-end configuration
    if (ram >= 16 && cpu === 'high' && storage === 'ssd') {
        canHandle.push('Heavy multitasking with 20+ browser tabs');
        canHandle.push('4K video streaming without buffering');
        canHandle.push('Professional photo editing (Photoshop, Lightroom)');
        canHandle.push('Running virtual machines');
        
        if (usage === 'gaming') {
            canHandle.push('Modern AAA games at high/ultra settings (1080p-1440p)');
            canHandle.push('VR gaming experiences');
            canHandle.push('Game streaming and recording simultaneously');
        }
        
        if (usage === 'videoediting') {
            canHandle.push('4K video editing with multiple layers');
            canHandle.push('Real-time color grading and effects');
            canHandle.push('Working with RAW footage');
        }
        
        if (usage === 'coding') {
            canHandle.push('Running multiple Docker containers');
            canHandle.push('Large-scale IDE projects with IntelliSense');
            canHandle.push('Building and compiling large codebases');
        }
        
        if (usage === 'browsing') {
            canHandle.push('Unlimited tabs without slowdown');
            canHandle.push('Multiple web apps running simultaneously');
        }
        
        // Upgrades for high-end
        if (ram === 16) {
            upgrades.push('Consider 32GB RAM if working with very large projects or datasets');
        }
        if (usage === 'gaming') {
            upgrades.push('Ensure you have a dedicated GPU (RTX 3060 or better) for optimal gaming');
        }
        if (usage === 'videoediting') {
            upgrades.push('A dedicated GPU will significantly speed up rendering and effects');
        }
        upgrades.push('Your CPU and RAM are excellent - focus on GPU for graphics-intensive tasks');
        upgrades.push('Consider adding more SSD storage if you work with large files');
    }
    // Mid-range configuration
    else if (ram >= 8 && cpu === 'medium') {
        canHandle.push('Smooth web browsing with 10-15 tabs');
        canHandle.push('Microsoft Office and productivity apps');
        canHandle.push('Light photo editing (basic Photoshop, GIMP)');
        canHandle.push('1080p video streaming');
        canHandle.push('Video calls and conferencing');
        
        if (usage === 'gaming') {
            canHandle.push('Esports titles (Valorant, CS:GO, League of Legends)');
            canHandle.push('Games from 2015-2020 at medium-high settings');
            canHandle.push('Indie and casual games');
            mightStruggle.push('Latest AAA games at ultra settings (2023+)');
            mightStruggle.push('Ray tracing enabled games');
            mightStruggle.push('Gaming while streaming');
        }
        
        if (usage === 'videoediting') {
            canHandle.push('1080p video editing with basic effects');
            canHandle.push('Short videos and social media content');
            mightStruggle.push('4K video editing');
            mightStruggle.push('Complex effects and transitions');
            mightStruggle.push('Working with RAW or high-bitrate footage');
        }
        
        if (usage === 'coding') {
            canHandle.push('Web development (VS Code, Node.js)');
            canHandle.push('Backend development (Python, Java)');
            canHandle.push('Single Docker container development');
            mightStruggle.push('Heavy virtualization or multiple containers');
            mightStruggle.push('Large Android Studio projects');
            mightStruggle.push('Machine learning model training');
        }
        
        if (usage === 'browsing') {
            mightStruggle.push('More than 20 tabs with heavy web apps');
        }
        
        // Upgrades for mid-range
        if (storage === 'hdd') {
            upgrades.push('🔥 PRIORITY: Upgrade to SSD - this will give you the biggest speed boost!');
        }
        if (ram === 8) {
            upgrades.push('Upgrade to 16GB RAM for smoother multitasking and better performance');
        }
        if (usage === 'gaming' || usage === 'videoediting') {
            upgrades.push('Consider upgrading to 16GB RAM for better ' + (usage === 'gaming' ? 'gaming' : 'video editing') + ' performance');
        }
        if (cpu === 'medium') {
            upgrades.push('CPU is decent, but upgrading would help with intensive tasks');
        }
    }
    // Low-end configuration
    else {
        canHandle.push('Basic web browsing (3-5 tabs)');
        canHandle.push('Email and document editing (Word, Google Docs)');
        canHandle.push('Music and podcast streaming');
        canHandle.push('Watching videos (480p-720p)');
        
        mightStruggle.push('Multiple browser tabs (10+)');
        mightStruggle.push('HD video streaming (1080p)');
        mightStruggle.push('Basic photo editing');
        mightStruggle.push('Running multiple applications simultaneously');
        
        if (usage === 'gaming') {
            notRecommended.push('Modern gaming (2020+)');
            notRecommended.push('VR experiences');
            notRecommended.push('Graphics-intensive games');
            mightStruggle.push('Older casual games and retro titles');
        }
        
        if (usage === 'videoediting') {
            notRecommended.push('Video editing of any kind');
            notRecommended.push('Content creation workflows');
            notRecommended.push('Any video rendering');
        }
        
        if (usage === 'coding') {
            mightStruggle.push('Running local development servers');
            mightStruggle.push('Using modern IDEs (VS Code with extensions)');
            notRecommended.push('Mobile app development (Android Studio)');
            notRecommended.push('Running virtual machines or containers');
        }
        
        if (usage === 'browsing') {
            canHandle.push('Light productivity work');
        } else {
            notRecommended.push('Professional work in ' + usage);
        }
        
        // Upgrades for low-end
        upgrades.push('🔥 CRITICAL: Your system needs significant upgrades for better performance');
        if (storage === 'hdd') {
            upgrades.push('🔥 #1 PRIORITY: Upgrade to SSD - instant 3-5x speed boost for $50-100');
        }
        if (ram < 8) {
            upgrades.push('🔥 #2 PRIORITY: Upgrade to at least 8GB RAM (16GB recommended)');
        }
        if (cpu === 'low') {
            upgrades.push('CPU upgrade would provide major performance improvements');
        }
        if (usage !== 'browsing') {
            upgrades.push('For ' + usage + ', consider a complete system upgrade or newer PC');
        }
    }
    
    // Additional context-specific upgrades
    if (storage === 'hdd' && !upgrades.some(u => u.includes('SSD'))) {
        upgrades.push('Upgrade to SSD for faster boot times and application loading');
    }
    
    // Always provide at least one upgrade suggestion
    if (upgrades.length === 0) {
        upgrades.push('Your system is well-balanced! Consider upgrading when new technology becomes available');
        upgrades.push('Keep your system updated with latest drivers and software');
        upgrades.push('Regular maintenance (disk cleanup, malware scans) keeps performance optimal');
    }
    
    return {
        score,
        canHandle,
        mightStruggle,
        notRecommended,
        upgrades
    };
}

// ====================================
// DISPLAY RESULTS FUNCTION
// ====================================

function displayResults(results) {
    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';
    
    // Scroll to results smoothly
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Animate score
    animateScore(results.score);
    
    // Update score label
    const scoreLabel = document.getElementById('score-label');
    if (results.score >= 80) {
        scoreLabel.textContent = 'Excellent performance - Your PC is powerful!';
    } else if (results.score >= 60) {
        scoreLabel.textContent = 'Good performance - Handles most tasks well';
    } else if (results.score >= 40) {
        scoreLabel.textContent = 'Fair performance - Suitable for basic tasks';
    } else {
        scoreLabel.textContent = 'Limited performance - Upgrades highly recommended';
    }
    
    // Display capability lists - ALWAYS SHOW IF THERE'S CONTENT
    displayList('can-handle', results.canHandle);
    displayList('might-struggle', results.mightStruggle);
    displayList('not-recommended', results.notRecommended);
    displayList('upgrades', results.upgrades);
    
    // Add SVG gradient if not already present
    addSVGGradient();
}

// Function to display result lists
function displayList(type, items) {
    const card = document.getElementById(`${type}-card`);
    const list = document.getElementById(`${type}-list`);
    
    // ALWAYS check if items exist and show/hide accordingly
    if (items && items.length > 0) {
        card.style.display = 'block';
        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    } else {
        card.style.display = 'none';
    }
}

// ====================================
// SCORE ANIMATION
// ====================================

function animateScore(finalScore) {
    const scoreNumber = document.getElementById('score-number');
    const scoreProgress = document.getElementById('score-progress');
    
    // Calculate circle progress (circumference = 2 * π * r = 2 * π * 80 = 502.4)
    const circumference = 502.4;
    const offset = circumference - (finalScore / 100) * circumference;
    
    // Animate number from 0 to final score
    let currentScore = 0;
    const increment = finalScore / 50; // 50 steps for smooth animation
    const duration = 1000; // 1 second
    const stepTime = duration / 50;
    
    const numberInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(numberInterval);
        }
        scoreNumber.textContent = Math.round(currentScore);
    }, stepTime);
    
    // Animate circle progress
    setTimeout(() => {
        scoreProgress.style.strokeDashoffset = offset;
    }, 100);
}

// ====================================
// ADD SVG GRADIENT FOR SCORE CIRCLE
// ====================================

function addSVGGradient() {
    const svg = document.querySelector('.score-circle');
    if (svg && !svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#06b6d4');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#a855f7');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
}

// ====================================
// INITIALIZATION
// ====================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set home tab as active on load
    switchTab('home');
    
    // Add gradient to score SVG
    addSVGGradient();
});
