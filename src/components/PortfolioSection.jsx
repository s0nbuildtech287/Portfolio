import React from "react";

const portfolioImages = [
  "images/portfolio/project-1.jpg",
  "images/portfolio/project-2.jpg",
  "images/portfolio/project-3.jpg",
  "images/portfolio/project-4.png",
  "images/portfolio/project-5.jpg",
  "images/portfolio/project-6.png",
];

const PortfolioSection = ({ isActive, isBackSection }) => {
  return (
    <section
      className={`portfolio section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="portfolio"
    >
      <div className="container">
        <div className="row">
          <div className="section-title padd-15">
            <h2>Portfolio</h2>
          </div>
        </div>
        <div className="row">
          <div className="portfolio-heading padd-15">
            <h2>My Last Projects :</h2>
          </div>
        </div>
        <div className="row">
          {portfolioImages.map((imgSrc, index) => (
            <div key={index} className="portfolio-item padd-15">
              <div className="portfolio-item-inner shadow-dark">
                <div className="portfolio-img">
                  <img src={imgSrc} alt={`Project ${index + 1}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
