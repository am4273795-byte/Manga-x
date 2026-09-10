// إعدادات Firebase الخاصة بمشروع Manga X
const firebaseConfig = {
  apiKey: "AIzaSyCiHNEcRyiV9Siy5sB1dHTBcypMJMorF2Q",
  authDomain: "mangax-18232.firebaseapp.com",
  projectId: "mangax-18232",
  storageBucket: "mangax-18232.firebasestorage.app",
  messagingSenderId: "852304213792",
  appId: "1:852304213792:web:068c656f7ccaf94ced0945",
  measurementId: "G-VDVRY81LL3"
};

// تهيئة الخدمات
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// إدارة الوضع الليلي
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark');
}

// تحميل قائمة المانجا في الصفحة الرئيسية
function loadMangaList() {
    const mangaGrid = document.getElementById('mangaGrid');
    if (!mangaGrid) return;
    
    db.collection("manga").orderBy("createdAt", "desc").onSnapshot(snapshot => {
        mangaGrid.innerHTML = "";
        if (snapshot.empty) {
            mangaGrid.innerHTML = `<p class="col-span-full text-center py-8 text-slate-400">لا يوجد مانجا مضافة حالياً. أضف بعض المانجا من لوحة التحكم!</p>`;
            return;
        }

        snapshot.forEach(doc => {
            const manga = doc.data();
            const id = doc.id;
            mangaGrid.innerHTML += `
                <a href="reader.html?id=${id}" class="bg-white dark:bg-cardBg rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition duration-300 group">
                    <div class="relative aspect-[3/4] overflow-hidden">
                        <img src="${manga.coverUrl || 'https://via.placeholder.com/300x400'}" alt="${manga.title}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                        <span class="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">${manga.genre || 'مانجا'}</span>
                    </div>
                    <div class="p-3">
                        <h3 class="font-bold text-sm truncate dark:text-white">${manga.title}</h3>
                        <p class="text-xs text-slate-400 mt-1">${manga.chapters ? manga.chapters.length : 0} فصل</p>
                    </div>
                </a>
            `;
        });
    });
}

document.addEventListener('DOMContentLoaded', loadMangaList);
  
