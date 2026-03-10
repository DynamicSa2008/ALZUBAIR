import React from "react";

export default function WhatsAppButton() {
  return (
    <a
    // href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}