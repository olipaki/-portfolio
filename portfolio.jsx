import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const SECTIONS = ["Intro", "About", "Career", "Projects", "Skills", "Contact"];

const CAREER = [
  {
    period: "2016.07 — 2025.12",
    years: "9년 6개월",
    company: "신성통상",
    role: "경영지원본부 비서 · 총무팀",
    desc: "사내 전반적인 행정·운영·비용 정산, 인사 관련 지원 업무를 수행. 여행사 내역 / 법인카드 승인내역 / 그룹웨어 출장 데이터를 비교·매칭하는 정산 자동화 매크로를 직접 개발하여 오류 사전 방지 체계 구축.",
    highlight: "정산 자동화 매크로 개발 · 오류 방지 시스템 구현",
    color: "#b8c4b0",
  },
  {
    period: "2015.09 — 2016.08",
    years: "1년",
    company: "희코러스",
    role: "코러스 보컬 세션",
    desc: "SBS, KBS, OBS, 전국노래자랑 등 방송 및 콘서트 현장에서 다양한 장르의 코러스 보컬 세션으로 참여 및 공연 수행.",
    highlight: "방송·콘서트 현장 다수 참여",
    color: "#d4b8b0",
  },
  {
    period: "2010.04 — 2013.08",
    years: "3년 4개월",
    company: "Forever 21",
    role: "VMD Team · 명동점",
    desc: "ACC·언더웨어·액티브웨어 등 제품군의 컬러 매치 및 디스플레이 기획을 통해 시즌별 플로어셋·매장 콘셉트 구성.",
    highlight: "주말 매출 1억 5천만 원 달성",
    color: "#c2cdd6",
  },
];

const SKILLS = [
  {
    category: "AI · Tech",
    color: "#b8c4b0",
    items: [
      "Python",
      "AI Agent 설계",
      "RAG 파이프라인",
      "LLM 프롬프트 엔지니어링",
      "업무 자동화 매크로",
    ],
  },
  {
    category: "Business · Admin",
    color: "#d4b8b0",
    items: [
      "경영지원 · 총무 (9년+)",
      "비용 정산 · 법인카드",
      "행정 프로세스 설계",
      "그룹웨어 · ERP 운용",
      "비서 · 일정 관리",
    ],
  },
  {
    category: "Creative · Language",
    color: "#c2cdd6",
    items: [
      "VMD · 디스플레이 기획",
      "컬러리스트 과정 수료",
      "OPIc IM2 (영어)",
      "新HSK 2등급 (중국어)",
      "GTQ 그래픽 자격",
    ],
  },
];

const PROJECTS = [
  {
    id: "uDGOEN-_bQ8",
    num: "01",
    tag: "AI Agent",
    title: "AI Agent 기반\n업무 자동화 서비스",
    desc: "실무에서 경험한 반복 업무 문제를 AI Agent로 해결한 프로젝트. 총무·행정 도메인 지식을 기반으로 서비스 구조를 설계하고 구현했습니다.",
    techs: ["AI Agent", "Python", "자동화", "워크플로우"],
    color: "#b8c4b0",
  },
  {
    id: "E_vB3BvMr2Q",
    num: "02",
    tag: "RAG",
    title: "RAG 기반\n지식 검색 AI 서비스",
    desc: "사내 문서·규정 데이터를 활용한 RAG 기반 검색 서비스. 실제 업무 데이터를 적용해 정보 접근성과 응답 정확도를 높이는 방식으로 설계했습니다.",
    techs: ["RAG", "LLM", "벡터DB", "Python"],
    color: "#d4b8b0",
  },
];

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
function Cursor({ mouse }) {
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setTrail((prev) => ({
        x: prev.x + (mouse.x - prev.x) * 0.12,
        y: prev.y + (mouse.y - prev.y) * 0.12,
      })),
    );
    return () => cancelAnimationFrame(id);
  });

  return (
    <>
      <div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          left: mouse.x - 4,
          top: mouse.y - 4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "rgba(184,196,176,0.9)",
          transition: "transform 0.1s",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9998,
          left: trail.x - 20,
          top: trail.y - 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(184,196,176,0.35)",
          transition: "width 0.2s, height 0.2s",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   PARALLAX BLOB BACKGROUND
───────────────────────────────────────── */
function ParallaxBg({ mouse }) {
  const blobs = [
    {
      x: "15%",
      y: "20%",
      size: 520,
      color: "rgba(184,196,176,0.07)",
      depth: 0.02,
    },
    {
      x: "75%",
      y: "15%",
      size: 380,
      color: "rgba(212,184,176,0.06)",
      depth: 0.035,
    },
    {
      x: "60%",
      y: "70%",
      size: 460,
      color: "rgba(194,205,214,0.06)",
      depth: 0.025,
    },
    {
      x: "25%",
      y: "75%",
      size: 300,
      color: "rgba(184,196,176,0.05)",
      depth: 0.015,
    },
  ];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: b.color,
            filter: "blur(80px)",
            transform: `translate(${mouse.x * b.depth}px, ${mouse.y * b.depth}px) translate(-50%,-50%)`,
            transition: "transform 0.8s cubic-bezier(.25,.46,.45,.94)",
          }}
        />
      ))}
      {/* fine grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────── */
function NavDots({ active, onNav }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
      }}
    >
      {SECTIONS.map((s, i) => (
        <button
          key={s}
          onClick={() => onNav(i)}
          title={s}
          style={{
            width: active === i ? 8 : 5,
            height: active === i ? 8 : 5,
            borderRadius: "50%",
            border: `1px solid ${active === i ? "#b8c4b0" : "rgba(255,255,255,0.25)"}`,
            background: active === i ? "#b8c4b0" : "transparent",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
function Slide({ children, id }) {
  return (
    <section
      id={id}
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 60px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ num, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 56,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.85rem",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        {num}
      </span>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 300,
          color: "#f0ece4",
          letterSpacing: "0.03em",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "rgba(255,255,255,0.08)",
          marginLeft: 12,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER (for intro numbers)
───────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += 1;
          setVal(start);
          if (start < to) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────
   FLOATING TAG (intro badges)
───────────────────────────────────────── */
function FloatingTag({ label, style }) {
  return (
    <span
      style={{
        position: "absolute",
        padding: "6px 14px",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(8px)",
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.55)",
        whiteSpace: "nowrap",
        animation: "floatTag 4s ease-in-out infinite",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Portfolio() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const containerRef = useRef(null);

  // Mouse tracking
  useEffect(() => {
    const handler = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = SECTIONS.map((_, i) =>
      document.getElementById(`section-${i}`),
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { threshold: 0.5 },
    );
    sections.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (i) => {
    document
      .getElementById(`section-${i}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const parallaxStyle = (depth) => ({
    transform: `translate(${(mouse.x - window.innerWidth / 2) * depth}px, ${(mouse.y - window.innerHeight / 2) * depth}px)`,
    transition: "transform 0.6s cubic-bezier(.25,.46,.45,.94)",
  });

  return (
    <div
      ref={containerRef}
      style={{
        background: "#0f0e0c",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 300,
        color: "#f0ece4",
        overflowX: "hidden",
        cursor: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Noto+Sans+KR:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(184,196,176,0.3); border-radius: 2px; }
        @keyframes floatTag {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        button { outline: none; }
        .hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important; }
      `}</style>

      <Cursor mouse={mouse} />
      <ParallaxBg mouse={mouse} />
      <NavDots active={activeSection} onNav={scrollTo} />

      {/* ── TOP NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: "20px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(15,14,12,0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.06em",
          }}
        >
          PSH · Portfolio
        </span>
        <div style={{ display: "flex", gap: 36 }}>
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => scrollTo(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "none",
                fontSize: "0.65rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:
                  activeSection === i ? "#b8c4b0" : "rgba(255,255,255,0.3)",
                transition: "color 0.3s",
                padding: 0,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* ════════════════════════════════════
          SECTION 0 · INTRO
      ════════════════════════════════════ */}
      <Slide id="section-0">
        <div style={{ maxWidth: 1200, width: "100%", position: "relative" }}>
          {/* Floating tags */}
          <FloatingTag
            label="AI Agent · RAG"
            style={{ top: "5%", right: "8%", animationDelay: "0s" }}
          />
          <FloatingTag
            label="업무 자동화"
            style={{ top: "20%", right: "2%", animationDelay: "0.8s" }}
          />
          <FloatingTag
            label="총무 · 경영지원 9년+"
            style={{ bottom: "22%", right: "12%", animationDelay: "1.6s" }}
          />
          <FloatingTag
            label="VMD · 컬러리스트"
            style={{ bottom: "10%", right: "4%", animationDelay: "2.4s" }}
          />

          {/* Rotating ring */}
          <div
            style={{
              position: "absolute",
              right: "15%",
              top: "50%",
              transform: "translateY(-50%)",
              width: 280,
              height: 280,
              ...parallaxStyle(0.015),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(184,196,176,0.12)",
                animation: "rotateSlow 20s linear infinite",
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(184,196,176,0.4)",
                    transform: `rotate(${deg}deg) translateX(139px) translateY(-50%)`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                inset: 24,
                borderRadius: "50%",
                border: "1px solid rgba(212,184,176,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "3.5rem",
                    fontWeight: 300,
                    color: "rgba(184,196,176,0.6)",
                    lineHeight: 1,
                  }}
                >
                  <Counter to={9} />+
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    color: "rgba(255,255,255,0.25)",
                    marginTop: 6,
                  }}
                >
                  YEARS EXP
                </div>
              </div>
            </div>
          </div>

          {/* Main text */}
          <div style={{ maxWidth: 600 }}>
            <p
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#b8c4b0",
                marginBottom: 28,
                animation: "fadeSlideUp 0.8s 0.1s both",
              }}
            >
              Portfolio · 2025
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(4rem, 7vw, 7rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                marginBottom: 8,
                animation: "fadeSlideUp 0.8s 0.25s both",
                ...parallaxStyle(-0.008),
              }}
            >
              박세형
              <br />
              <em
                style={{ fontStyle: "italic", color: "rgba(184,196,176,0.65)" }}
              >
                Park Sehyung
              </em>
            </h1>
            <div
              style={{
                width: 60,
                height: 1,
                background: "linear-gradient(90deg, #b8c4b0, transparent)",
                margin: "28px 0",
                animation: "fadeSlideUp 0.8s 0.4s both",
              }}
            />
            <p
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 2,
                maxWidth: 420,
                animation: "fadeSlideUp 0.8s 0.55s both",
              }}
            >
              9년간의 경영지원 실무 경험과
              <br />
              AI·자동화 역량을 결합한
              <br />
              <span style={{ color: "#b8c4b0" }}>
                디지털 워크플로우 개선 전문가
              </span>
            </p>
            <button
              onClick={() => scrollTo(1)}
              style={{
                marginTop: 48,
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "none",
                border: "1px solid rgba(184,196,176,0.3)",
                color: "#b8c4b0",
                padding: "14px 28px",
                cursor: "none",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                transition: "all 0.3s",
                animation: "fadeSlideUp 0.8s 0.7s both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(184,196,176,0.1)";
                e.currentTarget.style.borderColor = "#b8c4b0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "rgba(184,196,176,0.3)";
              }}
            >
              EXPLORE ↓
            </button>
          </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════
          SECTION 1 · ABOUT
      ════════════════════════════════════ */}
      <Slide id="section-1">
        <div style={{ maxWidth: 1200, width: "100%" }}>
          <SectionLabel num="01" title="About Me" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Left: quote + text */}
            <div>
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.3rem, 2.2vw, 1.65rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                  borderLeft: "2px solid #b8c4b0",
                  paddingLeft: 28,
                  marginBottom: 40,
                  ...parallaxStyle(0.006),
                }}
              >
                "반복을 없애고,
                <br />
                본질에 집중하는
                <br />
                일하는 방식을 만듭니다."
              </blockquote>
              <p
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: "0.9rem",
                  lineHeight: 2.1,
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 300,
                }}
              >
                총무·경영지원 분야에서{" "}
                <span style={{ color: "#b8c4b0" }}>약 9년간</span> 실무를
                담당하며 출장비 정산, 비용 관리, 시설관리, 행정 프로세스 개선 등
                폭넓은 운영 업무를 수행해왔습니다.
                <br />
                <br />
                반복적이고 오류 가능성이 높은 업무를{" "}
                <span style={{ color: "#b8c4b0" }}>시스템으로 해결</span>하고자
                하는 관심이 직접적인 자동화 매크로 개발로 이어졌고, 현재는{" "}
                <span style={{ color: "#b8c4b0" }}>
                  AI Agent · RAG 기반 서비스 개발 과정
                </span>
                을 통해 디지털 워크플로우 개선 역량을 갖춘 인재로 성장 중입니다.
              </p>
            </div>

            {/* Right: info cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "성명", value: "박세형" },
                { label: "생년월일", value: "1990.05.17" },
                { label: "위치", value: "서울시 강동구" },
                { label: "연락처", value: "010-3052-9662" },
                { label: "이메일", value: "Se7en3333@naver.com", span: true },
                {
                  label: "언어",
                  value: "한국어 · 영어 IM2 · 중국어 HSK2",
                  span: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    gridColumn: item.span ? "1 / -1" : undefined,
                    padding: "18px 22px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 2,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(184,196,176,0.06)";
                    e.currentTarget.style.borderColor = "rgba(184,196,176,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════
          SECTION 2 · CAREER
      ════════════════════════════════════ */}
      <Slide id="section-2">
        <div style={{ maxWidth: 1200, width: "100%" }}>
          <SectionLabel num="02" title="Career" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CAREER.map((c, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(`career-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: 48,
                  padding: "36px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  transition: "background 0.3s",
                  background:
                    hoveredCard === `career-${i}`
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                  borderRadius: 2,
                  cursor: "default",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.25)",
                      marginBottom: 6,
                    }}
                  >
                    {c.period}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: c.color,
                      opacity: 0.8,
                    }}
                  >
                    {c.years}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 16,
                      marginBottom: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        color:
                          hoveredCard === `career-${i}`
                            ? "#f0ece4"
                            : "rgba(255,255,255,0.8)",
                        transition: "color 0.3s",
                      }}
                    >
                      {c.company}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: c.color,
                        opacity: 0.8,
                      }}
                    >
                      {c.role}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.9,
                      marginBottom: 14,
                      maxWidth: 560,
                    }}
                  >
                    {c.desc}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 14px",
                      background: `${c.color}18`,
                      border: `1px solid ${c.color}40`,
                      borderRadius: 2,
                      fontSize: "0.68rem",
                      color: c.color,
                      letterSpacing: "0.06em",
                    }}
                  >
                    ✦ {c.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════
          SECTION 3 · PROJECTS
      ════════════════════════════════════ */}
      <Slide id="section-3">
        <div style={{ maxWidth: 1200, width: "100%" }}>
          <SectionLabel num="03" title="AI Projects" />
          <div
            style={{
              padding: "20px 28px",
              marginBottom: 48,
              background: "rgba(184,196,176,0.05)",
              borderLeft: "2px solid rgba(184,196,176,0.5)",
              borderRadius: 2,
            }}
          >
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#b8c4b0",
                marginBottom: 8,
              }}
            >
              AI AGENT와 RAG를 활용한 생각하는 AI 서비스 개발자 양성과정
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
              }}
            >
              비전공자로서 실무 경험을 기반으로{" "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                실제 현업 문제를 AI로 해결
              </span>
              하는 관점으로 기획·구현한 2개의 프로젝트입니다.
            </p>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
          >
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                className="hover-lift"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                {/* Video */}
                <div
                  style={{
                    position: "relative",
                    paddingTop: "52%",
                    background: "#0a0908",
                  }}
                >
                  {playingVideo === i ? (
                    <iframe
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      src={`https://www.youtube.com/embed/${p.id}?autoplay=1`}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingVideo(i)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, rgba(15,14,12,0.9), rgba(15,14,12,0.6))`,
                        cursor: "none",
                      }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${p.id}/maxresdefault.jpg`}
                        alt="thumbnail"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.35,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.08)",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(184,196,176,0.2)";
                          e.currentTarget.style.borderColor = "#b8c4b0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.08)";
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.4)";
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="white"
                          style={{ marginLeft: 3 }}
                        >
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                      <span
                        style={{
                          position: "absolute",
                          bottom: 16,
                          left: 20,
                          fontSize: "0.6rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        클릭하여 재생
                      </span>
                    </div>
                  )}
                </div>
                {/* Body */}
                <div style={{ padding: "24px 28px 28px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: p.color,
                        opacity: 0.9,
                      }}
                    >
                      Project {p.num} · {p.tag}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.3rem",
                      fontWeight: 400,
                      color: "#f0ece4",
                      marginBottom: 12,
                      lineHeight: 1.35,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.85,
                      marginBottom: 18,
                    }}
                  >
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.techs.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 12px",
                          background: `${p.color}14`,
                          border: `1px solid ${p.color}30`,
                          borderRadius: 2,
                          fontSize: "0.62rem",
                          letterSpacing: "0.08em",
                          color: p.color,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════
          SECTION 4 · SKILLS
      ════════════════════════════════════ */}
      <Slide id="section-4">
        <div style={{ maxWidth: 1200, width: "100%" }}>
          <SectionLabel num="04" title="Skills" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              marginBottom: 56,
            }}
          >
            {SKILLS.map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(`skill-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: "32px 28px",
                  background:
                    hoveredCard === `skill-${i}`
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hoveredCard === `skill-${i}` ? s.color + "40" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 2,
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 1,
                      background: s.color,
                      opacity: 0.7,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: s.color,
                    }}
                  >
                    {s.category}
                  </span>
                </div>
                <ul style={{ listStyle: "none" }}>
                  {s.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(255,255,255,0.6)",
                        padding: "10px 0",
                        borderBottom:
                          j < s.items.length - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#f0ece4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      }}
                    >
                      <span
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          background: s.color,
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certificates row */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { year: "2021", name: "GTQ", org: "KPC한국생산성본부" },
              { year: "2020", name: "OPIc IM2", org: "영어 회화" },
              { year: "2024", name: "新HSK 2등급", org: "중국어" },
              {
                year: "2020",
                name: "컬러리스트 과정",
                org: "그린컴퓨터아트아카데미",
              },
            ].map((cert, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(194,205,214,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    color: "#c2cdd6",
                    opacity: 0.7,
                  }}
                >
                  {cert.year}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.3)",
                      marginTop: 2,
                    }}
                  >
                    {cert.org}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ════════════════════════════════════
          SECTION 5 · CONTACT
      ════════════════════════════════════ */}
      <Slide id="section-5">
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8c4b0",
                marginBottom: 20,
              }}
            >
              Contact
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 300,
                lineHeight: 1.2,
                marginBottom: 28,
                color: "#f0ece4",
                ...parallaxStyle(-0.01),
              }}
            >
              함께 일하고
              <br />
              싶으시다면
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.9,
              }}
            >
              9년의 실무 경험과 AI 역량을 결합하여
              <br />더 나은 업무 환경을 만들어가겠습니다.
            </p>

            {/* Motivation snippets */}
            <div
              style={{
                marginTop: 48,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {[
                {
                  num: "01",
                  title: "지원동기",
                  text: "총무·경영지원 9년의 실무 경험을 바탕으로 단순 운영을 넘어, AI 기반 업무 자동화와 디지털 워크플로우 개선 역할을 수행할 수 있는 직무로의 취업을 목표로 합니다.",
                },
                {
                  num: "02",
                  title: "노력한 경험",
                  text: "출장 정산 자동화 매크로를 직접 개발해 항공권 정산 시간을 단축하고 오류 방지 체계와 증빙 자료 표준화로 업무 효율을 강화했습니다.",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "22px 24px",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(184,196,176,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.025)")
                  }
                >
                  <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {m.num}
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#b8c4b0",
                      }}
                    >
                      {m.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.85,
                    }}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: "✉",
                label: "Email",
                value: "Se7en3333@naver.com",
                href: "mailto:Se7en3333@naver.com",
              },
              {
                icon: "✆",
                label: "Phone",
                value: "010-3052-9662",
                href: "tel:01030529662",
              },
              { icon: "⌖", label: "Location", value: "서울시 강동구" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href || "#"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "24px 28px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 2,
                  textDecoration: "none",
                  transition: "all 0.3s",
                  cursor: item.href ? "none" : "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(184,196,176,0.07)";
                  e.currentTarget.style.borderColor = "rgba(184,196,176,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: "#b8c4b0",
                    width: 24,
                    textAlign: "center",
                    opacity: 0.8,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                      marginBottom: 5,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.92rem",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </a>
            ))}

            {/* Education highlight */}
            <div
              style={{
                marginTop: 8,
                padding: "24px 28px",
                background: "rgba(184,196,176,0.04)",
                border: "1px solid rgba(184,196,176,0.15)",
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#b8c4b0",
                  marginBottom: 12,
                }}
              >
                Education
              </div>
              {[
                {
                  year: "2025",
                  name: "AI AGENT · RAG 양성과정",
                  sub: "수료 예정",
                },
                {
                  year: "2017",
                  name: "서울문화예술대학교",
                  sub: "실용음악학과 졸업",
                },
              ].map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "baseline",
                    padding: "9px 0",
                    borderBottom:
                      i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      color: "rgba(184,196,176,0.6)",
                      minWidth: 36,
                    }}
                  >
                    {e.year}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {e.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.3)",
                        marginTop: 2,
                      }}
                    >
                      {e.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          © 2025 Park Sehyung · All rights reserved
        </div>
      </Slide>
    </div>
  );
}
