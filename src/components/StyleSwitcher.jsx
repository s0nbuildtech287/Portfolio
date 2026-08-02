import React, { useState, useEffect } from "react";

const colorSkins = [
  { id: "color-1", hex: "#ec1839" },
  { id: "color-2", hex: "#fa5b0f" },
  { id: "color-3", hex: "#37b182" },
  { id: "color-4", hex: "#1854b4" },
  { id: "color-5", hex: "#f021b6" },
];

const StyleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const changeSkinColor = (hex) => {
    document.documentElement.style.setProperty("--skin-color", hex);
  };

  const handleTogglerClick = () => {
    setIsOpen(!isOpen);
    setIsSpinning(!isSpinning);
  };

  return (
    <div className={`style-switcher ${isOpen ? "open" : ""}`}>
      <div className="style-switcher-toggler s-icon" onClick={handleTogglerClick}>
        <i className={`fas fa-cog ${isSpinning ? "fa-spin" : ""}`}></i>
      </div>
      <div className="day-night s-icon" onClick={() => setIsDark(!isDark)}>
        <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
      </div>
      <h4>Theme Colors</h4>
      <div className="colors">
        {colorSkins.map((skin) => (
          <span
            key={skin.id}
            className={skin.id}
            onClick={() => changeSkinColor(skin.hex)}
            style={{ backgroundColor: skin.hex }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default StyleSwitcher;
