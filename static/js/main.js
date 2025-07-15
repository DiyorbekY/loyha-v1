// Main JavaScript file for Maishiy Magazin

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCart();
    initializeWishlist();
    initializeFilters();
    initializeSearch();
    initializeProductActions();
    initializeAnimations();
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initializeCart() {
    updateCartCount();

    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-product-id');
            const quantity = document.getElementById('quantity') ? parseInt(document.getElementById('quantity').value) : 1;

            addToCart(productId, quantity);
        }
    });
}

function addToCart(productId, quantity = 1) {
    // Show loading state
    const button = document.querySelector(`[data-product-id="${productId}"].add-to-cart`);
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading-spinner"></span> Qo\'shilmoqda...';
    button.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Show success message
        showNotification('Mahsulot savatga qo\'shildi!', 'success');

        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1000);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadges = document.querySelectorAll('.action-btn .badge');
    cartBadges.forEach(badge => {
        if (badge.closest('.action-btn').href && badge.closest('.action-btn').href.includes('cart')) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    });
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function initializeWishlist() {
    updateWishlistCount();

    // Add to wishlist buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-wishlist') || e.target.closest('.add-to-wishlist')) {
            e.preventDefault();
            const button = e.target.classList.contains('add-to-wishlist') ? e.target : e.target.closest('.add-to-wishlist');
            const productId = button.getAttribute('data-product-id');

            toggleWishlist(productId, button);
        }
    });
}

function toggleWishlist(productId, button) {
    const isInWishlist = wishlist.includes(productId);
    const icon = button.querySelector('i');

    if (isInWishlist) {
        wishlist = wishlist.filter(id => id !== productId);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-danger');
        showNotification('Mahsulot sevimlilardan olib tashlandi', 'info');
    } else {
        wishlist.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-danger');
        showNotification('Mahsulot sevimlilarga qo\'shildi!', 'success');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlistBadges = document.querySelectorAll('.action-btn .badge');
    wishlistBadges.forEach(badge => {
        if (badge.closest('.action-btn').href && badge.closest('.action-btn').href.includes('wishlist')) {
            badge.textContent = wishlist.length;
            badge.style.display = wishlist.length > 0 ? 'block' : 'none';
        }
    });
}

// Filters functionality
function initializeFilters() {
    const filterForm = document.querySelector('.filters-sidebar');
    if (!filterForm) return;

    const applyButton = filterForm.querySelector('.apply-filters');
    const filterInputs = filterForm.querySelectorAll('input[type="checkbox"], input[type="radio"], input[type="number"]');

    // Apply filters button
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            applyFilters();
        });
    }

    // Auto-apply filters on change (with debounce)
    let filterTimeout;
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(applyFilters, 500);
        });
    });
}

function applyFilters() {
    const filterForm = document.querySelector('.filters-sidebar');
    if (!filterForm) return;

    const formData = new FormData();

    // Collect filter data
    const categories = Array.from(filterForm.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const brands = Array.from(filterForm.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const rating = filterForm.querySelector('input[name="rating"]:checked')?.value;
    const priceMin = filterForm.querySelector('input[name="price_min"]')?.value;
    const priceMax = filterForm.querySelector('input[name="price_max"]')?.value;

    // Build URL parameters
    const params = new URLSearchParams();
    if (categories.length) params.append('categories', categories.join(','));
    if (brands.length) params.append('brands', brands.join(','));
    if (rating) params.append('rating', rating);
    if (priceMin) params.append('price_min', priceMin);
    if (priceMax) params.append('price_max', priceMax);

    // Redirect with filters
    const currentUrl = new URL(window.location);
    currentUrl.search = params.toString();
    window.location.href = currentUrl.toString();
}

// Search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    if (!searchForm || !searchInput) return;

    // Search suggestions (mock data)
    const suggestions = [
        'Muzlatgich',
        'Kir yuvish mashinasi',
        'Televizor',
        'Mikroto\'lqinli pech',
        'Konditsioner',
        'Oshxona plitasi',
        'Changyutgich'
    ];

    // Create suggestions dropdown
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 10px 10px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;

    searchForm.style.position = 'relative';
    searchForm.appendChild(suggestionsContainer);

    // Search input events
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredSuggestions = suggestions.filter(item =>
            item.toLowerCase().includes(query)
        );

        if (filteredSuggestions.length > 0) {
            suggestionsContainer.innerHTML = filteredSuggestions.map(item =>
                `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">${item}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Suggestion click
    suggestionsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-item')) {
            searchInput.value = e.target.textContent;
            suggestionsContainer.style.display = 'none';
            searchForm.submit();
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Product actions
function initializeProductActions() {
    // Quick view functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view') || e.target.closest('.quick-view')) {
            e.preventDefault();
            const button = e.target.classList.contains('quick-view') ? e.target : e.target.closest('.quick-view');
            const productId = button.getAttribute('data-product-id');

            openQuickView(productId);
        }
    });

    // Product image zoom
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function openQuickView(productId) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tezkor ko'rish</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <div class="loading-spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Simulate loading product data
    setTimeout(() => {
        modal.querySelector('.modal-body').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="https://via.placeholder.com/400x300" class="img-fluid rounded" alt="Product">
                </div>
                <div class="col-md-6">
                    <h4>Mahsulot nomi</h4>
                    <div class="product-rating mb-3">
                        <i class="fas fa-star text-warning"></i>
                        <i class="fas fa-star text-warning"></i>
                        <i class="fas fa-star text-warning"></i>
                        <i class="fas fa-star text-warning"></i>
                        <i class="far fa-star text-warning"></i>
                        <span class="ms-2">4.0 (25 sharh)</span>
                    </div>
                    <div class="product-price mb-3">
                        <span class="h4 text-primary">1,500,000 so'm</span>
                        <span class="text-muted text-decoration-line-through ms-2">2,000,000 so'm</span>
                    </div>
                    <p>Bu mahsulot haqida qisqacha ma'lumot...</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary add-to-cart" data-product-id="${productId}">
                            <i class="fas fa-cart-plus"></i> Savatga qo'shish
                        </button>
                        <button class="btn btn-outline-danger add-to-wishlist" data-product-id="${productId}">
                            <i class="far fa-heart"></i> Sevimlilar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }, 1000);

    // Remove modal when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .brand-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
}

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

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
    // Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Back to top button
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) {
        // Create back to top button
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'btn btn-primary';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});