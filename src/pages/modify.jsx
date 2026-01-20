import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlane, FaExchangeAlt, FaCalendarAlt, FaSearch, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ModifySearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get existing params passed from Results page to pre-fill the form
  const initialParams = location.state || { from: '', to: '', date: '', type: 'One Way' };

  const [type, setType] = useState(initialParams.type || 'One Way');
  const [from, setFrom] = useState(initialParams.from || '');
  const [to, setTo] = useState(initialParams.to || '');
  const [date, setDate] = useState(initialParams.date || '');
  const [returnDate, setReturnDate] = useState(initialParams.returnDate || '');

  // Handle Form Submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate back to results with NEW data
    navigate("/results", {
      state: {
        type,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date,
        returnDate: type === 'Round Trip' ? returnDate : null
      }
    });
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white p-3 d-flex align-items-center gap-3">
             <button className="btn btn-sm btn-light rounded-circle text-primary" onClick={() => navigate(-1)}>
                <FaArrowLeft />
             </button>
             <h5 className="mb-0 fw-bold">Modify Your Search</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSearch}>
                {/* Trip Type */}
                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Trip Type</label>
                    <div className="btn-group w-100" role="group">
                        {['One Way', 'Round Trip', 'Multi-City'].map((t) => (
                            <button 
                                key={t}
                                type="button" 
                                className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setType(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* From & To */}
                <div className="row g-2 mb-3 position-relative">
                    <div className="col-5">
                        <label className="form-label small fw-bold text-muted">From</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><FaPlane className="text-muted"/></span>
                            <input type="text" className="form-control fw-bold" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Origin" required />
                        </div>
                    </div>
                    
                    {/* Swap Button */}
                    <div className="col-2 d-flex align-items-end justify-content-center">
                        <button type="button" className="btn btn-light border rounded-circle shadow-sm position-absolute" style={{bottom: '5px', zIndex: 10}} onClick={() => { setFrom(to); setTo(from); }}>
                            <FaExchangeAlt className="text-primary"/>
                        </button>
                    </div>

                    <div className="col-5">
                        <label className="form-label small fw-bold text-muted">To</label>
                        <div className="input-group">
                             <span className="input-group-text bg-light"><FaPlane className="text-muted" style={{transform: 'rotate(90deg)'}}/></span>
                            <input type="text" className="form-control fw-bold" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Dest" required />
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="row g-2 mb-4">
                    <div className={type === 'Round Trip' ? "col-6" : "col-12"}>
                        <label className="form-label small fw-bold text-muted">Departure Date</label>
                        <div className="input-group">
                             <span className="input-group-text bg-light"><FaCalendarAlt className="text-muted"/></span>
                             <input type="date" className="form-control" value={date ? new Date(date).toISOString().split('T')[0] : ''} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                    </div>
                    {type === 'Round Trip' && (
                        <div className="col-6">
                            <label className="form-label small fw-bold text-muted">Return Date</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><FaCalendarAlt className="text-muted"/></span>
                                <input type="date" className="form-control" value={returnDate ? new Date(returnDate).toISOString().split('T')[0] : ''} onChange={(e) => setReturnDate(e.target.value)} required />
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                    <FaSearch className="me-2"/> Search Flights
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifySearch;