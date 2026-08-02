import React from "react";

const AboutSection = ({ isActive, isBackSection, onNavigateContact }) => {
  return (
    <section
      className={`about section ${isActive ? "active" : ""} ${isBackSection ? "back-section" : ""}`}
      id="about"
    >
      <div className="container">
        <div className="row">
          <div className="section-title padd-15">
            <h2>About Me</h2>
          </div>
        </div>
        <div className="row">
          <div className="about-content padd-15">
            <div className="row">
              <div className="about-text padd-15">
                <h3>
                  Hi, I'm Xuan Son and I am a<span> Software Developer </span>
                </h3>
                <p>Below is some information about myself and some basic tech skills I have.</p>
              </div>
            </div>
            <div className="row">
              <div className="personal-info padd-15">
                <div className="row">
                  <div className="info-item padd-15">
                    <p>Birthday : <span>28 July 2004</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Age : <span>21</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Website : <span>www.xson.vn</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Email : <span>buixu4ns0n@gmail.com</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Degree : <span>B.S. in Information Systems</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Phone : <span>086.609.7785</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>City : <span>Ha Noi</span></p>
                  </div>
                  <div className="info-item padd-15">
                    <p>Freelance : <span>Freelance Available</span></p>
                  </div>
                </div>
                <div className="row">
                  <div className="buttons padd-15">
                    <a
                      href="#contact"
                      className="btn hire-me"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateContact();
                      }}
                    >
                      Hire me
                    </a>
                  </div>
                </div>
              </div>
              <div className="skills padd-15">
                <div className="row">
                  <div className="skill-item padd-15">
                    <h5>HTML / CSS</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "76%" }}></div>
                      <div className="skill-percent">76%</div>
                    </div>
                  </div>
                  <div className="skill-item padd-15">
                    <h5>Bootstrap / Sass</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "80%" }}></div>
                      <div className="skill-percent">80%</div>
                    </div>
                  </div>
                  <div className="skill-item padd-15">
                    <h5>JavaScript / Typescript</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "90%" }}></div>
                      <div className="skill-percent">90%</div>
                    </div>
                  </div>
                  <div className="skill-item padd-15">
                    <h5>Node - ExpressJS / NestTS</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "80%" }}></div>
                      <div className="skill-percent">80%</div>
                    </div>
                  </div>
                  <div className="skill-item padd-15">
                    <h5>React</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "80%" }}></div>
                      <div className="skill-percent">80%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="education padd-15">
                <h3 className="title">Education</h3>
                <div className="row">
                  <div className="timeline-box padd-15">
                    <div className="timeline shahow-dark">
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2019 - 2022</h3>
                        <h4 className="timeline-title">High School Diploma - Quang Trung High School, Ha Dong</h4>
                        <p className="timeline-text">
                          During my time at Quang Trung High School, I focused on building a strong foundation in information technology and participated in various academic activities. I achieved second place in the school-level informatics competition, which sparked my interest in programming and problem-solving skills.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2023 - 2024</h3>
                        <h4 className="timeline-title">Outstanding Scholarship - Semester 1, Thuy Loi University</h4>
                        <p className="timeline-text">
                          In my second year at Thuy Loi University, majoring in Information Systems, I earned an outstanding scholarship for Semester 1 with a perfect GPA of 4.0. I excelled in key subjects such as Object-Oriented Programming (OOP), Web Technology, Web Foundations, and Database Systems, achieving A grades in all, which strengthened my technical skills in software development and data management.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2024 - 2025</h3>
                        <h4 className="timeline-title">Outstanding Scholarship - Semester 2, Thuy Loi University</h4>
                        <p className="timeline-text">
                          Continuing my studies at Thuy Loi University in Information Systems, I received another outstanding scholarship for Semester 2 with a GPA of 3.6. This period involved advanced coursework in areas like software engineering, network security, and project management, where I applied practical skills through group projects and hands-on labs. Maintaining high performance, I contributed to team assignments and gained deeper insights into full-stack development.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="experience padd-15">
                <h3 className="title">Experience</h3>
                <div className="row">
                  <div className="timeline-box padd-15">
                    <div className="timeline shahow-dark">
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> Feb 2022 - Mar 2023</h3>
                        <h4 className="timeline-title">Freelance Projects - Dormitory Management, Tech Store, Student Management</h4>
                        <p className="timeline-text">
                          Worked on multiple freelance projects including a dormitory management system, a tech store platform, and a student management application. Utilized PHP with Laravel and ExpressJS for backend development, while the frontend was built with HTML, CSS, and Bootstrap. Integrated React for dynamic components.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2023 - 2024</h3>
                        <h4 className="timeline-title">Data Classification and Clustering Project</h4>
                        <p className="timeline-text">
                          Participated in a personal project focused on data classification and clustering, involving the training of machine learning models. Explored algorithms such as K-Means, Hierarchical Clustering, and Support Vector Machines (SVM) to analyze datasets using Python, Scikit-learn, and TensorFlow.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> Jan 2025 - May 2025</h3>
                        <h4 className="timeline-title">Backend Developer Intern - TCOM Corporation</h4>
                        <p className="timeline-text">
                          Completed a 5-month internship as a Backend Developer at TCOM Corporation, contributing to two projects: Motoya (a Japanese second-hand goods trading platform) and Flamigo (a travel company website). Developed CRUD APIs using NodeJS and ExpressJS, implemented client feedback, and improved system performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
