import React from "react";

export default function Questions() {
  return (
    <>
      <div className="container">
        <div className="about-section my-5">
          <h3 className="fs-1 text-center">الأسئلة الشائعة</h3>
        </div>
        <div className="faq-container">
          <div className="row">
            <div className="col-md-6">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                    >
                      <span className="plus">+</span>
                      <span>ما أهمية تسجيل العلامة التجارية؟</span>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      <span className="plus">+</span>
                      <p>
                        يمنحك تسجيل العلامة التجارية حماية قانونية، وتميزًا
                        سوقيًا، وقيمة استثمارية طويلة الأمد.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                    >
                      <span className="plus">+</span>
                      <span>
                        هل تقدم شركة الزبير خدمة تسجيل العلامة التجارية؟
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      <span className="plus">+</span>
                      <p>
                        نعم، تقدم شركة الزبير خدمة تسجيل العلامة التجارية بكل
                        احترافية.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                  >
                    <span className="plus">+</span>
                    <span>هل تشمل خدماتكم التصميم؟</span>
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <span className="plus">+</span>
                    <p>
                      نعم، تشمل خدماتنا التصميم الاحترافي للعلامات التجارية.
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                  >
                    <span className="plus">+</span>
                    <span>ما هي خدمة ترجمة العلامة التجارية</span>
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <span className="plus">+</span>
                    <p>
                      خدمة ترجمة العلامة التجارية هي عملية نقل اسم العلامة
                      التجارية أو شعارها أو محتواها من لغة إلى لغة أخرى بطريقة
                      دقيقة ومعتمدة . هذه الخدمة مطلوبة بشكل أساسي من قبل الهيئة
                      السعودية للملكية الفكرية عند تسجيل أي علامة تجارية تحتوي
                      على نصوص أو كلمات غير عربية{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
