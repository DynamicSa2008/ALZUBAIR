import React from "react";
import logo from "../../Images/Alzubairlogo.png";

export default function Footer() {
  return (
    <>
      <div className="Footer mt-5 py-5 bg-dark">
        <div className="container">
          <div className="row g-4 text-center text-md-start">

            {/* خدماتنا */}
            <div className="col-12 col-md-3">
              <h4 className="text-light mb-3">خدماتنا</h4>

              <ul className="list-unstyled text-light footer-links">
                <li>
                 
                  تسجيل العلامة التجارية
                   <i className="fa-solid fa-trademark me-2"></i>
                </li>

                <li>
                  
                  ترجمة العلامة التجارية
                  <i className="fa-solid fa-language me-2"></i>
                </li>

                <li>
                 
                  الترجمة المعتمدة
                   <i className="fa-solid fa-certificate me-2"></i>
                </li>

                <li>
                 
                  تصميم الهوية التجارية
                   <i className="fa-solid fa-pen-nib me-2"></i>
                </li>
              </ul>
            </div>

            {/* روابط هامة */}
            <div className="col-12 col-md-3">
              <h4 className="text-light mb-3">روابط هامة</h4>

              <ul className="list-unstyled footer-links">
                <li>
                  <a href="#about" className="text-light text-decoration-none">
                    
                    من نحن
                    <i className="fa-solid fa-user me-2"></i>
                  </a>
                </li>

                <li>
                  <a href="#contact" className="text-light text-decoration-none">
                  
                    تواصل معنا
                      <i className="fa-solid fa-envelope me-2"></i>
                  </a>
                </li>

                <li>
                  <a href="#blog" className="text-light text-decoration-none">
                   
                    المدونة
                     <i className="fa-solid fa-blog me-2"></i>
                  </a>
                </li>
              </ul>
            </div>

            {/* تواصل معنا */}
            <div className="col-12 col-md-3">
              <h4 className="text-light mb-3">تواصل معنا</h4>

              <ul className="list-unstyled text-light footer-links">

                <li>
                  
                  <span dir="ltr">+966 54 929 1853</span>
                  <i className="fa-solid fa-phone me-2"></i>
                </li>

                <li>
                 
                  <a
                    href="https://wa.me/966549291853"
                    className="text-light text-decoration-none"
                  >
                    واتساب
                  </a>
                   <i className="fa-brands fa-whatsapp me-2 text-success"></i>
                </li>

                <li>
                 
                  <a
                    href="mailto:Info@trademarks-sa.com"
                    className="text-light text-decoration-none"
                  >
                    Info@trademarks-sa.com
                  </a>
                   <i className="fa-solid fa-envelope me-2"></i>
                </li>

                <li>
                 
                  الرياض - حي الملز
                  <br />
                  شارع الستين - بجوار دوار الكويت
                   <i className="fa-solid fa-location-dot me-2"></i>
                </li>

              </ul>
            </div>

            {/* اللوجو */}
            <div className="col-12 col-md-3 text-center">
              <img src={logo} className="w-75 mb-3" alt="Logo" />

              <p className="text-light small">
                شركة متخصصة في تسجيل العلامات التجارية والخدمات القانونية
                المتعلقة بالملكية الفكرية في المملكة العربية السعودية.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* copyright */}
      <footer className="bg-black text-center text-light py-3">
        © جميع الحقوق محفوظة لشركة الزبير
      </footer>
    </>
  );
}