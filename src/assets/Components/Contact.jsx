import React from "react";

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div id="contact" className=" mt-5 contact-section">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center text-light mb-4">تواصل معنا</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                الإسم الأول
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="الإسم الأول"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                الإسم الآخر
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="الإسم الآخر"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="البريد الإلكتروني"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                ارسل رسالة
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="ارسل رسالة"
                required
              ></textarea>
            </div>

            <div className="text-center mt-4">
              <button className="SubmitButton w-50" type="submit">
                تقديم
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
