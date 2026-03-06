import React from "react";
import aboutUs from "../Images/شركة الزبير.webp";
export default function About() {
  return (
    <>
      <div className="container">
        <div id="about" className="about-section my-5">
          <h3 className="fs-1 text-center">من نحن ؟</h3>
          <hr />
          <p className="fs-4 text-center mt-4">
            شركة الزبير مؤسسة متخصصة في تسجيل العلامة التجارية و ترجمة العلامة
            التجارية وتصميم وبناء الهويات التجارية.
          </p>
        </div>
        <div className="row">
          <div className="col-md-6 my-5">
            <h2>نعتمد علي </h2>
            <ul>
              <li className="fs-3 my-3">
                فريق قانوني متخصص في إجراءات تسجيل العلامة التجارية
              </li>
              <li className="fs-3 my-3">
                مترجمين معتمدين بخبرة واسعة في ترجمة العلامة التجارية
              </li>
              <li className="fs-3 my-3">
                مصممين محترفين لبناء الهوية التجارية
              </li>
              <li className="fs-3 my-3">
                نظام إداري احترافي يضمن سرعة التنفيذ ودقة الإجراءات
              </li>
              <li className="fs-3 my-3">
                نهدف لأن نكون شريك نجاح استراتيجي لعملائنا، عبر تقديم خدمات
                سريعة، دقيقة، وبأسعار تنافسية مدروسة.
              </li>
            </ul>
          </div>
          <div className="col-md-6 my-5">
            <div className="about-image">
              <img className="w-100" src={aboutUs} alt="شركة الزبير " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
