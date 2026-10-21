import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    const hover = () => { dotRef.current?.classList.add('hovered'); ringRef.current?.classList.add('hovered'); };
    const unhover = () => { dotRef.current?.classList.remove('hovered'); ringRef.current?.classList.remove('hovered'); };
    
    const attachHover = () => {
      document.querySelectorAll('a, button, input, select, textarea, .tilt-card, .menu-card-pro, .svc-card-pro, .testi-card, .calc-box').forEach(el => {
        el.addEventListener('mouseenter', hover);
        el.addEventListener('mouseleave', unhover);
      });
    };
    attachHover();
    const timer = setTimeout(attachHover, 1000);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />
    </>
  );
}

/* ─────────────────────────────────────────────
   FLOATING ACTION BUTTONS (WHATSAPP & CALL)
───────────────────────────────────────────── */
function FloatingActions() {
  return (
    <div className="floating-bar">
      <a
        href="https://wa.me/919841600569?text=Hello%20SS%20Caterers!%20I%20would%20like%20to%20enquire%20about%20catering%20services%20for%20my%20upcoming%20event."
        target="_blank"
        rel="noreferrer"
        className="fab-btn fab-wa"
        title="Chat on WhatsApp"
      >
        <span className="fab-icon">💬</span>
        <span className="fab-text">WhatsApp Us</span>
      </a>
      <a
        href="tel:9841600569"
        className="fab-btn fab-call"
        title="Call Now"
      >
        <span className="fab-icon">📞</span>
        <span className="fab-text">98416 00569</span>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM LOADER
───────────────────────────────────────────── */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 300); return 100; }
        return p + 4;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="loader">
      <div className="loader-plate">
        <div className="loader-ring" />
        <div className="loader-inner-ring" />
        <img src="/ssc-emblem-hd.png" alt="SSC Logo" className="loader-logo-img" />
      </div>
      <p className="loader-brand">S.S. CATERERS</p>
      <p className="loader-motto">Quality First · Chennai</p>
      <div className="loader-track">
        <div className="loader-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="loader-pct">{pct}%</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#hero" className="nav-logo">
        <div className="nav-badge-img-wrap">
          <img src="/ssc-emblem-hd.png" alt="SS Caterers Logo" className="nav-logo-img" />
        </div>
        <div className="nav-brand-text">
          <span className="nav-title">S.S. <span className="nav-accent">CATERERS</span></span>
          <span className="nav-sub">Quality First · Est. Chennai</span>
        </div>
      </a>
      <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        {['About', 'Services', 'Menu', 'Calculator', 'Gallery', 'Reviews', 'Contact'].map(n => (
          <li key={n}><a href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{n}</a></li>
        ))}
        <li>
          <a
            href="https://wa.me/919841600569?text=Hi%20SS%20Caterers,%20I'd%20like%20to%20book%20catering%20services"
            target="_blank"
            rel="noreferrer"
            className="nav-btn-wa"
          >
            💬 WhatsApp
          </a>
        </li>
        <li>
          <a href="tel:9841600569" className="nav-btn" onClick={() => setMenuOpen(false)}>
            📞 Book Now
          </a>
        </li>
      </ul>
      <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Toggle Navigation">
        <span /><span /><span />
      </button>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current || !bgRef.current) return;
      const y = window.scrollY;
      bgRef.current.style.transform = `translate3d(0, ${y * 0.4}px, 0) scale(1.08)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 3D Tilt Business Card
  const cardRef = useRef(null);
  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(12px)`;
  }, []);
  const onMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
  }, []);

  const floatingBadges = [
    { text: '🌿 Pure Ghee & Fresh Spices', top: '16%', left: '4%' },
    { text: '👑 Grand Wedding Specialists', top: '38%', left: '2%' },
    { text: '⭐ 500+ Memorable Celebrations', top: '78%', left: '8%' },
    { text: '📍 Shenoy Nagar, Chennai', top: '22%', right: '4%' },
    { text: '✨ Custom Feasts & Buffets', top: '76%', right: '5%' }
  ];

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-bg" ref={bgRef} style={{ backgroundImage: `url('/food-hero.jpg')` }} />
      <div className="hero-overlay" />

      {/* Floating Badges */}
      <div className="hero-floating-badges">
        {floatingBadges.map((b, i) => (
          <div
            key={i}
            className="hero-pill-badge"
            style={{
              top: b.top,
              left: b.left,
              right: b.right,
              animationDelay: `${i * 0.7}s`
            }}
          >
            {b.text}
          </div>
        ))}
      </div>

      <div className="hero-grid">
        {/* Left Column: Headline & Intro */}
        <div className="hero-text">
          <div className="chip">
            <span className="chip-spark">✦</span> Chennai’s Premier Event Caterers
          </div>
          
          <h1 className="hero-h1">
            <span className="hero-ss">S.S.</span>
            <span className="hero-caterers">CATERERS</span>
          </h1>
          
          <p className="hero-script">✦ Quality First ✦</p>

          <p className="hero-desc">
            Grand authentic South Indian delicacies, fragrant wedding biryanis, and lavish multi-course feasts. 
            Crafted with traditional heritage recipes, pure ingredients, and heartfelt hospitality.
          </p>

          <div className="hero-actions">
            <a href="tel:9841600569" className="btn-orange">
              <span>📞 Quick Call Booking</span>
            </a>
            <a
              href="https://wa.me/919841600569?text=Hi%20SS%20Caterers!%20I'd%20like%20a%20catering%20quote%20for%20my%20event."
              target="_blank"
              rel="noreferrer"
              className="btn-wa"
            >
              <span>💬 WhatsApp Quote</span>
            </a>
            <a href="#menu" className="btn-ghost">
              <span>Explore Menu ↓</span>
            </a>
          </div>

          <div className="hero-stats">
            {[
              ['500+', 'Events Catered'],
              ['15+', 'Years Experience'],
              ['100%', 'Taste & Hygiene'],
              ['50k+', 'Guests Delighted']
            ].map(([num, lbl]) => (
              <div key={lbl} className="hstat">
                <b>{num}</b>
                <span>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive 3D Visiting Card */}
        <div className="hero-card-wrap" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
          <div className="hero-card" ref={cardRef}>
            <div className="hcard-glow-top" />
            
            {/* Top row with visiting card graphic tag */}
            <div className="hcard-header">
              <span className="hcard-jesus">✦ JESUS LOVES YOU ✦</span>
              <span className="hcard-badge-tag">OFFICIAL VISITING CARD</span>
            </div>

            {/* Official Logo Banner from Client Visiting Card */}
            <div className="hcard-banner-wrapper">
              <img
                src="/logo-badge-hd.png"
                alt="S.S. Caterers Quality First Official Logo"
                className="hcard-official-logo"
              />
            </div>

            <div className="hcard-divider" />

            <div className="hcard-contacts">
              <div className="hcard-cblock">
                <div className="hcard-clabel">Proprietor</div>
                <div className="hcard-cname">J. Jaswanth Samuel</div>
                <a href="tel:9841600569" className="hcard-cnum">98416 00569</a>
              </div>
              <div className="hcard-cblock">
                <div className="hcard-clabel">Coordinator</div>
                <div className="hcard-cname">A.P. Sathish Kumar</div>
                <a href="tel:9940162639" className="hcard-cnum">99401 62639</a>
              </div>
            </div>

            <div className="hcard-divider" />

            <div className="hcard-footer-info">
              <div className="hcard-addr">
                📍 #28/32, Kandan Street, Shenoy Nagar, Chennai – 600 030
              </div>
              <div className="hcard-email">
                ✉️ jaswanth729@gmail.com
              </div>
            </div>

            <div className="hcard-action-bar">
              <a href="tel:9841600569" className="hcard-action-btn hcard-action-btn--primary">
                📞 Call Jaswanth
              </a>
              <a
                href="https://wa.me/919841600569?text=Hello%20Jaswanth%20Samuel,%20I%20got%20your%20visiting%20card%20from%20the%20website"
                target="_blank"
                rel="noreferrer"
                className="hcard-action-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#about" className="scroll-cue">
        <div className="scroll-mouse"><div className="scroll-wheel" /></div>
        <span>Scroll to Explore</span>
      </a>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PARALLAX DIVIDER BAND
───────────────────────────────────────────── */
function ParallaxBand({ img, children, id }) {
  const ref = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const fn = () => {
      if (!ref.current || !bgRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      bgRef.current.style.transform = `translate3d(0, ${center * 0.3}px, 0) scale(1.15)`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <section className="para-band" id={id} ref={ref}>
      <div className="para-band-bg" ref={bgRef} style={{ backgroundImage: `url('${img}')` }} />
      <div className="para-band-overlay" />
      <div className="para-band-content">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="about-sec" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Visual Showcase */}
          <div className="about-imgs reveal">
            <div className="aimg aimg-main tilt-card">
              <img src="/wedding.jpg" alt="Wedding Grand Feast" />
              <div className="aimg-overlay">
                <span>Traditional & Modern Banquet Feasts</span>
              </div>
            </div>
            <div className="aimg aimg-sm tilt-card">
              <img src="/curry.jpg" alt="Authentic South Indian Curry" />
              <div className="aimg-overlay">
                <span>Clay-Pot Slow Cooking</span>
              </div>
            </div>
            <div className="aimg-badge-float">
              <div className="abadge">
                <span className="abadge-num">15+</span>
                <span className="abadge-lbl">Years of Excellence</span>
              </div>
            </div>
          </div>

          {/* Description & Values */}
          <div className="about-text">
            <div className="sec-tag reveal">About S.S. Caterers</div>
            <h2 className="sec-h2 reveal">Rooted in Tradition, <span>Perfected</span> for Celebrations</h2>
            <div className="sec-line reveal" />
            <p className="about-p reveal">
              Established with an unwavering commitment to <strong>Quality First</strong>, S.S. Caterers 
              has earned the trust of families and premier corporate organizations across Chennai.
              Located at Shenoy Nagar, we specialize in delivering authentic flavours that leave an everlasting 
              impression on your guests.
            </p>
            <p className="about-p reveal">
              Whether you are hosting a regal wedding reception, an auspicious housewarming ceremony, 
              or an executive corporate gathering, every dish is prepared with fresh local produce, pure ghee, 
              and traditional aromatic ground spices.
            </p>

            <div className="about-highlights-grid reveal">
              <div className="ab-item">
                <span className="ab-icon">🌿</span>
                <div>
                  <h4>100% Fresh Daily</h4>
                  <p>Procured every single morning from local organic markets.</p>
                </div>
              </div>
              <div className="ab-item">
                <span className="ab-icon">👨‍🍳</span>
                <div>
                  <h4>Master Culinary Chefs</h4>
                  <p>15+ years of wedding & authentic catering heritage.</p>
                </div>
              </div>
              <div className="ab-item">
                <span className="ab-icon">🛡️</span>
                <div>
                  <h4>Hygiene Guaranteed</h4>
                  <p>Strict food safety standards, sanitized live counters.</p>
                </div>
              </div>
              <div className="ab-item">
                <span className="ab-icon">⏰</span>
                <div>
                  <h4>Seamless Punctuality</h4>
                  <p>Setup ready well before guests arrive, zero delays.</p>
                </div>
              </div>
            </div>

            <div className="about-actions reveal">
              <a href="#calculator" className="btn-orange">Calculate Event Budget</a>
              <a href="tel:9841600569" className="btn-ghost">Call J. Jaswanth Samuel</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES SECTION
───────────────────────────────────────────── */
function ServicesSection() {
  const svcs = [
    {
      icon: '💍',
      title: 'Grand Wedding Catering',
      desc: 'Sumptuous multi-course wedding banquets, traditional banana leaf sadhyas, live tandoor and dosa counters, and royal dessert spreads.',
      tag: 'Signature Service',
      perks: ['Traditional Sadhya & Leaf Service', 'Grand Buffet Counters', 'Live Welcome Drinks & Chaat']
    },
    {
      icon: '🏢',
      title: 'Corporate Events & Seminars',
      desc: 'Sophisticated catering for conferences, AGM meetings, product launches, and corporate executive dinners with timely setup.',
      tag: 'Professional',
      perks: ['Executive Bento & Buffets', 'High-Tea & Coffee Breaks', 'Strict Punctuality']
    },
    {
      icon: '🎂',
      title: 'Birthday & Milestone Parties',
      desc: 'Fun, vibrant food menus with starters, sizzlers, finger foods, and celebratory main courses loved by kids and adults alike.',
      tag: 'Custom Themes',
      perks: ['Live Pizza & Pasta Counters', 'Mocktail Bars', 'Delicious Party Desserts']
    },
    {
      icon: '🙏',
      title: 'Auspicious & Sacred Occasions',
      desc: 'Pure, satvik, traditional Tamil meals prepared with religious reverence for Gruhapravesam, Upanayanam, and Poojas.',
      tag: 'Sacred & Pure',
      perks: ['Pure Vegetarian Menus', 'No Onion/Garlic Options', 'Traditional Brass Vessels']
    },
    {
      icon: '🎓',
      title: 'College & Institutional Fests',
      desc: 'High-volume catering for college symposiums, alumni meets, and graduation days offering premium taste at student-friendly pricing.',
      tag: 'High Volume',
      perks: ['Efficient Crowd Handling', 'Combos & Fast Service', 'Custom Meal Trays']
    },
    {
      icon: '🏡',
      title: 'Intimate Family Gatherings',
      desc: 'Personalized catering for anniversary dinners, get-togethers, and house parties from 25 guests onwards with boutique care.',
      tag: 'Cozy & Gourmet',
      perks: ['Homestyle Authentic Taste', 'Custom Portions', 'Dedicated Service Staff']
    }
  ];

  return (
    <section className="svc-sec" id="services">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Tailored Culinary Solutions</div>
          <h2 className="sec-h2">Exceptional Catering for <span>Every Occasion</span></h2>
          <p className="sec-desc">
            We adapt seamlessly to your guest count, dietary preferences, and event themes across Chennai.
          </p>
          <div className="sec-line" />
        </div>

        <div className="svc-grid-pro">
          {svcs.map((s, i) => (
            <div key={s.title} className={`svc-card-pro reveal reveal-d${(i % 3) + 1}`}>
              <div className="svc-glow-top" />
              <div className="svc-header-row">
                <div className="svc-icon-pro">{s.icon}</div>
                <span className="svc-tag-pro">{s.tag}</span>
              </div>
              <h3 className="svc-title-pro">{s.title}</h3>
              <p className="svc-desc-pro">{s.desc}</p>
              
              <ul className="svc-perks">
                {s.perks.map((p, idx) => (
                  <li key={idx}>✓ {p}</li>
                ))}
              </ul>

              <a
                href={`https://wa.me/919841600569?text=Hi%20SS%20Caterers,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}`}
                target="_blank"
                rel="noreferrer"
                className="svc-link"
              >
                Enquire for {s.title} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MENU SECTION WITH CATEGORY FILTER
───────────────────────────────────────────── */
function MenuSection() {
  const [activeTab, setActiveTab] = useState('all');

  const menuItems = useMemo(() => [
    {
      id: 1,
      cat: 'nonveg',
      type: 'Non-Veg',
      name: 'Chennai Dum Biryani',
      subtitle: 'Slow Cooked in Seeraga Samba / Basmati',
      desc: 'Marinated tender meat layered with long-grain fragrant rice, saffron milk, and fried onions, cooked under gentle coal dum.',
      img: '/biryani.jpg',
      badge: 'Bestseller'
    },
    {
      id: 2,
      cat: 'veg',
      type: 'Pure Veg',
      name: 'Grand South Indian Sambar & Rasam',
      subtitle: 'Traditional Thali Centerpiece',
      desc: 'Simmered with drumsticks, shallots, handmade aromatic sambar masala and accompanied by tangy pepper-cumin rasam.',
      img: '/curry.jpg',
      badge: 'Authentic'
    },
    {
      id: 3,
      cat: 'veg',
      type: 'Pure Veg',
      name: 'Malabar & Ceylon Parotta Feasts',
      subtitle: 'Flaky & Crispy Layers',
      desc: 'Multi-layered golden parottas served steaming hot with rich vegetable kurma, salna, and paneer pepper fry.',
      img: '/food-hero.jpg',
      badge: 'Popular'
    },
    {
      id: 4,
      cat: 'nonveg',
      type: 'Non-Veg',
      name: 'Chettinad Pepper Chicken & Mutton Chukka',
      subtitle: 'Fiery & Aromatic Spices',
      desc: 'Fresh stone-ground black pepper, shallots, curry leaves, and tender roasted meat cooked to roasted perfection.',
      img: '/curry.jpg',
      badge: "Chef's Special"
    },
    {
      id: 5,
      cat: 'veg',
      type: 'Pure Veg',
      name: 'Crispy Starters & Medu Vada',
      subtitle: 'Golden Morning & Evening Bites',
      desc: 'Crisp hot medu vadas, vegetable cutlets, paneer tikka, and crunchy onion pakoras with coconut chutney.',
      img: '/food-hero.jpg',
      badge: 'Classic'
    },
    {
      id: 6,
      cat: 'dessert',
      type: 'Dessert',
      name: 'Royal Elaneer & Semiya Payasam',
      subtitle: 'Tender Coconut & Milk Pudding',
      desc: 'Rich payasam sweetened with natural jaggery or condensed milk, enriched with roasted cashews, raisins, and cardamom.',
      img: '/sweets.jpg',
      badge: 'Divine Sweet'
    },
    {
      id: 7,
      cat: 'veg',
      type: 'Pure Veg',
      name: 'Fresh Chutney & Pickle Spread',
      subtitle: 'Stone Ground Accompaniments',
      desc: 'Traditional coconut, spicy kara chutney, mint coriander dip, mango ginger pickle, and crispy appalam.',
      img: '/spices.jpg',
      badge: 'Essential'
    },
    {
      id: 8,
      cat: 'dessert',
      type: 'Dessert',
      name: 'Hot Gulab Jamun & Ice Cream Combo',
      subtitle: 'Decadent Finale',
      desc: 'Melt-in-mouth khoya jamuns soaked in rose syrup, paired seamlessly with creamy vanilla bean ice cream.',
      img: '/sweets.jpg',
      badge: 'Crowd Fav'
    }
  ], []);

  const filtered = activeTab === 'all' ? menuItems : menuItems.filter(m => m.cat === activeTab);

  return (
    <section className="menu-sec" id="menu">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Culinary Masterpieces</div>
          <h2 className="sec-h2">Our Signature <span>Menu Spread</span></h2>
          <p className="sec-desc">
            Prepared with traditional secret masalas, slow-cooking craftsmanship, and uncompromised quality.
          </p>
          <div className="sec-line" />
        </div>

        {/* Tab Filters */}
        <div className="menu-tabs reveal">
          <button
            className={`menu-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Specialties
          </button>
          <button
            className={`menu-tab-btn ${activeTab === 'veg' ? 'active' : ''}`}
            onClick={() => setActiveTab('veg')}
          >
            🌱 Pure Vegetarian
          </button>
          <button
            className={`menu-tab-btn ${activeTab === 'nonveg' ? 'active' : ''}`}
            onClick={() => setActiveTab('nonveg')}
          >
            🍗 Non-Vegetarian
          </button>
          <button
            className={`menu-tab-btn ${activeTab === 'dessert' ? 'active' : ''}`}
            onClick={() => setActiveTab('dessert')}
          >
            🍨 Sweets & Desserts
          </button>
        </div>

        {/* Menu Cards */}
        <div className="menu-grid-pro">
          {filtered.map((item, idx) => (
            <div key={item.id} className={`menu-card-pro reveal reveal-d${(idx % 4) + 1}`}>
              <div className="menu-card-media">
                <img src={item.img} alt={item.name} loading="lazy" />
                <span className={`menu-type-tag ${item.cat === 'veg' ? 'veg' : 'nonveg'}`}>
                  {item.cat === 'veg' ? '🟢 Veg' : item.cat === 'nonveg' ? '🔴 Non-Veg' : '🟡 Dessert'}
                </span>
                <span className="menu-badge-corner">{item.badge}</span>
              </div>
              <div className="menu-card-body">
                <h3 className="menu-dish-title">{item.name}</h3>
                <div className="menu-dish-sub">{item.subtitle}</div>
                <p className="menu-dish-desc">{item.desc}</p>
                <div className="menu-card-foot">
                  <span className="menu-custom-note">Customizable Spice Levels</span>
                  <a
                    href={`https://wa.me/919841600569?text=Hello%20SS%20Caterers!%20Can%20we%20include%20"${encodeURIComponent(item.name)}"%20in%20our%20menu%20plan?`}
                    target="_blank"
                    rel="noreferrer"
                    className="menu-select-btn"
                  >
                    Add to Enquiry +
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EVENT BUDGET CALCULATOR
───────────────────────────────────────────── */
function BudgetCalculator() {
  const [guests, setGuests] = useState(150);
  const [plan, setPlan] = useState('gold');
  const [extraDessert, setExtraDessert] = useState(true);
  const [welcomeDrinks, setWelcomeDrinks] = useState(true);

  const planRates = {
    silver: { name: 'Standard Feast Thali', rate: 250 },
    gold: { name: 'Royal Grand Banquet Buffet', rate: 450 },
    platinum: { name: 'Supreme Luxury Wedding Feast', rate: 700 }
  };

  const currentRate = planRates[plan].rate;
  const drinksCost = welcomeDrinks ? 35 : 0;
  const dessertCost = extraDessert ? 45 : 0;
  const perPlate = currentRate + drinksCost + dessertCost;
  const totalCost = guests * perPlate;

  return (
    <section className="calc-sec" id="calculator">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Interactive Pricing Tool</div>
          <h2 className="sec-h2">Estimate Your <span>Event Budget</span></h2>
          <p className="sec-desc">
            Get an instant realistic estimate for your celebration in Chennai. Tailored to your guest count.
          </p>
          <div className="sec-line" />
        </div>

        <div className="calc-container reveal">
          <div className="calc-controls">
            {/* Guest Count Slider */}
            <div className="calc-field">
              <div className="calc-field-head">
                <label>Number of Guests</label>
                <span className="calc-value-badge">{guests} Guests</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-slider-scale">
                <span>50 Guests</span>
                <span>500</span>
                <span>1000</span>
                <span>1500+</span>
              </div>
            </div>

            {/* Package Selector */}
            <div className="calc-field">
              <label>Select Menu Package</label>
              <div className="calc-plan-pills">
                <button
                  className={`plan-pill ${plan === 'silver' ? 'selected' : ''}`}
                  onClick={() => setPlan('silver')}
                >
                  <div className="plan-name">Silver Feast</div>
                  <div className="plan-rate">₹250 / plate</div>
                  <span className="plan-detail">Traditional 14-item Meal</span>
                </button>
                <button
                  className={`plan-pill ${plan === 'gold' ? 'selected' : ''}`}
                  onClick={() => setPlan('gold')}
                >
                  <div className="plan-name">Royal Gold (Most Popular)</div>
                  <div className="plan-rate">₹450 / plate</div>
                  <span className="plan-detail">Biryani, Starters & Buffet</span>
                </button>
                <button
                  className={`plan-pill ${plan === 'platinum' ? 'selected' : ''}`}
                  onClick={() => setPlan('platinum')}
                >
                  <div className="plan-name">Platinum Luxury</div>
                  <div className="plan-rate">₹700 / plate</div>
                  <span className="plan-detail">Grand Live Counters & Sweets</span>
                </button>
              </div>
            </div>

            {/* Addons */}
            <div className="calc-field">
              <label>Optional Enhancements</label>
              <div className="calc-addons">
                <label className="calc-check-row">
                  <input
                    type="checkbox"
                    checked={welcomeDrinks}
                    onChange={(e) => setWelcomeDrinks(e.target.checked)}
                  />
                  <span>Live Welcome Drinks & Mocktail Counter (+₹35 / guest)</span>
                </label>
                <label className="calc-check-row">
                  <input
                    type="checkbox"
                    checked={extraDessert}
                    onChange={(e) => setExtraDessert(e.target.checked)}
                  />
                  <span>Dual Dessert Counter with Hot Jamun & Ice Cream (+₹45 / guest)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="calc-summary-card">
            <div className="calc-summary-glow" />
            <h3 className="summary-title">Estimate Summary</h3>
            <div className="summary-plan-title">{planRates[plan].name}</div>

            <div className="summary-row">
              <span>Estimated Guests:</span>
              <strong>{guests} People</strong>
            </div>
            <div className="summary-row">
              <span>Per Plate Estimate:</span>
              <strong>₹{perPlate}</strong>
            </div>
            <div className="summary-row">
              <span>Setup & Service Staff:</span>
              <strong className="text-free">Included (Free)</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total-box">
              <span className="total-label">Approximate Total</span>
              <span className="total-amount">₹{totalCost.toLocaleString('en-IN')}*</span>
              <span className="total-note">*Taxes & specific venue logistical costs as applicable</span>
            </div>

            <a
              href={`https://wa.me/919841600569?text=Hi%20SS%20Caterers!%20I%20used%20your%20website%20calculator.%20Guests:%20${guests},%20Package:%20${planRates[plan].name},%20Estimated%20Total:%20₹${totalCost}.%20Can%20we%20discuss%20further?`}
              target="_blank"
              rel="noreferrer"
              className="btn-orange btn-full"
            >
              💬 Lock in this Quote via WhatsApp
            </a>
            <p className="summary-guarantee">✦ S.S. Caterers Quality First Guarantee ✦</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   GALLERY WITH LIVE TABS & DRAG STRIP
───────────────────────────────────────────── */
function GallerySection() {
  const imgs = [
    { src: '/food-hero.jpg', label: 'The Royal Grand Spread', tag: 'Buffet Setup' },
    { src: '/biryani.jpg', label: 'Signature Chennai Dum Biryani', tag: 'Bestseller' },
    { src: '/wedding.jpg', label: 'Traditional Wedding Feast', tag: 'Wedding' },
    { src: '/curry.jpg', label: 'Authentic Slow-Simmered Curries', tag: 'Specialty' },
    { src: '/sweets.jpg', label: 'Traditional & Modern Sweets', tag: 'Desserts' },
    { src: '/spices.jpg', label: 'Aromatic Hand-Ground Spices', tag: 'Heritage' },
  ];

  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onUp = () => setIsDragging(false);

  return (
    <section className="gallery-sec" id="gallery">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Visual Showcase</div>
          <h2 className="sec-h2">A Glimpse of <span>Our Feasts</span></h2>
          <p className="sec-desc">Explore the presentation and live setup excellence crafted for celebrations in Chennai.</p>
          <div className="sec-line" />
        </div>
      </div>
      <div
        className="gallery-track"
        ref={trackRef}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {imgs.map((img, i) => (
          <div key={i} className="gallery-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="gallery-img-wrap">
              <img src={img.src} alt={img.label} draggable={false} />
              <div className="gallery-tag-pill">{img.tag}</div>
              <div className="gallery-label">{img.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CLIENT TESTIMONIALS SECTION
───────────────────────────────────────────── */
function TestimonialsSection() {
  const reviews = [
    {
      name: 'Dr. Ramesh Sundaram',
      event: 'Daughter’s Grand Wedding (800 Guests)',
      loc: 'Anna Nagar, Chennai',
      stars: '★★★★★',
      text: 'Jaswanth Samuel and his team delivered the most extraordinary catering experience for my daughter’s wedding. The Seeraga Samba Biryani and Elaneer Payasam received endless compliments from every guest!'
    },
    {
      name: 'Priya & Vignesh',
      event: 'Reception & Sangeet (450 Guests)',
      loc: 'Kilpauk, Chennai',
      stars: '★★★★★',
      text: 'Quality First is truly their motto! The live counters were clean, well-managed, and the food was served piping hot with wonderful smile and hospitality. Highly recommended caterer!'
    },
    {
      name: 'M. Lawrence Raj',
      event: 'Annual Corporate Gala & Dinner',
      loc: 'Guindy, Chennai',
      stars: '★★★★★',
      text: 'We engaged S.S. Caterers for our 300-member corporate annual event. Punctual arrival, pristine hygiene, and exceptional taste. Sathish Kumar coordinated every detail flawlessly.'
    }
  ];

  return (
    <section className="testi-sec" id="reviews">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Client Testimonials</div>
          <h2 className="sec-h2">Loved by Families Across <span>Chennai</span></h2>
          <p className="sec-desc">
            Real feedback from hosts who entrusted their special milestones to S.S. Caterers.
          </p>
          <div className="sec-line" />
        </div>

        <div className="testi-grid">
          {reviews.map((r, i) => (
            <div key={r.name} className={`testi-card reveal reveal-d${i + 1}`}>
              <div className="testi-stars">{r.stars}</div>
              <p className="testi-text">"{r.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{r.name.charAt(0)}</div>
                <div>
                  <h4 className="testi-name">{r.name}</h4>
                  <div className="testi-event">{r.event} · {r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHY CHOOSE US
───────────────────────────────────────────── */
function WhySection() {
  const reasons = [
    { icon: '🏆', title: 'Quality First Promise', desc: 'Inspired by our visiting card creed: every single dish is quality checked and crafted with uncompromising standards.' },
    { icon: '🌿', title: 'Daily Market Freshness', desc: 'No frozen ingredients or artificial coloring. Cold-pressed oils, pure farm ghee, and daily picked vegetables.' },
    { icon: '👨‍🍳', title: '15+ Years Veteran Chefs', desc: 'Deep command over authentic South Indian, Chettinad, Malabar, and contemporary continental cuisines.' },
    { icon: '⏰', title: 'Clockwork Punctuality', desc: 'Live counters set up 1.5 hours prior to event time. Warm service seamlessly delivered on schedule.' },
    { icon: '💬', title: 'Tailored Menus for Any Budget', desc: 'From cozy 30-person family lunches to 2,000-guest wedding banquets, we optimize costs without reducing taste.' },
    { icon: '❤️', title: 'Blessed Hospitality', desc: 'Guided by "Jesus Loves You" — we treat your celebrations with warm familial love, care, and respectful devotion.' },
  ];

  return (
    <section className="why-sec">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Our Competitive Edge</div>
          <h2 className="sec-h2">Why Families <span>Choose</span> S.S. Caterers</h2>
          <p className="sec-desc">We don’t just serve meals — we curate memories of warmth and celebration.</p>
          <div className="sec-line" />
        </div>
        <div className="why-grid">
          {reasons.map((r, i) => (
            <div key={r.title} className={`why-card reveal reveal-d${(i % 2) + 1}`}>
              <div className="why-icon-box">{r.icon}</div>
              <div>
                <h3 className="why-title">{r.title}</h3>
                <p className="why-desc">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────── */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    guests: '150',
    date: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Also offer auto-opening WhatsApp with pre-filled details
    const text = encodeURIComponent(
      `Hello SS Caterers!\nName: ${formData.name}\nPhone: ${formData.phone}\nEvent: ${formData.eventType}\nGuests: ${formData.guests}\nDate: ${formData.date}\nNotes: ${formData.message}`
    );
    window.open(`https://wa.me/919841600569?text=${text}`, '_blank');
  };

  return (
    <section className="contact-sec" id="contact">
      <div className="container">
        <div className="sec-header reveal">
          <div className="sec-tag">Direct Booking & Enquiries</div>
          <h2 className="sec-h2">Let’s Plan Your <span>Memorable Feast</span></h2>
          <p className="sec-desc">Reach out directly via phone, WhatsApp, or through our quick booking enquiry form.</p>
          <div className="sec-line" />
        </div>
        
        <div className="contact-grid">
          {/* Visiting Card Contact Details */}
          <div className="contact-info reveal">
            <h3 className="cinfo-title">Connect with Our Team</h3>
            <p className="cinfo-sub">Available every day to assist with wedding schedules and menu consultations.</p>

            <a href="tel:9841600569" className="cinfo-item">
              <div className="cinfo-icon">📞</div>
              <div>
                <div className="cinfo-lbl">Proprietor</div>
                <div className="cinfo-val">J. Jaswanth Samuel — 98416 00569</div>
                <span className="cinfo-action-text">Tap to Call Now →</span>
              </div>
            </a>

            <a href="tel:9940162639" className="cinfo-item">
              <div className="cinfo-icon">📞</div>
              <div>
                <div className="cinfo-lbl">Event Coordinator</div>
                <div className="cinfo-val">A.P. Sathish Kumar — 99401 62639</div>
                <span className="cinfo-action-text">Tap to Call Now →</span>
              </div>
            </a>

            <a
              href="https://wa.me/919841600569?text=Hello%20SS%20Caterers!%20I'd%20like%20to%20plan%20catering%20for%20my%20event."
              target="_blank"
              rel="noreferrer"
              className="cinfo-item cinfo-item--wa"
            >
              <div className="cinfo-icon" style={{ background: '#25D366' }}>💬</div>
              <div>
                <div className="cinfo-lbl" style={{ color: '#25D366' }}>Instant WhatsApp</div>
                <div className="cinfo-val">+91 98416 00569</div>
                <span className="cinfo-action-text">Chat with Jaswanth directly →</span>
              </div>
            </a>

            <a href="mailto:jaswanth729@gmail.com" className="cinfo-item">
              <div className="cinfo-icon">✉️</div>
              <div>
                <div className="cinfo-lbl">Email Address</div>
                <div className="cinfo-val">jaswanth729@gmail.com</div>
              </div>
            </a>

            <div className="cinfo-item">
              <div className="cinfo-icon">📍</div>
              <div>
                <div className="cinfo-lbl">Office & Commercial Kitchen</div>
                <div className="cinfo-val">#28/32, Kandan Street, Shenoy Nagar, Chennai – 600 030</div>
              </div>
            </div>

            <div className="cinfo-motto">
              <div className="cinfo-motto-text">"Jesus Loves You"</div>
              <div className="cinfo-motto-sub">S.S. CATERERS · QUALITY FIRST</div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="contact-form reveal reveal-d2">
            <div className="form-glow-top" />
            <h3 className="form-title">Send Event Enquiry</h3>
            <p className="form-sub">Fill details below — we will reply within 2 hours or connect over WhatsApp.</p>
            
            {submitted ? (
              <div className="form-success">
                <h3>🎉 Enquiry Sent Successfully!</h3>
                <p>Opening WhatsApp to connect directly with J. Jaswanth Samuel. You can also call us directly at 98416 00569.</p>
                <button
                  type="button"
                  className="btn-orange"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="fgroup">
                    <label htmlFor="cf-name">Your Full Name *</label>
                    <input
                      id="cf-name"
                      type="text"
                      placeholder="e.g. Anand Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="fgroup">
                    <label htmlFor="cf-phone">Mobile Number *</label>
                    <input
                      id="cf-phone"
                      type="tel"
                      placeholder="e.g. 98416 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="fgroup">
                    <label htmlFor="cf-email">Email Address</label>
                    <input
                      id="cf-email"
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="fgroup">
                    <label htmlFor="cf-event">Event Type</label>
                    <select
                      id="cf-event"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    >
                      <option>Wedding Banquet</option>
                      <option>Reception & Sangeet</option>
                      <option>Corporate Gala / Seminar</option>
                      <option>Birthday & Milestone Party</option>
                      <option>Housewarming / Pooja</option>
                      <option>Other Custom Event</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="fgroup">
                    <label htmlFor="cf-guests">Estimated Guests</label>
                    <input
                      id="cf-guests"
                      type="number"
                      placeholder="e.g. 200"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      min="20"
                    />
                  </div>
                  <div className="fgroup">
                    <label htmlFor="cf-date">Tentative Event Date</label>
                    <input
                      id="cf-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fgroup">
                  <label htmlFor="cf-msg">Menu Preferences or Special Requests</label>
                  <textarea
                    id="cf-msg"
                    rows="3"
                    placeholder="Tell us about special items (e.g. Dum Biryani, Elaneer Payasam, Live counters)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-orange btn-full">
                  🚀 Submit & Open Direct WhatsApp Chat
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   MAIN APPLICATION
───────────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  useScrollReveal();

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <CustomCursor />
        <FloatingActions />
        <Navbar />
        <HeroSection />
        <AboutSection />

        {/* Parallax Heritage Spices Band */}
        <ParallaxBand img="/spices.jpg" id="spice-band">
          <div className="band-content">
            <div className="band-tag">Authentic Heritage</div>
            <h2 className="band-h2">Spices That Awaken The Soul</h2>
            <p className="band-p">
              Every blend is roasted and ground in-house. From whole black peppercorns to slow-infused saffron 
              and rich cardamom, we bring the unmistakable fragrance of traditional Tamil feasting to your table.
            </p>
          </div>
        </ParallaxBand>

        <ServicesSection />
        <MenuSection />
        <BudgetCalculator />
        <GallerySection />

        {/* Parallax Celebration Band */}
        <ParallaxBand img="/wedding.jpg">
          <div className="band-content band-content--center">
            <div className="band-script">"Jesus Loves You"</div>
            <h2 className="band-h2-sm">We Serve Every Guest With Love & Dedication</h2>
            <p className="band-p">S.S. Caterers · Quality First · Shenoy Nagar, Chennai</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="tel:9841600569" className="btn-orange">
                📞 Call 98416 00569
              </a>
              <a
                href="https://wa.me/919841600569?text=Hello%20SS%20Caterers!%20I%20would%20like%20to%20discuss%20an%20event%20booking."
                target="_blank"
                rel="noreferrer"
                className="btn-wa"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </ParallaxBand>

        <TestimonialsSection />
        <WhySection />
        <ContactSection />

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-badge-img-wrap">
                <img src="/ssc-emblem-hd.png" alt="SS Caterers Logo" className="footer-logo-img" />
              </div>
              <div>
                <div className="footer-name">S.S. CATERERS</div>
                <div className="footer-tag-line">Quality First · Shenoy Nagar, Chennai</div>
              </div>
            </div>

            <div className="footer-copy">
              © {new Date().getFullYear()} S.S. Caterers. All Rights Reserved.<br />
              #28/32, Kandan Street, Shenoy Nagar, Chennai – 600 030<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>"Jesus Loves You"</span>
            </div>

            <div className="footer-links">
              <a href="tel:9841600569">📞 J. Jaswanth Samuel: 98416 00569</a>
              <a href="tel:9940162639">📞 A.P. Sathish Kumar: 99401 62639</a>
              <a href="mailto:jaswanth729@gmail.com">✉️ jaswanth729@gmail.com</a>
              <a
                href="https://wa.me/919841600569"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#25D366', fontWeight: 'bold' }}
              >
                💬 WhatsApp Available 24/7
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
