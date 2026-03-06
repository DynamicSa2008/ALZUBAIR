import React from "react";
import logo from "../../Images/Alzubairlogo.png";
export default function Footer() {
  return (
    <>
      <div className="Footer mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h4 className="text-light">خدماتنا</h4>
              <p className="fs-5 text-light">
                تسجيل العلامة التجارية ترجمة العلامة التجارية الترجمة المعتمدة
                تصميم الهوية التجارية
              </p>
            </div>
            <div className="col-md-3">
              <h4 className="text-light">روابط هامة</h4>
              <ul>
                <li>
                  <a href="#about">من نحن </a>
                </li>
                <li>
                  <a href="#contact">تواصل معنا</a>
                </li>
                <li>
                  <a href="#blog">المدونة</a>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h4 className="text-light">تواصل معنا</h4>
            </div>
            <div className="col-md-3">
              <img src={logo} className="w-50" alt="Logo" />
            </div>
          </div>
        </div>
      </div>
      <footer className=" py-4">
        <span className="text-center fs-5">
          © جميع الحقوق محفوظة لشركة الزبير
        </span>
      </footer>
    </>
  );
}
