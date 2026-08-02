import React, { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Sondeptrai123@k";

const PortfolioSection = ({ isActive, isBackSection }) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // State xác thực Admin (Lưu Session)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // States cho Auth
  const [inputPass, setInputPass] = useState("");
  const [passError, setPassError] = useState("");

  // States cho Form Thêm Dự Án
  const [imageType, setImageType] = useState("file"); // "file" hoặc "url"
  const [image, setImage] = useState("");
  const [purpose, setPurpose] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // States duy nhất cho Upload file README (.md / .txt)
  const [readmeFileName, setReadmeFileName] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [readmeUrl, setReadmeUrl] = useState("");

  // State cho Viewer xem chi tiết README Popup
  const [activeReadmeProject, setActiveReadmeProject] = useState(null);

  // 1. Load dự án đã lưu & Khôi phục Admin Session từ sessionStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio_user_projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (err) {
        console.error("Failed to parse stored projects:", err);
      }
    }

    const adminSession = sessionStorage.getItem("portfolio_admin_session");
    if (adminSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Xử lý khi chọn file ảnh từ máy tính (Tải & lưu vào ổ cứng images/projects/)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dung lượng file ảnh quá lớn (vui lòng chọn file nhỏ hơn 5MB)!");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        try {
          // Gửi dữ liệu tới API Middleware để ghi file vào thư mục images/projects
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "image",
              fileName: file.name,
              base64Content: base64Data
            })
          });
          const resData = await response.json();
          if (resData.success) {
            setImage(resData.url); // Đường dẫn ảnh lưu trên ổ cứng: /images/projects/...
          } else {
            setImage(base64Data); // Fallback base64
          }
        } catch (err) {
          console.error("Server upload error:", err);
          setImage(base64Data); // Fallback base64
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi Upload file README (.md hoặc .txt) từ máy tính (Tải & lưu vào ổ cứng readmee/)
  const handleReadmeFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const textData = reader.result;
        setReadmeContent(textData);
        setReadmeFileName(file.name);

        try {
          // Gửi dữ liệu tới API Middleware để ghi file vào thư mục readmee
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "readme",
              fileName: file.name,
              textContent: textData
            })
          });
          const resData = await response.json();
          if (resData.success) {
            setReadmeUrl(resData.url); // Đường dẫn file README lưu trên ổ cứng: /readmee/...
          }
        } catch (err) {
          console.error("Server upload error:", err);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  // Xử lý mở Modal Admin
  const handleOpenAddModal = () => {
    setInputPass("");
    setPassError("");
    setShowModal(true);
  };

  // Xác thực mật khẩu Admin & Lưu Session
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (inputPass === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("portfolio_admin_session", "true");
      setPassError("");
    } else {
      setPassError("Mật khẩu không chính xác!");
    }
  };

  // Xử lý Thêm dự án mới
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
      deployUrl: deployUrl.trim() || "#",
      readmeFileName: readmeFileName,
      readmeContent: readmeContent,
      readmeUrl: readmeUrl
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("portfolio_user_projects", JSON.stringify(updatedProjects));

    // Reset form & Đóng modal
    setImage("");
    setPurpose("");
    setDeployUrl("");
    setReadmeFileName("");
    setReadmeContent("");
    setReadmeUrl("");
    setShowModal(false);
  };

  // Xóa dự án
  const handleDeleteProject = (id) => {
    if (!isAuthenticated) {
      const pass = prompt("Nhập mật khẩu Admin để xóa dự án:");
      if (pass !== ADMIN_PASSWORD) {
        alert("Mật khẩu không đúng!");
        return;
      }
      setIsAuthenticated(true);
      sessionStorage.setItem("portfolio_admin_session", "true");
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
              title={isAuthenticated ? "Admin: Thêm dự án mới" : "Admin: Đăng nhập & Thêm dự án"}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: isAuthenticated ? "var(--skin-color)" : "transparent",
                border: "1px solid var(--skin-color)",
                color: isAuthenticated ? "#fff" : "var(--skin-color)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                transition: "all 0.3s ease",
                opacity: 0.9
              }}
            >
              <i className="fa fa-plus"></i>
            </button>

            {isAuthenticated && (
              <span style={{ fontSize: "12px", color: "var(--skin-color)", fontWeight: "600" }}>
                ✓ Admin Mode Active
              </span>
            )}
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
                    height: "270px",
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

                  {/* Nội dung Mục đích & Links */}
                  <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "14px", color: "var(--text-black-900)", fontWeight: "500", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {proj.purpose}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        {/* Nút Xem README */}
                        {proj.readmeContent && (
                          <button
                            onClick={() => setActiveReadmeProject(proj)}
                            style={{ background: "none", border: "none", padding: 0, fontSize: "12px", color: "var(--text-black-900)", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                            title="Xem README chi tiết"
                          >
                            <i className="fa fa-book-open" style={{ fontSize: "12px", color: "var(--skin-color)" }}></i> README
                          </button>
                        )}

                        {proj.deployUrl && proj.deployUrl !== "#" && (
                          <a
                            href={proj.deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: "var(--skin-color)", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "3px" }}
                            title="Xem Demo / Deploy"
                          >
                            <i className="fa fa-external-link-alt"></i> Deploy
                          </a>
                        )}
                      </div>

                      {isAuthenticated && (
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
                          title="Xóa dự án"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Popup Xem Nội Dung File README Chi Tiết */}
      {activeReadmeProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setActiveReadmeProject(null)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-black-100)",
              border: "1px solid var(--bg-black-50)",
              borderRadius: "15px",
              maxWidth: "650px",
              width: "100%",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", borderBottom: "1px solid var(--bg-black-50)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa fa-book-open" style={{ fontSize: "18px", color: "var(--skin-color)" }}></i>
                <h3 style={{ fontSize: "18px", color: "var(--text-black-900)", fontWeight: "700", margin: 0 }}>
                  {activeReadmeProject.readmeFileName || "README.md"} - Chi Tiết Dự Án
                </h3>
              </div>
              <button
                onClick={() => setActiveReadmeProject(null)}
                style={{ background: "none", border: "none", color: "var(--text-black-900)", fontSize: "18px", cursor: "pointer" }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px", backgroundColor: "var(--bg-black-900)", borderRadius: "8px", border: "1px solid var(--bg-black-50)" }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "14px", color: "var(--text-black-900)", margin: 0, lineHeight: "1.6" }}>
                {activeReadmeProject.readmeContent}
              </pre>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button
                onClick={() => setActiveReadmeProject(null)}
                className="btn"
                style={{ padding: "8px 22px" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
              maxWidth: "500px",
              width: "100%",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--text-black-900)", fontWeight: "700" }}>
                {isAuthenticated ? "Thêm Dự Án Mới (Admin Mode Active)" : "Xác Thực Mật Khẩu Admin"}
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
              /* Bước 2: Form Nhập Dự Án */
              <form onSubmit={handleAddProject}>
                {/* Trường 1: Ảnh Dự Án */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "8px" }}>
                    1. Ảnh Dự Án (Upload lưu thẳng vào images/projects/)
                  </label>

                  <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <button
                      type="button"
                      onClick={() => { setImageType("file"); setImage(""); }}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "13px",
                        borderRadius: "6px",
                        border: "1px solid var(--skin-color)",
                        backgroundColor: imageType === "file" ? "var(--skin-color)" : "transparent",
                        color: imageType === "file" ? "#fff" : "var(--text-black-900)",
                        cursor: "pointer"
                      }}
                    >
                      <i className="fa fa-upload"></i> Upload từ máy tính
                    </button>
                    <button
                      type="button"
                      onClick={() => { setImageType("url"); setImage(""); }}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        fontSize: "13px",
                        borderRadius: "6px",
                        border: "1px solid var(--skin-color)",
                        backgroundColor: imageType === "url" ? "var(--skin-color)" : "transparent",
                        color: imageType === "url" ? "#fff" : "var(--text-black-900)",
                        cursor: "pointer"
                      }}
                    >
                      <i className="fa fa-link"></i> Dán Link URL ảnh
                    </button>
                  </div>

                  {imageType === "file" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                    />
                  )}

                  {uploading && <p style={{ fontSize: "12px", color: "var(--skin-color)", marginTop: "4px" }}>Đang lưu file lên máy tính...</p>}

                  {image && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-black-700)", marginBottom: "4px" }}>Xem trước ảnh (Lưu tại {image}):</p>
                      <img
                        src={image}
                        alt="Preview"
                        style={{ height: "100px", maxWidth: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--bg-black-50)" }}
                      />
                    </div>
                  )}
                </div>

                {/* Trường 2: Mục Đích / Mô Tả */}
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

                {/* Trường 3: Link Deploy */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    3. Link Deploy (Vercel / Website Link)
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

                {/* Trường 4: Upload File README (.md / .txt) lưu thẳng vào readmee/ */}
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "8px" }}>
                    4. Upload File README (.md / .txt) (Lưu thẳng vào readmee/)
                  </label>
                  <input
                    type="file"
                    accept=".md,.txt"
                    onChange={handleReadmeFileUpload}
                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                  />
                  {readmeFileName && (
                    <p style={{ fontSize: "12px", color: "var(--skin-color)", marginTop: "6px", fontWeight: "600" }}>
                      ✓ Đã lưu file vào thư mục readmee/{readmeFileName}
                    </p>
                  )}
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
                  <button type="submit" className="btn" style={{ padding: "8px 22px" }} disabled={uploading}>
                    {uploading ? "Đang lưu..." : "Lưu Dự Án"}
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
