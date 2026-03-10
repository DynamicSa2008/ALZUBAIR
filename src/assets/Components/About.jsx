import React, { memo, useRef, useEffect, useCallback, useState } from "react";
import aboutUs from "../Images/شركة الزبير.webp";
const AboutIcon = memo(({ children }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.style.willChange = 'transform';
    }
  }, []);

  return (
    <div className="about-icon-wrapper" ref={iconRef}>
      {children}
      <div className="about-icon-ring"></div>
    </div>
  );
});

AboutIcon.displayName = 'AboutIcon';
const AboutListItem = memo(({ children, icon, index, observerRef }) => {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!observerRef.current || !itemRef.current) return;

    const currentObserver = observerRef.current;
    const currentItem = itemRef.current;

    currentObserver.observe(currentItem);

    return () => {
      if (currentItem) {
        currentObserver.unobserve(currentItem);
      }
    };
  }, [observerRef]);
  useEffect(() => {
    if (!itemRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(itemRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <li 
      ref={itemRef}
      className={`about-list-item ${isVisible ? 'about-visible' : ''}`}
    >
      <AboutIcon>{icon}</AboutIcon>
      <span className="about-item-text">{children}</span>
    </li>
  );
});

AboutListItem.displayName = 'AboutListItem';

const AboutImage = memo(() => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform';
    }
  }, []);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="about-image-container" ref={containerRef}>
      <div className="about-image-frame">
        {!isLoaded && <div className="about-image-skeleton"></div>}
        <img 
          ref={imageRef}
          className={`about-image ${isLoaded ? 'about-image-loaded' : ''}`}
          src={aboutUs} 
          alt="شركة الزبير"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          width="500"
          height="375"
        />
      </div>
      {isLoaded && (
        <>
          <div className="about-image-shine"></div>
          <div className="about-image-particles">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </div>
  );
});

AboutImage.displayName = 'AboutImage';
const ICONS_DATA = [
  {
    id: 'legal',
    path: (
      <svg className="about-icon about-icon-legal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V7L12 2Z" stroke="#c52330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#c52330" strokeWidth="2"/>
        <path d="M12 12V16" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 19L15 19" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    text: "فريق قانوني متخصص في إجراءات تسجيل العلامة التجارية"
  },
  {
    id: 'translate',
    path: (
      <svg className="about-icon about-icon-translate" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5H15" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 3V7" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 12L17 8L13 12" stroke="#c52330" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 16V8" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 13H11" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 10L8 16" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 19H21" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    text: "مترجمين معتمدين بخبرة واسعة في ترجمة العلامة التجارية"
  },
  {
    id: 'design',
    path: (
      <svg className="about-icon about-icon-design" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3V5" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 12H3" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 12H21" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 19V21" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="#c52330" strokeWidth="2"/>
        <path d="M12 15L12 21" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 12L21 12" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 12L3 12" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 9L12 3" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 6L20 8" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 6L4 8" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 18L20 16" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 18L4 16" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    text: "مصممين محترفين لبناء الهوية التجارية"
  },
  {
    id: 'system',
    path: (
      <svg className="about-icon about-icon-system" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="#c52330" strokeWidth="2"/>
        <path d="M8 2V22" stroke="#c52330" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M16 2V22" stroke="#c52330" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M2 8H22" stroke="#c52330" strokeWidth="2" strokeDasharray="2 2"/>
        <path d="M2 16H22" stroke="#c52330" strokeWidth="2" strokeDasharray="2 2"/>
        <circle cx="12" cy="12" r="2" fill="#c52330" fillOpacity="0.2" stroke="#c52330" strokeWidth="2"/>
      </svg>
    ),
    text: "نظام إداري احترافي يضمن سرعة التنفيذ ودقة الإجراءات"
  },
  {
    id: 'partner',
    path: (
      <svg className="about-icon about-icon-partner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" stroke="#c52330" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill="#c52330" fillOpacity="0.2" stroke="#c52330" strokeWidth="2"/>
        <path d="M12 8V12L14 14" stroke="#c52330" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    text: "نهدف لأن نكون شريك نجاح استراتيجي لعملائنا، عبر تقديم خدمات سريعة، دقيقة، وبأسعار تنافسية مدروسة."
  }
];

const About = memo(() => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('about-visible');
            });
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.willChange = 'transform';
    }
  }, []);

  return (
    <div ref={sectionRef} className="about-wrapper">
      {isVisible && (
        <div className="about-background">
          <div className="about-bg-circle" style={{ willChange: 'transform' }}></div>
          <div className="about-bg-circle-2" style={{ willChange: 'transform' }}></div>
          <div className="about-bg-pattern"></div>
          <div className="about-bg-dots"></div>
        </div>
      )}

      <div className="container">
        <div id="about" className="about-section">
          <h3 className="about-title">من نحن ؟</h3>
          <div className="about-title-decoration"></div>
          
          <p className="about-description">
            شركة الزبير مؤسسة متخصصة في تسجيل العلامة التجارية و ترجمة العلامة
            التجارية وتصميم وبناء الهويات التجارية.
          </p>
        </div>

        <div className="row about-content-row">
          <div className="col-md-6 about-left-col">
            <h2 className="about-subtitle">
              <span className="about-subtitle-text">نعتمد على</span>
              <span className="about-subtitle-line"></span>
            </h2>
            
            <ul className="about-list">
              {ICONS_DATA.map((item, index) => (
                <AboutListItem
                  key={item.id}
                  icon={item.path}
                  index={index}
                  observerRef={observerRef}
                >
                  {item.text}
                </AboutListItem>
              ))}
            </ul>
          </div>

          <div className="col-md-6 about-right-col">
            {isVisible && <AboutImage />}
          </div>
        </div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;