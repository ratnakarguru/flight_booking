import React from 'react'; // Removed useState import
import { FaFilter, FaMoon, FaSun, FaClock, FaCloudSun } from 'react-icons/fa6';

// 1. RECEIVE PROPS HERE instead of defining state
const FlightFilters = ({
  priceRange,
  setPriceRange,
  selectedStops,
  setSelectedStops,
  selectedAirlines,
  setSelectedAirlines,
  selectedTimes,
  setSelectedTimes,
  uniqueAirlines // Receive the real airlines list from parent
}) => {

  // 2. HELPER FUNCTIONS 
  // (These can stay here, but they use the SETTERS passed from props)
  
  const handleCheckboxChange = (e, currentList, setList) => {
    const { value, checked } = e.target;
    if (checked) {
      setList([...currentList, value]);
    } else {
      setList(currentList.filter((item) => item !== value));
    }
  };

  const handleTimeSelect = (value) => {
    if (selectedTimes.includes(value)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== value));
    } else {
      setSelectedTimes([...selectedTimes, value]);
    }
  };

  // 3. THE RETURN STATEMENT
  return (
    <div className="col-lg-3">
      <div className="card border-0 shadow-sm p-3 sticky-top" style={{ top: '90px' }}>
        
        {/* Header & Reset */}
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <h6 className="fw-bold mb-0">
            <FaFilter className="me-2 text-primary" />
            Filters
          </h6>
          <button
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={() => {
              // Using setters from PROPS
              setPriceRange(15000);
              setSelectedStops([]);
              setSelectedAirlines([]);
              setSelectedTimes([]);
            }}
          >
            Reset
          </button>
        </div>

        {/* 1. Price Filter */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted">
            Max Price: ₹{priceRange.toLocaleString()}
          </label>
          <input
            type="range"
            className="form-range"
            min={3000}
            max={20000}
            step={500}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>₹3k</span>
            <span>₹20k</span>
          </div>
        </div>

        {/* 2. Stops Filter */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted">Stops</label>
          {['Non-Stop', '1 Stop', '2+ Stops'].map((stop, index) => (
            <div className="form-check" key={stop}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`stop-${index}`}
                value={stop}
                // Using Value from PROP
                checked={selectedStops.includes(stop)}
                // Passing the SETTER from PROP
                onChange={(e) => handleCheckboxChange(e, selectedStops, setSelectedStops)}
              />
              <label className="form-check-label small" htmlFor={`stop-${index}`}>
                {stop}
              </label>
            </div>
          ))}
        </div>

        {/* 3. Departure Time Filter */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted">Departure Time</label>
          <div className="row g-2">
            {[
              { label: 'Before 6 AM', icon: <FaMoon />, value: 'Before 6 AM' },
              { label: '6 AM - 12 PM', icon: <FaCloudSun />, value: '6 AM - 12 PM' },
              { label: '12 PM - 6 PM', icon: <FaSun />, value: '12 PM - 6 PM' },
              { label: 'After 6 PM', icon: <FaClock />, value: 'After 6 PM' },
            ].map((time) => (
              <div className="col-6" key={time.value}>
                <button
                  className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 ${
                    selectedTimes.includes(time.value)
                      ? 'btn-primary text-white'
                      : 'btn-outline-secondary text-dark border-opacity-25'
                  }`}
                  onClick={() => handleTimeSelect(time.value)}
                >
                  <span className="mb-1">{time.icon}</span>
                  <span style={{ fontSize: '0.7rem' }}>{time.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Airlines Filter */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Airlines</label>
          {uniqueAirlines && uniqueAirlines.length > 0 ? (
            uniqueAirlines.map((airline, index) => (
              <div className="form-check" key={airline}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`airline-${index}`}
                  value={airline}
                  checked={selectedAirlines.includes(airline)}
                  onChange={(e) => handleCheckboxChange(e, selectedAirlines, setSelectedAirlines)}
                />
                <label className="form-check-label small ms-1" htmlFor={`airline-${index}`}>
                  {airline}
                </label>
              </div>
            ))
          ) : (
            <div className="small text-muted">No airlines found</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FlightFilters;