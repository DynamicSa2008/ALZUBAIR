import React from "react";
import service1 from "../Images/تصميم الهوية وبناء العلامة التجارية.webp";
import service2 from "../Images/خدمة طباعة المخططات الهندسية بدقة وموثوقية.webp";
import service3 from "../Images/خدمة تسجيل العلامة التجارية.webp";
import service4 from "../Images/خدمة ترجمة العلامة التجارية المعتمدة.webp";
import service5 from "../Images/خدمات التجليد والتغليف الإحترافية.webp";
import service6 from "../Images/خدمات الدعايا والإعلان المتكاملة.webp";
import service7 from "../Images/خدمات الترجمة المعتمدة للوثائق التجارية.webp";
import service8 from "../Images/خدمات الطباعة الإحترافية للعلامة التجارية.webp";
export default function Services() {
  return (
    <>
      <div id="services" className="services-section">
        <div className="container">
          <div className="services-intro text-center text-light py-4">
            <h2>خدماتنا</h2>
            <hr />
            <p>
              نقدم حلولاً متكاملة في تسجيل العلامة التجارية و ترجمة العلامة
              التجارية باحترافية عالية
              <br />، وسرعة تنفيذ، وإجراءات دقيقة تضمن لك الانطلاق بثقة في السوق
              المحلي والدولي.
            </p>
          </div>
          {/* services Cards */}
          <div className="row ">
            <div className="col-md-3 my-2">
              <div className="card-1 ">
                <img
                  className="w-100"
                  src={service1}
                  alt="تصميم الهوية وبناء العلامة التجارية"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service2}
                  alt="طباعة المخططات الهندسية بدقة وموثوقية"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service3}
                  alt="تسجيل العلامة التجارية"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service4}
                  alt="ترجمة العلامة التجارية المعتمدة"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service5}
                  alt="خدمات التغليف والتجليد الاحترافية"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service6}
                  alt="خدمات الدعايا والاعلان المتكاملة"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service7}
                  alt="خدمات الترجمة المعتمدة للوثائق التجارية"
                />
              </div>
            </div>
            <div className="col-md-3 my-2">
              <div className="card-1">
                <img
                  className="w-100"
                  src={service8}
                  alt="خدمة الطباعة الاحترافية للعلامة التجارية"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
