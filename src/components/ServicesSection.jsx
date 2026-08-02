import React from "react";

const servicesData = [
  {
    icon: "fa fa-solid fa-code",
    title: "Frontend Development",
    desc: "Crafting responsive, user-friendly, and visually appealing interfaces using modern web technologies. Skilled in HTML, CSS, JavaScript, React, Next and UI frameworks to deliver seamless user experiences across all devices."
  },
  {
    icon: "fa fa-solid fa-server",
    title: "Backend Development",
    desc: "Building secure and efficient server-side systems. Experienced in PHP (Laravel), Node with Express and Nest and Java to design APIs, manage databases, and ensure system stability and scalability."
  },
  {
    icon: "fa fa-solid fa-palette",
    title: "UI/UX Design",
    desc: "Designing intuitive layouts and prototypes with Figma and Canva. Focus on clean, consistent, and user-centered design principles to enhance usability and brand identity."
  },
  {
    icon: "fa fa-solid fa-cubes",
    title: "Software Development",
    desc: "Developing tailored software solutions with an emphasis on functionality, maintainability, and performance. Able to translate business requirements into effective digital products."
  },
  {
    icon: "fa fa-solid fa-file-word",
    title: "Presentation & Productivity Tools",
    desc: "Proficient in PowerPoint, Word, Excel, and Canva for creating professional presentations and reports that effectively communicate ideas and data."
  },
  {
    icon: "fa fa-solid fa-chart-line",
    title: "Data Analysis",
    desc: "Collecting, cleaning, and analyzing data to extract meaningful insights. Skilled in using tools like SQL and visualization platforms to support data-driven decision making."
  }
];

const ServicesSection = ({ isActive, isBackSection }) => {
  return (
    <section
      className={`service section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="services"
    >
      <div className="container">
        <div className="row">
          <div className="section-title padd-15">
            <h2>Services</h2>
          </div>
        </div>
        <div className="row">
          {servicesData.map((service, index) => (
            <div key={index} className="service-item padd-15">
              <div className="service-item-inner">
                <div className="icon">
                  <i className={service.icon}></i>
                </div>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
