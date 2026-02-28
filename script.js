document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const navToggle = nav?.querySelector('.nav-toggle');
    const navLinks = nav?.querySelector('.nav-links');
    const themeStorageKey = 'educareTheme';

    if (nav && navToggle && navLinks) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.type = 'button';
        const themeItem = document.createElement('li');
        themeItem.className = 'theme-item';

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeToggle.textContent = theme === 'dark' ? '\u2600' : '\u263D';
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        };

        const savedTheme = localStorage.getItem(themeStorageKey) || 'light';
        applyTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(themeStorageKey, nextTheme);
            applyTheme(nextTheme);

            themeToggle.classList.remove('switching');
            window.requestAnimationFrame(() => {
                themeToggle.classList.add('switching');
            });
        });

        themeItem.appendChild(themeToggle);
        navLinks.appendChild(themeItem);

        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('menu-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 680) {
                nav.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.prepend(scrollProgress);

    const updateProgress = () => {
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
        scrollProgress.style.width = `${Math.min(percent, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const testimonialSection = document.querySelector('.testimonials');
    if (testimonialSection) {
        const track = testimonialSection.querySelector('.testimonial-track');
        const slides = testimonialSection.querySelectorAll('.testimonial-card');
        const prevBtn = testimonialSection.querySelector('[data-slide-dir="prev"]');
        const nextBtn = testimonialSection.querySelector('[data-slide-dir="next"]');
        const dots = testimonialSection.querySelectorAll('.slider-dot');

        if (track && slides.length > 1) {
            let activeIndex = 0;
            let autoPlay;

            const setSlide = (index) => {
                activeIndex = (index + slides.length) % slides.length;
                track.style.transform = `translateX(-${activeIndex * 100}%)`;

                dots.forEach((dot, dotIndex) => {
                    dot.classList.toggle('active', dotIndex === activeIndex);
                });
            };

            const startAutoPlay = () => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return;
                }
                autoPlay = window.setInterval(() => {
                    setSlide(activeIndex + 1);
                }, 4200);
            };

            const stopAutoPlay = () => {
                if (autoPlay) {
                    window.clearInterval(autoPlay);
                }
            };

            prevBtn?.addEventListener('click', () => setSlide(activeIndex - 1));
            nextBtn?.addEventListener('click', () => setSlide(activeIndex + 1));

            dots.forEach((dot) => {
                dot.addEventListener('click', () => {
                    const toIndex = Number(dot.dataset.slideTo);
                    if (!Number.isNaN(toIndex)) {
                        setSlide(toIndex);
                    }
                });
            });

            testimonialSection.addEventListener('mouseenter', stopAutoPlay);
            testimonialSection.addEventListener('mouseleave', startAutoPlay);

            setSlide(0);
            startAutoPlay();
        }
    }

    const showFormMessage = (form, message, type = 'success') => {
        if (!form) {
            return;
        }

        const oldMessage = form.nextElementSibling;
        if (oldMessage && oldMessage.classList.contains('form-message')) {
            oldMessage.remove();
        }

        const el = document.createElement('p');
        el.className = `form-message ${type}`;
        el.textContent = message;
        el.setAttribute('role', 'status');
        form.insertAdjacentElement('afterend', el);
    };

    const loginForm = document.querySelector('.login-form form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFormMessage(loginForm, 'Demo mode: login is not connected to a backend yet.');
        });
    }

    const signupForm = document.querySelector('.signup-form form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFormMessage(signupForm, 'Demo mode: signup is captured only for frontend preview.');
        });
    }

    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('donorName')?.value.trim();
            const amount = document.getElementById('donationAmount')?.value.trim();
            const purpose = document.getElementById('donationPurpose')?.value;

            showFormMessage(
                donationForm,
                `Thank you ${name}. Donation of INR ${amount} for ${purpose} has been submitted in demo mode.`
            );
            donationForm.reset();
        });
    }


    const teacherForm = document.querySelector('.teacher-form');
    if (teacherForm) {
        teacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const teacherName = document.getElementById('teacherName')?.value.trim();
            const subject = document.getElementById('teacherSubject')?.value;
            showFormMessage(
                teacherForm,
                `Thank you ${teacherName}. Your ${subject} mentor application has been submitted for admin review.`
            );
            teacherForm.reset();
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value.trim();
            showFormMessage(
                contactForm,
                `Thanks ${name}. Your message has been received in demo mode.`
            );
            contactForm.reset();
        });
    }

    const faqQuestionForm = document.querySelector('.faq-question-form');
    const faqQuestionList = document.getElementById('faqUserQuestionList');
    const faqStorageKey = 'educareFaqQuestions';

    const renderFaqQuestions = () => {
        if (!faqQuestionList) {
            return;
        }

        const savedQuestions = JSON.parse(localStorage.getItem(faqStorageKey) || '[]');
        faqQuestionList.innerHTML = '';

        if (!savedQuestions.length) {
            faqQuestionList.innerHTML = '<li class="empty">No questions yet. Be the first to ask.</li>';
            return;
        }

        savedQuestions.forEach((item) => {
            const li = document.createElement('li');
            const questionText = document.createElement('p');
            questionText.className = 'question-text';
            questionText.textContent = item.question;

            const questionMeta = document.createElement('p');
            questionMeta.className = 'question-meta';
            questionMeta.textContent = `Asked by ${item.name}`;

            li.appendChild(questionText);
            li.appendChild(questionMeta);
            faqQuestionList.appendChild(li);
        });
    };

    renderFaqQuestions();

    if (faqQuestionForm) {
        faqQuestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('faqName')?.value.trim();
            const question = document.getElementById('faqQuestion')?.value.trim();

            const savedQuestions = JSON.parse(localStorage.getItem(faqStorageKey) || '[]');
            const updatedQuestions = [{ name, question }, ...savedQuestions].slice(0, 6);
            localStorage.setItem(faqStorageKey, JSON.stringify(updatedQuestions));

            renderFaqQuestions();
            showFormMessage(
                faqQuestionForm,
                `Thanks ${name}. Your question was received in demo mode and will be reviewed.`
            );
            faqQuestionForm.reset();
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    if (filterButtons.length && courseCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selected = button.dataset.filter;

                filterButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');

                courseCards.forEach((card) => {
                    const category = card.dataset.category;
                    const shouldShow = selected === 'all' || selected === category;
                    card.style.display = shouldShow ? 'flex' : 'none';
                });
            });
        });
    }

    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length) {
        revealItems.forEach((item, index) => {
            item.style.setProperty('--reveal-index', `${index % 6}`);
        });

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            revealItems.forEach((item) => revealObserver.observe(item));
        } else {
            revealItems.forEach((item) => item.classList.add('in-view'));
        }
    }

    const canTilt = window.matchMedia('(pointer:fine)').matches;
    const tiltCards = document.querySelectorAll('.course-card, .option-card, .mentor-card, .visual-card');

    if (canTilt && tiltCards.length) {
        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateX = ((y / rect.height) - 0.5) * -4;
                const rotateY = ((x / rect.width) - 0.5) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    const adminActions = document.querySelectorAll('.admin-action');
    if (adminActions.length) {
        adminActions.forEach((button) => {
            button.addEventListener('click', () => {
                const card = button.closest('.admin-card');
                if (!card) {
                    return;
                }

                const status = card.querySelector('.admin-status');
                const applicant = card.dataset.applicant || 'Applicant';
                const action = button.dataset.action;

                if (!status || !action) {
                    return;
                }

                if (action === 'approve') {
                    status.textContent = 'Status: Approved';
                    status.className = 'admin-status approved';
                    window.alert(`${applicant} has been approved as a teacher.`);
                } else if (action === 'reject') {
                    status.textContent = 'Status: Rejected';
                    status.className = 'admin-status rejected';
                    window.alert(`${applicant} has been rejected.`);
                }
            });
        });
    }
});



