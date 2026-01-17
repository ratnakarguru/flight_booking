import React, { useState } from 'react';
import { 
  FaPlaneDeparture, 
  FaPlaneArrival, 
  FaCalendarAlt, 
  FaUser, 
  FaWhatsapp,
  FaSearch,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeroSection = () => {
  const [tripType, setTripType] = useState('oneWay');

  // Initialize Multi-City with 1 segment
  const [multiCitySegments, setMultiCitySegments] = useState([
    { id: 1, from: '', to: '', date: '' }
  ]);

  const handleSegmentChange = (id, field, value) => {
    const updatedSegments = multiCitySegments.map(segment =>
      segment.id === id ? { ...segment, [field]: value } : segment
    );
    setMultiCitySegments(updatedSegments);
  };

  const handleAddSegment = () => {
    const newId = multiCitySegments.length > 0 ? Math.max(...multiCitySegments.map(s => s.id)) + 1 : 1;
    setMultiCitySegments([...multiCitySegments, { id: newId, from: '', to: '', date: '' }]);
  };

  const handleRemoveSegment = (id) => {
    setMultiCitySegments(multiCitySegments.filter(segment => segment.id !== id));
  };

  const bgImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
  const brandOrange = '#ff6b00';

  return (
    <div 
      className="position-relative d-flex align-items-center justify-content-center" 
      style={{ 
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '600px',
        paddingTop: '80px', paddingBottom: '80px'
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div className="container position-relative z-1">
        <div className="card border-0 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
          <div className="card-body p-4">
            
            {/* Trip Type Tabs */}
            <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
              {['oneWay', 'return', 'multi'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`btn rounded-pill px-4 fw-bold text-nowrap ${tripType === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                  style={{ fontSize: '0.9rem' }}
                >
                  {type === 'oneWay' ? 'ONE WAY' : type === 'return' ? 'RETURN' : 'MULTI CITY'}
                </button>
              ))}
            </div>

            {/* --- MULTI CITY LOGIC --- */}
            {tripType === 'multi' ? (
              <div className="multi-city-container">
                {multiCitySegments.map((segment, index) => (
                  <div className="row g-2 align-items-end mb-2" key={segment.id}>
                    
                    {/* 1. From */}
                    <div className="col-lg-2 col-md-6">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase">From</label>}
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-end-0"><FaPlaneDeparture className="text-secondary" /></span>
                        <input 
                          type="text" 
                          className="form-control border-start-0 ps-0 bg-light" 
                          placeholder="City" 
                          value={segment.from}
                          onChange={(e) => handleSegmentChange(segment.id, 'from', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 2. To */}
                    <div className="col-lg-2 col-md-6">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase">To</label>}
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-light border-end-0"><FaPlaneArrival className="text-secondary" /></span>
                        <input 
                          type="text" 
                          className="form-control border-start-0 ps-0 bg-light" 
                          placeholder="City"
                          value={segment.to}
                          onChange={(e) => handleSegmentChange(segment.id, 'to', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 3. Date */}
                    <div className="col-lg-2 col-md-6">
                      {index === 0 && <label className="form-label text-muted small fw-bold text-uppercase">Date</label>}
                      <div className="input-group input-group-sm">
                        <input 
                          type="date" 
                          className="form-control border-end-0 bg-light" 
                          value={segment.date}
                          onChange={(e) => handleSegmentChange(segment.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 4. LOGIC SPLIT: Row 1 vs Row 2+ */}
                    {index === 0 ? (
                      // --- FIRST ROW: Shows Travellers & Search Button ---
                      <>
                       <div className="col-lg-2 col-md-6 ">
                          <label className="form-label d-none d-lg-block">&nbsp;</label> 
                          <button 
                            className="btn btn-sm btn-outline-dark rounded-circle d-flex align-items-center justify-content-center ms-2"
                            style={{ width: '32px', height: '32px' }}
                            onClick={handleAddSegment}
                            title="Add Flight"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        {/* Travellers */}
                        <div className="col-lg-2 col-md-6">
                          <label className="form-label text-muted small fw-bold text-uppercase">Travellers</label>
                          <div className="input-group input-group-sm">
                            <input type="text" className="form-control border-end-0 bg-light" placeholder="1 Adult" />
                            <span className="input-group-text bg-light border-start-0"><FaUser className="text-secondary" /></span>
                          </div>
                        </div>

                        {/* Search Button */}
                        <div className="col-lg-2 col-md-6 d-grid">
                           <label className="form-label d-none d-lg-block">&nbsp;</label> {/* Spacer for alignment */}
                           <button className="btn btn-sm text-white fw-bold" style={{ backgroundColor: brandOrange }}>
                             SEARCH
                           </button>
                        </div>

                        {/* Add Button (Last Column) */}
                       
                      </>
                    ) : (
                      // --- SUBSEQUENT ROWS: Just Remove Button ---
                      <div className="col-lg-2 col-md-6 d-flex align-items-end pb-1">
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => handleRemoveSegment(segment.id)}
                          title="Remove Flight"
                        >
                          <FaMinus size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // --- STANDARD VIEW (One Way / Return) ---
              // (This code remains unchanged from the standard grid logic)
              <div className="row g-3">
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">From</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaPlaneDeparture className="text-secondary" /></span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="City" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">To</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaPlaneArrival className="text-secondary" /></span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="City" />
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Departure</label>
                  <div className="input-group">
                    <input type="date" className="form-control border-end-0" />
                    <span className="input-group-text bg-white border-start-0"><FaCalendarAlt className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Return</label>
                  <div className="input-group">
                    <input type="date" className="form-control border-end-0" disabled={tripType === 'oneWay'} />
                    <span className="input-group-text bg-white border-start-0"><FaCalendarAlt className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-12 col-lg-2">
                  <label className="form-label text-muted small fw-bold text-uppercase">Travellers</label>
                  <div className="input-group">
                    <input type="text" className="form-control border-end-0" placeholder="1 Adult" />
                    <span className="input-group-text bg-white border-start-0"><FaUser className="text-secondary" /></span>
                  </div>
                </div>
                <div className="col-md-12 col-lg-2 d-grid align-items-end">
                  <button className="btn fw-bold text-white py-2" style={{ backgroundColor: brandOrange }}>
                    SEARCH
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <a 
        href="https://wa.me/918337911111" 
        target="_blank" 
        rel="noopener noreferrer"
        className="position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center rounded-circle shadow text-white bg-success"
        style={{ width: '60px', height: '60px', zIndex: 1050, textDecoration: 'none' }}
      >
        <FaWhatsapp size={35} />
      </a>
    </div>
  );
};

export default HeroSection;