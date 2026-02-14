import './style.css'
import { translations } from './translations.js'

document.addEventListener('DOMContentLoaded', () => {
    // Language Toggle
    const langToggle = document.getElementById('lang-toggle');
    const flagIcon = langToggle.querySelector('.flag-icon');
    let currentLang = 'en';

    function updateContent(lang) {
        // Iterate over all elements with a 'key' attribute
        document.querySelectorAll('[key]').forEach(el => {
            const key = el.getAttribute('key');
            const keys = key.split('.');
            let value = translations[lang];

            // Traverse the translation object
            for (let k of keys) {
                value = value[k];
            }

            if (value) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = value;
                } else {
                    el.innerText = value;
                }
            }
        });

        // Update Dynamic Content (Portfolio/Experience)
        const experienceGrid = document.getElementById('experience-grid');
        if (experienceGrid && translations[lang].portfolio.jobs) {
            experienceGrid.innerHTML = translations[lang].portfolio.jobs.map(job => `
                <div class="project-card">
                    <div class="project-info">
                        <h3>${job.title}</h3>
                        <p class="company">${job.company}</p>
                        <p class="period">${job.period}</p>
                        <p>${job.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        // Update Flag and Text
        const langText = langToggle.querySelector('.lang-text');
        if (lang === 'en') {
            flagIcon.innerText = '🇺🇸';
            langText.innerText = 'EN';
            langToggle.setAttribute('aria-label', 'Switch to Portuguese');
        } else {
            flagIcon.innerText = '🇧🇷';
            langText.innerText = 'PT';
            langToggle.setAttribute('aria-label', 'Switch to English');
        }
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'pt' : 'en';
        updateContent(currentLang);
    });

    // Initialize content
    updateContent(currentLang);


    // Mobile Navigation Toggle
    const navContent = document.querySelector('.nav-content');
    const navRight = document.querySelector('.nav-right');
    const navLinks = document.querySelector('.nav-links');

    // Create toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.classList.add('nav-toggle');
    toggleBtn.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    // Insert toggle button before the nav-right container on mobile
    // But nav-right contains the toggle, so we need to be careful with layout
    // Let's hide nav-right on mobile and show it when toggled? 
    // Simplified: Just append the burger menu to nav-content
    navContent.appendChild(toggleBtn);

    // Style toggle button via JS for simplicity or add to CSS
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.display = 'none'; // Hidden on desktop
    toggleBtn.style.flexDirection = 'column';
    toggleBtn.style.gap = '5px';
    toggleBtn.style.zIndex = '1002'; // Above menu

    // Add CSS for mobile toggle visibility
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            .nav-toggle { display: flex !important; }
            .nav-right {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                padding: 2rem;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                animation: slideDown 0.3s ease-out;
            }
            .nav-right.active {
                display: flex;
            }
            .nav-links {
                flex-direction: column;
                gap: 1.5rem;
                width: 100%;
                text-align: center;
            }
            .lang-toggle {
                margin: 0 auto; /* Center flag on mobile */
                margin-top: 1rem;
            }
            .nav-toggle span {
                width: 25px;
                height: 3px;
                background: var(--secondary-purple);
                transition: 0.3s;
            }
            .nav-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
            .nav-toggle.active span:nth-child(2) { opacity: 0; }
            .nav-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }
            
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        }
    `;
    document.head.appendChild(style);

    toggleBtn.addEventListener('click', () => {
        navRight.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navRight.classList.remove('active');
                toggleBtn.classList.remove('active');
            }
        });
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active-link');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active-link');
                a.style.color = 'var(--secondary-purple)';
            } else {
                a.style.color = 'var(--text-color)';
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const answer = item.querySelector('.faq-answer');

            // Close others
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
});
