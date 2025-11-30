// ====== FIREBASE ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js"; // Опционально

// === КОНФИГУРАЦИЯ FIREBASE ===
const firebaseConfig = {
    apiKey: "AIzaSyB7wYyFG1KNlVl8bW-3pn0U5fgHXktCGic",
    authDomain: "animy-ae6fa.firebaseapp.com",
    projectId: "animy-ae6fa",
    storageBucket: "animy-ae6fa.firebasestorage.app",
    messagingSenderId: "795248580471",
    appId: "1:795248580471:web:c821c22700a045bbb53372",
    measurementId: "G-TFM93P4HRE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const GoogleProvider = new GoogleAuthProvider();
const AppleProvider = new OAuthProvider("apple.com");

/* =================================================================
    Раздел I. ГЛОБАЛЬНАЯ ЛОГИКА (Работает на всех страницах)
================================================================= */

// ---------- Вспомогательные функции ----------
const qs = sel => document.querySelector(sel);
const body = document.body;

// ДОБАВЛЕНО: Список аниме и их HTML-файлов для универсального поиска
const animeLinks = [
    { titles: ["one piece", "ван піс", "onepiece"], file: "one-piece.html" },
    { titles: ["bleach", "бліч"], file: "bleach.html" },
    { titles: ["dandadan", "дандадан"], file: "dandadan.html" },
    { titles: ["gachiakuta", "гачіакута"], file: "gachiakuta.html" },
    { titles: ["jujutsu kaisen", "магічна битва", "магическая битва"], file: "jujutsu-kaisen.html" },
    { titles: ["kaiju no8", "кайдзю №8", "kaiju 8"], file: "kaiju-no8.html" },
    { titles: ["kimetsu no yaiba", "клинок знищує демонів", "demon slayer"], file: "kimetsu-no-yaiba.html" },
    { titles: ["the fragrant flower", "ароматна квітка"], file: "the-fragrant-flower.html" },
    { titles: ["attack on titan", "атака титанів", "атака титанов", "aot"], file: "attack-on-titan.html" },
    { titles: ["hanako kun", "ханако-кун"], file: "hanako-kun.html" },
    { titles: ["your name", "твоє ім’я", "твое имя"], file: "your-name.html" },
    { titles: ["silent voice", "форма голосу", "форма голоса"], file: "silent-voice.html" },
    { titles: ["evangelion", "євангеліон"], file: "evangelion.html" },
    { titles: ["spirited away", "унесені привидами", "унесенные призраками"], file: "spirited-away.html" },
    { titles: ["haikyu!!", "волейбол"], file: "haikyu.html" },
    { titles: ["idol", "айдол"], file: "idol.html" }
];

/* =================================================================
    Раздел II. ТЕМА (Переключатель темы — единый и безопасный)
================================================================= */
(function setupThemeToggle() {
    if (window.__themeToggleInit) return;
    window.__themeToggleInit = true;

    const toggleBtn = qs('#themeToggle');
    const themeIcon = qs('#themeIcon');
    const iconsMap = {
        '#savedIcon': ['img/bookmark.png', 'img/bookmark_white.png'],
        '#profileIcon': ['img/user-profile.png', 'img/user-profile_white.png'],
        '#searchIcon': ['img/search-icon.png', 'img/search-icon-white.png'],
    };

    if (!toggleBtn) return;

    function applyTheme(theme) {
        const logoImg = document.querySelector('#logoImg');
if (logoImg) logoImg.src = 'img/animy_white.png';

        body.classList.remove('theme-dark', 'theme-light');
        body.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);

        if (themeIcon) themeIcon.src = theme === 'dark' ? 'img/light.png' : 'img/moon.png';

        Object.keys(iconsMap).forEach(sel => {
            const el = qs(sel);
            if (!el) return;
            const [lightPath, darkPath] = iconsMap[sel];
            el.src = theme === 'dark' ? darkPath : lightPath;
        });
    }

    toggleBtn.addEventListener('click', () => {
        const nowDark = body.classList.contains('theme-dark');
        applyTheme(nowDark ? 'light' : 'dark');
    });

    const storedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(storedTheme);
})();

/* =================================================================
    Раздел III. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА
================================================================= */
const translations = {
    en: { home: "Home", movies: "Movies", anime: "Anime", trends: "Trends", comments: "Comments", sendBtn: "Send", namePlaceholder: "Your Name", commentPlaceholder: "Leave your comment!", rights: 'All rights reserved.', watchNow: "Watch now" },
    ua: { home: "Головна", movies: "Фільми", anime: "Аніме", trends: "Тренди", comments: "Коментарі", sendBtn: "Надіслати", namePlaceholder: "Ваше ім'я", commentPlaceholder: "Залиш свій коментар!", rights: 'Всі права захищені.', watchNow: "Дивитись зараз" },
    de: { home: "Startseite", movies: "Filme", anime: "Anime", trends: "Trends", comments: "Kommentare", sendBtn: "Senden", namePlaceholder: "Dein Name", commentPlaceholder: "Hinterlasse deinen Kommentar!", rights: 'Alle Rechte vorbehalten.', watchNow: "Jetzt ansehen" }
};

// (animeTranslations сохранены без изменений, не вставляю сюда ради краткости — их вставь как у тебя)

const applyLang = (lang) => {
    if (!translations[lang]) lang = 'en';
    document.documentElement.lang = lang;
    body.dataset.lang = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang]?.[key]) el.textContent = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (translations[lang]?.[key]) el.placeholder = translations[lang][key];
    });

    document.querySelectorAll('[data-anime]').forEach(el => {
        const key = el.dataset.anime;
        const t = animeTranslations[lang]?.[key];
        if (t) {
            const titleEl = el.querySelector('.anime-title');
            const descEl = el.querySelector('.overlay');
            if (titleEl) titleEl.textContent = t.title;
            if (descEl && t.desc) descEl.textContent = t.desc;
        }
    });

    if (typeof updateHeroText === 'function') updateHeroText(lang);
};

const langSelect = qs('#langSelect');
if (langSelect) {
    const storedLang = localStorage.getItem('lang') || 'en';
    langSelect.value = storedLang;
    applyLang(storedLang);
    langSelect.addEventListener('change', e => applyLang(e.target.value));
} else {
    applyLang(localStorage.getItem('lang') || 'en');
}

/* =================================================================
    Раздел IV. ПОИСК
================================================================= */
const searchBtn = qs('#searchBtn');
const searchBar = qs('#searchBar');
const searchInput = qs('#searchInput');
const clearBtn = qs('#clearSearch');

if (searchBtn && searchBar && searchInput && clearBtn) {
    searchBtn.addEventListener('click', () => {
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) searchInput.focus();
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        if (typeof filterAnime === 'function') filterAnime('');
    });

    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;

            let foundFile = null;
            for (const item of animeLinks) {
                if (item.titles.some(title => title.includes(query))) {
                    foundFile = item.file;
                    break;
                }
            }

            if (foundFile) {
                window.location.href = foundFile;
            } else {
                window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        }
    });
}

/* =================================================================
    Раздел V. МОДАЛЬНОЕ ОКНО
================================================================= */
const profileBtn = qs('#profileBtn');
const authModal = qs('#authModal');
const closeModalBtn = qs('#closeModalBtn');

if (profileBtn && authModal) profileBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
if (closeModalBtn && authModal) closeModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));
if (authModal) authModal.addEventListener('click', e => {
    if (e.target === authModal) authModal.classList.add('hidden');
});

/* =================================================================
    Раздел VI. Firebase Authentication
================================================================= */
const emailForm = qs(".auth-form");
const googleBtn = qs(".oauth-btn.google");
const appleBtn = qs(".oauth-btn.apple");

if (emailForm) {
    emailForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Успешный вход!");
            if (authModal) authModal.classList.add("hidden"); 
        } catch (signInErr) {
            if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/wrong-password') {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    alert("Аккаунт успешно создан!");
                    if (authModal) authModal.classList.add("hidden"); 
                } catch (createErr) {
                    alert("Ошибка: " + createErr.message);
                }
            } else {
                alert("Ошибка входа: " + signInErr.message);
            }
        }
    });
}

if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, GoogleProvider);
            alert("Успешный вход через Google!");
            if (authModal) authModal.classList.add("hidden");
        } catch (err) {
            console.error("Google Login Error:", err);
            alert("Ошибка входа через Google: " + err.message);
        }
    });
}

if (appleBtn) {
    appleBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, AppleProvider);
            alert("Успешный вход через Apple!");
            if (authModal) authModal.classList.add("hidden");
        } catch (err) {
            console.error("Apple Login Error:", err);
            alert("Ошибка входа через Apple: " + err.message);
        }
    });
}

/* =================================================================
    Раздел VII. Комментарии
================================================================= */
const commentForm = qs('#commentForm');
if (commentForm) {
    const input = qs('#commentInput');
    const nameInput = qs('#username');
    const list = qs('#commentsList');
    const STORAGE_KEY = 'comments:' + window.location.pathname;

    const escapeHtml = str => str.replace(/[&<>"'\/]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' }[s]));

    let comments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const renderComments = () => {
        list.innerHTML = '';
        comments.forEach(c => {
            const el = document.createElement('div');
            el.className = 'comment';
            const name = c.name ? escapeHtml(c.name) : 'Anonymous';
            const time = new Date(c.ts).toLocaleString();
            el.innerHTML = `
                <div class="meta"><strong>${name}</strong> • <span>${escapeHtml(time)}</span></div>
                <div class="comment-text">${escapeHtml(c.text)}</div>`;
            list.appendChild(el);
        });
    };

    commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        comments.push({ name: nameInput.value.trim(), text, ts: Date.now() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
        renderComments();
        commentForm.reset();
    });

    renderComments();
}

/* =================================================================
    Раздел VIII. Футер
================================================================= */
const yearEl = qs('#copyrightYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =================================================================
    Раздел IX. Падающие листья
================================================================= */
function createFallingLeaves() {
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        const size = Math.random() * 25 + 15;
        const startX = Math.random() * window.innerWidth;
        const fallDuration = Math.random() * 8 + 7;
        const delay = Math.random() * 2;
        const swayAnimation = Math.random() > 0.5 ? 'sway-left' : 'sway-right';
        const swayDuration = Math.random() * 4 + 3;

        leaf.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: url('img/maple_leaf.png') no-repeat center/contain;
            position: fixed;
            top: -50px;
            left: ${startX}px;
            pointer-events: none;
            z-index: 9999;
            animation:
                fall ${fallDuration}s linear ${delay}s forwards,
                ${swayAnimation} ${swayDuration}s ease-in-out ${delay}s infinite;
        `;

        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), (fallDuration + delay) * 1000);
    }

    for (let i = 0; i < 10; i++) setTimeout(createLeaf, Math.random() * 2000);
    setInterval(createLeaf, 2000);
}

/* =================================================================
    Раздел X. Главная страница (index.html)
================================================================= */
window.addEventListener('DOMContentLoaded', () => {
    if (qs('#cardGrid1')) {
        createFallingLeaves();

        // Фильтрация
        window.filterAnime = query => {
            query = query.toLowerCase();
            document.querySelectorAll("[data-anime]").forEach(el => {
                const key = el.dataset.anime;
                const en = (animeTranslations?.en?.[key]?.title || "").toLowerCase();
                const ua = (animeTranslations?.ua?.[key]?.title || "").toLowerCase();
                const de = (animeTranslations?.de?.[key]?.title || "").toLowerCase();
                el.style.display = (en.includes(query) || ua.includes(query) || de.includes(query)) ? '' : 'none';
            });
        };

        if (searchInput) searchInput.addEventListener('input', e => filterAnime(e.target.value.toLowerCase()));

        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('search');
        if (searchQuery) {
            searchBar.classList.remove('hidden');
            searchInput.value = searchQuery;
            filterAnime(searchQuery.toLowerCase());
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Слайдеры
        // initSlider как у тебя
        // Hero видео — как у тебя
    }
});

// ---------- Проверка, что мы на странице профиля ----------
if (document.body.classList.contains('profile-page')) {

  // ---------- Кнопки Navbar ----------
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if(href && href !== '#') window.location.href = href;
    });
  });

  // ---------- Кнопка поиска ----------
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const clearSearch = document.getElementById('clearSearch');
  if(searchBtn && searchBar && clearSearch){
    searchBtn.onclick = () => searchBar.classList.toggle('hidden');
    clearSearch.onclick = () => searchBar.classList.add('hidden');
  }

  // ---------- Иконки сохранений, профиль, настройки ----------
  const savedBtn = document.getElementById('savedBtn');
  const profileBtn = document.getElementById('profileBtn');

  if(savedBtn) savedBtn.onclick = ()=> alert('Saved items');
  if(profileBtn) profileBtn.onclick = ()=> alert('Profile page');

  // ---------- Редактирование профиля ----------
  const editProfileBtn = document.getElementById('editProfileBtn');
  if(editProfileBtn) editProfileBtn.onclick = ()=> alert('Open edit profile modal');

  // ---------- Смена языка ----------
  const langSelect = document.getElementById('langSelect');
  if(langSelect){
    langSelect.value = localStorage.getItem('lang') || 'en';
    langSelect.onchange = ()=>{
      localStorage.setItem('lang', langSelect.value);
      alert('Language changed to: ' + langSelect.value);
    }
  }

  // ---------- Тема ----------
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.onclick = ()=>{
      const isLight = document.body.classList.contains('theme-light');
      document.body.classList.toggle('theme-light', !isLight);
      document.body.classList.toggle('theme-dark', isLight);
      localStorage.setItem('theme', isLight ? 'dark' : 'light');
    }
  }
}
