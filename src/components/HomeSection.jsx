import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const HomeSection = ({ isActive, isBackSection, onNavigateContact }) => {
  const typingRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typingRef.current, {
      strings: ["Web Developer", "Software Developer", "guy with a big love with mew mew"],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleDownloadCv = (e) => {
    e.preventDefault();
    onNavigateContact();

    const link = document.createElement("a");
    link.href = "files/BUI_XUAN_SON_CV.pdf";
    link.download = "BUI_XUAN_SON_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              I am a 4th-year IT student with a strong passion for web development, especially in backend. I am eager to learn new technologies, improve my problem-solving skills, and continuously grow in a professional environment. With adaptability, responsibility, and the ability to work under pressure, I am ready to contribute to team success and commit to long-term development with the company.
            </p>
            <a
              href="#contact"
              className="btn download-cv"
              onClick={handleDownloadCv}
            >
              Download CV
            </a>
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
