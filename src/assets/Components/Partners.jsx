import React from "react";
import slogan1 from "../Images/slogan1.jpeg";
import slogan2 from "../Images/slogan2.jpeg";
import slogan3 from "../Images/slogan3.jpeg";
import slogan4 from "../Images/slogan4.jpeg";
import slogan5 from "../Images/slogan5.jpeg";
import slogan6 from "../Images/slogan6.jpeg";
import slogan7 from "../Images/slogan7.jpeg";
import slogan8 from "../Images/slogan8.jpeg";
import slogan9 from "../Images/slogan9.jpeg";
import slogan10 from "../Images/slogan10.jpeg";
import slogan11 from "../Images/slogan11.jpeg";
import slogan12 from "../Images/slogan12.jpeg";
import slogan13 from "../Images/slogan13.jpeg";
import slogan14 from "../Images/slogan14.jpeg";
import slogan15 from "../Images/slogan15.jpeg";
import slogan16 from "../Images/slogan16.jpeg";
import slogan17 from "../Images/slogan17.jpeg";
import slogan18 from "../Images/slogan18.jpeg";
import slogan19 from "../Images/slogan19.jpeg";
import slogan20 from "../Images/slogan20.jpeg";
import slogan21 from "../Images/slogan21.jpeg";
import slogan22 from "../Images/slogan22.jpeg";
import slogan23 from "../Images/slogan23.jpeg";
import slogan24 from "../Images/slogan24.jpeg";
import slogan25 from "../Images/slogan25.jpeg";
import slogan26 from "../Images/slogan26.jpeg";

export default function Partners() {

  const logos = [slogan1, slogan2, slogan3, slogan4, slogan5,slogan6,slogan7,slogan8,slogan9,slogan10,slogan11,slogan12,slogan13,slogan14,slogan15,slogan16,slogan17,slogan18,slogan19,slogan20,slogan21,slogan22,slogan23,slogan24,slogan25,slogan26,];

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

          {/* {logos.map((logo, index) => (
            <div className="logo-item" key={"dup"+index}>
              <img src={logo} alt="Partner logo" />
            </div>
          ))} */}
        </div>
      </div>

    </div>
  );
}