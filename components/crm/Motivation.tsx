import React, { useEffect, useRef } from 'react';

const Motivation: React.FC = () => {
    const sectionsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('motiv-visible');
                    }
                });
            },
            { threshold: 0.08 }
        );

        sectionsRef.current.forEach((s) => {
            if (s) observer.observe(s);
        });

        return () => observer.disconnect();
    }, []);

    const addSectionRef = (el: HTMLDivElement | null, index: number) => {
        if (el) sectionsRef.current[index] = el;
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

                .motiv-root {
                    --gold: #C9A84C;
                    --gold-light: #E8C97A;
                    --gold-dim: rgba(201, 168, 76, 0.15);
                    --cream: #F5F0E8;
                    --off-white: #EDE8DF;
                    --ink: #0D0C0A;
                    --ink-soft: #1A1916;
                    --ink-mid: #2C2A26;
                    --muted: #6B6660;
                    --border: rgba(201, 168, 76, 0.2);
                    background: var(--ink);
                    color: var(--cream);
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 18px;
                    line-height: 1.8;
                    overflow-x: hidden;
                    min-height: 100%;
                    position: relative;
                }

                .motiv-grain {
                    position: fixed;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0.4;
                }

                .motiv-hero {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 60px 40px;
                    position: relative;
                    border-bottom: 1px solid var(--border);
                }

                .motiv-hero::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 1px;
                    height: 80px;
                    background: linear-gradient(to bottom, var(--gold), transparent);
                }

                .motiv-hero-label {
                    font-family: 'DM Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.25em;
                    color: var(--gold);
                    text-transform: uppercase;
                    margin-bottom: 36px;
                    opacity: 0;
                    animation: motivFadeUp 0.8s ease 0.2s forwards;
                }

                .motiv-hero-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(52px, 9vw, 110px);
                    font-weight: 300;
                    line-height: 1.0;
                    letter-spacing: -0.01em;
                    color: var(--cream);
                    opacity: 0;
                    animation: motivFadeUp 0.9s ease 0.4s forwards;
                    margin: 0;
                }

                .motiv-hero-title em {
                    font-style: italic;
                    color: var(--gold-light);
                }

                .motiv-hero-sub {
                    margin-top: 28px;
                    font-size: 15px;
                    font-family: 'DM Mono', monospace;
                    color: var(--muted);
                    letter-spacing: 0.1em;
                    opacity: 0;
                    animation: motivFadeUp 0.9s ease 0.6s forwards;
                }

                .motiv-hero-date {
                    margin-top: 60px;
                    font-size: 13px;
                    font-family: 'DM Mono', monospace;
                    color: var(--gold);
                    letter-spacing: 0.15em;
                    opacity: 0;
                    animation: motivFadeUp 0.9s ease 0.8s forwards;
                }

                .motiv-scroll-hint {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-family: 'DM Mono', monospace;
                    font-size: 9px;
                    letter-spacing: 0.3em;
                    color: var(--muted);
                    text-transform: uppercase;
                    opacity: 0;
                    animation: motivFadeUp 1s ease 1.2s forwards;
                }

                .motiv-content {
                    max-width: 780px;
                    margin: 0 auto;
                    padding: 0 40px;
                }

                .motiv-section {
                    padding: 90px 0 60px;
                    border-bottom: 1px solid var(--border);
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }

                .motiv-section.motiv-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .motiv-section:last-child {
                    border-bottom: none;
                }

                .motiv-section-header {
                    display: flex;
                    align-items: baseline;
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .motiv-section-time {
                    font-family: 'DM Mono', monospace;
                    font-size: 11px;
                    color: var(--gold);
                    letter-spacing: 0.2em;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .motiv-section-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                    color: var(--muted);
                }

                .motiv-section-line {
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }

                .motiv-p {
                    color: var(--off-white);
                    font-size: 18px;
                    line-height: 1.9;
                    margin-bottom: 22px;
                    font-weight: 300;
                    font-family: 'Cormorant Garamond', serif;
                }

                .motiv-p:last-child { margin-bottom: 0; }

                .motiv-p strong {
                    color: var(--gold-light);
                    font-weight: 400;
                }

                .motiv-pullquote {
                    margin: 48px 0;
                    padding: 32px 40px;
                    border-left: 2px solid var(--gold);
                    background: var(--gold-dim);
                }

                .motiv-pullquote .motiv-p {
                    font-size: 22px;
                    font-style: italic;
                    font-weight: 300;
                    color: var(--cream);
                    line-height: 1.7;
                    margin: 0;
                }

                .motiv-arabic {
                    font-size: 28px;
                    text-align: center;
                    color: var(--gold-light);
                    display: block;
                    margin: 16px 0 8px;
                    font-weight: 300;
                    font-family: 'Cormorant Garamond', serif;
                }

                .motiv-arabic-sub {
                    font-family: 'DM Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.15em;
                    color: var(--muted);
                    text-align: center;
                    display: block;
                    margin-bottom: 32px;
                }

                .motiv-deeper-truth {
                    background: var(--ink-soft);
                    border: 1px solid var(--border);
                    padding: 80px 60px;
                    margin: 80px 0;
                    position: relative;
                    overflow: hidden;
                }

                .motiv-deeper-truth::before {
                    content: '"';
                    position: absolute;
                    top: -40px;
                    left: 30px;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 280px;
                    color: var(--gold);
                    opacity: 0.05;
                    line-height: 1;
                    pointer-events: none;
                }

                .motiv-deeper-truth-label {
                    font-family: 'DM Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.3em;
                    text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 32px;
                    display: block;
                }

                .motiv-deeper-truth .motiv-p {
                    font-size: 20px;
                    line-height: 1.85;
                    font-style: italic;
                }

                .motiv-footer {
                    text-align: center;
                    padding: 60px 40px 80px;
                    border-top: 1px solid var(--border);
                }

                .motiv-footer-ornament {
                    font-size: 28px;
                    color: var(--gold);
                    letter-spacing: 0.3em;
                    margin-bottom: 20px;
                    display: block;
                    opacity: 0.6;
                }

                .motiv-footer .motiv-p {
                    font-family: 'DM Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.15em;
                    color: var(--muted);
                    text-transform: uppercase;
                }

                @keyframes motivFadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 600px) {
                    .motiv-content { padding: 0 24px; }
                    .motiv-deeper-truth { padding: 48px 28px; }
                    .motiv-p { font-size: 16px; }
                }
            `}</style>

            <div className="motiv-root">
                <div className="motiv-grain" />

                {/* Hero */}
                <div className="motiv-hero">
                    <p className="motiv-hero-label">Lifestyle Design · 3–5 Years From Now</p>
                    <h1 className="motiv-hero-title">
                        A Day in<br />the Life of<br /><em>Your Future Self</em>
                    </h1>
                    <p className="motiv-hero-sub">Maryland · USA</p>
                    <p className="motiv-hero-date">Written in the present tense — because it already is.</p>
                    <p className="motiv-scroll-hint">↓ scroll</p>
                </div>

                <div className="motiv-content">

                    {/* Fajr */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 0)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">06:15 AM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">Fajr</span>
                        </div>
                        <p className="motiv-p">The alarm goes off at 6:15. You don't hit snooze — that habit died somewhere in the grind years ago. You sit up. The house is quiet in that particular morning way, the kind of stillness that feels like it was made for this.</p>
                        <p className="motiv-p">You make wudu. Cold water on your face. You still notice how good that feels — something you used to dread, now one of your favourite parts of the morning. You lay your prayer mat facing the qibla and you stand in it. Just you and Allah. <strong>No phone. No noise. No agenda.</strong> Two raka'at of Sunnah. Then Fajr. You sit in the silence afterward, making dhikr, letting the morning settle into you before you go out and meet it.</p>
                        <div className="motiv-pullquote">
                            <p className="motiv-p">This is where your day actually starts. Not at your desk. Not in the office. Here — on this mat, in the quiet of the morning, with this gratitude that keeps compounding like a savings account you never touch.</p>
                        </div>
                        <p className="motiv-p">You make du'a. Long, slow, specific. For your family. For your rizq. For barakah in your work. For a spouse. For the people you haven't helped yet. You ask Allah for all of it like you actually believe it's coming — because you do. Tawakkul isn't passivity to you anymore. It's the exhale after you've done everything you could. It's the peace underneath the grind.</p>
                        <span className="motiv-arabic">بِسْمِ اللَّهِ</span>
                        <span className="motiv-arabic-sub">You begin everything with His name.</span>
                    </div>

                    {/* The Body */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 1)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">06:30 AM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">The Body</span>
                        </div>
                        <p className="motiv-p">You're at Lifetime before most people's alarms go off. You don't listen to anything on the drive — just the engine, the early Maryland air, the silence of a highway that's still half-asleep. You actually like this part. The drive that used to feel like a chore now feels like ceremony.</p>
                        <p className="motiv-p">Today is a heavy compound day — squats, pulls, carries. You move with intention, not performance. Nobody needs to see this. This is between you and the version of yourself that used to make excuses. You push until it hurts, then push a little more, because you know now that <strong>the resistance is the point.</strong> The discomfort used to stop you. Now it tells you you're going somewhere.</p>
                        <p className="motiv-p">After lifting, you end with rounds on the bag — a habit from your martial arts training that you've kept because something about hitting something clean with good technique still makes everything else feel manageable. You're not training to fight. You're training to be someone who could.</p>
                        <p className="motiv-p">Sauna. Hot tub. Five minutes of nothing. You sit in the heat and let your mind wander. No strategy. No plans. Just steam and the occasional thought about what you want to eat. You eat clean — whole foods, real protein, nothing your great-grandfather wouldn't recognize. You fast sunnah fasts when you can. Your body feels like yours now in a way it didn't when you were younger and hating it into submission.</p>
                    </div>

                    {/* The Office */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 2)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">09:30 AM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">The Office</span>
                        </div>
                        <p className="motiv-p">The office isn't huge. Doesn't need to be. A big desk with dual monitors and your tools — CRM, dashboards, analytics, the architecture of a business you built from nothing starting at 15, through years of no revenue, rejections, doubt, and grinding through it all anyway. There's a couch against the wall. A window that looks over the city below. You drink your coffee here and let the morning land.</p>
                        <p className="motiv-p">You pull up the company dashboard first. Revenue. Retention. Conversion. The marketing agency, the AI solutions arm, the e-commerce operation — three distinct income streams all humming. Some months one dips. You already know what to do. You built systems, not dependency on yourself. The machine runs without you having to be in every gear. <strong>That took years. It was worth it.</strong></p>
                        <p className="motiv-p">Your team is online by now. You check in — not to micromanage, but because you actually care about these people. You remember what it felt like to work somewhere that treated you like a number and you swore you'd never build that. You give credit loudly. You handle problems without drama. Leadership feels natural now in a way that used to feel like performance.</p>
                        <div className="motiv-pullquote">
                            <p className="motiv-p">Today you look at the monthly revenue number. It crossed $500,000 for the first time. You sit with it. You don't immediately post. You don't tell anyone right away. You just sit there and say Alhamdulillah so many times it starts to feel like breathing.</p>
                        </div>
                        <p className="motiv-p">You spend about an hour on strategy — refining offers, reviewing ad performance (you're spending mid-five figures monthly on paid ads, scaling toward six on strong months), identifying which client accounts need hands-on attention. Then two calls: one with a client thrilled about their results, one with a new prospect you've decided is worth your time. You close it. Not because you were pushy — because the offer is real and you know it and they can feel it.</p>
                        <p className="motiv-p">By early afternoon, the core work is done. You check out around 1 PM. <strong>3-4 hours of real work. That's the whole point.</strong></p>
                    </div>

                    {/* Home · Family */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 3)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">01:00 PM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">Home · Family</span>
                        </div>
                        <p className="motiv-p">You drive home. Not in a rush. You have a supercar now and you still notice it every single time you get in — the sound, the weight, the way Maryland roads feel different through it. You roll down the window sometimes and just take in the fact that you're here. That it happened. That you didn't quit.</p>
                        <p className="motiv-p">Lunch with your family. Your parents are home and you eat with them when you can. Your mom cooked something. Your dad is in a good mood. These meals feel different now that you've taken the financial pressure off them — there's a lightness in the house that wasn't always there. You bought them a new car recently. You're working on the kitchen renovation. Not because you needed to flex — because you promised yourself you would when you got here, and you keep your promises.</p>
                        <p className="motiv-p">You sit with them for a while after. No rush anywhere. This is the whole point of the freedom you built — not the cars, not the dashboard numbers — this. Being present in your own home without a weight on your chest.</p>
                    </div>

                    {/* Dhuhr · The Afternoon · Asr */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 4)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">02:30 PM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">Dhuhr · The Afternoon · Asr</span>
                        </div>
                        <p className="motiv-p">You pray Dhuhr. Then you open your Qur'an. You're a hafiz — you've carried it memorized for years now — and this daily review is how you keep it alive inside you. Not a performance. A conversation. You go through your pages carefully, lips moving, the words sitting in you the way they always have, deeper than thought. There's a kind of stillness that only happens here, in these pages, that nothing else in your day can replicate.</p>
                        <p className="motiv-p">After, you pull up your investment dashboards. Crypto wallets, stock positions, the portfolio you've been building and rebalancing for years. You review the numbers — not anxiously, but with the measured eye of someone who understands that wealth managed well is an act of stewardship, not just accumulation. You move some things. You let other things sit. You log it, close the tab, and move on. <strong>Tying the camel. Then letting go.</strong></p>
                        <p className="motiv-p">Then: Umrah planning. Next weekend. The whole family. You're booking flights, coordinating accommodations near Al-Masjid Al-Haram, figuring out the logistics of getting everyone there smoothly. You've done this trip multiple times now — quarterly if you can — but doing it with your whole family hits different every time. You think about your parents making tawaf. You think about standing at the Ka'bah next to the people you love most in the world. <strong>Not a goal. A rhythm.</strong> And this one — this particular trip — you've been looking forward to for weeks.</p>
                        <p className="motiv-p">By the time Asr rolls in, the game is on. Football in the living room, your whole family together on the couch, the noise and the commentary and someone always saying something about the ref. You're fully present for this. No laptop. No phone face-up. Just the game, your family, Maryland light through the windows, and the specific happiness of an ordinary afternoon that you once would have dreamed about on a rough day.</p>
                        <p className="motiv-p">You pray Asr when the time comes. Then you're back to it — half-watching, half-talking, fully home.</p>
                    </div>

                    {/* Hoops · Night */}
                    <div className="motiv-section" ref={(el) => addSectionRef(el, 5)}>
                        <div className="motiv-section-header">
                            <span className="motiv-section-time">07:00 PM</span>
                            <span className="motiv-section-line" />
                            <span className="motiv-section-title">Hoops · Night</span>
                        </div>
                        <p className="motiv-p">Around 7 you're back in the car headed to Lifetime. But tonight isn't a workout — tonight is hoops with the boys. Your circle. The ones who knew you before any of this, and a few you've picked up along the way who move at the same frequency. The court is loud and competitive and exactly what the end of a good day calls for. You run games for a couple hours, talking trash and laughing and playing hard the way you did when you were younger except now everything in your body actually works like you trained it to.</p>
                        <p className="motiv-p">After runs, you hit sprints. Then the sauna. Then the hot tub. This part is almost meditative — the heat pulling everything out of your muscles, the conversation winding down, the day closing. You sit in the steam and let the whole thing decompress. No urgency. No next thing. Just the end of a full day, felt properly.</p>
                        <p className="motiv-p">You make Maghrib before you leave. On time. Always.</p>
                        <p className="motiv-p">You're home by 9:30. The house is still alive — your family is up, and tonight you all watch a movie together. Dinner in the living room, everyone on the couch, something good on the screen, the kind of night that costs nothing and means everything. You eat well. You laugh. You're present in a way you couldn't always be when the weight of building was heaviest.</p>
                        <p className="motiv-p">You pray Isha. Then you wind down — not scrolling, not strategizing. Phone goes away at 10:45. Lights out by 11:15. The same room you've slept in your whole life in Maryland — but everything around it feels different now. <strong>You feel different.</strong> Not louder. Stiller. More certain in that specific way that only comes from having done something you weren't sure you could do, over and over, until it was simply who you are.</p>
                    </div>

                    {/* Deeper Truth */}
                    <div className="motiv-deeper-truth motiv-section" ref={(el) => addSectionRef(el, 6)}>
                        <span className="motiv-deeper-truth-label">The Deeper Truth</span>
                        <p className="motiv-p">None of this was given. You didn't stumble into it — you chose it, over and over again, on the mornings you didn't want to, in the years where nothing was working, through every rejection and every plateau and every voice — internal and external — that said this wasn't for you. The cars are real. The revenue is real. The freedom is real. But the thing underneath all of it — the thing that makes you actually happy — is that you didn't compromise who you were to get it. You prayed through the grind. You gave while you were still building. You kept your promises to your family before you had the means to fully keep them, so that when the means arrived, the habit was already there. You built a life that, if everything were taken tomorrow, you'd know exactly how to rebuild — because you know now that it always came from Him, through you, because you showed up. That's the whole secret. Stop waiting for the perfect moment. Keep your head down. Have tawakkul in Allah. Do your part. And enjoy the damn process — because this is it. This is the life. You're already in it.</p>
                    </div>

                </div>

                <footer className="motiv-footer">
                    <span className="motiv-footer-ornament">— ﷻ —</span>
                    <p className="motiv-p">Alhamdulillah · For everything that was · and everything yet to come</p>
                </footer>
            </div>
        </>
    );
};

export default Motivation;
