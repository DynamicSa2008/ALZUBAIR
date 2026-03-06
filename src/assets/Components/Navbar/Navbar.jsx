import React from "react";
import logo from "../../Images/Alzubairlogo.png";
export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="شعار الزبير لترجمة وتسجيل العلامة التجارية" />
          </a>
          <button
            className="navbar-toggler bg-light border-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link text-light active fw-bold"
                  aria-current="page"
                  href="#"
                >
                  الرئيسية
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#services">
                  {" "}
                  خدماتنا
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#about">
                  {" "}
                  من نحن
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#contact">
                  {" "}
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
