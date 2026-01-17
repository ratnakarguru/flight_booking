import React from 'react';
import { 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaGooglePlusG, 
  FaLinkedinIn, 
  FaUser 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const TopHeader = () => {
  const brandOrange = '#ff6b00';

  return (
    // ADDED CLASS: 'd-none d-lg-block'
    // d-none = Hide on all screens by default (Mobile, Tablet)
    // d-lg-block = Show only on Large screens (Desktop) and up
    <header className="bg-white py-3 border-bottom d-none d-lg-block">
      <div className="container">
        <div className="row align-items-center">
          
          {/* --- LEFT SECTION: LOGO --- */}
          <div className="col-lg-5 col-md-12 text-center text-lg-start mb-3 mb-lg-0">
            <h1 className="h2 fw-bold mb-0 text-dark">
              <span style={{ color: brandOrange }}>P</span>ATRA{' '}
              <span className="text-secondary" style={{ fontSize: '0.8em' }}>TOURS AND TRAVELS</span>
            </h1>
            <p className="text-muted small mb-0 fst-italic">
              Recognized by Ministry of Tourism, Govt. of India
            </p>
          </div>

          {/* --- RIGHT SECTION: CONTACT & SOCIALS --- */}
          <div className="col-lg-7 col-md-12">
            
            {/* Contact Row: Phones */}
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-end align-items-center gap-3 mb-2">
              
              {/* Toll Free */}
              <div className="d-flex align-items-center border-end pe-3 d-none d-sm-flex">
                <div className="rounded-circle bg-light p-2 me-2 d-flex align-items-center justify-content-center">
                  <FaPhoneAlt size={12} className="text-secondary" />
                </div>
                <div className="d-flex flex-column lh-1 text-start">
                  <span className="badge bg-secondary mb-1" style={{ fontSize: '0.6rem' }}>TOLL FREE</span>
                  <span className="fw-bold" style={{ color: brandOrange }}>1800 120 8464</span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="d-flex align-items-center">
                <FaWhatsapp size={20} className="text-success me-2" />
                <span className="fw-bold text-dark">+91 83379 11111</span>
              </div>
            </div>

            {/* Social Row */}
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-end align-items-center gap-3">
              <div className="d-flex gap-2 text-secondary">
                <a href="#" className="text-secondary hover-orange"><FaFacebookF /></a>
                <a href="#" className="text-secondary hover-orange"><FaTwitter /></a>
                <a href="#" className="text-secondary hover-orange"><FaGooglePlusG /></a>
                <a href="#" className="text-secondary hover-orange"><FaLinkedinIn /></a>
              </div>

              <span className="text-muted small d-none d-md-inline">
                support@orisysinfotech.com
              </span>

              <button className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2 rounded-pill px-3">
                SIGN IN <FaUser size={12} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;