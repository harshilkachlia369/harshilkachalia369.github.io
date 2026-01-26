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

const platforms = ['Amazon', 'Flipkart', 'Meesho', 'Ajio', 'Myntra', 'Snapdeal'];

let searchTimeout;
let allResults = [];

// Generate mock product data
function generateMockResults(query) {
    const results = [];
    const baseProducts = [
        { name: `${query} - Premium Edition`, basePrice: 2999 },
        { name: `${query} - Standard`, basePrice: 1999 },
        { name: `${query} - Pro Series`, basePrice: 4499 },
        { name: `${query} - Compact`, basePrice: 1499 },
        { name: `${query} - Deluxe`, basePrice: 3499 }
    ];

    platforms.forEach(platform => {
        baseProducts.forEach(product => {
            const discount = Math.floor(Math.random() * 40) + 5;
            const price = Math.floor(product.basePrice * (1 - discount / 100));
            results.push({
                id: `${platform}-${product.name}`,
                name: product.name,
                platform,
                price,
                originalPrice: product.basePrice,
                discount,
                rating: (4 + Math.random()).toFixed(1),
                url: `https://${platform.toLowerCase()}.com/search?q=${encodeURIComponent(query)}`
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
            <span class="product-platform">${product.platform}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-pricing">
                <span class="product-price">₹${product.price.toLocaleString()}</span>
                <span class="product-original-price">₹${product.originalPrice.toLocaleString()}</span>
                <span class="product-discount">${product.discount}% off</span>
            </div>
            <div class="product-footer">
                <div class="product-rating">
                    <span class="rating-star">★</span>
                    <span>${product.rating}</span>
                </div>
                <a href="${product.url}" class="view-product" target="_blank" onclick="event.stopPropagation()">
                    View Product
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
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

    // Simulate API call
    setTimeout(() => {
        allResults = generateMockResults(query);
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
        loadingState.classList.add('hidden');
    }, 800);
}

// Search input handler
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
    if (allResults.length > 0) {
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
    }
});

maxPrice.addEventListener('input', () => {
    if (allResults.length > 0) {
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
    }
});

sortBy.addEventListener('change', () => {
    if (allResults.length > 0) {
        const filteredResults = filterAndSortResults(allResults);
        renderSearchResults(filteredResults);
    }
});

// Amazon Sign In
const amazonSignIn = document.getElementById('amazonSignIn');
const signInState = document.getElementById('signInState');
const transactionsList = document.getElementById('transactionsList');
const transactionsContent = document.getElementById('transactionsContent');
const signOutButton = document.getElementById('signOutButton');

const mockTransactions = [
    { id: 'AMZ001', date: '2025-01-20', item: 'Wireless Headphones', amount: 2499, status: 'Delivered' },
    { id: 'AMZ002', date: '2025-01-15', item: 'Smart Watch', amount: 4999, status: 'Delivered' },
    { id: 'AMZ003', date: '2025-01-10', item: 'Bluetooth Speaker', amount: 1899, status: 'In Transit' },
    { id: 'AMZ004', date: '2025-01-05', item: 'Phone Case', amount: 499, status: 'Delivered' },
    { id: 'AMZ005', date: '2024-12-28', item: 'USB Cable', amount: 299, status: 'Delivered' },
    { id: 'AMZ006', date: '2024-12-20', item: 'Laptop Bag', amount: 1599, status: 'Delivered' },
    { id: 'AMZ007', date: '2024-12-15', item: 'Wireless Mouse', amount: 899, status: 'Delivered' }
];

amazonSignIn.addEventListener('click', () => {
    // Simulate sign in
    signInState.style.display = 'none';
    transactionsList.classList.remove('hidden');
    
    // Render transactions
    transactionsContent.innerHTML = mockTransactions.map(transaction => `
        <div class="transaction-card">
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
    transactionsList.classList.add('hidden');
    signInState.style.display = 'flex';
    transactionsContent.innerHTML = '';
});
