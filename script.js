// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Filter panel toggle
const filterButton = document.getElementById('filterButton');
const filterPanel = document.getElementById('filterPanel');
const closeFilters = document.getElementById('closeFilters');

filterButton.addEventListener('click', () => {
    filterPanel.classList.toggle('hidden');
});

closeFilters.addEventListener('click', () => {
    filterPanel.classList.add('hidden');
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');

const platformFilters = document.getElementById('platformFilters');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const sortBy = document.getElementById('sortBy');

// Platform URLs that link directly to search results
const platforms = {
    'Amazon': 'https://www.amazon.in/s?k=',
    'Flipkart': 'https://www.flipkart.com/search?q=',
    'Meesho': 'https://www.meesho.com/search?q=',
    'Ajio': 'https://www.ajio.com/search/?text=',
    'Myntra': 'https://www.myntra.com/',
    'Snapdeal': 'https://www.snapdeal.com/search?keyword='
};

let searchTimeout;
let allResults = [];
let currentSearchQuery = '';

// Generate mock product data with realistic prices from ₹50 to ₹50,000
function generateMockResults(query) {
    currentSearchQuery = query;
    const results = [];
    
    // More realistic and varied price ranges - from very cheap to expensive
    const basePrices = [
        49, 79, 99, 149, 199, 249, 299, 349, 399, 449, 499, 599, 699, 799, 899, 999,
        1199, 1299, 1499, 1799, 1999, 2499, 2999, 3499, 3999, 4499, 4999, 5999,
        6999, 7999, 8999, 9999, 12999, 14999, 19999, 24999, 29999, 39999, 49999
    ];
    
    // Pick 5 random prices from the array
    const randomBasePrices = [];
    for (let i = 0; i < 5; i++) {
        randomBasePrices.push(basePrices[Math.floor(Math.random() * basePrices.length)]);
    }
    
    const baseProducts = [
        { name: `${query} - Premium Edition`, basePrice: randomBasePrices[0] },
        { name: `${query} - Standard`, basePrice: randomBasePrices[1] },
        { name: `${query} - Pro Series`, basePrice: randomBasePrices[2] },
        { name: `${query} - Compact`, basePrice: randomBasePrices[3] },
        { name: `${query} - Deluxe`, basePrice: randomBasePrices[4] }
    ];

    Object.keys(platforms).forEach(platform => {
        baseProducts.forEach(product => {
            const discount = Math.floor(Math.random() * 40) + 5;
            const price = Math.floor(product.basePrice * (1 - discount / 100));
            
            // Create proper search URL that takes user directly to search results
            let searchUrl = platforms[platform] + encodeURIComponent(query);
            
            results.push({
                id: `${platform}-${product.name}`,
                name: product.name,
                platform,
                price,
                originalPrice: product.basePrice,
                discount,
                rating: (4 + Math.random()).toFixed(1),
                url: searchUrl
            });
        });
    });

    return results;
}

// Apply filters and sorting
function filterAndSortResults(results) {
    let filtered = [...results];

    // Platform filter
    const selectedPlatforms = Array.from(platformFilters.querySelectorAll('input:checked'))
        .map(input => input.value);
    
    if (selectedPlatforms.length > 0) {
        filtered = filtered.filter(item => selectedPlatforms.includes(item.platform));
    }

    // Price range filter
    const min = parseFloat(minPrice.value);
    const max = parseFloat(maxPrice.value);
    
    if (!isNaN(min)) {
        filtered = filtered.filter(item => item.price >= min);
    }
    if (!isNaN(max)) {
        filtered = filtered.filter(item => item.price <= max);
    }

    // Sorting
    const sortValue = sortBy.value;
    if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'discount') {
        filtered.sort((a, b) => b.discount - a.discount);
    }

    return filtered;
}

// Render search results
function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    searchResults.innerHTML = results.map(product => `
        <div class="product-card" onclick="window.open('${product.url}', '_blank')">
            <div class="platform-badge">
                <span class="product-platform">${product.platform}</span>
                <svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-pricing">
                <span class="product-price">₹${product.price.toLocaleString()}</span>
                <span class="product-original-price">₹${product.originalPrice.toLocaleString()}</span>
            </div>
            <span class="product-discount">${product.discount}% OFF</span>
            <div class="product-footer">
                <div class="product-rating">
                    <span class="rating-star">★</span>
                    <span>${product.rating}</span>
                    <span class="rating-count">(${Math.floor(Math.random() * 5000) + 500})</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Search function
function performSearch(query) {
    if (!query.trim()) {
        allResults = [];
        searchResults.innerHTML = '';
        emptyState.style.display = 'block';
        loadingState.classList.add('hidden');
        return;
    }

    loadingState.classList.remove('hidden');
    emptyState.style.display = 'none';
    searchResults.innerHTML = '';

    // Simulate API call with realistic delay
    setTimeout(() => {
        allResults = generateMockResults(query);
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
        loadingState.classList.add('hidden');
    }, 600);
}

// Search input handler with debounce
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
    }, 300);
});

// Filter change handlers
platformFilters.addEventListener('change', () => {
    if (allResults.length > 0) {
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
    }
});

minPrice.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (allResults.length > 0) {
            const filteredResults = filterAndSortResults(allResults);
            renderSearchResults(filteredResults);
        }
    }, 500);
});

maxPrice.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (allResults.length > 0) {
            const filteredResults = filterAndSortResults(allResults);
            renderSearchResults(filteredResults);
        }
    }, 500);
});

sortBy.addEventListener('change', () => {
    if (allResults.length > 0) {
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
    }
});

// Amazon Sign In functionality
const amazonSignIn = document.getElementById('amazonSignIn');
const signInState = document.getElementById('signInState');
const transactionsList = document.getElementById('transactionsList');
const transactionsContent = document.getElementById('transactionsContent');
const signOutButton = document.getElementById('signOutButton');

// Mock transaction data
const mockTransactions = [
    { id: 'AMZ001', date: '2025-01-20', item: 'Wireless Headphones', amount: 2499, status: 'Delivered' },
    { id: 'AMZ002', date: '2025-01-15', item: 'Smart Watch', amount: 4999, status: 'Delivered' },
    { id: 'AMZ003', date: '2025-01-10', item: 'Bluetooth Speaker', amount: 1899, status: 'In Transit' },
    { id: 'AMZ004', date: '2025-01-05', item: 'Phone Case', amount: 499, status: 'Delivered' },
    { id: 'AMZ005', date: '2024-12-28', item: 'USB Cable', amount: 299, status: 'Delivered' },
    { id: 'AMZ006', date: '2024-12-20', item: 'Laptop Bag', amount: 1599, status: 'Delivered' },
    { id: 'AMZ007', date: '2024-12-15', item: 'Wireless Mouse', amount: 899, status: 'Delivered' },
    { id: 'AMZ008', date: '2024-12-10', item: 'Power Bank', amount: 1299, status: 'Delivered' },
    { id: 'AMZ009', date: '2024-12-05', item: 'Screen Protector', amount: 199, status: 'Delivered' }
];

amazonSignIn.addEventListener('click', () => {
    // Simulate Amazon OAuth sign in
    signInState.style.display = 'none';
    transactionsList.classList.remove('hidden');
    
    // Render transactions with animation
    transactionsContent.innerHTML = mockTransactions.map((transaction, index) => `
        <div class="transaction-card" style="animation-delay: ${index * 0.05}s">
            <div class="transaction-header">
                <span class="transaction-id">${transaction.id}</span>
                <span class="transaction-status ${transaction.status === 'Delivered' ? 'delivered' : 'transit'}">
                    ${transaction.status}
                </span>
            </div>
            <h3 class="transaction-item">${transaction.item}</h3>
            <div class="transaction-footer">
                <span class="transaction-date">${new Date(transaction.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span class="transaction-amount">₹${transaction.amount.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
});

signOutButton.addEventListener('click', () => {
    // Sign out and return to sign in screen
    transactionsList.classList.add('hidden');
    signInState.style.display = 'flex';
    transactionsContent.innerHTML = '';
});
