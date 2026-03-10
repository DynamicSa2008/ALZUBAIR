import React, { memo, useMemo, useRef, useEffect } from "react";
const BenefitIcon = memo(({ icon, color }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.style.willChange = "transform";
    }
  }, []);

  return (
    <div className="alzubair-icon-wrapper" style={{ color }}>
      <div className="alzubair-icon-container" ref={iconRef}>
        {icon}
        <div className="alzubair-icon-ring"></div>
        <div className="alzubair-icon-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
});

BenefitIcon.displayName = "BenefitIcon";
const BenefitCard = memo(({ benefit, index, observerRef }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (observerRef?.current && cardRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef?.current && cardRef.current) {
        observerRef.current.unobserve(cardRef.current);
      }
    };
  }, [observerRef]);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.willChange = "transform, opacity";
    }
    if (glowRef.current) {
      glowRef.current.style.willChange = "opacity";
    }
  }, []);

  return (
    <div ref={cardRef} className="alzubair-benefit-card" data-index={index}>
      <BenefitIcon icon={benefit.icon} color={benefit.color} />

      <h3 className="alzubair-benefit-title">{benefit.title}</h3>
      <p className="alzubair-benefit-description">{benefit.description}</p>

      <div
        ref={glowRef}
        className="alzubair-card-glow"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${benefit.color}20, transparent 70%)`,
          willChange: "opacity",
        }}
      ></div>
    </div>
  );
});

BenefitCard.displayName = "BenefitCard";

const BENEFITS_DATA = [
  {
    id: 1,
    title: "الحماية القانونية الكاملة",
    description:
      "عند تسجيل العلامة التجارية لدى الهيئة السعودية للملكية الفكرية تحصل على حق الاستخدام الحصري ومنع أي طرف آخر من استغلالها.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 7V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 12V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 2,
    title: "التميز السوقي",
    description:
      "تسجيل العلامة التجارية يمنحك هوية فريدة لا يمكن تقليدها قانونياً.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 3,
    title: "تعزيز القيمة المضافة",
    description:
      "يساهم تسجيل العلامة التجارية في رفع القيمة التسويقية لمنتجاتك وخدماتك.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 12V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 17V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 4,
    title: "تسويق أكثر فاعلية",
    description: "يمكنك الترويج لعلامتك بثقة دون الخوف من النزاعات القانونية.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 3L12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 3H21V9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 5,
    title: "كسب ثقة العملاء",
    description: "العلامة المسجلة تعزز مصداقيتك في أعين العملاء والمستثمرين.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 6,
    title: "حماية المستهلك",
    description: "منع التقليد والتوزيع ضمن حماية سمعة علامتك.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 12L11 15L16 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 7,
    title: "اعتبارها أصل تجاري",
    description:
      "تتحول العلامة المسجلة إلى أصل من أصول الشركة يمكن تقييمه مالياً.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M12 3V7" stroke="currentColor" strokeWidth="2" />
        <path d="M8 5V7" stroke="currentColor" strokeWidth="2" />
        <path d="M16 5V7" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 8,
    title: "التوسع والنمو",
    description: "يسهل تسجيل العلامة التجارية التوسع محلياً ودولياً.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2617 12 22"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2617 12 22"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    color: "#c52330",
  },
  {
    id: 9,
    title: "جذب المستثمرين",
    description: "العلامة المسجلة عنصر قوة في أي ملف استثماري.",
    icon: (
      <svg
        className="benefit-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5 20V18C5 15.2386 7.23858 13 10 13H14C16.7614 13 19 15.2386 19 18V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19 5L22 8L19 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M22 8H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    color: "#c52330",
  },
];

const WhyAlzubair = memo(() => {
  const observerRef = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add("alzubair-card-visible");
            });
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.willChange = "transform";
    }
  }, []);

  const benefitsList = useMemo(() => BENEFITS_DATA, []);

  return (
    <div ref={sectionRef} className="alzubair-why-section">
      <div className="alzubair-background">
        <div
          className="alzubair-shape"
          style={{ willChange: "transform" }}
        ></div>
        <div
          className="alzubair-shape-2"
          style={{ willChange: "transform" }}
        ></div>
      </div>

      <div className="alzubair-container">
        <h2 className="alzubair-main-title">
          لماذا يعد تسجيل العلامة التجارية خطوة استراتيجية لنجاح أعمالك؟
        </h2>

        <p className="alzubair-description">
          يمثل تسجيل العلامة التجارية الأساس القانوني لبناء أعمالك بثقة
          واستقرار.
        </p>

        <div className="alzubair-benefits-grid">
          {benefitsList.map((benefit, index) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={index}
              observerRef={observerRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

WhyAlzubair.displayName = "WhyAlzubair";

export default WhyAlzubair;
