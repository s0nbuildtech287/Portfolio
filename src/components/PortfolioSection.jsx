import React, { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Sondeptrai123@k";

const PortfolioSection = ({ isActive, isBackSection }) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // States cho Auth
  const [inputPass, setInputPass] = useState("");
  const [passError, setPassError] = useState("");

  // States cho Form Thêm Dự Án (3 trường)
  const [image, setImage] = useState("");
  const [purpose, setPurpose] = useState("");
  const [deployUrl, setDeployUrl] = useState("");

  // Load dự án đã lưu từ localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio_user_projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (err) {
        console.error("Failed to parse stored projects:", err);
      }
    }
  }, []);

  // Xử lý mở Modal (Check nếu chưa Auth thì bắt nhập mật khẩu)
  const handleOpenAddModal = () => {
    setInputPass("");
    setPassError("");
    setShowModal(true);
  };

  // Xác thực mật khẩu Admin
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (inputPass === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassError("");
    } else {
      setPassError("Mật khẩu không chính xác!");
    }
  };

  // Xử lý Thêm dự án mới sau khi đã Auth
  const handleAddProject = (e) => {
    e.preventDefault();

    if (!purpose.trim()) {
      alert("Vui lòng nhập Mục đích / Mô tả dự án!");
      return;
    }

    const newProject = {
      id: Date.now(),
      image: image.trim() || "images/portfolio/project-1.jpg",
      purpose: purpose.trim(),
      deployUrl: deployUrl.trim() || "#"
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("portfolio_user_projects", JSON.stringify(updatedProjects));

    // Reset form & Đóng modal
    setImage("");
    setPurpose("");
    setDeployUrl("");
    setShowModal(false);
  };

  // Xóa dự án (Yêu cầu nhập mật khẩu xác nhận nếu chưa Auth)
  const handleDeleteProject = (id) => {
    if (!isAuthenticated) {
      const pass = prompt("Nhập mật khẩu Admin để xóa dự án:");
      if (pass !== ADMIN_PASSWORD) {
        alert("Mật khẩu không đúng!");
        return;
      }
      setIsAuthenticated(true);
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      const updatedProjects = projects.filter((p) => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem("portfolio_user_projects", JSON.stringify(updatedProjects));
    }
  };

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

        {/* Tiêu đề & Nút + Nhỏ tinh tế */}
        <div className="row">
          <div className="portfolio-heading padd-15" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
            <h2 style={{ margin: 0 }}>My Last Projects :</h2>
            
            {/* Nút + Nhỏ Nhắn Tinh Tế Dành Cho Admin */}
            <button
              onClick={handleOpenAddModal}
              title="Admin: Thêm dự án mới"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "1px solid var(--skin-color)",
                color: "var(--skin-color)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                transition: "all 0.3s ease",
                opacity: 0.8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--skin-color)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--skin-color)";
                e.currentTarget.style.opacity = "0.8";
              }}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>

        {/* Danh sách các dự án */}
        <div className="row">
          {projects.length === 0 ? (
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
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className="portfolio-item padd-15">
                <div
                  className="portfolio-item-inner shadow-dark"
                  style={{
                    backgroundColor: "var(--bg-black-100)",
                    borderRadius: "10px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "250px",
                    overflow: "hidden"
                  }}
                >
                  {/* Ảnh Dự Án */}
                  <div className="portfolio-img" style={{ height: "140px", overflow: "hidden" }}>
                    <img
                      src={proj.image}
                      alt="Project"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "images/portfolio/project-1.jpg";
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Nội dung Mục đích & Link Deploy */}
                  <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "14px", color: "var(--text-black-900)", fontWeight: "500", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {proj.purpose}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      {proj.deployUrl && proj.deployUrl !== "#" ? (
                        <a
                          href={proj.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "13px", color: "var(--skin-color)", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <i className="fa fa-external-link-alt"></i> Deploy Link
                        </a>
                      ) : (
                        <span style={{ fontSize: "13px", color: "var(--text-black-700)" }}>Chưa deploy</span>
                      )}

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
                        title="Xóa dự án"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Admin (Xác thực mật khẩu -> Form Thêm Dự Án) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-black-100)",
              border: "1px solid var(--bg-black-50)",
              borderRadius: "15px",
              maxWidth: "480px",
              width: "100%",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--text-black-900)", fontWeight: "700" }}>
                {isAuthenticated ? "Thêm Dự Án Mới (Admin)" : "Xác Thực Mật Khẩu Admin"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-black-900)", fontSize: "18px", cursor: "pointer" }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {!isAuthenticated ? (
              /* Bước 1: Form Nhập Mật Khẩu */
              <form onSubmit={handleVerifyPassword}>
                <p style={{ fontSize: "14px", color: "var(--text-black-700)", marginBottom: "15px" }}>
                  Vui lòng nhập mật khẩu Admin để quyền thêm mới dự án.
                </p>

                {passError && (
                  <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", fontWeight: "600" }}>
                    {passError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu Admin..."
                    required
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                    style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn"
                    style={{ background: "var(--bg-black-50)", color: "var(--text-black-900)", padding: "8px 18px" }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn" style={{ padding: "8px 22px" }}>
                    Xác Nhận
                  </button>
                </div>
              </form>
            ) : (
              /* Bước 2: Form Nhập Dự Án 3 Trường */
              <form onSubmit={handleAddProject}>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    1. Ảnh Dự Án (Link URL ảnh hoặc đường dẫn file)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://example.com/image.jpg hoặc images/portfolio/project-1.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    2. Mục Đích / Mô Tả Dự Án *
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Nhập mục đích hoặc mô tả ngắn gọn về dự án..."
                    required
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "10px 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)", resize: "vertical" }}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    3. Link Deploy (Vercel / GitHub / Website Link)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://my-app.vercel.app"
                    value={deployUrl}
                    onChange={(e) => setDeployUrl(e.target.value)}
                    style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn"
                    style={{ background: "var(--bg-black-50)", color: "var(--text-black-900)", padding: "8px 18px" }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn" style={{ padding: "8px 22px" }}>
                    Lưu Dự Án
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
