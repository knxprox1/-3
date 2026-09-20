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
    if (code.length !== 8) { setError("Codes are 8 letters or digits."); return; }
    if (code === "00000000") { setError("This access code is not recognised."); return; }
    go("loading"); setLoadingStep(0);
  };

  return <>
    <div className="bg"><div className="bg__orb bg__orb--a" data-depth="-8" /><div className="bg__orb bg__orb--b" data-depth="-14" /><div className="bg__orb bg__orb--c" data-depth="-6" /><div className="bg__grid" /><div className="bg__beam" /><div className="bg__calligraphy" data-depth="-10">الأسطورة</div><div className="bg__grain" /></div>
    <div className="shell">
      <header className="topbar"><button className="brand" onClick={() => go("welcome")} aria-label="Alostoura home"><span className="brand__mark"><WifiIcon /></span><span className="brand__text"><span className="brand__en">Alostoura</span><span className="brand__ar">الأسطورة</span></span></button><div className="topbar__right"><span className="chip"><span className="dot" />ALOSTOURA_5G</span><button className="iconbtn" onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications"><Icon><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Icon><span className="badge">2</span></button></div></header>
      {showNotifications && <div className="notif"><div className="notif__head">Notifications <button onClick={() => setShowNotifications(false)}>Close</button></div><div className="notif__list"><div className="sheet__item"><i>✓</i>Guest day pass included — 24 hours of fast Wi-Fi.</div><div className="sheet__item"><i>✓</i>Network security is active on WPA3.</div></div></div>}
      <main className="stage"><section className="card"><div className="card__sheen" /><div className="card__inner">
        {screen === "arrival" && <div className="arrival" onClick={() => go("welcome")}><div><div className="arrival__mark"><span className="halo" /><svg viewBox="0 0 120 120"><circle className="ring" cx="60" cy="60" r="54" /><path className="arc" d="M26 58a48 48 0 0 1 68 0" /><path className="arc" d="M38 70a31 31 0 0 1 44 0" /><path className="arc" d="M50 82a14 14 0 0 1 20 0" /><circle className="core" cx="60" cy="92" r="4.5" /></svg></div><div className="arrival__word">ALOSTOURA</div><div className="arrival__ar ar">الأسطورة</div><div className="arrival__tag">Premium Wi-Fi Experience</div></div><div className="arrival__skip">Tap anywhere to continue</div><div className="arrival__progress" /></div>}
        {screen === "welcome" && <div className="screen is-active"><div className="wifiwave"><i /><i /><i /><i /></div><div className="eyebrow">Welcome <span className="ar">مرحباً بك</span></div><h1 className="title">You're one step from<br /><span className="grad">legendary Wi-Fi.</span></h1><p className="lead">Connect to the ALOSTOURA network with your access code and enjoy fast, secure browsing across all your devices.</p><div className="netpanel"><Stat icon={<WifiIcon />} label="Network" value="ALOSTOURA_5G" /><Stat icon={<BoltIcon />} label="Speed" value="940" detail="Mbps" /><Stat icon={<ShieldIcon />} label="Security" value="WPA3" detail="Encrypted" /><Stat icon={<BoltIcon />} label="Signal" value="Excellent" /></div><div className="banner"><div className="banner__ico">✦</div><div><b>Guest day pass included</b><span>24 hours · 5 GB high-speed · up to 3 devices</span></div><span className="ar">ضيفنا العزيز</span></div><div className="welcome__cta"><button className="btn btn--primary" onClick={() => go("auth")}><WifiIcon />Enter access code<ArrowIcon /></button><button className="btn btn--ghost" onClick={() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth" })}>View packages & offers</button></div></div>}
        {screen === "auth" && <div className="screen is-active"><button className="back" onClick={() => go("welcome")}><Icon><path d="M19 12H5M11 18l-6-6 6-6" /></Icon>Back</button><div className="eyebrow">Authentication <span className="ar">رمز الدخول</span></div><h1 className="title">Enter your<br /><span className="grad">access code</span></h1><p className="lead">Type or paste the 8-character voucher printed on your card or receipt.</p><form className="voucher" onSubmit={submit}><div className="voucher__head"><label className="voucher__label" htmlFor="voucher">Access code</label><span className="voucher__count"><b>{code.length}</b> / 8</span></div><input id="voucher" className="voucher__input" value={code} onChange={(e) => updateCode(e.target.value)} placeholder="ALS7-K2M9" autoComplete="off" maxLength={8} />{error && <div className="field-msg field-msg--err"><span>ⓘ {error}</span></div>}<div className="helpers"><button type="button" className="helper" onClick={() => updateCode("ALST2026")}><span>✦</span>Use demo code</button><button type="button" className="helper" onClick={() => { setCode(""); setError(""); }}>✕ Clear</button></div><div className="auth__cta"><button className="btn btn--primary" type="submit" disabled={code.length !== 8}><WifiIcon />Connect to Wi-Fi</button><p className="terms">By connecting you agree to the <button type="button" className="link" onClick={() => setShowHelp(true)}>acceptable use policy</button>.<span className="ar">اتصال آمن ومشفّر بالكامل</span></p></div></form></div>}
        {screen === "loading" && <div className="screen is-active loading"><div className="eyebrow" style={{ justifyContent: "center" }}>Connecting <span className="ar">جاري الاتصال</span></div><div className="radar"><span className="radar__ring" /><span className="radar__ring" /><span className="radar__ring" /><span className="radar__orbit" /><span className="radar__sweep" /><div className="radar__core"><WifiIcon /></div></div><div className="loading__pct">{Math.min((loadingStep + 1) * 25, 100)}<small>%</small></div><div className="loading__bar"><i style={{ width: `${Math.min((loadingStep + 1) * 25, 100)}%` }} /></div><div className="steps">{["Verifying access code", "Negotiating with gateway", "Assigning IP address", "Securing your session"].map((step, i) => <div className={`step ${i <= loadingStep ? "is-done" : ""}`} key={step}><span className="step__ico">{i <= loadingStep ? "✓" : "•"}</span>{step}<span className="ar">{["التحقق", "البوابة", "العنوان", "التأمين"][i]}</span></div>)}</div></div>}
        {screen === "success" && <div className="screen is-active success"><div className="success__mark"><div className="success__disc">✓</div></div><div className="eyebrow" style={{ justifyContent: "center" }}>Connected <span className="ar">تم الاتصال</span></div><h1 className="title">Welcome to <span className="grad">ALOSTOURA</span></h1><p className="lead">Your device is authenticated and secured. Enjoy legendary speed.</p><div className="success__grid"><Stat icon={null} label="Latency" value="9" detail="ms" /><Stat icon={null} label="IP" value={ip} /><Stat icon={null} label="Plan" value="Day Pass" /></div><button className="btn btn--primary" onClick={() => go("session")}>Open my session <ArrowIcon /></button></div>}
        {screen === "session" && <div className="screen is-active"><div className="session__head"><span className="status"><span className="dot" />Connected · Secure</span><div className="plan"><b>Guest Day Pass</b>Expires in <span className="mono">23:59:59</span></div></div><div className="hero-metrics"><div className="ring-card"><div className="ring"><svg viewBox="0 0 132 132"><circle className="t" cx="66" cy="66" r="58" /><circle className="p" cx="66" cy="66" r="58" /></svg><div className="ring__c"><div className="ring__v">0<small> MB</small></div><div className="ring__k">Data used</div></div></div><div className="ring-card__foot"><b>0%</b> of 5 GB · <b>5.00 GB</b> left</div></div><div className="timers"><div className="timer timer--accent"><div className="stat__k">Session time</div><div className="timer__v">{formattedTime}</div></div><div className="timer"><div className="stat__k">Devices</div><div className="timer__v">1<small>/ 3 connected</small></div></div></div></div><div className="speed"><div className="speed__row"><div><div className="stat__k">⚡ Live throughput</div><div className="speed__v">940<small>Mbps ↓</small></div></div><div className="speed__side">Upload <b>120</b> Mbps<br />Ping <b>9</b> ms · Jitter <b>1</b> ms</div></div><div className="sparkline">▁▃▅▃▆▄▇▅▇▆▇▅▆▇▇</div></div><div className="info"><div className="info__item"><span>IP</span><b>{ip}</b></div><div className="info__item"><span>SSID</span><b>ALOSTOURA_5G</b></div><div className="info__item"><span>Band</span><b>5 GHz · Wi-Fi 6</b></div><div className="info__item"><span>Security</span><b>WPA3-Enterprise</b></div></div><div className="packs" id="packs"><h2 className="sec">Upgrade your experience <span className="ar">الباقات</span></h2><div className="packs__row">{[["vip", "Ultra Pass", "Unlimited · 1 Gbps · 7 days", "149"], ["stream", "Streaming Unlimited", "Unlimited 4K · 300 Mbps · 48 hours", "59"], ["day", "24H Full Access", "20 GB · 150 Mbps · 24 hours", "29"]].map(([id, name, spec, price]) => <button className={`pack ${id === "vip" ? "pack--vip" : ""}`} key={id} onClick={() => setShowHelp(true)}><span className="pack__tag">{id === "vip" ? "VIP Ultra" : id === "stream" ? "Streaming" : "Full access"}</span><div className="pack__name">{name}</div><div className="pack__spec">{spec}</div><div className="pack__foot"><span className="pack__price">{price}<small> SAR</small></span><span className="pack__pick">Select</span></div></button>)}</div></div><button className="btn btn--danger" onClick={() => go("bye")}><Icon><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><path d="M12 2v10" /></Icon>Disconnect from Wi-Fi</button></div>}
        {screen === "bye" && <div className="screen is-active bye"><div className="bye__mark">↗</div><div className="eyebrow" style={{ justifyContent: "center" }}>Disconnected <span className="ar">إلى اللقاء</span></div><h1 className="title">See you soon at<br /><span className="grad">ALOSTOURA</span></h1><p className="lead">Your session has ended securely. Thanks for connecting with us.</p><div className="success__grid"><Stat icon={null} label="Session" value={formattedTime} /><Stat icon={null} label="Data used" value="0 MB" /></div><button className="btn btn--primary" onClick={() => { setSessionSeconds(0); go("welcome"); }}>Connect again</button></div>}
      </div></section></main>
      <footer className="footer"><span>© 2026 ALOSTOURA · <span className="ar">الأسطورة</span></span><div className="footer__links"><button onClick={() => setShowHelp(true)}>Help</button><button onClick={() => setShowHelp(true)}>Terms</button></div></footer>
    </div>
    {showHelp && <div className="modal is-open" role="dialog" aria-modal="true"><div className="modal__card"><div className="modal__grab" /><div className="modal__ico">?</div><h3>Where is my access code?</h3><p>Your 8-character code is printed on your ALOSTOURA voucher card, receipt, or was sent to you by the front desk.</p><div className="sheet__list"><div className="sheet__item"><i>1</i>Codes look like <b className="mono">ALS7-K2M9</b>.</div><div className="sheet__item"><i>2</i>Each code allows up to 3 devices.</div><div className="sheet__item"><i>3</i>Need help? Visit reception or dial <b className="mono">0</b>.</div></div><button className="btn btn--primary btn--sm" onClick={() => setShowHelp(false)}>Got it</button></div></div>}
  </>;
}
