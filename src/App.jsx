import React, { useState, useEffect } from "react";
import Aside from "./components/Aside";
import StarfieldCanvas from "./components/StarfieldCanvas";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactSection from "./components/ContactSection";
import StyleSwitcher from "./components/StyleSwitcher";

const SECTION_IDS = ["home", "about", "services", "projects", "contact"];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(false);

  // 1. Kiểm tra URL Hash khi ứng dụng vừa được tải (direct URL access e.g. /#about)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (SECTION_IDS.includes(hash)) {
      setActiveSection(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  // 2. Lắng nghe sự kiện đổi Hash / nút Back & Forward trên trình duyệt
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 3. Scroll Spy: Tự động đồng bộ URL hash & Navigator theo vị trí cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            const currentSection = SECTION_IDS[i];
            setActiveSection(currentSection);
            
            // Cập nhật thanh địa chỉ URL mà không làm nhảy trang
            if (window.location.hash !== `#${currentSection}`) {
              window.history.replaceState(null, "", `#${currentSection}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Xử lý khi người dùng bấm vào các mục điều hướng Navigator
  const handleSelectSection = (targetSection) => {
    setActiveSection(targetSection);
    window.history.pushState(null, "", `#${targetSection}`);
    
    const element = document.getElementById(targetSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    if (window.innerWidth < 1200) {
      setIsNavOpen(false);
    }
  };

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="main-container">
      {/* Sidebar Navigation */}
      <Aside
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        isNavOpen={isNavOpen}
        onToggleNav={handleToggleNav}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Starfield Canvas Background */}
        <StarfieldCanvas />

        {/* Home Section */}
        <HomeSection
          isActive={activeSection === "home"}
          onNavigateContact={() => handleSelectSection("contact")}
        />

        {/* About Section */}
        <AboutSection
          isActive={activeSection === "about"}
          onNavigateContact={() => handleSelectSection("contact")}
        />

        {/* Services Section */}
        <ServicesSection
          isActive={activeSection === "services"}
        />

        {/* Projects Section */}
        <PortfolioSection
          isActive={activeSection === "projects"}
        />

        {/* Contact Section */}
        <ContactSection
          isActive={activeSection === "contact"}
        />
      </div>

      {/* Style Switcher & Dark/Light Mode */}
      <StyleSwitcher />
    </div>
  );
}

export default App;
