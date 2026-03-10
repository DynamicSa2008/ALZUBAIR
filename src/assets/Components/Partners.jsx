import React from "react";
import slogan1 from "../Images/slogan1.webp";
import slogan2 from "../Images/slogan2.webp";
import slogan3 from "../Images/sloagn3.webp";
import slogan4 from "../Images/slogan4.webp";
import slogan5 from "../Images/slogan5.webp";

export default function Partners() {

  const logos = [slogan1, slogan2, slogan3, slogan4, slogan5];

  return (
    <div className="container mt-5 partners-section">
      
      <div className="about-section my-5">
        <h3 className="fs-1 text-center mt-5">شركاء نجاح شركة الزبير</h3>
        <hr />
        <p className="fs-4 text-center mt-4">
          نفخر بثقة عملائنا وشركائنا الاستراتيجيين الذين اختارونا لإدارة ملفات
          تسجيل العلامة التجارية الخاصة بهم وبناء هوياتهم التجارية.
        </p>
      </div>

      <div className="logo-slider">
        <div className="logo-track">

          {logos.map((logo, index) => (
            <div className="logo-item" key={index}>
              <img src={logo} alt="Partner logo" />
            </div>
          ))}

          {logos.map((logo, index) => (
            <div className="logo-item" key={"dup"+index}>
              <img src={logo} alt="Partner logo" />
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}