import React from 'react';
import { 
  FaFilter, FaMoon, FaSun, FaClock, FaCloudSun, 
  FaArrowRotateLeft, FaPlaneDeparture, FaPlaneArrival 
} from 'react-icons/fa6';
import 'bootstrap/dist/css/bootstrap.min.css';

const FlightFilters = ({
  priceRange, setPriceRange,
  selectedStops = [],
  setSelectedStops,
  selectedAirlines = [],
  setSelectedAirlines,
  
  uniqueAirlines = [],          
  selectedDepTimes = [],       
  setSelectedDepTimes, 
  selectedArrTimes = [],     
  setSelectedArrTimes, 
}) => {

  const handleCheckboxChange = (e, currentList, setList) => {
    const { value, checked } = e.target;
    if (checked) setList([...currentList, value]);
    else setList(currentList.filter((item) => item !== value));
  };

  const handleTimeSelect = (value, currentList, setList) => {
    if (currentList.includes(value)) setList(currentList.filter((t) => t !== value));
    else setList([...currentList, value]);
  };

  const sectionBoxClass = "bg-white p-3 rounded-3 mb-3 border shadow-sm";
  const titleClass = "fw-bold text-dark mb-3 small text-uppercase d-flex align-items-center gap-2";

  // Time Options Configuration
  const timeOptions = [
    { label: 'Before 6 AM', icon: <FaMoon size={14} />, value: 'Before 6 AM' },
    { label: '6 AM - 12 PM', icon: <FaCloudSun size={14} />, value: '6 AM - 12 PM' },
    { label: '12 PM - 6 PM', icon: <FaSun size={14} />, value: '12 PM - 6 PM' },
    { label: 'After 6 PM', icon: <FaClock size={14} />, value: 'After 6 PM' },
  ];

  return (
    <div className="col-lg-3">
      <div className="sticky-top" style={{ top: '20px', zIndex: 10 }}>
        
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0 text-dark"><FaFilter className="me-2 text-primary" size={18} />Filters</h5>
          <button
            className="btn btn-sm btn-light text-danger fw-bold d-flex align-items-center gap-1 border-0"
            onClick={() => {
              setPriceRange(15000);
              setSelectedStops([]);
              setSelectedAirlines([]);
              setSelectedDepTimes([]);
              setSelectedArrTimes([]);
            }}
            style={{ fontSize: '0.8rem' }}>
            <FaArrowRotateLeft size={12} /> Reset
          </button>
        </div>

        {/* 1. Price */}
        <div className={sectionBoxClass}>
          <label className={titleClass}>Price Range</label>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">Max</span>
            <span className="fw-bold text-primary">₹{priceRange.toLocaleString()}</span>
          </div>
          <input type="range" className="form-range" min={3000} max={20000} step={500} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
        </div>

        {/* 2. Stops */}
        <div className={sectionBoxClass}>
          <label className={titleClass}>Stops</label>
          <div className="d-flex flex-column gap-2">
            {['Non-Stop', '1 Stop', '2+ Stops'].map((stop, index) => (
              <div className="form-check" key={stop}>
                <input className="form-check-input" type="checkbox" id={`stop-${index}`} value={stop} checked={selectedStops.includes(stop)} onChange={(e) => handleCheckboxChange(e, selectedStops, setSelectedStops)} />
                <label className="form-check-label small text-secondary" htmlFor={`stop-${index}`}>{stop}</label>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Departure Time */}
        <div className={sectionBoxClass}>
          <label className={titleClass}><FaPlaneDeparture className="text-secondary" /> Departure</label>
          <div className="row g-2">
            {timeOptions.map((time) => {
              const isActive = selectedDepTimes.includes(time.value);
              return (
                <div className="col-6" key={`dep-${time.value}`}>
                  <button
                    className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 border rounded-3 ${isActive ? 'bg-primary text-white border-primary' : 'btn-light text-muted border-light'}`}
                    onClick={() => handleTimeSelect(time.value, selectedDepTimes, setSelectedDepTimes)}>
                    <span className="mb-1">{time.icon}</span>
                    <span style={{ fontSize: '0.65rem' }}>{time.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. NEW: Arrival Time */}
        <div className={sectionBoxClass}>
          <label className={titleClass}><FaPlaneArrival className="text-secondary" /> Arrival</label>
          <div className="row g-2">
            {timeOptions.map((time) => {
              const isActive = selectedArrTimes.includes(time.value);
              return (
                <div className="col-6" key={`arr-${time.value}`}>
                  <button
                    className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 border rounded-3 ${isActive ? 'bg-primary text-white border-primary' : 'btn-light text-muted border-light'}`}
                    onClick={() => handleTimeSelect(time.value, selectedArrTimes, setSelectedArrTimes)}>
                    <span className="mb-1">{time.icon}</span>
                    <span style={{ fontSize: '0.65rem' }}>{time.label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Airlines */}
        <div className={sectionBoxClass}>
          <label className={titleClass}>Airlines</label>
          <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {uniqueAirlines?.map((airline, index) => (
              <div className="form-check" key={airline}>
                <input className="form-check-input" type="checkbox" id={`airline-${index}`} value={airline} checked={selectedAirlines.includes(airline)} onChange={(e) => handleCheckboxChange(e, selectedAirlines, setSelectedAirlines)} />
                <label className="form-check-label small text-secondary" htmlFor={`airline-${index}`}>{airline}</label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlightFilters;