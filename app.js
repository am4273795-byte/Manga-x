const firebaseConfig = {
  apiKey: "AIzaSyCiHNEcRyiV9Siy5sB1dHTBcypMJMorF2Q",
  authDomain: "mangax-18232.firebaseapp.com",
  projectId: "mangax-18232",
  storageBucket: "mangax-18232.firebasestorage.app",
  messagingSenderId: "852304213792",
  appId: "1:852304213792:web:068c656f7ccaf94ced0945",
  measurementId: "G-VDVRY81LL3"
};

firebase.initializeApp(firebaseConfig);
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

let allBooks = [];

// تحميل قائمة الكتب من قاعدة البيانات
function loadBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    db.collection("books").orderBy("createdAt", "desc").onSnapshot(snapshot => {
        booksGrid.innerHTML = "";
        allBooks = [];
        
        if (snapshot.empty) {
            booksGrid.innerHTML = `<p class="col-span-full text-center py-8 text-slate-400">لا يوجد كتب مضافة حالياً. أضف كتبك الأولى من لوحة التحكم!</p>`;
            return;
        }

        snapshot.forEach(doc => {
            const book = doc.data();
            book.id = doc.id;
            allBooks.push(book);
            renderBookCard(book, booksGrid);
        });
    });
}

function renderBookCard(book, container) {
    container.innerHTML += `
        <a href="book.html?id=${book.id}" class="bg-white dark:bg-cardBg rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition duration-300 group flex flex-col justify-between">
            <div>
                <div class="relative aspect-[3/4] overflow-hidden bg-slate-800">
                    <img src="${book.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">${book.category || 'عام'}</span>
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-sm truncate dark:text-white">${book.title}</h3>
                    <p class="text-xs text-slate-400 mt-1 truncate"><i class="fa-solid fa-user-pen text-[10px] ml-1"></i>${book.author || 'كاتب غير معروف'}</p>
                </div>
            </div>
            <div class="p-3 pt-0">
                <span class="block w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-xs font-bold py-1.5 rounded-lg transition">تصفح الكتاب</span>
            </div>
        </a>
    `;
}

// خاصية البحث السريع
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = "";
    
    const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(query) || 
        (book.author && book.author.toLowerCase().includes(query))
    );

    if(filtered.length === 0) {
        booksGrid.innerHTML = `<p class="col-span-full text-center py-8 text-slate-400">لا توجد نتائج بحث مطابقة.</p>`;
        return;
    }

    filtered.forEach(book => renderBookCard(book, booksGrid));
}

document.addEventListener('DOMContentLoaded', loadBooks);
