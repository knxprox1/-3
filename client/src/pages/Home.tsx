import { FormEvent, useEffect, useMemo, useState } from "react";

type Screen = "arrival" | "welcome" | "auth" | "loading" | "success" | "session" | "bye";

const Icon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);

const WifiIcon = () => <Icon><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.5 16.1a6 6 0 0 1 7 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></Icon>;
const ArrowIcon = () => <Icon className="arrow"><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
const ShieldIcon = () => <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
const BoltIcon = () => <Icon><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></Icon>;

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail?: string }) {
  return <div className="stat"><div className="stat__k">{icon}{label}</div><div className="stat__v">{value}{detail && <small>{detail}</small>}</div><div className="stat__glow" /></div>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("arrival");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [ip, setIp] = useState("—");

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("welcome"), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;
    const stepTimer = window.setInterval(() => setLoadingStep((step) => Math.min(step + 1, 3)), 560);
    const finishTimer = window.setTimeout(() => {
      setIp(`10.20.${Math.floor(Math.random() * 40) + 1}.${Math.floor(Math.random() * 240) + 10}`);
      setScreen("success");
    }, 2450);
    return () => { window.clearInterval(stepTimer); window.clearTimeout(finishTimer); };
  }, [screen]);

  useEffect(() => {
    if (screen !== "session") return;
    const timer = window.setInterval(() => setSessionSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen]);

  const formattedTime = useMemo(() => {
    const h = String(Math.floor(sessionSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((sessionSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(sessionSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [sessionSeconds]);

  const go = (next: Screen) => setScreen(next);
  const updateCode = (value: string) => { setError(""); setCode(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 8) { setError("يجب أن يتكوّن الرمز من ٨ أحرف أو أرقام."); return; }
    if (code === "00000000") { setError("رمز الدخول غير صحيح."); return; }
    go("loading"); setLoadingStep(0);
  };

  return <>
    <div className="bg"><div className="bg__orb bg__orb--a" data-depth="-8" /><div className="bg__orb bg__orb--b" data-depth="-14" /><div className="bg__orb bg__orb--c" data-depth="-6" /><div className="bg__grid" /><div className="bg__beam" /><div className="bg__calligraphy" data-depth="-10">الأسطورة</div><div className="bg__grain" /></div>
    <div className="shell">
      <header className="topbar"><button className="brand" onClick={() => go("welcome")} aria-label="الصفحة الرئيسية"><span className="brand__mark"><WifiIcon /></span><span className="brand__text"><span className="brand__en">الأسطورة</span><span className="brand__ar">بوابة واي فاي</span></span></button><div className="topbar__right"><span className="chip"><span className="dot" />الأسطورة_5G</span><button className="iconbtn" onClick={() => setShowNotifications((v) => !v)} aria-label="الإشعارات"><Icon><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Icon><span className="badge">2</span></button></div></header>
      {showNotifications && <div className="notif"><div className="notif__head">الإشعارات <button onClick={() => setShowNotifications(false)}>إغلاق</button></div><div className="notif__list"><div className="sheet__item"><i>✓</i>باقة الضيف اليومية متاحة — إنترنت سريع لمدة ٢٤ ساعة.</div><div className="sheet__item"><i>✓</i>حماية الشبكة مفعّلة بتقنية WPA3.</div></div></div>}
      <main className="stage"><section className="card"><div className="card__sheen" /><div className="card__inner">
        {screen === "arrival" && <div className="arrival" onClick={() => go("welcome")}><div><div className="arrival__mark"><span className="halo" /><svg viewBox="0 0 120 120"><circle className="ring" cx="60" cy="60" r="54" /><path className="arc" d="M26 58a48 48 0 0 1 68 0" /><path className="arc" d="M38 70a31 31 0 0 1 44 0" /><path className="arc" d="M50 82a14 14 0 0 1 20 0" /><circle className="core" cx="60" cy="92" r="4.5" /></svg></div><div className="arrival__word">الأسطورة</div><div className="arrival__ar ar">بوابة واي فاي للضيوف</div><div className="arrival__tag">تجربة واي فاي فاخرة</div></div><div className="arrival__skip">اضغط في أي مكان للمتابعة</div><div className="arrival__progress" /></div>}
        {screen === "welcome" && <div className="screen is-active"><div className="wifiwave"><i /><i /><i /><i /></div><div className="eyebrow">مرحباً بك</div><h1 className="title">أنت على بُعد خطوة من<br /><span className="grad">واي فاي أسطوري</span></h1><p className="lead">اتصل بشبكة الأسطورة باستخدام رمز الدخول واستمتع بتصفح سريع وآمن على جميع أجهزتك.</p><div className="netpanel"><Stat icon={<WifiIcon />} label="الشبكة" value="الأسطورة_5G" /><Stat icon={<BoltIcon />} label="السرعة" value="940" detail="ميغابت/ث" /><Stat icon={<ShieldIcon />} label="الأمان" value="WPA3" detail="مشفّر" /><Stat icon={<BoltIcon />} label="الإشارة" value="ممتازة" /></div><div className="banner"><div className="banner__ico">✦</div><div><b>باقة يومية مجانية للضيف</b><span>٢٤ ساعة · ٥ غيغابايت بسرعة عالية · حتى ٣ أجهزة</span></div><span className="ar">ضيفنا العزيز</span></div><div className="welcome__cta"><button className="btn btn--primary" onClick={() => go("auth")}><WifiIcon />إدخال رمز الدخول<ArrowIcon /></button><button className="btn btn--ghost" onClick={() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth" })}>عرض الباقات والعروض</button></div></div>}
        {screen === "auth" && <div className="screen is-active"><button className="back" onClick={() => go("welcome")}><Icon><path d="M19 12H5M11 18l-6-6 6-6" /></Icon>رجوع</button><div className="eyebrow">رمز الدخول</div><h1 className="title">أدخل<br /><span className="grad">رمز الدخول</span></h1><p className="lead">اكتب أو الصق رمز القسيمة المكوّن من ٨ أحرف والمطبوع على البطاقة أو الإيصال.</p><form className="voucher" onSubmit={submit}><div className="voucher__head"><label className="voucher__label" htmlFor="voucher">رمز الدخول</label><span className="voucher__count"><b>{code.length}</b> / 8</span></div><input id="voucher" className="voucher__input" value={code} onChange={(e) => updateCode(e.target.value)} placeholder="ALS7-K2M9" autoComplete="off" maxLength={8} />{error && <div className="field-msg field-msg--err"><span>ⓘ {error}</span></div>}<div className="helpers"><button type="button" className="helper" onClick={() => updateCode("ALST2026")}><span>✦</span>استخدام رمز تجريبي</button><button type="button" className="helper" onClick={() => { setCode(""); setError(""); }}>✕ Clear</button></div><div className="auth__cta"><button className="btn btn--primary" type="submit" disabled={code.length !== 8}><WifiIcon />الاتصال بالواي فاي</button><p className="terms">بالاتصال أنت توافق على <button type="button" className="link" onClick={() => setShowHelp(true)}>سياسة الاستخدام المقبول</button>.<span className="ar">اتصال آمن ومشفّر بالكامل</span></p></div></form></div>}
        {screen === "loading" && <div className="screen is-active loading"><div className="eyebrow" style={{ justifyContent: "center" }}>جاري الاتصال</div><div className="radar"><span className="radar__ring" /><span className="radar__ring" /><span className="radar__ring" /><span className="radar__orbit" /><span className="radar__sweep" /><div className="radar__core"><WifiIcon /></div></div><div className="loading__pct">{Math.min((loadingStep + 1) * 25, 100)}<small>٪</small></div><div className="loading__bar"><i style={{ width: `${Math.min((loadingStep + 1) * 25, 100)}%` }} /></div><div className="steps">{["التحقق من رمز الدخول", "التفاوض مع البوابة", "تخصيص عنوان الشبكة", "تأمين جلستك"].map((step, i) => <div className={`step ${i <= loadingStep ? "is-done" : ""}`} key={step}><span className="step__ico">{i <= loadingStep ? "✓" : "•"}</span>{step}<span className="ar">{["التحقق", "البوابة", "العنوان", "التأمين"][i]}</span></div>)}</div></div>}
        {screen === "success" && <div className="screen is-active success"><div className="success__mark"><div className="success__disc">✓</div></div><div className="eyebrow" style={{ justifyContent: "center" }}>تم الاتصال</div><h1 className="title">مرحباً بك في <span className="grad">الأسطورة</span></h1><p className="lead">تم التحقق من جهازك وتأمينه. استمتع بسرعة أسطورية.</p><div className="success__grid"><Stat icon={null} label="زمن الاستجابة" value="9" detail="مللي ثانية" /><Stat icon={null} label="عنوان الشبكة" value={ip} /><Stat icon={null} label="الباقة" value="باقة يومية" /></div><button className="btn btn--primary" onClick={() => go("session")}>فتح جلستي <ArrowIcon /></button></div>}
        {screen === "session" && <div className="screen is-active"><div className="session__head"><span className="status"><span className="dot" />متصل · آمن</span><div className="plan"><b>الباقة اليومية للضيف</b>تنتهي خلال <span className="mono">23:59:59</span></div></div><div className="hero-metrics"><div className="ring-card"><div className="ring"><svg viewBox="0 0 132 132"><circle className="t" cx="66" cy="66" r="58" /><circle className="p" cx="66" cy="66" r="58" /></svg><div className="ring__c"><div className="ring__v">0<small> ميغابايت</small></div><div className="ring__k">البيانات المستخدمة</div></div></div><div className="ring-card__foot"><b>0%</b> من ٥ غيغابايت · المتبقي <b>5.00 غيغابايت</b></div></div><div className="timers"><div className="timer timer--accent"><div className="stat__k">مدة الجلسة</div><div className="timer__v">{formattedTime}</div></div><div className="timer"><div className="stat__k">الأجهزة</div><div className="timer__v">1<small>/ ٣ أجهزة متصلة</small></div></div></div></div><div className="speed"><div className="speed__row"><div><div className="stat__k">⚡ السرعة الحالية</div><div className="speed__v">940<small>ميغابت/ث ↓</small></div></div><div className="speed__side">الرفع <b>120</b> ميغابت/ث<br />الاستجابة <b>9</b> مللي ثانية · التذبذب <b>1</b> مللي ثانية</div></div><div className="sparkline">▁▃▅▃▆▄▇▅▇▆▇▅▆▇▇</div></div><div className="info"><div className="info__item"><span>IP</span><b>{ip}</b></div><div className="info__item"><span>اسم الشبكة</span><b>الأسطورة_5G</b></div><div className="info__item"><span>النطاق</span><b>٥ غيغاهرتز · واي فاي ٦</b></div><div className="info__item"><span>الأمان</span><b>WPA3 للمؤسسات</b></div></div><div className="packs" id="packs"><h2 className="sec">طوّر تجربتك <span className="ar">الباقات</span></h2><div className="packs__row">{[["vip", "الباقة الفائقة", "بيانات بلا حدود · ١ غيغابت · ٧ أيام", "149"], ["stream", "بث بلا حدود", "دقة 4K بلا حدود · ٣٠٠ ميغابت · ٤٨ ساعة", "59"], ["day", "وصول كامل ٢٤ ساعة", "٢٠ غيغابايت · ١٥٠ ميغابت · ٢٤ ساعة", "29"]].map(([id, name, spec, price]) => <button className={`pack ${id === "vip" ? "pack--vip" : ""}`} key={id} onClick={() => setShowHelp(true)}><span className="pack__tag">{id === "vip" ? "فائق مميز" : id === "stream" ? "بث" : "وصول كامل"}</span><div className="pack__name">{name}</div><div className="pack__spec">{spec}</div><div className="pack__foot"><span className="pack__price">{price}<small> ريال</small></span><span className="pack__pick">اختيار</span></div></button>)}</div></div><button className="btn btn--danger" onClick={() => go("bye")}><Icon><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><path d="M12 2v10" /></Icon>قطع اتصال الواي فاي</button></div>}
        {screen === "bye" && <div className="screen is-active bye"><div className="bye__mark">↗</div><div className="eyebrow" style={{ justifyContent: "center" }}>تم قطع الاتصال · إلى اللقاء</div><h1 className="title">نراك قريباً في<br /><span className="grad">الأسطورة</span></h1><p className="lead">انتهت جلستك بأمان. شكراً لاتصالك بنا.</p><div className="success__grid"><Stat icon={null} label="الجلسة" value={formattedTime} /><Stat icon={null} label="البيانات المستخدمة" value="٠ ميغابايت" /></div><button className="btn btn--primary" onClick={() => { setSessionSeconds(0); go("welcome"); }}>الاتصال مجدداً</button></div>}
      </div></section></main>
      <footer className="footer"><span>© ٢٠٢٦ الأسطورة · <span className="ar">الأسطورة</span></span><div className="footer__links"><button onClick={() => setShowHelp(true)}>مساعدة</button><button onClick={() => setShowHelp(true)}>الشروط</button></div></footer>
    </div>
    {showHelp && <div className="modal is-open" role="dialog" aria-modal="true"><div className="modal__card"><div className="modal__grab" /><div className="modal__ico">?</div><h3>أين أجد رمز الدخول؟</h3><p>رمزك المكوّن من ٨ أحرف مطبوع على بطاقة القسيمة أو الإيصال، أو أرسله لك موظف الاستقبال.</p><div className="sheet__list"><div className="sheet__item"><i>1</i>تكون الرموز بهذا الشكل <b className="mono">ALS7-K2M9</b>.</div><div className="sheet__item"><i>2</i>يسمح كل رمز بتوصيل ما يصل إلى ٣ أجهزة.</div><div className="sheet__item"><i>3</i>تحتاج مساعدة؟ راجع الاستقبال أو اتصل بالرقم <b className="mono">0</b>.</div></div><button className="btn btn--primary btn--sm" onClick={() => setShowHelp(false)}>حسناً</button></div></div>}
  </>;
}
