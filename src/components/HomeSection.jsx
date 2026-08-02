import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const HomeSection = ({ isActive, isBackSection, onNavigateContact }) => {
  const typingRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typingRef.current, {
      strings: [
        "Fullstack Developer",
        "Quant Finance Developer",
        "Data Analyst",
        "AI Application Engineer"
      ],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleDownloadCv = (e) => {
    e.preventDefault();
    alert("CV hiện đang được cập nhật thông tin định hướng mới (Quant Finance / Fullstack / AI). Vui lòng liên hệ trực tiếp với tôi qua Email hoặc SĐT!");
    onNavigateContact();
  };

  return (
    <section
      className={`home section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="home"
    >
      <div className="container">
        <div className="row">
          <div className="home-info padd-15">
            <h3 className="hello">
              Hello, my name is <span className="name">Bùi Xuân Sơn</span>
            </h3>
            <h3 className="my-profession">
              I'm a <span ref={typingRef} className="typing"></span>
            </h3>
            <p>
              Tôi đã tốt nghiệp Đại học Thủy Lợi (chuyên ngành Hệ thống Thông tin). Hiện tại, tôi tập trung phát triển chuyên sâu với vai trò Fullstack Developer trong lĩnh vực Tài chính định lượng (Quant Finance), kết hợp Phân tích dữ liệu (Data Analyst) và nghiên cứu ứng dụng Trí tuệ nhân tạo (AI Engineering Application). Tôi đam mê giải quyết các bài toán dữ liệu phức tạp và xây dựng các sản phẩm phần mềm hiệu năng cao.
            </p>
            <button
              className="btn download-cv"
              onClick={handleDownloadCv}
              style={{ cursor: "pointer" }}
            >
              Download CV
            </button>
          </div>
          <div className="home-img padd-15">
            <img src="images/hero.jpg" alt="Bùi Xuân Sơn" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
