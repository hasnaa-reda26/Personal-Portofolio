function initMobileMenu() {

    const navLinks = document.querySelector('.nav-links');

    const headerContainer = document.querySelector('#header .container');
    
    if (!navLinks || !headerContainer) return;

    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn lg:hidden text-slate-900 dark:text-white text-2xl focus:outline-none';
    menuBtn.setAttribute('aria-label', 'فتح القائمة');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    headerContainer.appendChild(menuBtn);

    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        
        if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-times';
            menuBtn.setAttribute('aria-label', 'إغلاق القائمة');
        } else {
            icon.className = 'fa-solid fa-bars';
            menuBtn.setAttribute('aria-label', 'فتح القائمة');
        }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuBtn.querySelector('i').className = 'fa-solid fa-bars';
            menuBtn.setAttribute('aria-label', 'فتح القائمة');
        });
    });
}


function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function checkActiveSection() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkActiveSection);
    checkActiveSection();
}


function applyThemeColors(primary, secondary, accent) {
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-accent', accent);

    const gradientElements = document.querySelectorAll('[style*="linear-gradient"]');
    gradientElements.forEach(function(el) {
        const bg = el.style.background;
        if (bg.includes('linear-gradient')) {
            const regex = /linear-gradient\([^)]+\)/;
            const newGradient = `linear-gradient(135deg, ${primary}, ${secondary})`;
            el.style.background = bg.replace(regex, newGradient);
        }
    });
}

function changeFont(fontName) {
    document.body.classList.remove('font-alexandria', 'font-tajawal', 'font-cairo');
    document.body.classList.add('font-' + fontName);

    const fontButtons = document.querySelectorAll('.font-option');
    fontButtons.forEach(function(btn) {
        if (btn.getAttribute('data-font') === fontName) {
            btn.classList.add('active', 'border-primary', 'bg-slate-50', 'dark:bg-slate-800');
            btn.classList.remove('border-slate-200', 'dark:border-slate-700');
        } else {
            btn.classList.remove('active', 'border-primary', 'bg-slate-50', 'dark:bg-slate-800');
            btn.classList.add('border-slate-200', 'dark:border-slate-700');
        }
    });

    localStorage.setItem('selectedFont', fontName);
}

function initSettingsSidebar() {
    const sidebar = document.getElementById('settings-sidebar');
    const toggleBtn = document.getElementById('settings-toggle');
    const closeBtn = document.getElementById('close-settings');
    const resetBtn = document.getElementById('reset-settings');
    const fontOptions = document.querySelectorAll('.font-option');
    const colorsGrid = document.getElementById('theme-colors-grid');

    if (!sidebar || !toggleBtn) return;

    const themePalettes = [
        { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
        { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
        { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
        { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", accent: "#22d3ee" },
        { name: "Red Rose", primary: "#ef4444", secondary: "#f43f5e", accent: "#fb7185" },
        { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", accent: "#fbbf24" }
    ];

    
    function openSidebar() {
        sidebar.classList.remove('translate-x-full');
        toggleBtn.style.right = '20rem';
    }

    function closeSidebar() {
        sidebar.classList.add('translate-x-full');
        toggleBtn.style.right = '0';
    }

    toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && !sidebar.classList.contains('translate-x-full')) {
            closeSidebar();
        }
    });

    fontOptions.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const selectedFont = this.getAttribute('data-font');
            changeFont(selectedFont);
        });
    });

    if (colorsGrid) {
        colorsGrid.innerHTML = '';
        themePalettes.forEach(function(palette) {
            const colorBtn = document.createElement('button');
            colorBtn.className = 'w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm';
            colorBtn.style.background = `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`;
            colorBtn.setAttribute('title', palette.name);
            colorBtn.setAttribute('data-primary', palette.primary);
            colorBtn.setAttribute('data-secondary', palette.secondary);

            colorBtn.addEventListener('click', function() {
                applyThemeColors(palette.primary, palette.secondary, palette.accent);

                colorsGrid.querySelectorAll('button').forEach(function(b) {
                    b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
                });
                colorBtn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');

                localStorage.setItem('selectedTheme', JSON.stringify({
                    primary: palette.primary,
                    secondary: palette.secondary,
                    accent: palette.accent
                }));
            });

            colorsGrid.appendChild(colorBtn);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            localStorage.removeItem('selectedTheme');
            localStorage.removeItem('selectedFont');
            changeFont('tajawal');
            
            const defaultTheme = themePalettes[0];
            applyThemeColors(defaultTheme.primary, defaultTheme.secondary, defaultTheme.accent);

            const firstColorBtn = colorsGrid.querySelector('button');
            if (firstColorBtn) firstColorBtn.click();
            closeSidebar();
        });
    }

    const savedFont = localStorage.getItem('selectedFont');
    changeFont(savedFont || 'tajawal');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (!savedTheme) return;

    try {
        const themeData = JSON.parse(savedTheme);
        const primary = themeData.primary || themeData.from;
        const secondary = themeData.secondary || themeData.to;
        const accent = themeData.accent || primary;

        applyThemeColors(primary, secondary, accent);

        setTimeout(function() {
            const colorButtons = document.querySelectorAll('#theme-colors-grid button');
            colorButtons.forEach(function(btn) {
                if (btn.getAttribute('data-primary') === primary && btn.getAttribute('data-secondary') === secondary) {
                    colorButtons.forEach(function(b) {
                        b.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
                    });
                    btn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-slate-900');
                }
            });
        }, 100);
    } catch (e) {
        console.error('Error loading saved theme:', e);
    }
}


function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-button');
    const rootElement = document.documentElement;

    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        rootElement.classList.add('dark');
    } else {
        rootElement.classList.remove('dark');
    }

    themeBtn.addEventListener('click', function() {
        const isDark = rootElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}


function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.portfolio-filter');
    const items = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length === 0 || items.length === 0) return;

    items.forEach(function(item) {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-filter');

            filterBtns.forEach(function(b) {
                b.classList.remove('active', 'bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'shadow-lg', 'shadow-primary/50');
                b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-300', 'dark:border-slate-700');
            });

            this.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-300', 'dark:border-slate-700');
            this.classList.add('active', 'bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'shadow-lg', 'shadow-primary/50');

            items.forEach(function(item) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            });

            setTimeout(function() {
                items.forEach(function(item) {
                    const category = item.getAttribute('data-category');
                    if (selectedCategory === 'all' || category === selectedCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });

                setTimeout(function() {
                    items.forEach(function(item) {
                        const category = item.getAttribute('data-category');
                        if (selectedCategory === 'all' || category === selectedCategory) {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }
                    });
                }, 50);
            }, 300);
        });
    });
}


function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.remove('opacity-0', 'invisible');
            scrollBtn.classList.add('opacity-100', 'visible');
        } else {
            scrollBtn.classList.remove('opacity-100', 'visible');
            scrollBtn.classList.add('opacity-0', 'invisible');
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


function initCustomSelects() {
    const selects = document.querySelectorAll('.custom-select');

    selects.forEach(function(select) {
        const selectedText = select.querySelector('.selected-text');
        const chevronIcon = select.querySelector('.fa-chevron-down');
        const optionsWrapper = select.nextElementSibling;
        if (!optionsWrapper) return;
        
        const options = optionsWrapper.querySelectorAll('.custom-option');

        select.addEventListener('click', function(e) {
            e.stopPropagation();

            document.querySelectorAll('.custom-options').forEach(function(opt) {
                if (opt !== optionsWrapper) {
                    opt.classList.add('hidden');
                    const icon = opt.previousElementSibling?.querySelector('.fa-chevron-down');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });

            optionsWrapper.classList.toggle('hidden');
            if (optionsWrapper.classList.contains('hidden')) {
                chevronIcon.style.transform = 'rotate(0deg)';
            } else {
                chevronIcon.style.transform = 'rotate(180deg)';
            }
        });

        options.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                selectedText.textContent = value;
                
                selectedText.classList.remove('text-slate-400', 'text-slate-500', 'dark:text-slate-400');
                selectedText.classList.add('text-slate-800', 'dark:text-white');

                options.forEach(function(o) { o.classList.remove('bg-primary/10'); });
                option.classList.add('bg-primary/10');

                optionsWrapper.classList.add('hidden');
                chevronIcon.style.transform = 'rotate(0deg)';
            });
        });
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-options').forEach(function(opt) {
            opt.classList.add('hidden');
            const icon = opt.previousElementSibling?.querySelector('.fa-chevron-down');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });
    });
}


function initContactForm() {
    const form = document.querySelector('#contact form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const fieldNames = ['name', 'email', 'phone', 'message'];

    inputs.forEach(function(input, index) {
        if (fieldNames[index]) {
            input.id = 'contact-' + fieldNames[index];
            const prevLabel = input.previousElementSibling;
            if (prevLabel && prevLabel.tagName === 'LABEL') {
                prevLabel.setAttribute('for', input.id);
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll('.error-message').forEach(function(msg) { msg.remove(); });
        form.querySelectorAll('.border-red-500').forEach(function(el) { el.classList.remove('border-red-500'); });

        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const messageInput = form.querySelector('textarea');
        const projectSelectText = form.querySelector('.custom-select[data-name="project-type"] .selected-text');

        if (!nameInput.value.trim()) {
            showError(nameInput, 'يرجى إدخال الاسم الكامل');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'يرجى إدخال البريد الإلكتروني');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
            showError(phoneInput, 'يرجى إدخال رقم هاتف صحيح');
            isValid = false;
        }

        if (projectSelectText && projectSelectText.classList.contains('text-slate-400')) {
            const selectWrapper = projectSelectText.closest('.custom-select-wrapper');
            if (selectWrapper) {
                selectWrapper.querySelector('.custom-select').classList.add('border-red-500');
                showError(selectWrapper, 'يرجى اختيار نوع المشروع');
            }
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            showError(messageInput, 'يرجى إدخال تفاصيل المشروع');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'يرجى إدخال المزيد من التفاصيل');
            isValid = false;
        }

        if (isValid) {
            showSuccessModal();
            form.reset();

            form.querySelectorAll('.selected-text').forEach(function(text) {
                text.classList.add('text-slate-500', 'dark:text-slate-400');
                text.classList.remove('text-slate-800', 'dark:text-white');
            });
            if (projectSelectText) projectSelectText.textContent = 'اختر نوع المشروع';
            const budgetText = form.querySelector('.custom-select[data-name="budget"] .selected-text');
            if (budgetText) budgetText.textContent = 'اختر الميزانية';
        }
    });

    function showError(element, message) {
        const errorP = document.createElement('p');
        errorP.className = 'error-message text-red-400 text-sm mt-1';
        errorP.textContent = message;

        if (element.classList.contains('custom-select-wrapper')) {
            element.appendChild(errorP);
        } else {
            element.classList.add('border-red-500');
            element.parentElement.appendChild(errorP);
        }
    }

    function showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-slate-700 shadow-2xl transform animate-fade-in">
                <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa-solid fa-check text-4xl text-white"></i>
                </div>
                <h3 class="text-2xl font-bold mb-3">تم إرسال رسالتك بنجاح!</h3>
                <p class="text-slate-400 mb-6">شكراً لتواصلك. سأرد عليك في أقرب وقت ممكن.</p>
                <button class="success-popup-close bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
                    حسناً
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.success-popup-close').addEventListener('click', function() {
            modal.remove();
        });

        setTimeout(function() {
            if (modal.parentNode) modal.remove();
        }, 5000);
    }

    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            const errorP = this.parentElement.querySelector('.error-message');
            if (errorP) errorP.remove();
        });
    });
}


function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.getElementById('next-testimonial');
    const prevBtn = document.getElementById('prev-testimonial');
    const indicators = document.querySelectorAll('.carousel-indicator');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;

    function updateCarousel() {

        let visibleCards = 1;
        if (window.innerWidth >= 1024) {
            visibleCards = 3;
        } else if (window.innerWidth >= 640) {
            visibleCards = 2;
        }

        let maxIndex = cards.length - visibleCards;
        if (maxIndex < 0) {
            maxIndex = 0;
        }

        if (currentIndex > maxIndex) {
            currentIndex = 0; 
        }
        if (currentIndex < 0) {
            currentIndex = maxIndex; 
        }

        let cardPercentage = 100 / visibleCards;
        let translateValue = currentIndex * cardPercentage;
        track.style.transform = 'translateX(' + translateValue + '%)';

        indicators.forEach(function(dot, index) {

            dot.classList.remove('bg-accent');
            dot.classList.add('dark:bg-slate-600');
            
            if (index === currentIndex) {
                dot.classList.add('bg-accent');
                dot.classList.remove('dark:bg-slate-600');
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex++;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex--;
            updateCarousel();
        });
    }

    indicators.forEach(function(dot) {
        dot.addEventListener('click', function(e) {

            currentIndex = parseInt(e.target.getAttribute('data-index'));
            updateCarousel();
        });
    });

    updateCarousel();
}

document.addEventListener('DOMContentLoaded', function() {
    
    initMobileMenu();
    initScrollSpy();
    initSettingsSidebar();
    loadSavedTheme();
    initThemeToggle();
    initPortfolioFilter();
    initScrollToTop();
    initCustomSelects();
    initContactForm();
    initTestimonialsCarousel();

    console.log('App initialized successfully!');
});