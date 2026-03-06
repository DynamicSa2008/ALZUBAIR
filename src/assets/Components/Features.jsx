import React from "react";
import feature1 from "../Images/Feature1.jpg";
import feature2 from "../Images/Feature2.jpg";
import feature3 from "../Images/Feature3.jpg";
import feature4 from "../Images/Feature4.jpg";
export default function Features() {
  return (
    <>
      <div id="features" className="about-section my-5">
        <h3 className="fs-1 text-center mt-5">ما الذي يميز شركة الزبير؟</h3>
        <hr />
        <div className="container">
          <div className="row">
            <div className="col-md-6 my-4">
              <div className="card1">
                <div className="backgroundImg">
                  <img src={feature3} alt="Feature1" className="w-100" />
                </div>
                <div className="card-details">
                  <div className="Caption">
                    <h4 className="d-block fs-3">فريق عمل إحترافي</h4>
                    <p>
                      خبراء قانونيون ومترجمون ومصممون
                      <br /> يعملون بتناغم كامل.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 my-4">
              <div className="card1">
                <div className="backgroundImg">
                  <img src={feature4} alt="Feature1" className="w-100" />
                </div>
                <div className="card-details">
                  <div className="Caption">
                    <h4 className="d-block fs-3">الخبرة المتخصصة </h4>
                    <p>
                      سنوات من الخبرة في تسجيل العلامة التجارية
                      <br /> وترجمة العلامة التجارية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 my-4">
              <div className="card1">
                <div className="backgroundImg">
                  <img src={feature1} alt="Feature1" className="w-100" />
                </div>
                <div className="card-details">
                  <div className="Caption">
                    <h4 className="d-block fs-3">أسعار تنافسية مدروسة</h4>
                    <p>نوازن بين الجودة العالية والتكلفة المناسبة.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 my-4">
              <div className="card1">
                <div className="backgroundImg">
                  <img src={feature2} alt="Feature1" className="w-100" />
                </div>
                <div className="card-details">
                  <div className="Caption">
                    <h4 className="d-block fs-3">
                      مجموعة من الخدمات المتكاملة
                    </h4>
                    <p>
                      من تسجيل العلامة التجارية إلى بناء الهوية <br /> والتصميم.
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
