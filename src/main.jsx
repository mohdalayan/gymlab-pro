import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, BarChart3, Calculator, Check, ChevronLeft, Dumbbell, Flame, Gauge, Menu, Play, ShieldCheck, Sparkles, Target, Timer, UserRound, X } from 'lucide-react';
import './styles.css';

const PROGRAMS = [
  { id: 'full', name: 'Full Body', ar: 'كامل الجسم', days: 3, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85' },
  { id: 'upper', name: 'Upper / Lower', ar: 'الجزء العلوي والسفلي', days: 4, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85' },
  { id: 'ppl3', name: 'Push / Pull / Legs', ar: '3 أيام', days: 3, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85' },
  { id: 'ppl6', name: 'Push / Pull / Legs', ar: '6 أيام', days: 6, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85' },
  { id: 'arnold', name: 'Arnold Split', ar: 'تجزئة أرنولد', days: 6, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07f?auto=format&fit=crop&w=900&q=85' },
  { id: 'phul', name: 'PHUL', ar: 'قوة + كتلة عضلية', days: 4, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85' },
  { id: 'phat', name: 'PHAT', ar: 'قوة + هايبرتروفي', days: 5, image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=85' },
];

const EXERCISES = {
  push: [
    ['Bench Press', 'صدر', '4 × 6–10'],
    ['Incline Dumbbell Press', 'صدر علوي', '3 × 8–12'],
    ['Shoulder Press', 'أكتاف', '3 × 8–12'],
    ['Lateral Raise', 'أكتاف جانبي', '3 × 12–15'],
    ['Triceps Pushdown', 'ترايسبس', '3 × 10–15'],
  ],
  pull: [
    ['Barbell Row', 'ظهر', '4 × 6–10'],
    ['Lat Pulldown', 'لاتس', '3 × 8–12'],
    ['Seated Cable Row', 'ظهر متوسط', '3 × 8–12'],
    ['Face Pull', 'كتف خلفي', '3 × 12–15'],
    ['Biceps Curl', 'بايسبس', '3 × 10–15'],
  ],
  legs: [
    ['Back Squat', 'كواد + غلوت', '4 × 6–10'],
    ['Romanian Deadlift', 'هامسترنغ', '3 × 8–12'],
    ['Leg Press', 'كواد', '3 × 10–15'],
    ['Leg Curl', 'هامسترنغ', '3 × 10–15'],
    ['Calf Raise', 'سمانة', '4 × 12–20'],
  ],
  full: [
    ['Squat', 'أرجل', '3 × 6–10'],
    ['Bench Press', 'صدر', '3 × 6–10'],
    ['Lat Pulldown', 'ظهر', '3 × 8–12'],
    ['Romanian Deadlift', 'هامسترنغ', '3 × 8–12'],
    ['Shoulder Press', 'أكتاف', '3 × 8–12'],
  ],
};

const splitFor = (id) => {
  if (id === 'full') return ['Full Body'];
  if (id === 'upper') return ['Upper', 'Lower'];
  if (id.includes('ppl')) return ['Push', 'Pull', 'Legs'];
  if (id === 'arnold') return ['Chest + Back', 'Shoulders + Arms', 'Legs'];
  return ['Upper Power', 'Lower Power', 'Upper Hypertrophy', 'Lower Hypertrophy'];
};

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState('auto');
  const [activeDay, setActiveDay] = useState(0);
  const [form, setForm] = useState({ age: 22, weight: 75, height: 180, sex: 'male', goal: 'muscle', level: 'beginner', days: 4 });

  const program = useMemo(() => {
    if (selected !== 'auto') return PROGRAMS.find((item) => item.id === selected) || PROGRAMS[1];
    if (form.level === 'beginner') return PROGRAMS[0];
    if (+form.days === 3) return PROGRAMS[2];
    if (+form.days === 5) return PROGRAMS[6];
    if (+form.days === 6) return PROGRAMS[3];
    return PROGRAMS[1];
  }, [selected, form.days, form.level]);

  const bmr = useMemo(() => {
    const base = 10 * Number(form.weight) + 6.25 * Number(form.height) - 5 * Number(form.age);
    return Math.round(base + (form.sex === 'male' ? 5 : -161));
  }, [form]);
  const activity = form.level === 'advanced' ? 1.6 : form.level === 'intermediate' ? 1.55 : 1.45;
  const calories = Math.max(1200, Math.round(bmr * activity * (form.goal === 'fat' ? 0.88 : form.goal === 'strength' ? 1.03 : 1)));
  const protein = Math.round(Number(form.weight) * (form.goal === 'fat' ? 2.0 : form.goal === 'strength' ? 1.8 : 1.7));
  const bmi = (Number(form.weight) / ((Number(form.height) / 100) ** 2)).toFixed(1);
  const split = splitFor(program.id);
  const days = Math.min(+program.days, 6);
  const dayName = split[activeDay % split.length];
  const lower = dayName.toLowerCase();
  const exerciseList = program.id === 'full'
    ? EXERCISES.full
    : lower.includes('push') || lower.includes('chest')
      ? EXERCISES.push
      : lower.includes('pull') || lower.includes('back')
        ? EXERCISES.pull
        : EXERCISES.legs;

  const update = (key, value) => {
    setSelected('auto');
    setActiveDay(0);
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="app">
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="GymLab">
          <span className="brand-mark"><Dumbbell size={25} strokeWidth={1.8} /></span>
          <span><strong>GYMLAB</strong><small>TRAIN SMARTER</small></span>
        </a>
        <nav className={menuOpen ? 'nav-links mobile-open' : 'nav-links'}>
          <a className="active" href="#top">الرئيسية</a>
          <a href="#builder">مولّد البرامج</a>
          <a href="#programs">البرامج</a>
          <a href="#workout">جدولي</a>
          <a href="#about">عن GymLab</a>
        </nav>
        <div className="nav-actions">
          <button className="ghost">تسجيل الدخول</button>
          <button className="gold compact"><UserRound size={15} /> إنشاء حساب</button>
          <button className="menu-btn" onClick={() => setMenuOpen((value) => !value)} aria-label="القائمة">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="pill"><span className="live-dot" /> خطتك. تقدمك. تحت سيطرتك.</div>
            <p className="eyebrow">أكثر من مجرد جيم</p>
            <h1>برنامجك المثالي<br /><em>يبدأ من هنا.</em></h1>
            <p className="hero-lead">ابنِ برنامجًا يناسب هدفك ومستواك ووقتك، وتابع تقدمك بواجهة واضحة مصممة لتخليك تركز على التدريب.</p>
            <div className="hero-actions">
              <a className="gold hero-btn" href="#builder">ابدأ الآن <ArrowLeft size={18} /></a>
              <a className="outline hero-btn" href="#programs">استكشف البرامج <ArrowUpRight size={17} /></a>
            </div>
            <div className="trust-row">
              <div><b>+500</b><span>تمرين</span></div>
              <div><b>+20</b><span>برنامج</span></div>
              <div><b>+10K</b><span>تجربة تدريب</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" />
            <div className="hero-image" />
            <div className="hero-card floating-card top-card"><span>التزامك اليوم</span><strong>92%</strong><small><Flame size={13} /> ممتاز، استمر</small></div>
            <div className="hero-card floating-card bottom-card"><span>هدف الأسبوع</span><strong>4 / 4</strong><div className="progress"><i style={{ width: '100%' }} /></div></div>
          </div>
        </section>

        <section className="benefits shell">
          {[
            [ShieldCheck, 'محتوى موثوق', 'أساس علمي واضح بعيد عن العشوائية'],
            [Dumbbell, 'قاعدة تمارين', 'حركة، عضلة مستهدفة، وملاحظات أداء'],
            [Calculator, 'حاسبات متقدمة', 'BMR · TDEE · BMI · 1RM'],
            [Target, 'برامج متنوعة', 'من المبتدئ حتى أنظمة المحترفين'],
          ].map(([Icon, title, desc]) => (
            <article className="benefit" key={title}><div className="icon-circle"><Icon size={20} /></div><div><b>{title}</b><span>{desc}</span></div></article>
          ))}
        </section>

        <section className="section shell" id="builder">
          <div className="builder panel-surface">
            <div className="section-heading">
              <div><span className="section-kicker">GYMLAB PLANNER</span><h2>أنشئ برنامجك التدريبي الآن</h2><p>أدخل معلوماتك ونرشح لك نظامًا مناسبًا ثم عدّله كما تريد.</p></div>
              <div className="mini-insight"><Sparkles size={15} /><span>اختيار ذكي</span><b>{program.name}</b></div>
            </div>
            <div className="form-grid">
              <Field label="الهدف الرئيسي"><select value={form.goal} onChange={(e) => update('goal', e.target.value)}><option value="muscle">بناء العضلات</option><option value="strength">القوة</option><option value="fat">خسارة الدهون</option><option value="fitness">اللياقة</option></select></Field>
              <Field label="مستوى الخبرة"><select value={form.level} onChange={(e) => update('level', e.target.value)}><option value="beginner">مبتدئ</option><option value="intermediate">متوسط</option><option value="advanced">متقدم</option></select></Field>
              <Field label="أيام التدريب"><select value={form.days} onChange={(e) => update('days', +e.target.value)}>{[2,3,4,5,6].map((n) => <option key={n} value={n}>{n} أيام</option>)}</select></Field>
              <Field label="الجنس"><select value={form.sex} onChange={(e) => update('sex', e.target.value)}><option value="male">ذكر</option><option value="female">أنثى</option></select></Field>
              <Field label="العمر"><input type="number" min="15" max="80" value={form.age} onChange={(e) => update('age', e.target.value)} /></Field>
              <Field label="الطول (سم)"><input type="number" min="120" max="230" value={form.height} onChange={(e) => update('height', e.target.value)} /></Field>
              <Field label="الوزن (كجم)"><input type="number" min="35" max="250" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></Field>
            </div>
            <div className="planner-footer">
              <div className="planner-note"><Gauge size={16} /><span>القيم تقديرية وتتحسن دقتها مع إدخال بياناتك الحقيقية ومتابعة التقدم.</span></div>
              <a className="gold generate-btn" href="#workout">إنشاء البرنامج <ArrowLeft size={17} /></a>
            </div>
          </div>
        </section>

        <section className="section shell" id="programs">
          <div className="section-title"><div><span className="section-kicker">TRAINING SYSTEMS</span><h2>برامج جاهزة بمستوى احترافي</h2><p>بدّل النظام في ثانية وشاهد كيف يتغير جدولك.</p></div><a href="#workout" className="text-link">عرض الجدول <ChevronLeft size={15} /></a></div>
          <div className="program-grid">
            {PROGRAMS.map((item) => <button key={item.id} className={program.id === item.id ? 'program-card selected' : 'program-card'} onClick={() => { setSelected(item.id); setActiveDay(0); }}>
              <img src={item.image} alt="" loading="lazy" />
              <div className="program-shade" />
              <div className="program-content"><span className="days-badge">{item.days} أيام</span><strong>{item.name}</strong><small>{item.ar}</small><span className="card-arrow"><ArrowUpRight size={14} /></span></div>
            </button>)}
          </div>
        </section>

        <section className="section shell" id="workout">
          <div className="workout panel-surface">
            <div className="workout-head">
              <div><span className="section-kicker">YOUR WEEK</span><h2>{program.name}</h2><p>خطة مقترحة بناءً على بياناتك الحالية ومستوى خبرتك.</p></div>
              <div className="metric-row"><div><span>BMI</span><b>{bmi}</b></div><div><span>Protein</span><b>{protein}g</b></div><div><span>Calories</span><b>{calories.toLocaleString()}</b></div></div>
            </div>
            <div className="workout-tabs">{Array.from({ length: days }, (_, i) => <button key={i} className={activeDay === i ? 'active' : ''} onClick={() => setActiveDay(i)}><b>اليوم {i + 1}</b><span>{split[i % split.length]}</span></button>)}</div>
            <div className="session-bar"><div><span>الجلسة</span><b>{dayName}</b></div><div className="session-meta"><Timer size={15} /> 60–75 دقيقة <span>·</span> <Flame size={15} /> RIR 1–3</div></div>
            <div className="exercise-list">{exerciseList.map(([name, muscle, sets], index) => <article className="exercise" key={name}><div className="exercise-index">{String(index + 1).padStart(2, '0')}</div><div className="exercise-main"><b>{name}</b><span>{muscle}</span></div><strong>{sets}</strong><button aria-label="تشغيل شرح التمرين"><Play size={14} fill="currentColor" /></button></article>)}</div>
          </div>
        </section>

        <section className="app-banner shell" id="about">
          <div className="app-copy"><span className="section-kicker">GYMLAB APP</span><h2>التدريب يصبح أسهل<br /><em>لما يكون معك كل شيء.</em></h2><p>البرنامج، التقدم، الجلسات، والأرقام المهمة في مكان واحد. الواجهة مصممة لتكون سريعة وواضحة حتى أثناء التمرين.</p><div className="store-row"><span>▶ Google Play</span><span> App Store</span></div></div>
          <div className="phone-mock"><div className="phone-notch" /><div className="phone-screen"><div className="phone-header"><span>Push Day</span><b>Week 1 · Day 1</b></div>{EXERCISES.push.slice(0,4).map(([e,,sets]) => <div className="phone-item" key={e}><span>{e}</span><b>{sets}</b></div>)}<div className="phone-complete"><Check size={15} /> 3 / 5 مكتمل</div></div></div>
          <div className="quote-block"><span>“</span><p>العادات الصغيرة تصنع النتائج الكبيرة.</p><small>GymLab mindset</small></div>
        </section>
      </main>

      <footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><Dumbbell size={25} /></span><span><strong>GYMLAB</strong><small>TRAIN SMARTER</small></span></a><p>جسم أقوى · أداء أذكى · حياة أفضل</p></div><div><b>المنصة</b><a href="#builder">مولّد البرامج</a><a href="#programs">البرامج التدريبية</a><a href="#workout">جدولي</a></div><div><b>المحتوى</b><a>قاعدة التمارين</a><a>حاسبات رياضية</a><a>مقالات</a></div><div><b>مساعدة</b><a>الأسئلة الشائعة</a><a>تواصل معنا</a><a>الخصوصية</a></div></div><div className="shell footer-bottom"><span>© 2026 GymLab. جميع الحقوق محفوظة.</span><span>Built to train smarter.</span></div></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
