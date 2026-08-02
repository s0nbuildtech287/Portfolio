import React from "react";

const Aside = ({ activeSection, onSelectSection, isNavOpen, onToggleNav }) => {
  const navItems = [
    { id: "home", label: "Home", icon: "fa fa-home" },
    { id: "about", label: "About", icon: "fa fa-user" },
    { id: "services", label: "Services", icon: "fa fa-list" },
    { id: "portfolio", label: "Portfolio", icon: "fa fa-briefcase" },
    { id: "contact", label: "Contact", icon: "fa fa-comments" },
  ];

  return (
    <div className={`aside ${isNavOpen ? "open" : ""}`}>
      <div className="logo">
        <a href="#home" onClick={(e) => { e.preventDefault(); onSelectSection("home"); }}>
          <span>X</span>Sown
        </a>
      </div>
      <div
        className={`nav-toggler ${isNavOpen ? "open" : ""}`}
        onClick={onToggleNav}
      >
        <span></span>
      </div>
      <ul className="nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                onSelectSection(item.id);
              }}
            >
              <i className={item.icon}></i>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Aside;
