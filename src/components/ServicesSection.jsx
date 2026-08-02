import React from "react";

const servicesData = [
  {
    icon: "fa fa-solid fa-code",
    title: "Fullstack Development",
    desc: "Crafting comprehensive, scalable fullstack web and mobile solutions. Proficient in Node.js, Express, React, Java, PHP (Laravel), and React Native to build robust client-server applications."
  },
  {
    icon: "fa fa-solid fa-chart-line",
    title: "Quant Finance Developer",
    desc: "Building quantitative trading systems, financial modeling tools, and high-frequency data processing pipelines tailored for quantitative finance algorithms."
  },
  {
    icon: "fa fa-solid fa-database",
    title: "Data Analyst",
    desc: "Collecting, cleaning, transforming, and analyzing complex datasets to extract actionable business and financial insights using SQL, Python, and modern visualization tools."
  },
  {
    icon: "fa fa-solid fa-robot",
    title: "AI Engineering Application",
    desc: "Integrating state-of-the-art Artificial Intelligence, Machine Learning, and LLM models into production web applications to automate workflows and enhance predictive capabilities."
  },
  {
    icon: "fa fa-solid fa-cubes",
    title: "Software Development",
    desc: "Developing tailored software solutions with an emphasis on performance, maintainability, and clean architecture based on complex domain requirements."
  },
  {
    icon: "fa fa-solid fa-wrench",
    title: "Dev Tools & IT Workflow",
    desc: "Proficient in industry-standard developer tools including Git & GitHub, Postman API Testing, Vercel deployment, Docker basics, Linux/Terminal, and office productivity tools (Word, Excel, PowerPoint)."
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
