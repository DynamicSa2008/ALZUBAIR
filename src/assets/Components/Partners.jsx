import React from "react";
import slogan1 from "../Images/slogan1.webp";
import slogan2 from "../Images/slogan2.webp";
import slogan3 from "../Images/sloagn3.webp";
import slogan4 from "../Images/slogan4.webp";
import slogan5 from "../Images/slogan5.webp";

export default function Partners() {
  return (
    <>
      <div className="container mt-5 partners-section">
        <div className="about-section my-5">
          <h3 className="fs-1 text-center mt-5">شركاء نجاح شركة الزبير</h3>
          <hr />
          <p className="fs-4 text-center mt-4">
            نفخر بثقة عملائنا وشركائنا الاستراتيجيين الذين اختارونا لإدارة ملفات
            تسجيل العلامة التجارية الخاصة بهم وبناء هوياتهم التجارية.
          </p>
        </div>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-12 ">
            <div
              id="carouselExampleInterval"
              className="carousel slide text-center"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="1000">
                  <img src={slogan1} className="" alt="Alzubair slogan" />
                </div>
                <div className="carousel-item" data-bs-interval="">
                  <img src={slogan2} className="" alt="Alzubair slogan" />
                </div>
                <div className="carousel-item " data-bs-interval="1000">
                  <img src={slogan3} className=" " alt="Alzubair slogan" />
                </div>
                <div className="carousel-item" data-bs-interval="1000">
                  <img src={slogan4} className=" " alt="Alzubair slogan" />
                </div>
                <div className="carousel-item" data-bs-interval="1000">
                  <img src={slogan5} className="" alt="Alzubair slogan" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
