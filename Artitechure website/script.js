document.addEventListener('DOMContentLoaded', () => {

    /* --- Elements --- */
    const header = document.getElementById('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
    const heroBg = document.querySelector('.hero-bg');

    /* --- Sticky Header & Parallax --- */
    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Simple Parallax for Hero
        if (heroBg && window.scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
    });

    // Check initial state
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    /* --- Mobile Navigation --- */
    mobileMenuToggle.addEventListener('click', () => {
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const closeMobileMenu = () => {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileNavClose.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // Trigger immediately for elements in view on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    /* --- Gallery Filtering --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.masonry-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* --- Advanced Lightbox Functionality --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    let currentImageIndex = 0;
    let visibleItems = [];

    if (lightbox && galleryItems.length > 0) {
        
        const updateVisibleItems = () => {
            visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        };

        const showImage = (index) => {
            if (visibleItems.length === 0) return;
            if (index >= visibleItems.length) currentImageIndex = 0;
            else if (index < 0) currentImageIndex = visibleItems.length - 1;
            else currentImageIndex = index;

            const img = visibleItems[currentImageIndex].querySelector('.gallery-img');
            if (img) {
                lightboxImg.src = img.src;
            }
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                updateVisibleItems();
                currentImageIndex = visibleItems.indexOf(item);
                showImage(currentImageIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentImageIndex + 1);
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(currentImageIndex - 1);
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        });
    }

});
