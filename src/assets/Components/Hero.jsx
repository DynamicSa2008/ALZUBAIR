import React from "react";
import hero from "../Images/Hero.png";
export default function Hero() {
  return (
    <>
      <div className="hero-section">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6">
              <div className="hero-image">
                <img
                  className="w-100"
                  src={hero}
                  alt="الزبير لتسجيل العلامة التجارية"
                />
              </div>
            </div>
            <div className="col-md-6 text-center mt-5">
              <p className="text-center">
                <span className="text-light mb-2 text-center hero-intro">
                  في شركة الزبير نعمل وفق رؤية استراتيجية واضحة لنكون الشريك
                  المعتمد لكل من يسعى إلى حماية علامته التجارية وتعزيز قيمتها
                  السوقية.
                </span>
              </p>
              <button className="btn btn-light px-5">تواصل معنا</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
