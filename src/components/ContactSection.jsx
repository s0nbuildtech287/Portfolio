import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactSection = ({ isActive, isBackSection }) => {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        "service_ntj7u7a",
        "template_cyv4bxf",
        formRef.current,
        "xOSEf_NpfLI1RmerL"
      )
      .then(
        () => {
          setSending(false);
          alert("Message sent successfully!");
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          setSending(false);
          alert("Failed to send: " + JSON.stringify(error));
        }
      );
  };

  return (
    <section
      className={`contact section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="contact"
    >
      <div className="container">
        <div className="row">
          <div className="section-title padd-15">
            <h2>Contact Me</h2>
          </div>
        </div>
        <h3 className="contact-title padd-15">Have You Any Question ?</h3>
        <h4 className="contact-sub-title padd-15">I'M AT YOUR SERVICES</h4>
        <div className="row">
          <div className="contact-info-item padd-15">
            <div className="icon">
              <i className="fa fa-phone"></i>
            </div>
            <h4>Call Us On</h4>
            <p>0866 0977 85</p>
          </div>
          <div className="contact-info-item padd-15">
            <div className="icon">
              <i className="fa fa-map-marker-alt"></i>
            </div>
            <h4>Office</h4>
            <p>Ha Noi</p>
          </div>
          <div className="contact-info-item padd-15">
            <div className="icon">
              <i className="fa fa-envelope"></i>
            </div>
            <h4>Email</h4>
            <p>buixu4ns0n@gmail.com</p>
          </div>
          <div className="contact-info-item padd-15">
            <div className="icon">
              <i className="fa fa-globe-europe"></i>
            </div>
            <h4>Website</h4>
            <p>xson.vn</p>
          </div>
        </div>
        <h3 className="contact-title padd-15">SEND ME AN EMAIL ?</h3>
        <h4 className="contact-sub-title padd-15">I'M VERY RESPONSIVE TO MESSAGES</h4>
        <div className="row">
          <form className="contact-form padd-15" id="contactForm" ref={formRef} onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-item col-6 padd-15">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    name="name"
                    required
                  />
                </div>
              </div>
              <div className="form-item col-6 padd-15">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-item col-12 padd-15">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject"
                    name="title"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-item col-12 padd-15">
                <div className="form-group">
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-item col-12 padd-15">
                <button type="submit" className="btn" id="btnSend" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
