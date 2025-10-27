// ===================================
// Landing Animation Handler
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login page if not logged in
        alert('Vui lòng đăng nhập để truy cập trang chủ');
        window.location.href = '../login/login.html';
        return;
    }

    // Update navbar with user info
    const authButtonsContainer = document.getElementById('authButtons');
    if (authButtonsContainer && currentUser) {
        authButtonsContainer.innerHTML = `
            <span class="navbar-text text-white me-2" style="font-size: 0.9rem;">
                <i class="bi bi-person-circle"></i> ${currentUser.fullname || currentUser.email}
            </span>
            <button class="btn btn-auth-outline" onclick="handleLogout()" style="border-radius: 20px;">
                <i class="bi bi-box-arrow-right"></i> Logout
            </button>
        `;
    }

    const landingAnimation = document.getElementById('landingAnimation');
    const navbar = document.getElementById('mainNav');
    const heroSection = document.getElementById('why-choose-us');
    let hasScrolled = false;
    const landingHideThreshold = 1;

    // Ensure the hero section stays hidden until the landing animation is dismissed
    if (heroSection) {
        heroSection.classList.remove('section-visible');
        if (!heroSection.classList.contains('section-hidden')) {
            heroSection.classList.add('section-hidden');
        }
    }

    const revealHeroSection = () => {
        if (!heroSection) {
            return;
        }
        if (!heroSection.classList.contains('section-visible')) {
            heroSection.classList.remove('section-hidden');
            heroSection.classList.add('section-visible');
        }
    };

    const resetHeroSection = () => {
        if (!heroSection) {
            return;
        }
        heroSection.classList.remove('section-visible');
        if (!heroSection.classList.contains('section-hidden')) {
            heroSection.classList.add('section-hidden');
        }
    };

    // Handle scroll to hide/show landing animation and navbar
    function handleLandingScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        // When user scrolls down from the top
        if (scrollY > landingHideThreshold && !hasScrolled) {
            hasScrolled = true;
            // Hide landing animation and menu button
            if (landingAnimation) {
                landingAnimation.classList.add('hidden');
            }
            // Show navbar with slide-down animation
            if (navbar) {
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
            revealHeroSection();
        }
        // When user scrolls back to top
        else if (scrollY <= landingHideThreshold && hasScrolled) {
            hasScrolled = false;
            // Show landing animation and menu button
            if (landingAnimation) {
                landingAnimation.classList.remove('hidden');
            }
            // Hide navbar
            if (navbar) {
                navbar.classList.remove('navbar-visible');
                navbar.classList.add('navbar-hidden');
            }
            resetHeroSection();
        }
        // Keep navbar visible while scrolling down
        else if (scrollY > landingHideThreshold) {
            if (navbar) {
                navbar.classList.remove('navbar-hidden');
                navbar.classList.add('navbar-visible');
            }
            revealHeroSection();
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', handleLandingScroll);
    
    // Initial check
    handleLandingScroll();
});

// ===================================
// Logout Handler
// ===================================

function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        alert('Đăng xuất thành công!');
        window.location.href = '../login/login.html';
    }
}

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links that start with #
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only handle internal anchor links
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navbar
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
});

// ===================================
// Current Page Navigation Highlight
// ===================================

function highlightCurrentPageNav() {
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    if (!navLinks.length) {
        return;
    }

    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    let matched = false;

    navLinks.forEach(link => {
        const isMatch = link.dataset.page === fileName;
        link.classList.remove('nav-current-page', 'active');
        if (isMatch) {
            link.classList.add('nav-current-page', 'active');
            matched = true;
        }
    });

    if (!matched && fileName === 'index.html') {
        const homeLink = document.querySelector('#mainNav .nav-link[data-page="index.html"]');
        if (homeLink) {
            homeLink.classList.add('nav-current-page', 'active');
        }
    }
}

document.addEventListener('DOMContentLoaded', highlightCurrentPageNav);
window.addEventListener('pageshow', highlightCurrentPageNav);

// ===================================
// Navbar Background Change on Scroll
// ===================================

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgb(18, 18, 18)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'rgb(18, 18, 18)';
        navbar.style.backdropFilter = 'none';
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ===================================
// Back to Top Button Functionality
// ===================================

const backToTopButton = document.getElementById('backToTop');

// Track custom landing filter dropdowns so we can orchestrate their open/close states
const filterDropdownRegistry = [];

// Keep wheel/touch scrolling confined to a specific container so the page does not move
function enableWheelLock(container, scrollableElement) {
    if (!container || container.dataset.wheelLock === 'enabled') {
        return;
    }

    const target = scrollableElement || container;
    let touchStartY = 0;

    const shouldLock = deltaY => {
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollHeight <= clientHeight) {
            return true;
        }
        const atTop = scrollTop <= 0 && deltaY < 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && deltaY > 0;
        return atTop || atBottom;
    };

    const handleWheel = event => {
        if (shouldLock(event.deltaY)) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const handleTouchStart = event => {
        if (event.touches && event.touches.length) {
            touchStartY = event.touches[0].clientY;
        }
    };

    const handleTouchMove = event => {
        if (!event.touches || !event.touches.length) {
            return;
        }
        const currentY = event.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        if (shouldLock(deltaY)) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    container.dataset.wheelLock = 'enabled';
}

function toggleBackToTopButton() {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

// Show/hide button on scroll
window.addEventListener('scroll', toggleBackToTopButton);

// Scroll to top when button is clicked
backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Contact Form Submission Handler
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Log form data (in a real application, this would be sent to a server)
        console.log('Contact Form Submitted:', formData);
        
        // Show success message
        alert('Thank you for contacting us! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// ===================================
// Newsletter Form Submission Handler
// ===================================

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Log email (in a real application, this would be sent to a server)
        console.log('Newsletter Subscription:', email);
        
        // Show success message
        alert('Thank you for subscribing to our newsletter!');
        
        // Reset form
        newsletterForm.reset();
    });
}

// ===================================
// Card Hover Effect Enhancement
// ===================================

const carCards = document.querySelectorAll('.car-card');

carCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===================================
// Section Menu & Reveal Animations
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const menuPanel = document.getElementById('sectionMenuPanel');
    const menuList = document.getElementById('sectionMenuList');
    const menuCloseBtn = document.getElementById('sectionMenuClose');
    const menuTriggers = document.querySelectorAll('.nav-menu-trigger');
    const navbarMenuBtn = document.getElementById('landingMenuBtn');
    const sectionNodes = Array.from(document.querySelectorAll('section[id]'));
    let menuAnchorElement = null;

    // Ensure the landing overlay is dismissed and navbar is visible before calculating scroll offsets
    const preparePageForMenuScroll = () => {
        const landingAnimation = document.getElementById('landingAnimation');
        const navbarElement = document.getElementById('mainNav');
        const heroSection = document.getElementById('why-choose-us');

        if (landingAnimation && !landingAnimation.classList.contains('hidden')) {
            landingAnimation.classList.add('hidden');
        }

        if (navbarElement) {
            navbarElement.classList.remove('navbar-hidden');
            navbarElement.classList.add('navbar-visible');
        }

        if (heroSection && heroSection.classList.contains('section-hidden')) {
            heroSection.classList.remove('section-hidden');
            heroSection.classList.add('section-visible');
        }
    };

    if (menuPanel && menuList) {
        const menuItems = [];

        const landingSection = document.getElementById('landingAnimation');
        if (landingSection) {
            menuItems.push({ label: 'Home', target: '#landingAnimation' });
        }

        sectionNodes.forEach(section => {
            if (section.id === 'landingAnimation') {
                return;
            }
            const heading = section.querySelector('h2, h3, h4, h5');
            const label = heading ? heading.textContent.trim() : section.id.replace(/-/g, ' ');
            menuItems.push({ label, target: `#${section.id}` });
        });

    menuList.innerHTML = '';
    enableWheelLock(menuPanel, menuList);

        function smoothScrollTo(targetSelector) {
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) {
                return;
            }
            preparePageForMenuScroll();

            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const innerHeading = targetElement.querySelector('h1, h2, h3, h4, h5, h6');
            const scrollAnchor = innerHeading || targetElement;
            const anchorTop = scrollAnchor.getBoundingClientRect().top + window.pageYOffset;
            const spacingOffset = innerHeading ? 32 : 16;
            const finalPosition = Math.max(anchorTop - navbarHeight - spacingOffset, 0);
            window.scrollTo({ top: finalPosition, behavior: 'smooth' });

            // Final adjustment once the navbar is in place to avoid cropped headings on the first navigation
            setTimeout(() => {
                const refreshedNavbar = document.querySelector('.navbar');
                const refreshedHeight = refreshedNavbar ? refreshedNavbar.offsetHeight : 0;
                const currentRect = scrollAnchor.getBoundingClientRect();
                const desiredTop = (innerHeading ? 32 : 16) + refreshedHeight;
                const delta = currentRect.top - desiredTop;
                if (Math.abs(delta) > 1) {
                    window.scrollBy({ top: delta, behavior: 'auto' });
                }
            }, 350);
        }

        menuItems.forEach(item => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = item.target;
            anchor.innerHTML = `<span>${item.label}</span><i class="bi bi-arrow-right-short"></i>`;
            anchor.addEventListener('click', function(event) {
                event.preventDefault();
                closeMenu();
                if (item.target === '#landingAnimation') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    smoothScrollTo(item.target);
                }
            });
            listItem.appendChild(anchor);
            menuList.appendChild(listItem);
        });
    }

    let menuOpen = false;

    function positionMenuPanel(anchorElement) {
        if (!menuPanel || !anchorElement) {
            return;
        }
        const anchorRect = anchorElement.getBoundingClientRect();
        const panelWidth = menuPanel.offsetWidth || 0;
        const viewportWidth = window.innerWidth;
        const horizontalPadding = 16;
        const maxLeft = viewportWidth - panelWidth - horizontalPadding;
        const computedLeft = Math.max(horizontalPadding, Math.min(anchorRect.left, maxLeft));
        menuPanel.style.left = `${computedLeft}px`;
        menuPanel.style.top = `${anchorRect.bottom + 12}px`;
    }

    function setTriggersExpanded(state) {
        menuTriggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', state);
        });
    }

    function openMenu() {
        if (!menuPanel) {
            return;
        }
        positionMenuPanel(menuAnchorElement || navbarMenuBtn || menuTriggers[0]);
        menuPanel.classList.add('open');
        menuPanel.setAttribute('aria-hidden', 'false');
        menuOpen = true;
        setTriggersExpanded('true');
    }

    function closeMenu() {
        if (!menuPanel) {
            return;
        }
        menuPanel.classList.remove('open');
        menuPanel.setAttribute('aria-hidden', 'true');
        menuOpen = false;
        setTriggersExpanded('false');
    }

    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            menuAnchorElement = event.currentTarget;
            toggleMenu();
        });
    });

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', closeMenu);
    }

    document.addEventListener('click', function(event) {
        if (!menuOpen || !menuPanel) {
            return;
        }
        const clickedInsidePanel = menuPanel.contains(event.target);
        const clickedTrigger = Array.from(menuTriggers).some(trigger => trigger.contains(event.target));
        if (!clickedInsidePanel && !clickedTrigger) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (menuOpen) {
            positionMenuPanel(menuAnchorElement || navbarMenuBtn || menuTriggers[0]);
        }
    });

    if (navbarMenuBtn && !navbarMenuBtn.hasAttribute('aria-expanded')) {
        navbarMenuBtn.setAttribute('aria-expanded', 'false');
    }

    // Intersection Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px'
    });

    const manualRevealSections = new Set(['why-choose-us']);

    sectionNodes.forEach(section => {
        if (!section.classList.contains('section-transition')) {
            return;
        }
        if (manualRevealSections.has(section.id)) {
            section.classList.remove('section-visible');
            if (!section.classList.contains('section-hidden')) {
                section.classList.add('section-hidden');
            }
            return;
        }
        if (!section.classList.contains('section-hidden')) {
            section.classList.add('section-hidden');
        }
        sectionObserver.observe(section);
    });

    // Intersection Observer for cards and feature elements
    const revealTargets = document.querySelectorAll('.card, .stat-card, .partner-card, .blog-card, .testimonial-card, .feature-card, .selling-step, .selling-benefits-card, .benefit-item, .contact-item');

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-ready');
                elementObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    revealTargets.forEach(target => {
        target.classList.add('reveal-ready');
        elementObserver.observe(target);
    });

    // FAQ ripple feedback
    const faqButtons = document.querySelectorAll('#faq .accordion-button');
    faqButtons.forEach(button => {
        const triggerRipple = () => {
            button.classList.remove('ripple-active');
            void button.offsetWidth;
            button.classList.add('ripple-active');
            setTimeout(() => {
                button.classList.remove('ripple-active');
            }, 650);
        };

        button.addEventListener('click', triggerRipple);
        button.addEventListener('keyup', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                triggerRipple();
            }
        });
    });

    const faqAccordion = document.getElementById('faqAccordion');
    if (faqAccordion) {
        faqAccordion.addEventListener('show.bs.collapse', event => {
            const answer = event.target.querySelector('.faq-answer');
            if (!answer) {
                return;
            }
            answer.classList.remove('faq-answer-visible');
            void answer.offsetWidth;
            answer.classList.add('faq-answer-visible');
        });

        faqAccordion.addEventListener('hide.bs.collapse', event => {
            const answer = event.target.querySelector('.faq-answer');
            if (answer) {
                answer.classList.remove('faq-answer-visible');
            }
        });
    }
});

// ===================================
// Loading Indicator for External Links
// ===================================

const externalLinks = document.querySelectorAll('a[href^="pages/"]');

externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Add a small loading indicator (optional)
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.add('bi-arrow-clockwise');
            icon.style.animation = 'spin 1s linear infinite';
        }
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.innerHTML = `&copy; ${currentYear} LuxAuto. All rights reserved.`;
    }
});

// ===================================
// Keyboard Navigation Support
// ===================================

document.addEventListener('keydown', function(e) {
    // Press 'H' to go to home/hero section
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            document.querySelector('#why-choose-us').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (!e.target.matches('input, textarea')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ===================================
// Console Welcome Message
// ===================================

console.log('%c Welcome to LuxAuto! ', 'background: #0d6efd; color: white; font-size: 20px; padding: 10px;');
console.log('%c Your trusted platform for buying and selling vehicles ', 'font-size: 14px; color: #6c757d;');

// ===================================
// Landing Filter Dropdown Enhancer
// ===================================

function closeAllFilterPanels(exceptPanel) {
    filterDropdownRegistry.forEach(entry => {
        if (entry.panel === exceptPanel) {
            return;
        }
        entry.close();
    });
}

function enhanceLandingFilters() {
    const selectElements = Array.from(document.querySelectorAll('.landing-filter'));

    selectElements.forEach(select => {
        if (select.dataset.enhanced === 'true') {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'filter-select-wrapper';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        select.classList.add('filter-native-select');

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'filter-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const activeOption = select.options[select.selectedIndex];
        const initialLabel = activeOption ? activeOption.textContent : (select.getAttribute('data-placeholder') || 'Select');
        trigger.innerHTML = `<span>${initialLabel}</span><i class="bi bi-chevron-down"></i>`;
        wrapper.appendChild(trigger);

        const panel = document.createElement('div');
        panel.className = 'filter-select-panel section-menu-card';
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('role', 'listbox');

        const list = document.createElement('ul');
        list.className = 'filter-select-list';

        Array.from(select.options).forEach(option => {
            if (option.disabled || option.hidden) {
                return;
            }
            const listItem = document.createElement('li');
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'filter-select-option';
            optionButton.dataset.value = option.value;
            optionButton.textContent = option.textContent;
            optionButton.setAttribute('role', 'option');

            if (option.selected) {
                optionButton.classList.add('active');
            }

            optionButton.addEventListener('click', () => {
                select.value = option.value;
                trigger.querySelector('span').textContent = option.textContent;
                list.querySelectorAll('.filter-select-option').forEach(btn => btn.classList.remove('active'));
                optionButton.classList.add('active');
                select.dispatchEvent(new Event('change', { bubbles: true }));
                closePanel();
            });

            listItem.appendChild(optionButton);
            list.appendChild(listItem);
        });

    panel.appendChild(list);
    enableWheelLock(panel, list);
        wrapper.appendChild(panel);

        function openPanel() {
            closeAllFilterPanels(panel);
            panel.classList.add('open');
            panel.setAttribute('aria-hidden', 'false');
            trigger.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            panel.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
            trigger.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', event => {
            event.preventDefault();
            if (panel.classList.contains('open')) {
                closePanel();
            } else {
                openPanel();
            }
        });

        trigger.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (panel.classList.contains('open')) {
                    closePanel();
                } else {
                    openPanel();
                }
            }
        });

        select.addEventListener('change', () => {
            const matchingOption = Array.from(list.querySelectorAll('.filter-select-option')).find(btn => btn.dataset.value === select.value);
            list.querySelectorAll('.filter-select-option').forEach(btn => btn.classList.remove('active'));
            if (matchingOption) {
                matchingOption.classList.add('active');
                trigger.querySelector('span').textContent = matchingOption.textContent;
            }
        });

        filterDropdownRegistry.push({ panel, close: closePanel });
        select.dataset.enhanced = 'true';
    });

    return selectElements;
}

document.addEventListener('click', event => {
    if (!event.target.closest('.filter-select-wrapper')) {
        closeAllFilterPanels(null);
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeAllFilterPanels(null);
    }
});

// ===================================
// Landing Search Functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.landing-search-input');
    const searchBtn = document.querySelector('.landing-search-btn');
    const filterToggle = document.getElementById('filterToggle');
    const filterGroup = document.getElementById('filterGroup');
    const filterSelects = enhanceLandingFilters();
    const brandFilter = filterSelects[0] || null;
    const regionFilter = filterSelects[1] || null;
    const priceFilter = filterSelects[2] || null;
    
    // Ripple effect function for button only
    function createRipple(button) {
        if (button) {
            button.classList.remove('ripple');
            // Force reflow to restart animation
            void button.offsetWidth;
            button.classList.add('ripple');
            
            // Remove class after animation completes
            setTimeout(() => {
                button.classList.remove('ripple');
            }, 800);
        }
    }
    
    // Handle filter toggle button click with closing animation
    if (filterToggle && filterGroup) {
        filterToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect to the button only
            createRipple(filterToggle);
            
            // Toggle filter visibility with animations
            if (filterGroup.classList.contains('show')) {
                // Close animation
                filterGroup.classList.add('hide');
                filterToggle.classList.remove('active');
                closeAllFilterPanels(null);
                
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    filterGroup.classList.remove('show', 'hide');
                    closeAllFilterPanels(null);
                }, 500);
            } else {
                // Open animation
                filterGroup.classList.add('show');
                filterToggle.classList.add('active');
            }
        });
    }
    
    // Handle search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // Handle Enter key in search input
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Perform search function
    function performSearch() {
        const searchQuery = searchInput ? searchInput.value : '';
        const brand = brandFilter ? brandFilter.value : '';
        const region = regionFilter ? regionFilter.value : '';
        const price = priceFilter ? priceFilter.value : '';
        
        // Log search parameters (in production, this would trigger actual search)
        console.log('Search Parameters:', {
            query: searchQuery,
            brand: brand,
            region: region,
            priceRange: price
        });
        
        // Scroll to featured section to show results
        const featuredSection = document.querySelector('#featured');
        if (featuredSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = featuredSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Show user feedback (optional)
        if (searchQuery || brand || region || price) {
            // Create a temporary message
            const message = document.createElement('div');
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: white; color: #000; padding: 15px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10000; font-weight: 500;';
            message.textContent = 'Searching for vehicles...';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 2000);
        }
    }
    
    // Handle filter changes - auto-update
    [brandFilter, regionFilter, priceFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                console.log('Filter changed:', this.value);
                const wrapper = this.closest('.filter-select-wrapper');
                if (!wrapper) {
                    return;
                }
                const trigger = wrapper.querySelector('.filter-select-trigger');
                if (!trigger) {
                    return;
                }
                trigger.classList.add('selection-feedback');
                setTimeout(() => {
                    trigger.classList.remove('selection-feedback');
                }, 400);
            });
        }
    });
    
    // Removed click-outside-to-close behavior
    // Filters now only close when the filter toggle button is clicked again
});
