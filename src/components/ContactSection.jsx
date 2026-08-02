import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const ContactSection = ({ isActive, isBackSection }) => {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formRef.current) return;

    // 1. Anti-Spam: Bẫy Honeypot Field (Bot tự động điền sẽ bị chặn ngay)
    const honeypot = formRef.current.elements["bot_field"]?.value;
    if (honeypot) {
      // Giả lập thành công đối với Bot để Bot dừng spam mà không tốn EmailJS quota
      alert("Message sent successfully!");
      formRef.current.reset();
      return;
    }

    // 2. Anti-Spam: Rate Limiting (Giới hạn 60 giây mới cho gửi lại 1 lần)
    const lastSent = localStorage.getItem("contact_last_sent");
    const now = Date.now();
    const COOLDOWN_TIME = 60000; // 60s

    if (lastSent && now - parseInt(lastSent, 10) < COOLDOWN_TIME) {
      const waitSeconds = Math.ceil((COOLDOWN_TIME - (now - parseInt(lastSent, 10))) / 1000);
      alert(`Bạn vừa gửi tin nhắn xong. Vui lòng chờ ${waitSeconds} giây nữa trước khi gửi tiếp để tránh bị spam!`);
      return;
    }

    // 3. Kiểm tra độ dài tin nhắn tối thiểu
    const message = formRef.current.elements["message"]?.value || "";
    if (message.trim().length < 5) {
      alert("Vui lòng nhập nội dung tin nhắn chi tiết hơn (tối thiểu 5 ký tự)!");
      return;
    }

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
          // Lưu thời điểm gửi thành công để kích hoạt Cooldown
          localStorage.setItem("contact_last_sent", Date.now().toString());
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
            {/* Honeypot Field ẩn - Bẫy chống Bot Spam tự động */}
            <input
              type="text"
              name="bot_field"
              tabIndex="-1"
              autoComplete="off"
              style={{ display: "none", position: "absolute", left: "-9999px" }}
            />

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
