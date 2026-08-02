import React, { useState, useEffect } from "react";
import Aside from "./components/Aside";
import StarfieldCanvas from "./components/StarfieldCanvas";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ContactSection from "./components/ContactSection";
import StyleSwitcher from "./components/StyleSwitcher";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Scroll Spy: Tự động cập nhật Navigator theo vị trí cuộn trang khi cuộn Landing Page
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["home", "about", "services", "portfolio", "contact"];
      const scrollPosition = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectSection = (targetSection) => {
    setActiveSection(targetSection);
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

        {/* Portfolio Section */}
        <PortfolioSection
          isActive={activeSection === "portfolio"}
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
