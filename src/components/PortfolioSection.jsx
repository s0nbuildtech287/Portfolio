import React, { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Sondeptrai123@k";

const PortfolioSection = ({ isActive, isBackSection }) => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null); // ID dự án đang chỉnh sửa
  
  // State xác thực Admin (Lưu Session)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // States cho Auth
  const [inputPass, setInputPass] = useState("");
  const [passError, setPassError] = useState("");

  // States cho Form Thêm / Chỉnh Sửa Dự Án
  const [title, setTitle] = useState(""); // Tên dự án
  const [position, setPosition] = useState(1); // Vị trí / Thứ tự hiển thị (Ví dụ: 1 đứng đầu)
  const [rating, setRating] = useState(5); // Số sao đánh giá độ hoàn thiện (1 - 5)
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

  // State cho Modal Phóng To Ảnh (Lightbox)
  const [activeImage, setActiveImage] = useState(null);

  // 1. Load dự án từ File JSON (Hoạt động hoàn hảo cả khi Deploy Vercel/Netlify) & Fallback localStorage
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response = await fetch("/api/projects");
        if (!response.ok) {
          response = await fetch("/data/projects.json");
        }
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
            localStorage.setItem("portfolio_user_projects", JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load projects from server file:", err);
      }

      // Fallback localStorage
      const savedProjects = localStorage.getItem("portfolio_user_projects");
      if (savedProjects) {
        try {
          setProjects(JSON.parse(savedProjects));
        } catch (err) {
          console.error("Failed to parse stored projects:", err);
        }
      }
    };

    fetchProjects();

    const adminSession = sessionStorage.getItem("portfolio_admin_session");
    if (adminSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Hàm đồng bộ và lưu danh sách dự án trực tiếp vào file data/projects.json trên ổ cứng
  const saveProjectsToDisk = async (newProjectsList) => {
    setProjects(newProjectsList);
    localStorage.setItem("portfolio_user_projects", JSON.stringify(newProjectsList));

    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjectsList)
      });
    } catch (err) {
      console.error("Error saving projects to server file:", err);
    }
  };

  // Xử lý tăng lượt truy cập (+1 lượt click) khi ai đó bấm vào nút Deploy
  const handleDeployClick = (projId) => {
    const updatedProjects = projects.map((p) =>
      p.id === projId ? { ...p, clicks: (p.clicks || 0) + 1 } : p
    );
    saveProjectsToDisk(updatedProjects);
  };

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
            setImage(resData.url);
          } else {
            setImage(base64Data);
          }
        } catch (err) {
          console.error("Server upload error:", err);
          setImage(base64Data);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi Upload file README (.md hoặc .txt) từ máy tính
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
            setReadmeUrl(resData.url);
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

  // Reset form dữ liệu
  const resetForm = () => {
    setTitle("");
    setPosition(projects.length + 1);
    setRating(5);
    setImage("");
    setPurpose("");
    setDeployUrl("");
    setReadmeFileName("");
    setReadmeContent("");
    setReadmeUrl("");
    setEditingProjectId(null);
  };

  // Xử lý mở Modal Thêm Mới Dự Án
  const handleOpenAddModal = () => {
    resetForm();
    setInputPass("");
    setPassError("");
    setShowModal(true);
  };

  // Xử lý mở Modal Chỉnh Sửa Dự Án
  const handleEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title || "");
    setPosition(proj.position || 1);
    setRating(proj.rating || 5);
    setImage(proj.image || "");
    setPurpose(proj.purpose || "");
    setDeployUrl(proj.deployUrl || "");
    setReadmeFileName(proj.readmeFileName || "");
    setReadmeContent(proj.readmeContent || "");
    setReadmeUrl(proj.readmeUrl || "");
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

  // Xử lý Thêm mới hoặc Cập nhật dự án
  const handleSaveProject = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập Tên dự án!");
      return;
    }

    let updatedProjects = [];

    if (editingProjectId) {
      // Cập nhật dự án sẵn có
      updatedProjects = projects.map((p) =>
        p.id === editingProjectId
          ? {
              ...p,
              title: title.trim(),
              position: Number(position) || 1,
              rating: Number(rating) || 5,
              image: image.trim() || p.image,
              purpose: purpose.trim(),
              deployUrl: deployUrl.trim() || "#",
              readmeFileName: readmeFileName || p.readmeFileName,
              readmeContent: readmeContent || p.readmeContent,
              readmeUrl: readmeUrl || p.readmeUrl
            }
          : p
      );
    } else {
      // Thêm mới dự án
      const newProject = {
        id: Date.now(),
        title: title.trim(),
        position: Number(position) || 1,
        rating: Number(rating) || 5,
        clicks: 0,
        image: image.trim() || "images/portfolio/project-1.jpg",
        purpose: purpose.trim(),
        deployUrl: deployUrl.trim() || "#",
        readmeFileName: readmeFileName,
        readmeContent: readmeContent,
        readmeUrl: readmeUrl
      };
      updatedProjects = [...projects, newProject];
    }

    saveProjectsToDisk(updatedProjects);
    resetForm();
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
      saveProjectsToDisk(updatedProjects);
    }
  };

  // Sắp xếp các dự án theo thứ tự ưu tiên (position tăng dần)
  const sortedProjects = [...projects].sort(
    (a, b) => (Number(a.position) || 99) - (Number(b.position) || 99)
  );

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
          {sortedProjects.length === 0 ? (
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
            sortedProjects.map((proj) => (
              <div key={proj.id} className="portfolio-item padd-15">
                <div
                  className="portfolio-item-inner shadow-dark"
                  style={{
                    backgroundColor: "var(--bg-black-100)",
                    border: "1px solid var(--bg-black-50)",
                    borderRadius: "14px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "290px",
                    overflow: "hidden",
                    transition: "all 0.3s ease"
                  }}
                >
                  {/* Ảnh Dự Án */}
                  <div
                    style={{
                      height: "160px",
                      width: "100%",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    onClick={() => setActiveImage(proj.image)}
                    title="Bấm vào để xem ảnh lớn"
                  >
                    <img
                      src={proj.image}
                      alt="Project"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "images/portfolio/project-1.jpg";
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top center",
                        transition: "transform 0.3s ease",
                        display: "block"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>

                  {/* Nội dung Tên, Thông Số Thống Kê & Nút Thao Tác */}
                  <div style={{ padding: "12px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      {/* Tên Dự Án */}
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "var(--text-black-900)",
                          margin: "0 0 6px 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        title={proj.title || "Dự Án"}
                      >
                        {proj.title || "Dự Án"}
                      </h3>

                      {/* Hàng Thông Số: Vị trí - Số sao - Lượt truy cập */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                          fontSize: "12px",
                          lineHeight: "1.4"
                        }}
                      >
                        {/* Vị trí dự án */}
                        <span
                          style={{
                            color: "var(--skin-color)",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px"
                          }}
                          title="Vị trí thứ tự ưu tiên dự án"
                        >
                          <i className="fa fa-trophy" style={{ fontSize: "11px" }}></i> #{proj.position || 1}
                        </span>

                        {/* Số sao hoàn thiện (1 - 5 sao) */}
                        <span
                          style={{
                            color: "#f59e0b",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px"
                          }}
                          title="Độ hoàn thiện dự án"
                        >
                          <i className="fa fa-star" style={{ fontSize: "11px" }}></i> {proj.rating || 5}/5
                        </span>

                        {/* Số lượt click truy cập Deploy */}
                        <span
                          style={{
                            color: "var(--text-black-700)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                          title="Số lượt click truy cập nút Deploy"
                        >
                          <i className="fa fa-mouse-pointer" style={{ fontSize: "11px", color: "var(--skin-color)" }}></i> {proj.clicks || 0} lượt truy cập
                        </span>
                      </div>
                    </div>

                    {/* Nút Liên Kết & Thao Tác Admin */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--bg-black-50)" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        {/* Nút Xem README */}
                        {proj.readmeContent && (
                          <button
                            onClick={() => setActiveReadmeProject(proj)}
                            style={{
                              background: "var(--bg-black-50)",
                              border: "none",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "var(--text-black-900)",
                              fontWeight: "600",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.2s ease"
                            }}
                            title="Xem README chi tiết"
                          >
                            <i className="fa fa-book-open" style={{ fontSize: "12px", color: "var(--skin-color)" }}></i> README
                          </button>
                        )}

                        {/* Nút Link Deploy (Tự động +1 lượt click khi bấm) */}
                        {proj.deployUrl && proj.deployUrl !== "#" && (
                          <a
                            href={proj.deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleDeployClick(proj.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid var(--skin-color)",
                              padding: "3px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "var(--skin-color)",
                              fontWeight: "600",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.2s ease"
                            }}
                            title="Xem Live Demo (Tăng +1 lượt truy cập)"
                          >
                            <i className="fa fa-external-link-alt" style={{ fontSize: "11px" }}></i> Deploy
                          </a>
                        )}
                      </div>

                      {/* Nút Edit & Trash (Chỉ dành cho Admin) */}
                      {isAuthenticated && (
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => handleEditProject(proj)}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "var(--bg-black-50)",
                              border: "none",
                              color: "var(--skin-color)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              transition: "all 0.2s ease"
                            }}
                            title="Chỉnh sửa dự án"
                          >
                            <i className="fa fa-pen"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              transition: "all 0.2s ease"
                            }}
                            title="Xóa dự án"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Popup Phóng To Ảnh Rộng Rãi Căn Giữa Nội Dung Trang */}
      {activeImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            left: window.innerWidth >= 1200 ? "270px" : 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setActiveImage(null)}
        >
          <div
            style={{
              backgroundColor: "var(--bg-black-100)",
              border: "1px solid var(--bg-black-50)",
              borderRadius: "12px",
              padding: "18px 22px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              maxWidth: "880px",
              width: "92%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--bg-black-50)", paddingBottom: "10px" }}>
              <span style={{ fontSize: "15px", color: "var(--text-black-900)", fontWeight: "600" }}>
                Chi Tiết Ảnh Dự Án
              </span>
              <button
                onClick={() => setActiveImage(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-black-900)",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <img
              src={activeImage}
              alt="Project Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "520px",
                objectFit: "contain",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Popup Xem Nội Dung File README Chi Tiết */}
      {activeReadmeProject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            left: window.innerWidth >= 1200 ? "270px" : 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
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
              maxWidth: "750px",
              width: "92%",
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

      {/* Modal Admin (Xác thực mật khẩu -> Form Thêm / Chỉnh Sửa Dự Án) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            left: window.innerWidth >= 1200 ? "270px" : 0,
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
              width: "90%",
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
                {!isAuthenticated
                  ? "Xác Thực Mật Khẩu Admin"
                  : editingProjectId
                  ? "Chỉnh Sửa Dự Án"
                  : "Thêm Dự Án Mới"}
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
                  Vui lòng nhập mật khẩu Admin để thực hiện thao tác này.
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
              /* Bước 2: Form Thêm / Chỉnh Sửa Dự Án */
              <form onSubmit={handleSaveProject}>
                {/* Trường 1: Tên Dự Án */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    1. Tên Dự Án *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Nền Tảng Đầu Tư Quant Trading"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                  />
                </div>

                {/* Hàng 2: Vị Trí & Đánh Giá Số Sao */}
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                      2. Vị Trí Ưu Tiên (Thứ Tự)
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      placeholder="1"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                      3. Đánh Giá Sao (1-5 ⭐)
                    </label>
                    <select
                      className="form-control"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      style={{ width: "100%", height: "42px", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "0 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)" }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5 Stars</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5 Stars</option>
                      <option value={3}>⭐⭐⭐ 3/5 Stars</option>
                      <option value={2}>⭐⭐ 2/5 Stars</option>
                      <option value={1}>⭐ 1/5 Star</option>
                    </select>
                  </div>
                </div>

                {/* Trường 3: Ảnh Dự Án */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "8px" }}>
                    4. Ảnh Dự Án (Upload lưu thẳng vào images/projects/)
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

                {/* Trường 4: Mục Đích / Mô Tả */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    5. Mục Đích / Mô Tả Dự Án
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Nhập mục đích hoặc mô tả ngắn gọn về dự án..."
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--bg-black-50)", padding: "10px 12px", background: "var(--bg-black-900)", color: "var(--text-black-900)", resize: "vertical" }}
                  ></textarea>
                </div>

                {/* Trường 5: Link Deploy */}
                <div className="form-group" style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "6px" }}>
                    6. Link Deploy (Vercel / Website Link)
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

                {/* Trường 6: Upload File README (.md / .txt) lưu thẳng vào readmee/ */}
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-black-900)", marginBottom: "8px" }}>
                    7. Upload File README (.md / .txt) (Lưu thẳng vào readmee/)
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
                    {uploading ? "Đang lưu..." : editingProjectId ? "Cập Nhật Dự Án" : "Lưu Dự Án"}
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
