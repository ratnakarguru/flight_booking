import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Note: Ensure bootstrap.bundle.min.js is imported in your App.js/index.js for the clicks to work!

const Navbar = () => {
  const links = [
    "HOME", "FLIGHT", "CABS ▼", "CAR RENTALS ▼", "TAXI PACKAGE", 
    "HOLIDAYS ▼", "FOREX", "VISA", "CANCEL RESERVATION", 
    "SPECIAL OFFERS", "TESTIMONIALS", "CONTACT US"
  ];

  const brandOrange = '#ff6b00'; 

  return (
    // navbar-expand-lg: This is crucial. It says "Use standard row layout on Large screens, but switch to mobile layout on smaller ones"
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: brandOrange }}>
      <div className="container">
        
        {/* 1. BRAND (Optional - shown in navbar if desired, or kept in header above) */}
        {/* We leave this empty or minimal if you use the TopHeader above, but the Toggler needs to sit right */}
        <a className="navbar-brand d-lg-none fw-bold" href="#">Patra Travels</a>

        {/* 2. TOGGLER BUTTON (Hamburger) */}
        {/* data-bs-toggle is changed to "offcanvas" */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="offcanvas" 
          data-bs-target="#leftSidebarMenu" 
          aria-controls="leftSidebarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 3. SIDEBAR CONTAINER (Offcanvas) */}
        {/* 'offcanvas-start' makes it slide in from the LEFT */}
        <div 
          className="offcanvas offcanvas-start text-bg-dark" 
          tabIndex="-1" 
          id="leftSidebarMenu" 
          aria-labelledby="offcanvasLabel"
          style={{ backgroundColor: brandOrange, border: 'none' }} // Ensure sidebar matches brand color
        >
          
          {/* Sidebar Header (Visible only on Mobile) */}
          <div className="offcanvas-header border-bottom border-secondary">
            <h5 className="offcanvas-title fw-bold" id="offcanvasLabel">PATRA TOURS</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              data-bs-dismiss="offcanvas" 
              aria-label="Close"
            ></button>
          </div>

          {/* Sidebar Body (Links) */}
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-between flex-grow-1 pe-3">
              {links.map((link, index) => {
                const isDropdown = link.includes('▼');
                const label = link.replace(' ▼', '');

                return isDropdown ? (
                  <li key={index} className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle text-white fw-bold" 
                      href="#" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {label}
                    </a>
                    <ul className="dropdown-menu border-0 shadow-sm">
                      <li><a className="dropdown-item" href="#">Action</a></li>
                      <li><a className="dropdown-item" href="#">Another action</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>
                ) : (
                  <li key={index} className="nav-item">
                    <a 
                      className="nav-link text-white fw-bold" 
                      href="#"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;