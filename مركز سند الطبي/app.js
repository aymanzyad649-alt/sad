/* =========================================================
   Sanad Medical Center — App
   Booking engine, live availability, tests & local storage
   ========================================================= */
(function () {
    'use strict';

    /* ---------------------------------------------------------
       Data
    --------------------------------------------------------- */
    const SPECIALTIES = [
        { id: 'cardio', name: 'القلب والأوعية الدموية', short: 'القلب', icon: 'bi-heart-pulse', desc: 'تشخيص ومتابعة أمراض القلب والضغط وتخطيط القلب.' },
        { id: 'internal', name: 'الباطنة العامة', short: 'الباطنة', icon: 'bi-clipboard2-pulse', desc: 'فحص شامل ومتابعة الأمراض المزمنة والتحاليل الدورية.' },
        { id: 'pediatrics', name: 'طب الأطفال', short: 'الأطفال', icon: 'bi-balloon-heart', desc: 'رعاية الأطفال وحديثي الولادة والمتابعة والتطعيمات.' },
        { id: 'ortho', name: 'جراحة العظام والمفاصل', short: 'العظام', icon: 'bi-bandaid', desc: 'علاج الإصابات والكسور وآلام المفاصل والعمود الفقري.' },
        { id: 'derma', name: 'الجلدية والتجميل', short: 'الجلدية', icon: 'bi-stars', desc: 'علاج مشاكل البشرة والشعر والجلسات التجميلية.' },
        { id: 'dental', name: 'طب وتجميل الأسنان', short: 'الأسنان', icon: 'bi-emoji-smile', desc: 'تنظيف وعلاج الأسنان والتركيبات وتجميل الابتسامة.' },
        { id: 'obgyn', name: 'النساء والتوليد', short: 'النساء', icon: 'bi-gender-female', desc: 'متابعة الحمل والولادة وصحة المرأة والتغذية.' },
        { id: 'eyes', name: 'طب وجراحة العيون', short: 'العيون', icon: 'bi-eye', desc: 'فحص النظر وعلاج أمراض العيون والليزر والمياه البيضاء.' }
    ];

    const DOCTORS = [
        { id: 'd1', name: 'د. سارة عبد الرحمن', specialty: 'cardio', title: 'استشاري القلب والأوعية الدموية', exp: 15, rating: 4.9, reviews: 312, fee: 400, days: [0, 2, 4], hours: [10, 15], color: '#0e7c6b' },
        { id: 'd2', name: 'د. كريم مصطفى', specialty: 'internal', title: 'أخصائي الباطنة العامة', exp: 9, rating: 4.8, reviews: 208, fee: 300, days: [1, 3, 6], hours: [12, 18], color: '#1f7a8c' },
        { id: 'd3', name: 'د. منى الشريف', specialty: 'pediatrics', title: 'استشاري طب الأطفال وحديثي الولادة', exp: 12, rating: 5.0, reviews: 401, fee: 350, days: [0, 1, 3], hours: [9, 14], color: '#b06ab3' },
        { id: 'd4', name: 'د. أحمد فتحي', specialty: 'ortho', title: 'استشاري جراحة العظام والمفاصل', exp: 18, rating: 4.9, reviews: 356, fee: 450, days: [2, 4, 6], hours: [13, 19], color: '#c98a2b' },
        { id: 'd5', name: 'د. ليلى حسن', specialty: 'derma', title: 'أخصائي الجلدية والتجميل', exp: 8, rating: 4.7, reviews: 189, fee: 320, days: [1, 3, 6], hours: [11, 17], color: '#d4638f' },
        { id: 'd6', name: 'د. عمر السيد', specialty: 'dental', title: 'أخصائي طب وتجميل الأسنان', exp: 10, rating: 4.8, reviews: 244, fee: 300, days: [0, 2, 4], hours: [10, 16], color: '#3a7ca5' },
        { id: 'd7', name: 'د. هبة عادل', specialty: 'obgyn', title: 'استشاري النساء والتوليد', exp: 14, rating: 4.9, reviews: 287, fee: 400, days: [1, 4, 6], hours: [11, 16], color: '#8b5cf6' },
        { id: 'd8', name: 'د. يوسف نبيل', specialty: 'eyes', title: 'أخصائي طب وجراحة العيون', exp: 7, rating: 4.6, reviews: 156, fee: 280, days: [0, 3, 6], hours: [12, 17], color: '#0f9d8f' }
    ];

    const TESTS = [
        { id: 't1', name: 'صورة دم كاملة (CBC)', cat: 'تحاليل', icon: 'bi-droplet', price: 180, dur: 15, prep: 'لا يشترط الصيام', desc: 'تقييم كريات الدم البيضاء والحمراء والصفائح لكشف الأنيميا والالتهابات.' },
        { id: 't2', name: 'سكر صائم', cat: 'تحاليل', icon: 'bi-activity', price: 90, dur: 10, prep: 'صيام 8 ساعات', desc: 'قياس مستوى السكر في الدم لتشخيص ومتابعة مرض السكري.' },
        { id: 't3', name: 'تحليل دهون شامل', cat: 'تحاليل', icon: 'bi-clipboard2-pulse', price: 260, dur: 20, prep: 'صيام 12 ساعة', desc: 'قياس الكوليسترول والدهون الثلاثية وتقييم صحة القلب.' },
        { id: 't4', name: 'وظائف الكبد', cat: 'تحاليل', icon: 'bi-thermometer-half', price: 220, dur: 20, prep: 'لا يشترط الصيام', desc: 'تقييم إنزيمات الكبد ووظائفه الحيوية ومتابعة الأدوية.' },
        { id: 't5', name: 'وظائف الكلى', cat: 'تحاليل', icon: 'bi-droplet-half', price: 200, dur: 20, prep: 'لا يشترط الصيام', desc: 'قياس الكرياتينين والبولينا لتقييم كفاءة الكلى.' },
        { id: 't6', name: 'فيتامين د', cat: 'تحاليل', icon: 'bi-brightness-high', price: 450, dur: 30, prep: 'لا يشترط الصيام', desc: 'تحديد نسبة فيتامين د ومتابعة هشاشة العظام والإرهاق.' },
        { id: 't7', name: 'وظائف الغدة الدرقية (TSH)', cat: 'تحاليل', icon: 'bi-activity', price: 250, dur: 25, prep: 'لا يشترط الصيام', desc: 'تقييم نشاط الغدة الدرقية وعلاقتها بالوزن والطاقة.' },
        { id: 't8', name: 'أشعة صدر', cat: 'أشعة', icon: 'bi-lungs', price: 350, dur: 15, prep: 'إزالة المعادن', desc: 'تصوير الصدر لتشخيص التهابات الجهاز التنفسي وأمراض الرئة.' },
        { id: 't9', name: 'رسم قلب (ECG)', cat: 'قلب', icon: 'bi-heart-pulse', price: 300, dur: 20, prep: 'تجنب المجهود قبل الفحص', desc: 'تسجيل النشاط الكهربائي للقلب لكشف اضطرابات النظم.' },
        { id: 't10', name: 'سونار البطن الكامل', cat: 'أشعة', icon: 'bi-soundwave', price: 500, dur: 30, prep: 'صيام 6 ساعات', desc: 'فحص الكبد والمرارة والكلى والطحال والأوعية الدموية.' }
    ];

    const LAB = { id: 'lab', days: [0, 1, 2, 3, 4, 6], hours: [8, 20] };
    const STORAGE_KEY = 'sanad_bookings_v1';
    const HOME_VISIT_FEE = 50;
    const CLINIC_PHONE = '201001234567';

    const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    /* ---------------------------------------------------------
       Helpers
    --------------------------------------------------------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    function pad(n) { return String(n).padStart(2, '0'); }

    function escapeHTML(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, (ch) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function todayISO() {
        const d = new Date();
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function toISO(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function fromISO(iso) {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function addDays(date, n) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        d.setDate(d.getDate() + n);
        return d;
    }

    function fmtTime(time) {
        const [h, m] = time.split(':').map(Number);
        const suffix = h < 12 ? 'ص' : 'م';
        const hour = h % 12 || 12;
        return `${hour}:${pad(m)} ${suffix}`;
    }

    function fmtDateLong(iso) {
        const d = fromISO(iso);
        return `${DAY_NAMES[d.getDay()]}، ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
    }

    function toMinutes(time) {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    }

    function addMinutes(time, amount) {
        const total = (toMinutes(time) + amount) % (24 * 60);
        return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
    }

    function initials(name) {
        const parts = name.replace(/^د\.\s*/, '').trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2);
        return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
    }

    function specialtyName(id) {
        const s = SPECIALTIES.find((x) => x.id === id);
        return s ? s.name : '';
    }

    function hashStr(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i += 1) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    /* ---------------------------------------------------------
       Bookings storage
    --------------------------------------------------------- */
    function getBookings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            return [];
        }
    }

    function saveBookings(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
            /* storage unavailable */
        }
    }

    function getBooking(id) {
        return getBookings().find((b) => b.id === id) || null;
    }

    function updateBookingCount() {
        const badge = $('#bookingCount');
        if (!badge) return;
        const count = getBookings().length;
        badge.textContent = count;
        badge.classList.toggle('is-empty', count === 0);
        const btn = badge.closest('.bookings-btn');
        if (btn) {
            btn.setAttribute('aria-label', `مواعيدي، ${count} ${count === 1 ? 'حجز' : 'حجوزات'}`);
        }
    }

    /* ---------------------------------------------------------
       Availability engine
    --------------------------------------------------------- */
    function infoOfDoctor(doc) {
        return { id: doc.id, days: doc.days, hours: doc.hours, price: doc.fee };
    }

    function infoOfTest(test) {
        return { id: test.id, days: LAB.days, hours: LAB.hours, price: test.price };
    }

    function makeTimes(startHour, endHour) {
        const out = [];
        for (let mins = startHour * 60; mins < endHour * 60; mins += 30) {
            out.push(`${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`);
        }
        return out;
    }

    function timesFor(info, iso) {
        if (!info) return [];
        const d = fromISO(iso);
        if (d.getDay() === 5) return [];
        if (!info.days.includes(d.getDay())) return [];
        return makeTimes(info.hours[0], info.hours[1]);
    }

    function isPast(iso, time) {
        const today = todayISO();
        if (iso < today) return true;
        if (iso > today) return false;
        const now = new Date();
        return toMinutes(time) <= now.getHours() * 60 + now.getMinutes();
    }

    function isSeededTaken(entityId, iso, time) {
        return hashStr(`${entityId}|${iso}|${time}`) % 100 < 30;
    }

    function isTaken(entityId, iso, time) {
        if (isSeededTaken(entityId, iso, time)) return true;
        return getBookings().some((b) => b.entityId === entityId && b.date === iso && b.time === time);
    }

    function freeTimes(info, iso) {
        return timesFor(info, iso)
            .filter((t) => !isTaken(info.id, iso, t) && !isPast(iso, t));
    }

    function findNextSlot(doc) {
        const info = infoOfDoctor(doc);
        const today = new Date();
        for (let i = 0; i < 14; i += 1) {
            const iso = toISO(addDays(today, i));
            const free = freeTimes(info, iso);
            if (free.length) return { date: iso, time: free[0] };
        }
        return null;
    }

    function nextSlotLabel(next) {
        if (!next) return 'لا توجد مواعيد قريبة';
        const today = todayISO();
        const tomorrow = toISO(addDays(new Date(), 1));
        let prefix;
        if (next.date === today) prefix = 'اليوم';
        else if (next.date === tomorrow) prefix = 'غدًا';
        else prefix = DAY_NAMES[fromISO(next.date).getDay()];
        return `${prefix} · ${fmtTime(next.time)}`;
    }

    /* ---------------------------------------------------------
       State
    --------------------------------------------------------- */
    const state = {
        mode: 'clinic',
        specialty: SPECIALTIES[0].id,
        doctorId: null,
        testId: null,
        date: null,
        time: null,
        step: 1,
        visit: 'center',
        patient: { name: '', phone: '', age: '', gender: '', notes: '' },
        consent: false,
        lastBookingId: null,
        doctorFilter: 'all'
    };

    let availDate = todayISO();
    let toastTimer = null;

    function selectedDoctor() {
        return DOCTORS.find((d) => d.id === state.doctorId) || null;
    }

    function selectedTest() {
        return TESTS.find((t) => t.id === state.testId) || null;
    }

    function entityInfo() {
        if (state.mode === 'clinic') {
            const doc = selectedDoctor();
            if (!doc) return null;
            return {
                id: doc.id,
                kind: 'clinic',
                title: doc.name,
                sub: doc.title,
                price: doc.fee,
                days: doc.days,
                hours: doc.hours,
                icon: 'bi-person-badge',
                color: doc.color
            };
        }
        const test = selectedTest();
        if (!test) return null;
        return {
            id: test.id,
            kind: 'test',
            title: test.name,
            sub: `فحص ${test.cat}`,
            price: test.price,
            days: LAB.days,
            hours: LAB.hours,
            icon: test.icon,
            color: '#0e7c6b'
        };
    }

    function totalPrice() {
        const info = entityInfo();
        if (!info) return null;
        return info.price + (info.kind === 'test' && state.visit === 'home' ? HOME_VISIT_FEE : 0);
    }

    function resetAppointment() {
        state.date = null;
        state.time = null;
    }

    function ensureDate() {
        const info = entityInfo();
        if (!info) return;
        if (state.date && freeTimes(info, state.date).length) return;
        state.time = null;
        state.date = null;
        const today = new Date();
        for (let i = 0; i < 14; i += 1) {
            const iso = toISO(addDays(today, i));
            if (freeTimes(info, iso).length) {
                state.date = iso;
                return;
            }
        }
    }

    /* ---------------------------------------------------------
       Render: specialties, doctors, availability, tests
    --------------------------------------------------------- */
    function renderSpecialties() {
        const grid = $('#specialtyGrid');
        if (!grid) return;
        grid.innerHTML = SPECIALTIES.map((s) => {
            const count = DOCTORS.filter((d) => d.specialty === s.id).length;
            return `
                <button class="specialty-card reveal" data-action="start-specialty" data-id="${s.id}">
                    <span class="specialty-icon"><i class="bi ${s.icon}"></i></span>
                    <h3>${s.name}</h3>
                    <p>${s.desc}</p>
                    <span class="specialty-foot">
                        <span><i class="bi bi-person-badge"></i> ${count} ${count === 1 ? 'طبيب' : 'أطباء'}</span>
                        احجز الآن <i class="bi bi-arrow-left"></i>
                    </span>
                </button>`;
        }).join('');
        observeReveals();
    }

    function renderDoctorFilters() {
        const row = $('#doctorFilters');
        if (!row) return;
        const chips = [{ id: 'all', label: 'كل الأطباء' }]
            .concat(SPECIALTIES.map((s) => ({ id: s.id, label: s.short })));
        row.innerHTML = chips.map((c) => `
            <button class="filter-chip ${state.doctorFilter === c.id ? 'active' : ''}"
                data-action="filter-doctors" data-id="${c.id}" role="tab"
                aria-selected="${state.doctorFilter === c.id}">${c.label}</button>`).join('');
    }

    function renderDoctors() {
        const grid = $('#doctorGrid');
        if (!grid) return;
        const list = state.doctorFilter === 'all'
            ? DOCTORS
            : DOCTORS.filter((d) => d.specialty === state.doctorFilter);

        grid.innerHTML = list.map((d) => {
            const next = findNextSlot(d);
            return `
                <article class="doctor-card reveal">
                    <div class="doctor-head">
                        <span class="doctor-avatar" style="--c:${d.color}">${initials(d.name)}</span>
                        <div class="doctor-meta">
                            <h3>${d.name}</h3>
                            <span>${d.title}</span>
                        </div>
                        <span class="rating-pill"><i class="bi bi-star-fill"></i> ${d.rating.toFixed(1)}</span>
                    </div>
                    <div class="doctor-tags">
                        <span class="tag">${specialtyName(d.specialty)}</span>
                        <span class="tag">خبرة ${d.exp} سنة</span>
                    </div>
                    <div class="doctor-stats">
                        <span>الكشف: <strong class="fee">${d.fee} ج.م</strong></span>
                        <span>${d.reviews} تقييم</span>
                    </div>
                    <div class="next-slot ${next ? '' : 'is-full'}">
                        <i class="bi ${next ? 'bi-calendar2-check' : 'bi-calendar2-x'}"></i>
                        ${next ? `أقرب موعد: ${nextSlotLabel(next)}` : 'لا توجد مواعيد قريبة'}
                    </div>
                    <button class="btn btn-outline" data-action="book-doctor" data-id="${d.id}">
                        احجز موعد <i class="bi bi-arrow-left"></i>
                    </button>
                </article>`;
        }).join('');

        if (!list.length) {
            grid.innerHTML = '<div class="avail-empty"><i class="bi bi-info-circle"></i> لا يوجد أطباء في هذا التخصص حاليًا.</div>';
        }
        observeReveals();
    }

    function renderAvailabilityTabs() {
        const tabs = $('#availabilityTabs');
        if (!tabs) return;
        const today = new Date();
        const items = [];
        for (let i = 0; i < 5; i += 1) {
            const d = addDays(today, i);
            const iso = toISO(d);
            let label = DAY_NAMES[d.getDay()];
            if (i === 0) label = 'اليوم';
            if (i === 1) label = 'غدًا';
            items.push(`
                <button class="avail-tab ${iso === availDate ? 'active' : ''}"
                    data-action="avail-date" data-date="${iso}" role="tab"
                    aria-selected="${iso === availDate}">
                    ${label}
                    <small>${d.getDate()} ${MONTH_NAMES[d.getMonth()]}</small>
                </button>`);
        }
        tabs.innerHTML = items.join('');
    }

    function renderAvailability() {
        renderAvailabilityTabs();
        const board = $('#availabilityBoard');
        if (!board) return;

        const rows = [];
        DOCTORS.forEach((doc) => {
            const info = infoOfDoctor(doc);
            const free = freeTimes(info, availDate).slice(0, 3);
            if (free.length) rows.push({ doc, free });
        });

        if (!rows.length) {
            board.innerHTML = `
                <div class="avail-empty">
                    <i class="bi bi-calendar2-x"></i>
                    لا توجد مواعيد متاحة في هذا اليوم — جرّب يومًا آخر أو حدد طبيبك مباشرة.
                </div>`;
            return;
        }

        board.innerHTML = rows.slice(0, 5).map(({ doc, free }) => `
            <div class="avail-row">
                <div class="avail-doc">
                    <span class="avatar" style="--c:${doc.color}">${initials(doc.name)}</span>
                    <div>
                        <strong>${doc.name}</strong>
                        <span>${specialtyName(doc.specialty)} · ${doc.fee} ج.م</span>
                    </div>
                </div>
                <div class="avail-slots">
                    ${free.map((time) => `
                        <button class="slot-chip" data-action="quick-slot"
                            data-doctor="${doc.id}" data-date="${availDate}" data-time="${time}"
                            aria-label="احجز مع ${doc.name} الساعة ${fmtTime(time)}">${fmtTime(time)}</button>`).join('')}
                </div>
            </div>`).join('');
    }

    function renderTests() {
        const grid = $('#testGrid');
        if (!grid) return;
        grid.innerHTML = TESTS.map((t) => `
            <article class="test-card reveal">
                <div class="test-head">
                    <span class="test-icon"><i class="bi ${t.icon}"></i></span>
                    <div>
                        <h3>${t.name}</h3>
                        <span class="test-cat">${t.cat}</span>
                    </div>
                </div>
                <p class="test-desc">${t.desc}</p>
                <div class="test-meta">
                    <span><i class="bi bi-clock"></i> ${t.dur} دقيقة</span>
                    <span><i class="bi bi-cup-hot"></i> ${t.prep}</span>
                </div>
                <div class="test-foot">
                    <span class="test-price">${t.price} <small>ج.م</small></span>
                    <button class="btn btn-outline btn-sm" data-action="book-test" data-id="${t.id}">
                        احجز الفحص <i class="bi bi-arrow-left"></i>
                    </button>
                </div>
            </article>`).join('');
        observeReveals();
    }

    /* ---------------------------------------------------------
       Render: booking wizard
    --------------------------------------------------------- */
    function observationIcon(info) {
        if (info.kind === 'clinic') {
            const doc = selectedDoctor();
            return `<span class="avatar" style="--c:${doc.color}">${initials(doc.name)}</span>`;
        }
        return `<span class="avatar" style="--c:#0e7c6b"><i class="bi ${info.icon}"></i></span>`;
    }

    function renderSteps() {
        $$('#steps li').forEach((li) => {
            const n = Number(li.dataset.step);
            li.classList.toggle('active', n === state.step);
            li.classList.toggle('done', n < state.step);
        });
    }

    function renderModeTabs() {
        return `
            <div class="mode-tabs" role="tablist" aria-label="نوع الخدمة">
                <button class="mode-tab ${state.mode === 'clinic' ? 'active' : ''}" data-action="set-mode" data-mode="clinic" role="tab" aria-selected="${state.mode === 'clinic'}">
                    <i class="bi bi-person-badge"></i> استشارة طبية
                </button>
                <button class="mode-tab ${state.mode === 'test' ? 'active' : ''}" data-action="set-mode" data-mode="test" role="tab" aria-selected="${state.mode === 'test'}">
                    <i class="bi bi-droplet"></i> فحص / تحليل
                </button>
            </div>`;
    }

    function stepServiceHTML() {
        const isClinic = state.mode === 'clinic';
        let content = '';

        if (isClinic) {
            const docs = DOCTORS.filter((d) => d.specialty === state.specialty);
            content = `
                <p class="field-label">التخصص الطبي</p>
                <div class="chip-row">
                    ${SPECIALTIES.map((s) => `
                        <button class="chip ${state.specialty === s.id ? 'active' : ''}"
                            data-action="wizard-specialty" data-id="${s.id}">${s.name}</button>`).join('')}
                </div>
                <p class="field-label">الطبيب <span class="muted" style="font-weight:500">${docs.length} متاح</span></p>
                <div class="pick-list">
                    ${docs.map((d) => {
                        const next = findNextSlot(d);
                        return `
                            <button class="pick-card ${state.doctorId === d.id ? 'selected' : ''}"
                                data-action="pick-doctor" data-id="${d.id}">
                                <span class="avatar" style="--c:${d.color}">${initials(d.name)}</span>
                                <span class="pick-info">
                                    <strong>${d.name}</strong>
                                    <span>${d.title}</span>
                                    <small>${d.fee} ج.م · ★ ${d.rating.toFixed(1)}${next ? ` · ${nextSlotLabel(next)}` : ''}</small>
                                </span>
                                <span class="pick-check"><i class="bi bi-check-lg"></i></span>
                            </button>`;
                    }).join('') || '<div class="empty-slots">لا يوجد أطباء في هذا التخصص حاليًا.</div>'}
                </div>`;
        } else {
            content = `
                <p class="field-label">اختر الفحص المطلوب</p>
                <div class="pick-list">
                    ${TESTS.map((t) => `
                        <button class="pick-card ${state.testId === t.id ? 'selected' : ''}"
                            data-action="pick-test" data-id="${t.id}">
                            <span class="avatar" style="--c:#0e7c6b"><i class="bi ${t.icon}"></i></span>
                            <span class="pick-info">
                                <strong>${t.name}</strong>
                                <span>${t.cat} · ${t.dur} دقيقة</span>
                                <small>${t.price} ج.م · ${t.prep}</small>
                            </span>
                            <span class="pick-check"><i class="bi bi-check-lg"></i></span>
                        </button>`).join('')}
                </div>`;
        }

        const info = entityInfo();
        return `
            <div class="wizard-title">
                <div>
                    <h3>${isClinic ? 'اختر التخصص والطبيب' : 'اختر الفحص أو التحليل'}</h3>
                    <p>${isClinic ? 'الأسعار شاملة الكشف، والدفع يتم في المركز.' : 'نتائج معتمدة وإمكانية سحب العينات من المنزل.'}</p>
                </div>
            </div>
            ${renderModeTabs()}
            ${content}
            ${info ? '' : `<p class="muted" style="font-size:.74rem;margin-top:.8rem"><i class="bi bi-info-circle"></i> اختر ${isClinic ? 'طبيبًا' : 'فحصًا'} للمتابعة إلى اختيار الموعد.</p>`}`;
    }

    function stepDateHTML() {
        const info = entityInfo();
        if (!info) return stepServiceHTML();

        const start = new Date();
        const chips = [];
        for (let i = 0; i < 14; i += 1) {
            const d = addDays(start, i);
            const iso = toISO(d);
            const times = timesFor(info, iso);
            const free = freeTimes(info, iso);
            const disabled = !times.length || !free.length;
            const status = !times.length ? 'مغلق' : (!free.length ? 'مكتمل' : '');
            let label = DAY_NAMES[d.getDay()];
            if (i === 0) label = 'اليوم';
            if (i === 1) label = 'غدًا';
            chips.push(`
                <button class="date-chip ${state.date === iso ? 'selected' : ''}"
                    data-action="pick-date" data-date="${iso}" ${disabled ? 'disabled' : ''}
                    title="${disabled ? (status === 'مغلق' ? 'المركز مغلق أو الطبيب غير متاح' : 'لا توجد أوقات متاحة') : fmtDateLong(iso)}">
                    <span class="dow">${label}</span>
                    <span class="day">${d.getDate()}</span>
                    <span class="mon">${status || MONTH_NAMES[d.getMonth()]}</span>
                </button>`);
        }

        let slotsHTML = '';
        if (!state.date) {
            slotsHTML = '<div class="empty-slots"><i class="bi bi-calendar2-x"></i> لا توجد أيام متاحة خلال الفترة القادمة، من فضلك اختر طبيبًا آخر.</div>';
        } else {
            const times = timesFor(info, state.date);
            if (!times.length) {
                slotsHTML = '<div class="empty-slots"><i class="bi bi-calendar2-x"></i> المركز مغلق في هذا اليوم، اختر يومًا آخر.</div>';
            } else {
                const available = times.filter((t) => !isTaken(info.id, state.date, t) && !isPast(state.date, t));
                if (!available.length) {
                    slotsHTML = '<div class="empty-slots"><i class="bi bi-clock-history"></i> لا توجد أوقات متاحة في هذا اليوم، جرّب يومًا آخر.</div>';
                } else {
                    slotsHTML = `
                        <div class="slots-grid">
                            ${times.map((t) => {
                                const taken = isTaken(info.id, state.date, t) || isPast(state.date, t);
                                return `<button class="slot ${taken ? 'is-taken' : ''} ${state.time === t ? 'is-selected' : ''}"
                                    data-action="pick-time" data-time="${t}" ${taken ? 'disabled' : ''}>
                                    ${fmtTime(t)}
                                </button>`;
                            }).join('')}
                        </div>`;
                }
            }
        }

        return `
            <div class="selected-service">
                ${observationIcon(info)}
                <div>
                    <strong>${info.title}</strong>
                    <span>${info.sub} · ${info.price} ج.م${state.mode === 'test' && state.visit === 'home' ? ' + زيارة منزلية' : ''}</span>
                </div>
                <button class="text-btn" data-action="back-to-service">تغيير</button>
            </div>

            <p class="field-label">اختر اليوم</p>
            <div class="date-strip">${chips.join('')}</div>

            <p class="field-label">
                الأوقات المتاحة
                ${state.date ? `<span class="muted" style="font-weight:500">${fmtDateLong(state.date)}</span>` : ''}
            </p>
            ${slotsHTML}
            <div class="slots-legend">
                <span><i class="legend-dot"></i> متاح</span>
                <span><i class="legend-dot selected"></i> اختيارك</span>
                <span><i class="legend-dot taken"></i> محجوز</span>
            </div>`;
    }

    function stepDetailsHTML() {
        const info = entityInfo();
        if (!info) return stepServiceHTML();
        const p = state.patient;

        const visitOptions = info.kind === 'test' ? `
            <div class="visit-options">
                <button type="button" class="visit-option ${state.visit === 'center' ? 'selected' : ''}" data-action="visit-type" data-visit="center">
                    <i class="bi bi-building"></i>
                    <div><strong>في المركز</strong><span>بدون رسوم إضافية</span></div>
                </button>
                <button type="button" class="visit-option ${state.visit === 'home' ? 'selected' : ''}" data-action="visit-type" data-visit="home">
                    <i class="bi bi-house-door"></i>
                    <div><strong>زيارة منزلية</strong><span>+ ${HOME_VISIT_FEE} ج.م</span></div>
                </button>
            </div>` : '';

        return `
            <div class="selected-service">
                ${observationIcon(info)}
                <div>
                    <strong>${info.title}</strong>
                    <span>${fmtDateLong(state.date)} · ${fmtTime(state.time)}</span>
                </div>
                <button class="text-btn" data-action="prev-step">تعديل الموعد</button>
            </div>

            <div class="form-grid">
                <div class="field" data-wrap="name">
                    <label for="pName">الاسم بالكامل <span class="req">*</span></label>
                    <input id="pName" type="text" data-field="name" value="${escapeHTML(p.name)}" placeholder="مثال: أحمد محمد علي" autocomplete="name">
                    <small class="err" data-err="name"></small>
                </div>
                <div class="field phone" data-wrap="phone">
                    <label for="pPhone">رقم الموبايل <span class="req">*</span></label>
                    <input id="pPhone" type="tel" data-field="phone" value="${escapeHTML(p.phone)}" placeholder="01xxxxxxxxx" autocomplete="tel" inputmode="tel">
                    <small class="err" data-err="phone"></small>
                </div>
                <div class="field" data-wrap="age">
                    <label for="pAge">العمر</label>
                    <input id="pAge" type="number" data-field="age" value="${escapeHTML(p.age)}" placeholder="اختياري" min="1" max="120" inputmode="numeric">
                    <small class="err" data-err="age"></small>
                </div>
                <div class="field" data-wrap="gender">
                    <label for="pGender">النوع</label>
                    <select id="pGender" data-field="gender">
                        <option value="">اختياري</option>
                        <option value="male" ${p.gender === 'male' ? 'selected' : ''}>ذكر</option>
                        <option value="female" ${p.gender === 'female' ? 'selected' : ''}>أنثى</option>
                    </select>
                    <small class="err" data-err="gender"></small>
                </div>
                <div class="field full" data-wrap="notes">
                    <label for="pNotes">ملاحظات أو سبب الزيارة</label>
                    <textarea id="pNotes" data-field="notes" placeholder="اكتب أي تفاصيل تساعد الطبيب (اختياري)">${escapeHTML(p.notes)}</textarea>
                    <small class="err" data-err="notes"></small>
                </div>
                ${visitOptions}
                <div class="field full" data-wrap="consent">
                    <label class="consent">
                        <input type="checkbox" data-field="consent" ${state.consent ? 'checked' : ''}>
                        <span>أوافق على سياسة الخصوصية وشروط الحجز، وأتعهد بصحة البيانات المدخلة.</span>
                    </label>
                    <small class="err" data-err="consent"></small>
                </div>
            </div>`;
    }

    function stepSuccessHTML() {
        const b = getBooking(state.lastBookingId) || getBookings().slice(-1)[0];
        if (!b) {
            return `
                <div class="success-card">
                    <div class="success-icon"><i class="bi bi-calendar2-check"></i></div>
                    <h3>لا يوجد حجز حديث</h3>
                    <p>يمكنك بدء حجز جديد أو عرض مواعيدك المحفوظة.</p>
                    <div class="success-actions">
                        <button class="btn btn-primary" data-action="book-another">بدء حجز جديد</button>
                        <button class="btn btn-outline" data-action="open-bookings">عرض مواعيدي</button>
                    </div>
                </div>`;
        }

        const visitLabel = b.type === 'test'
            ? (b.visit === 'home' ? 'زيارة منزلية' : 'في المركز')
            : 'في المركز';

        return `
            <div class="success-card">
                <div class="success-icon"><i class="bi bi-check2"></i></div>
                <h3>تم تأكيد حجزك بنجاح</h3>
                <p>احتفظ بكود الحجز وأظهره في الاستقبال عند وصولك.</p>

                <div class="code-box">${b.id} <span>كود الحجز</span></div>

                <div class="receipt">
                    <div class="receipt-row"><span>الخدمة</span><strong>${escapeHTML(b.title)}</strong></div>
                    <div class="receipt-row"><span>${b.type === 'test' ? 'الفحص' : 'الطبيب'}</span><strong>${escapeHTML(b.subtitle)}</strong></div>
                    <div class="receipt-row"><span>التاريخ</span><strong>${fmtDateLong(b.date)}</strong></div>
                    <div class="receipt-row"><span>الوقت</span><strong>${fmtTime(b.time)}</strong></div>
                    <div class="receipt-row"><span>الاسم</span><strong>${escapeHTML(b.patient.name)}</strong></div>
                    <div class="receipt-row"><span>الهاتف</span><strong dir="ltr">${escapeHTML(b.patient.phone)}</strong></div>
                    <div class="receipt-row"><span>${b.type === 'test' ? 'الزيارة' : 'العيادة'}</span><strong>${visitLabel}</strong></div>
                    <div class="receipt-row"><span>الإجمالي</span><strong>${b.price} ج.م — يُدفع في المركز</strong></div>
                </div>

                <div class="success-actions">
                    <button class="btn btn-primary btn-sm" data-action="add-calendar" data-id="${b.id}">
                        <i class="bi bi-calendar2-plus"></i> أضف إلى التقويم
                    </button>
                    <button class="btn btn-ghost btn-sm" data-action="share-whatsapp" data-id="${b.id}">
                        <i class="bi bi-whatsapp"></i> إرسال التفاصيل
                    </button>
                    <button class="btn btn-ghost btn-sm" data-action="print-booking">
                        <i class="bi bi-printer"></i> طباعة
                    </button>
                    <button class="btn btn-outline btn-sm" data-action="book-another">
                        <i class="bi bi-plus-lg"></i> حجز آخر
                    </button>
                </div>
            </div>`;
    }

    function renderActions() {
        const actions = $('#wizardActions');
        if (!actions) return;
        if (state.step === 4) {
            actions.innerHTML = '';
            return;
        }

        let canNext = true;
        let label = 'اختيار الموعد';
        if (state.step === 1) {
            canNext = !!entityInfo();
        } else if (state.step === 2) {
            canNext = !!(state.date && state.time);
            label = 'متابعة البيانات';
        } else {
            label = 'تأكيد الحجز';
        }

        actions.innerHTML = `
            ${state.step > 1 ? '<button class="btn btn-ghost" data-action="prev-step"><i class="bi bi-arrow-right"></i> السابق</button>' : ''}
            <span class="spacer"></span>
            <button class="btn btn-primary" data-action="next-step" ${canNext ? '' : 'disabled'}>
                ${label}
                <i class="bi ${state.step === 3 ? 'bi-check2-circle' : 'bi-arrow-left'}"></i>
            </button>`;
    }

    function renderSummary() {
        const box = $('#summary');
        if (!box) return;
        const info = entityInfo();

        if (!info) {
            box.innerHTML = `
                <div class="summary-empty">
                    <i class="bi bi-clipboard2-pulse"></i>
                    ابدأ باختيار ${state.mode === 'clinic' ? 'التخصص والطبيب' : 'الفحص'} لعرض تفاصيل حجزك هنا.
                </div>`;
            return;
        }

        const price = totalPrice();
        const visitRow = info.kind === 'test'
            ? `<div class="summary-line"><span>طريقة الزيارة</span><strong>${state.visit === 'home' ? `زيارة منزلية (+${HOME_VISIT_FEE} ج.م)` : 'في المركز'}</strong></div>`
            : '';

        box.innerHTML = `
            <div class="summary-service">
                ${observationIcon(info)}
                <div>
                    <strong>${info.title}</strong>
                    <span>${info.sub}</span>
                </div>
            </div>
            <div class="summary-line"><span>نوع الخدمة</span><strong>${info.kind === 'clinic' ? 'استشارة طبية' : 'فحص / تحليل'}</strong></div>
            <div class="summary-line"><span>التاريخ</span><strong>${state.date ? fmtDateLong(state.date) : 'لم يُحدد'}</strong></div>
            <div class="summary-line"><span>الوقت</span><strong>${state.time ? fmtTime(state.time) : 'لم يُحدد'}</strong></div>
            ${visitRow}
            <div class="summary-total">
                <span>الإجمالي (يُدفع في المركز)</span>
                <strong>${price} ج.م</strong>
            </div>`;
    }

    function renderWizard() {
        renderSteps();
        const body = $('#wizardBody');
        if (!body) return;

        if (state.step === 1) body.innerHTML = stepServiceHTML();
        else if (state.step === 2) body.innerHTML = stepDateHTML();
        else if (state.step === 3) body.innerHTML = stepDetailsHTML();
        else body.innerHTML = stepSuccessHTML();

        renderActions();
        renderSummary();
    }

    /* ---------------------------------------------------------
       Wizard flow
    --------------------------------------------------------- */
    function goNext() {
        if (state.step === 1) {
            if (!entityInfo()) return;
            state.step = 2;
            ensureDate();
            renderWizard();
        } else if (state.step === 2) {
            if (!state.date || !state.time) return;
            state.step = 3;
            renderWizard();
        } else if (state.step === 3) {
            confirmBooking();
        }
    }

    function validateForm() {
        const errs = {};
        const p = state.patient;
        const phone = String(p.phone || '').replace(/[\s\-()]/g, '');

        if (String(p.name || '').trim().length < 3) {
            errs.name = 'من فضلك اكتب الاسم بالكامل (3 أحرف على الأقل).';
        }
        if (!/^(?:\+?20|0)?1[0125]\d{8}$/.test(phone)) {
            errs.phone = 'اكتب رقم موبايل مصري صحيح مثل 01012345678.';
        }
        if (p.age !== '' && (Number(p.age) < 1 || Number(p.age) > 120)) {
            errs.age = 'اكتب عمرًا بين 1 و 120.';
        }
        if (!state.consent) {
            errs.consent = 'يجب الموافقة على شروط الحجز للمتابعة.';
        }
        return errs;
    }

    function applyErrors(errs) {
        $$('[data-wrap]').forEach((w) => w.classList.remove('invalid'));
        $$('[data-err]').forEach((e) => { e.textContent = ''; });

        Object.keys(errs).forEach((key) => {
            const wrap = $(`[data-wrap="${key}"]`);
            const err = $(`[data-err="${key}"]`);
            if (wrap) wrap.classList.add('invalid');
            if (err) err.textContent = errs[key];
        });

        const first = $('[data-wrap].invalid input, [data-wrap].invalid select, [data-wrap].invalid textarea');
        if (first) first.focus({ preventScroll: false });
    }

    function confirmBooking() {
        const info = entityInfo();
        if (!info || !state.date || !state.time) {
            state.step = 2;
            renderWizard();
            return;
        }

        const errs = validateForm();
        if (Object.keys(errs).length) {
            applyErrors(errs);
            return;
        }

        if (isTaken(info.id, state.date, state.time)) {
            showToast('عذرًا، هذا الموعد تم حجزه للتو. اختر وقتًا آخر.', true);
            resetAppointment();
            ensureDate();
            state.step = 2;
            renderWizard();
            return;
        }

        const code = generateCode();
        const booking = {
            id: code,
            type: info.kind,
            entityId: info.id,
            title: info.title,
            subtitle: info.sub,
            specialty: state.mode === 'clinic' ? specialtyName(state.specialty) : 'المعامل والأشعة',
            date: state.date,
            time: state.time,
            price: totalPrice(),
            visit: state.visit,
            patient: {
                name: state.patient.name.trim(),
                phone: state.patient.phone.trim(),
                age: state.patient.age,
                gender: state.patient.gender,
                notes: state.patient.notes.trim()
            },
            createdAt: new Date().toISOString()
        };

        const all = getBookings();
        all.push(booking);
        saveBookings(all);

        state.lastBookingId = code;
        state.step = 4;
        renderWizard();
        updateBookingCount();
        renderAvailability();
        renderDoctors();
        showToast('تم تأكيد حجزك بنجاح 🎉');
    }

    function generateCode() {
        const existing = getBookings();
        let code;
        do {
            code = `SND-${Math.floor(1000 + Math.random() * 9000)}`;
        } while (existing.some((b) => b.id === code));
        return code;
    }

    function resetBooking() {
        state.doctorId = null;
        state.testId = null;
        state.date = null;
        state.time = null;
        state.step = 1;
        state.visit = 'center';
        state.consent = false;
        state.patient = { name: '', phone: '', age: '', gender: '', notes: '' };
        state.lastBookingId = null;
        renderWizard();
    }

    function scrollToBooking() {
        const el = $('#booking');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function startClinic(doctorId) {
        const doc = DOCTORS.find((d) => d.id === doctorId);
        if (!doc) return;
        state.mode = 'clinic';
        state.doctorId = doc.id;
        state.specialty = doc.specialty;
        state.testId = null;
        state.visit = 'center';
        resetAppointment();
        state.step = 2;
        ensureDate();
        renderWizard();
        scrollToBooking();
    }

    function startTest(testId) {
        const test = TESTS.find((t) => t.id === testId);
        if (!test) return;
        state.mode = 'test';
        state.testId = test.id;
        state.doctorId = null;
        state.visit = 'center';
        resetAppointment();
        state.step = 2;
        ensureDate();
        renderWizard();
        scrollToBooking();
    }

    function startSpecialty(id) {
        state.mode = 'clinic';
        state.specialty = id;
        state.doctorId = null;
        state.testId = null;
        state.visit = 'center';
        resetAppointment();
        state.step = 1;
        renderWizard();
        scrollToBooking();
    }

    /* ---------------------------------------------------------
       My bookings
    --------------------------------------------------------- */
    function bookingIcon(b) {
        if (b.type === 'test') return 'bi-droplet';
        return 'bi-person-badge';
    }

    function renderBookings() {
        const list = $('#bookingsList');
        if (!list) return;
        const bookings = getBookings().slice().sort((a, b) => {
            const A = `${a.date} ${a.time}`;
            const B = `${b.date} ${b.time}`;
            return A.localeCompare(B);
        });

        if (!bookings.length) {
            list.innerHTML = `
                <div class="empty-bookings">
                    <i class="bi bi-calendar2-x"></i>
                    <strong>لا توجد حجوزات بعد</strong>
                    <p>احجز موعدك الأول وسيظهر هنا مع كود الحجز.</p>
                </div>`;
            return;
        }

        list.innerHTML = bookings.map((b) => `
            <div class="appt">
                <span class="appt-icon"><i class="bi ${bookingIcon(b)}"></i></span>
                <div class="appt-info">
                    <strong>${escapeHTML(b.title)}</strong>
                    <span>${fmtDateLong(b.date)} · ${fmtTime(b.time)}</span>
                    <span>${b.price} ج.م · ${b.patient.name ? escapeHTML(b.patient.name) : ''}</span>
                    <span class="appt-code">${b.id}</span>
                </div>
                <div class="appt-actions">
                    <button class="appt-btn" data-action="print-booking" data-id="${b.id}" title="طباعة" aria-label="طباعة الحجز ${b.id}"><i class="bi bi-printer"></i></button>
                    <button class="appt-cancel" data-action="cancel-booking" data-id="${b.id}">إلغاء</button>
                </div>
            </div>`).join('');
    }

    function openBookings() {
        renderBookings();
        const modal = $('#bookingsModal');
        if (!modal) return;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        const close = $('.modal-close', modal);
        if (close) close.focus();
    }

    function closeBookings() {
        const modal = $('#bookingsModal');
        if (!modal) return;
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    function cancelBooking(id) {
        if (!window.confirm('هل تريد إلغاء هذا الحجز؟')) return;
        const all = getBookings().filter((b) => b.id !== id);
        saveBookings(all);
        updateBookingCount();
        renderBookings();
        renderAvailability();
        renderDoctors();
        if (state.lastBookingId === id) {
            resetBooking();
        } else if (state.step > 1) {
            renderWizard();
        }
        showToast('تم إلغاء الحجز وإتاحة الموعد لغيره.');
    }

    /* ---------------------------------------------------------
       Calendar, WhatsApp, print
    --------------------------------------------------------- */
    function icsEscape(text) {
        return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    }

    function downloadICS(id) {
        const b = getBooking(id);
        if (!b) return;
        const start = `${b.date.replace(/-/g, '')}T${b.time.replace(':', '')}00`;
        const end = `${b.date.replace(/-/g, '')}T${addMinutes(b.time, 30).replace(':', '')}00`;
        const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Sanad Medical Center//AR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${b.id}@sanad-clinic`,
            `DTSTAMP:${stamp}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${icsEscape(`موعد في مركز سند الطبي — ${b.title}`)}`,
            `LOCATION:${icsEscape('مركز سند الطبي، 27 شارع التحرير، الدقي، الجيزة')}`,
            `DESCRIPTION:${icsEscape(`كود الحجز: ${b.id}\nالاسم: ${b.patient.name}\nالهاتف: ${b.patient.phone}\nالسعر: ${b.price} ج.م`)}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ];
        const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sanad-${b.id}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        showToast('تم تجهيز ملف التقويم.');
    }

    function shareWhatsApp(id) {
        const b = getBooking(id);
        if (!b) return;
        const text = [
            'مرحبًا مركز سند الطبي،',
            `أؤكد حجزي بكود: ${b.id}`,
            `الخدمة: ${b.title} (${b.subtitle})`,
            `الموعد: ${fmtDateLong(b.date)} — ${fmtTime(b.time)}`,
            `الاسم: ${b.patient.name}`,
            `الهاتف: ${b.patient.phone}`
        ].join('\n');
        window.open(`https://wa.me/${CLINIC_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }

    function printBooking(id) {
        const b = getBooking(id) || getBooking(state.lastBookingId) || getBookings().slice(-1)[0];
        if (!b) {
            showToast('لا يوجد حجز للطباعة', true);
            return;
        }

        const visitLabel = b.type === 'test'
            ? (b.visit === 'home' ? 'زيارة منزلية' : 'في المركز')
            : 'في المركز';

        const rows = [
            ['كود الحجز', b.id],
            ['الخدمة', b.title],
            [b.type === 'test' ? 'الفحص' : 'الطبيب', b.subtitle],
            ['التاريخ', fmtDateLong(b.date)],
            ['الوقت', fmtTime(b.time)],
            ['الاسم', b.patient.name],
            ['الهاتف', b.patient.phone],
            [b.type === 'test' ? 'الزيارة' : 'العيادة', visitLabel],
            ['الإجمالي', `${b.price} ج.م — يُدفع في المركز`]
        ];

        const sheet = document.createElement('section');
        sheet.className = 'print-sheet';
        sheet.id = 'printSheet';
        sheet.setAttribute('dir', 'rtl');
        sheet.innerHTML = `
            <div class="print-head">
                <div>
                    <h1>مركز سند الطبي</h1>
                    <p>27 شارع التحرير، الدقي، الجيزة — 0100 123 4567</p>
                </div>
                <div class="print-code">
                    <span>كود الحجز</span>
                    <strong>${escapeHTML(b.id)}</strong>
                </div>
            </div>
            <h2>تأكيد حجز موعد</h2>
            <table class="print-table">
                <tbody>
                    ${rows.map(([k, v]) => `<tr><th>${escapeHTML(String(k))}</th><td>${escapeHTML(String(v))}</td></tr>`).join('')}
                </tbody>
            </table>
            <p class="print-note">يرجى إظهار هذا الإيصال في الاستقبال عند وصولك. للحجز أو التعديل اتصل بالمركز.</p>
            <p class="print-foot">تمت الطباعة في ${fmtDateLong(todayISO())}</p>`;

        document.body.appendChild(sheet);
        document.body.classList.add('printing');

        const cleanup = () => {
            document.body.classList.remove('printing');
            sheet.remove();
            window.removeEventListener('afterprint', cleanup);
        };        window.addEventListener('afterprint', cleanup);
        setTimeout(() => {
            window.print();
            // Fallback for browsers that never fire afterprint.
            setTimeout(cleanup, 1500);
        }, 60);
    }

    /* ---------------------------------------------------------
       UI feedback
    --------------------------------------------------------- */
    function showToast(message, isError) {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.toggle('is-error', !!isError);
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    }

    /* ---------------------------------------------------------
       Events
    --------------------------------------------------------- */
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-action]');
        if (!trigger) return;
        const action = trigger.dataset.action;

        switch (action) {
            case 'open-bookings':
                openBookings();
                break;
            case 'close-bookings':
                closeBookings();
                break;
            case 'set-mode':
                state.mode = trigger.dataset.mode;
                state.doctorId = null;
                state.testId = null;
                state.visit = 'center';
                resetAppointment();
                state.step = 1;
                renderWizard();
                break;
            case 'wizard-specialty': {
                state.specialty = trigger.dataset.id;
                const doc = selectedDoctor();
                if (doc && doc.specialty !== state.specialty) {
                    state.doctorId = null;
                    resetAppointment();
                }
                renderWizard();
                break;
            }
            case 'pick-doctor':
                state.mode = 'clinic';
                state.doctorId = trigger.dataset.id;
                state.testId = null;
                resetAppointment();
                renderWizard();
                break;
            case 'pick-test':
                state.mode = 'test';
                state.testId = trigger.dataset.id;
                state.doctorId = null;
                state.visit = 'center';
                resetAppointment();
                renderWizard();
                break;
            case 'pick-date':
                state.date = trigger.dataset.date;
                state.time = null;
                renderWizard();
                break;
            case 'pick-time':
                state.time = trigger.dataset.time;
                renderWizard();
                break;
            case 'next-step':
                goNext();
                break;
            case 'prev-step':
                state.step = Math.max(1, state.step - 1);
                renderWizard();
                break;
            case 'back-to-service':
                state.step = 1;
                renderWizard();
                break;
            case 'visit-type':
                state.visit = trigger.dataset.visit;
                renderWizard();
                break;
            case 'confirm-booking':
                confirmBooking();
                break;
            case 'book-another':
                resetBooking();
                break;
            case 'filter-doctors':
                state.doctorFilter = trigger.dataset.id;
                renderDoctorFilters();
                renderDoctors();
                break;
            case 'book-doctor':
                startClinic(trigger.dataset.id);
                break;
            case 'book-test':
                startTest(trigger.dataset.id);
                break;
            case 'start-specialty':
                startSpecialty(trigger.dataset.id);
                break;
            case 'start-test-mode':
                event.preventDefault();
                state.mode = 'test';
                state.testId = null;
                state.doctorId = null;
                state.visit = 'center';
                resetAppointment();
                state.step = 1;
                renderWizard();
                scrollToBooking();
                break;
            case 'avail-date':
                availDate = trigger.dataset.date;
                renderAvailability();
                break;
            case 'quick-slot': {
                const doc = DOCTORS.find((d) => d.id === trigger.dataset.doctor);
                if (!doc) break;
                state.mode = 'clinic';
                state.doctorId = doc.id;
                state.specialty = doc.specialty;
                state.testId = null;
                state.date = trigger.dataset.date;
                state.time = trigger.dataset.time;
                state.step = 3;
                renderWizard();
                scrollToBooking();
                showToast('أكمل بياناتك لتأكيد الحجز.');
                break;
            }
            case 'cancel-booking':
                cancelBooking(trigger.dataset.id);
                break;
            case 'add-calendar':
                downloadICS(trigger.dataset.id);
                break;
            case 'share-whatsapp':
                shareWhatsApp(trigger.dataset.id);
                break;
            case 'print-booking':
                printBooking(trigger.dataset.id);
                break;
            default:
                break;
        }
    });

    function handleFormInput(event) {
        const el = event.target.closest('[data-field]');
        if (!el) return;
        const key = el.dataset.field;
        if (key === 'consent') {
            state.consent = el.checked;
        } else {
            state.patient[key] = el.value;
        }
        const wrap = el.closest('[data-wrap]');
        if (wrap) wrap.classList.remove('invalid');
        const err = $(`[data-err="${key}"]`);
        if (err) err.textContent = '';
    }

    document.addEventListener('input', handleFormInput);
    document.addEventListener('change', handleFormInput);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeBookings();
            closeMobileNav();
        }
    });

    const modal = $('#bookingsModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeBookings();
        });
    }

    /* ---------------------------------------------------------
       Quick booking bar
    --------------------------------------------------------- */
    function fillQuickSpecialty() {
        const select = $('#quickSpecialty');
        if (!select) return;
        select.innerHTML = SPECIALTIES.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
        select.value = state.specialty;
    }

    function fillQuickDoctors(specialtyId) {
        const select = $('#quickDoctor');
        if (!select) return;
        const docs = DOCTORS.filter((d) => d.specialty === specialtyId);
        select.innerHTML = docs.map((d) => `<option value="${d.id}">${d.name}</option>`).join('');
    }

    const quickSpecialty = $('#quickSpecialty');
    if (quickSpecialty) {
        quickSpecialty.addEventListener('change', () => fillQuickDoctors(quickSpecialty.value));
    }

    const quickBar = $('#quickBar');
    if (quickBar) {
        quickBar.addEventListener('submit', (event) => {
            event.preventDefault();
            const docId = $('#quickDoctor') ? $('#quickDoctor').value : '';
            if (!docId) {
                showToast('لا يوجد أطباء متاحون في هذا التخصص.', true);
                return;
            }
            startClinic(docId);
        });
    }

    /* ---------------------------------------------------------
       Navigation, reveal, counters
    --------------------------------------------------------- */
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');

    function closeMobileNav() {
        if (!navLinks) return;
        navLinks.classList.remove('open');
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.addEventListener('click', (event) => {
            if (event.target.closest('a')) closeMobileNav();
        });
    }

    const siteNav = $('#siteNav');
    window.addEventListener('scroll', () => {
        if (siteNav) siteNav.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
        : null;

    function observeReveals() {
        if (!revealObserver) {
            $$('.reveal').forEach((el) => el.classList.add('in'));
            return;
        }
        $$('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
    }

    const counterObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.55 })
        : null;

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target || '0');
        const decimals = Number(el.dataset.decimals || 0);
        const duration = 1400;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = decimals ? value.toFixed(decimals) : String(Math.round(value));
            if (progress < 1) requestAnimationFrame(frame);
            else el.textContent = decimals ? target.toFixed(decimals) : String(Math.round(target));
        }
        requestAnimationFrame(frame);
    }

    function initCounters() {
        $$('.counter').forEach((el) => {
            if (counterObserver) counterObserver.observe(el);
            else el.textContent = el.dataset.target;
        });
    }

    function initScrollSpy() {
        if (!('IntersectionObserver' in window)) return;
        const sections = $$('main section[id]');
        const apply = (id) => {
            $$('.nav-links > a').forEach((a) => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        };
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) apply(entry.target.id);
            });
        }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
        sections.forEach((s) => spy.observe(s));
    }

    /* ---------------------------------------------------------
       Init
    --------------------------------------------------------- */
    function init() {
        renderSpecialties();
        fillQuickSpecialty();
        fillQuickDoctors(state.specialty);
        renderDoctorFilters();
        renderDoctors();
        renderAvailability();
        renderTests();
        renderWizard();
        updateBookingCount();
        observeReveals();
        initCounters();
        initScrollSpy();
        if (siteNav) siteNav.classList.toggle('scrolled', window.scrollY > 12);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
