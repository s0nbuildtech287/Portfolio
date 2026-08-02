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
                  Hi, I'm Xuan Son and I am a<span> Fullstack Developer & Data Analyst </span>
                </h3>
                <p>Tôi đã tốt nghiệp Cử nhân Hệ thống Thông tin. Dưới đây là thông tin cá nhân và kỹ năng chuyên môn của tôi.</p>
              </div>
            </div>

            {/* Row chứa 2 cột Cân Bằng 50% - 50% */}
            <div className="row about-balanced-row">
              {/* Cột Trái: 5 Trường Thông Tin Cá Nhân */}
              <div className="personal-info padd-15">
                <div className="info-list-stacked">
                  <div className="info-item-stacked">
                    <p>Birthday : <span>28 July 2004 (21 Age)</span></p>
                  </div>
                  <div className="info-item-stacked">
                    <p>Degree : <span>B.S. in Information Systems (Graduated)</span></p>
                  </div>
                  <div className="info-item-stacked">
                    <p>English : <span>IELTS 6.0 Certificate</span></p>
                  </div>
                  <div className="info-item-stacked">
                    <p>Email & Phone : <span>buixu4ns0n@gmail.com | 086.609.7785</span></p>
                  </div>
                  <div className="info-item-stacked">
                    <p>City & Status : <span>Ha Noi (Available for Projects)</span></p>
                  </div>
                </div>

                <div className="buttons">
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

              {/* Cột Phải: 5 Thanh Kỹ Năng Song Song Bằng Nhau */}
              <div className="skills padd-15">
                <div className="skills-list-stacked">
                  <div className="skill-item">
                    <h5>Languages <span>(Python, JS/TS, Java, PHP)</span></h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "90%" }}></div>
                      <div className="skill-percent">90%</div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <h5>Fullstack Frameworks <span>(React, Node, NestJS, Laravel)</span></h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "88%" }}></div>
                      <div className="skill-percent">88%</div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <h5>AI & Data <span>(Scikit-Learn, TensorFlow, Pandas)</span></h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "85%" }}></div>
                      <div className="skill-percent">85%</div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <h5>Quant Finance Dev & Data Analytics</h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "85%" }}></div>
                      <div className="skill-percent">85%</div>
                    </div>
                  </div>

                  <div className="skill-item">
                    <h5>English Communication <span>(IELTS 6.0 Certificate)</span></h5>
                    <div className="progress">
                      <div className="progress-in" style={{ width: "75%" }}></div>
                      <div className="skill-percent">75%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Row */}
            <div className="row">
              {/* Education Timeline */}
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
                          Excelled in Mathematics and was selected to compete in the City-Level Mathematics Competition. Demonstrated a strong passion for Information Technology, achieving Second Place in the School-Level Informatics Competition, establishing a strong logical and analytical foundation.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2023 - 2025</h3>
                        <h4 className="timeline-title">4 Consecutive Outstanding Scholarships - Thuy Loi University</h4>
                        <p className="timeline-text">
                          Awarded Outstanding Scholarships for 4 consecutive semesters with top academic standing, including a perfect GPA of 4.0/4.0. Achieved A grades in key core subjects: Object-Oriented Programming (OOP), Web Technology, Database Systems, Software Engineering, and Data Structures.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2025</h3>
                        <h4 className="timeline-title">Graduated B.S. in Information Systems - Thuy Loi University</h4>
                        <p className="timeline-text">
                          Successfully graduated with a degree in Information Systems. Gained deep expertise in software engineering, fullstack development, database architecture, quantitative data analytics, and artificial intelligence applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="experience padd-15">
                <h3 className="title">Experience</h3>
                <div className="row">
                  <div className="timeline-box padd-15">
                    <div className="timeline shahow-dark">
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> 2023 - 2024</h3>
                        <h4 className="timeline-title">AI & Machine Learning Projects - University IT Club</h4>
                        <p className="timeline-text">
                          Active member of the University IT Club, developing multiple AI & ML projects in data prediction, classification, and clustering. Implemented full end-to-end ML pipelines: data preprocessing, feature engineering, model training, and performance evaluation. Applied key algorithms (K-Means, SVM, Random Forest, Decision Trees, Hierarchical Clustering) using Python, Pandas, NumPy, Scikit-learn, TensorFlow, and Matplotlib.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> Jan 2025 - May 2025</h3>
                        <h4 className="timeline-title">Backend Developer Intern - TCOM Corporation</h4>
                        <p className="timeline-text">
                          Completed a 5-month internship as a Backend Developer at TCOM Corporation, contributing to Motoya (Japanese second-hand goods trading platform) and Flamigo (travel website). Developed RESTful CRUD APIs using Node.js & Express.js.
                        </p>
                      </div>
                      <div className="timeline-item">
                        <div className="circle-dot"></div>
                        <h3 className="timeline-date"><i className="fa fa-calendar"></i> July 2025 - Present</h3>
                        <h4 className="timeline-title">Fullstack Developer & Data Analyst (Quant Finance & AI)</h4>
                        <p className="timeline-text">
                          Developing fullstack software systems tailored for Quant Finance, analyzing financial and market data datasets (Data Analyst), and researching & integrating AI Engineering Applications into trading algorithms and business workflows.
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
