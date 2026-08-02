import React, { useState } from "react";
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
  const [backSection, setBackSection] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const sections = ["home", "about", "services", "portfolio", "contact"];

  const handleSelectSection = (targetSection) => {
    if (targetSection === activeSection) return;
    setBackSection(activeSection);
    setActiveSection(targetSection);

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
          isBackSection={backSection === "home"}
          onNavigateContact={() => handleSelectSection("contact")}
        />

        {/* About Section */}
        <AboutSection
          isActive={activeSection === "about"}
          isBackSection={backSection === "about"}
          onNavigateContact={() => handleSelectSection("contact")}
        />

        {/* Services Section */}
        <ServicesSection
          isActive={activeSection === "services"}
          isBackSection={backSection === "services"}
        />

        {/* Portfolio Section */}
        <PortfolioSection
          isActive={activeSection === "portfolio"}
          isBackSection={backSection === "portfolio"}
        />

        {/* Contact Section */}
        <ContactSection
          isActive={activeSection === "contact"}
          isBackSection={backSection === "contact"}
        />
      </div>

      {/* Style Switcher & Dark/Light Mode */}
      <StyleSwitcher />
    </div>
  );
}

export default App;
