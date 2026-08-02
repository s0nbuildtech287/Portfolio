import React from "react";

const PortfolioSection = ({ isActive, isBackSection }) => {
  return (
    <section
      className={`portfolio section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="projects"
    >
      <div className="container">
        <div className="row">
          <div className="section-title padd-15">
            <h2>Projects</h2>
          </div>
        </div>
        <div className="row">
          <div className="portfolio-heading padd-15">
            <h2>My Last Projects :</h2>
          </div>
        </div>
        <div className="row">
          <div className="padd-15" style={{ flex: "0 0 100%", maxWidth: "100%" }}>
            <div
              className="shahow-dark"
              style={{
                backgroundColor: "var(--bg-black-100)",
                border: "1px solid var(--bg-black-50)",
                borderRadius: "10px",
                padding: "50px 20px",
                textAlign: "center"
              }}
            >
              <i className="fa fa-briefcase" style={{ fontSize: "40px", color: "var(--skin-color)", marginBottom: "20px" }}></i>
              <h3 style={{ fontSize: "22px", color: "var(--text-black-900)", marginBottom: "10px" }}>
                Dự Án Mới Đang Được Cập Nhật
              </h3>
              <p style={{ color: "var(--text-black-700)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
                Các dự án thực tế mới về <strong>Quant Finance</strong>, <strong>Data Analysis</strong> và <strong>AI Engineering Application</strong> đang được hoàn thiện và sẽ sớm công bố tại đây.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
