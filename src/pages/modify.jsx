import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaTimes, FaChevronDown, FaPlus, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ModifySearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; // Get data passed from previous page

  // --- 1. STATE INITIALIZATION (Using passed data) ---
  const [type, setType] = useState(state.type || 'One Way');
  
  // Initialize with the Codes passed (e.g., 'DEL') or defaults
  const [from, setFrom] = useState(state.from || '');
  const [to, setTo] = useState(state.to || '');
  
  // Initialize Labels (We will auto-update these if they are just codes)
  const [fromCity, setFromCity] = useState(state.fromLabel || state.from || 'Select Origin'); 
  const [toCity, setToCity] = useState(state.toLabel || state.to || 'Select Dest'); 

  // Dates
  const [date, setDate] = useState(state.date || new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(state.returnDate || '');

  // Multi-City State
  const [segments, setSegments] = useState(state.segments || [
    { from: 'DEL', fromCity: 'Delhi (DEL)', to: 'BOM', toCity: 'Mumbai (BOM)', date: new Date().toISOString().split('T')[0] }
  ]);

  // Passengers
  const [passengers, setPassengers] = useState(state.passengers || { adults: 1, children: 0 });
  const [cabinClass, setCabinClass] = useState(state.cabinClass || 'Economy');
  
  // UI Toggles
  const [showTripMenu, setShowTripMenu] = useState(false);
  const [showPassengerMenu, setShowPassengerMenu] = useState(false);
  const [activeSearch, setActiveSearch] = useState(null);
  
  // Data
  const [airportList, setAirportList] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);

  // --- 2. LOAD DATA & RESOLVE NAMES ---
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json")
      .then(res => res.json())
      .then(data => {
        const major = data.filter(a => a.iata_code && a.name);
        setAirportList(major);

        // --- AUTO-RESOLVE NAMES ---
        // If we have a code like "DEL" but the label is just "DEL", find the real city name
        
        // 1. Resolve From
        if (state.from) {
            const foundFrom = major.find(a => a.iata_code === state.from);
            if (foundFrom) setFromCity(`${foundFrom.city}, ${foundFrom.country}`);
        }
        
        // 2. Resolve To
        if (state.to) {
            const foundTo = major.find(a => a.iata_code === state.to);
            if (foundTo) setToCity(`${foundTo.city}, ${foundTo.country}`);
        }

        // 3. Resolve Multi-City Segments
        if (state.segments && state.segments.length > 0) {
            const updatedSegments = state.segments.map(seg => {
                const f = major.find(a => a.iata_code === seg.from);
                const t = major.find(a => a.iata_code === seg.to);
                return {
                    ...seg,
                    fromCity: f ? `${f.city}, ${f.country}` : seg.from,
                    toCity: t ? `${t.city}, ${t.country}` : seg.to
                };
            });
            setSegments(updatedSegments);
        }
      });
  }, [state]); // Run this logic when component mounts or state changes

  // --- 3. HELPERS ---
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Select Date";
    const d = new Date(dateString);
    return isNaN(d) ? "Select Date" : d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
  };

  const getPassengerSummary = () => {
    const total = passengers.adults + passengers.children;
    return `${total} ${total === 1 ? 'Adult' : 'Travellers'}, ${cabinClass}`;
  };

  // Search Logic
  const handleAirportSearch = (query) => {
    if (!query) { setFilteredAirports([]); return; }
    const lowerQ = query.toLowerCase();
    const results = airportList.filter(a => 
        a.city.toLowerCase().includes(lowerQ) || 
        a.iata_code.toLowerCase().includes(lowerQ)
    ).slice(0, 5); 
    setFilteredAirports(results);
  };

  const selectAirport = (airport, fieldType) => {
    const code = airport.iata_code;
    const city = `${airport.city}, ${airport.country}`;

    if (fieldType === 'from') { setFrom(code); setFromCity(city); }
    else if (fieldType === 'to') { setTo(code); setToCity(city); }
    else if (fieldType.startsWith('seg-from-')) {
        const idx = parseInt(fieldType.split('-')[2]);
        const newSegs = [...segments]; newSegs[idx].from = code; newSegs[idx].fromCity = city;
        setSegments(newSegs);
    }
    else if (fieldType.startsWith('seg-to-')) {
        const idx = parseInt(fieldType.split('-')[2]);
        const newSegs = [...segments]; newSegs[idx].to = code; newSegs[idx].toCity = city;
        setSegments(newSegs);
    }
    setActiveSearch(null);
    setFilteredAirports([]);
  };

  const handleSearch = () => {
    // Pass labels along with codes so the next page doesn't have to look them up again
    const payload = type === 'Multi-City' 
        ? { type, segments, passengers, cabinClass }
        : { type, from, fromLabel: fromCity, to, toLabel: toCity, date, returnDate, passengers, cabinClass };
    
    navigate("/results", { state: payload });
  };

  // --- 4. STYLES (Your Approved Design) ---
  const styles = {
    container: { backgroundColor: '#fff', padding: '15px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'relative', zIndex: 100 },
    inputBox: {
        backgroundColor: '#f4f5f7', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', position: 'relative', 
        border: '1px solid transparent', transition: 'border-color 0.2s', minWidth: '140px', height: '55px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
    },
    inputBoxActive: { backgroundColor: '#fff', borderColor: '#007bff', boxShadow: '0 0 0 3px rgba(0,123,255,0.1)' },
    label: { fontSize: '10px', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' },
    value: { fontSize: '14px', fontWeight: '700', color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.2' },
    searchBtn: {
        background: 'linear-gradient(90deg, #4b93ff 0%, #007bff 100%)', color: 'white', fontWeight: '800', border: 'none', 
        borderRadius: '6px', padding: '0 25px', height: '55px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '14px'
    },
    dropdownMenu: { position: 'absolute', top: '60px', left: '0', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', zIndex: 1000, minWidth: '250px', padding: '10px' },
    popupOverlay: { position: 'fixed', top:0, left:0, right:0, bottom:0, zIndex: 900 }
  };

  const SearchBox = ({ label, value, onClick, isActive, children, showClose, onClose }) => (
    <div style={{...styles.inputBox, ...(isActive ? styles.inputBoxActive : {})}} onClick={onClick} className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
            <span style={styles.label}>{label}</span>
            {showClose && <FaTimes size={10} color="#999" onClick={(e) => { e.stopPropagation(); onClose(); }} />}
        </div>
        <div style={styles.value}>{value}</div>
        {children}
    </div>
  );

  return (
    <div style={styles.container}>
      {(showTripMenu || showPassengerMenu || activeSearch) && <div style={styles.popupOverlay} onClick={() => {setShowTripMenu(false); setShowPassengerMenu(false); setActiveSearch(null)}} ></div>}

      <div className="container">
        
        {/* DESKTOP VIEW */}
        <div className="d-none d-lg-block">
            
            {/* Top Row: Trip Type & Passengers */}
            <div className="d-flex mb-3 gap-2">
                <div className="position-relative" style={{width: '200px'}}>
                    <SearchBox label="TRIP TYPE" value={<span className="d-flex align-items-center gap-1">{type} <FaChevronDown size={10} className="text-primary"/></span>} onClick={() => setShowTripMenu(!showTripMenu)} isActive={showTripMenu} />
                    {showTripMenu && (
                        <div style={{...styles.dropdownMenu, minWidth: '200px'}}>
                            {['One Way', 'Round Trip', 'Multi-City'].map(t => (
                                <div key={t} className="p-2 fw-bold hover-bg-light" style={{cursor:'pointer'}} onClick={() => { setType(t); setShowTripMenu(false); }}>{t}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="position-relative" style={{width: '250px'}}>
                    <SearchBox label="PASSENGER & CLASS" value={getPassengerSummary()} onClick={() => setShowPassengerMenu(!showPassengerMenu)} isActive={showPassengerMenu} />
                    {showPassengerMenu && (
                        <div style={{...styles.dropdownMenu, minWidth: '250px', zIndex: 1001}}>
                             <div className="d-flex justify-content-between mb-2"><span className="fw-bold small">Adults</span><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={()=>setPassengers(p=>({...p, adults:Math.max(1, p.adults-1)}))}>-</button><span>{passengers.adults}</span><button className="btn btn-sm btn-outline-primary" onClick={()=>setPassengers(p=>({...p, adults:p.adults+1}))}>+</button></div></div>
                             <div className="d-flex justify-content-between mb-2"><span className="fw-bold small">Children</span><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={()=>setPassengers(p=>({...p, children:Math.max(0, p.children-1)}))}>-</button><span>{passengers.children}</span><button className="btn btn-sm btn-outline-primary" onClick={()=>setPassengers(p=>({...p, children:p.children+1}))}>+</button></div></div>
                             <select className="form-select form-select-sm mb-2" value={cabinClass} onChange={(e)=>setCabinClass(e.target.value)}><option>Economy</option><option>Business</option></select>
                             <button className="btn btn-primary btn-sm w-100" onClick={()=>setShowPassengerMenu(false)}>Done</button>
                        </div>
                    )}
                </div>
            </div>

            {/* A. STANDARD LAYOUT */}
            {type !== 'Multi-City' && (
                <div className="d-flex align-items-center gap-2">
                    <div className="position-relative flex-grow-1">
                        <SearchBox label="FROM" value={activeSearch === 'from' ? '' : fromCity} isActive={activeSearch === 'from'} onClick={() => setActiveSearch('from')}>
                            {activeSearch === 'from' && <input autoFocus className="form-control border-0 p-0 shadow-none fw-bold" style={{fontSize:'14px', marginTop:'-20px'}} placeholder="Type City..." onChange={(e) => handleAirportSearch(e.target.value)} />}
                        </SearchBox>
                        {activeSearch === 'from' && filteredAirports.length > 0 && <div style={styles.dropdownMenu}>{filteredAirports.map((a, i) => <div key={i} className="p-2 border-bottom cursor-pointer" onClick={() => selectAirport(a, 'from')}>{a.city} ({a.iata_code})</div>)}</div>}
                    </div>

                    <FaExchangeAlt className="text-primary mx-2" style={{cursor:'pointer'}} onClick={()=>{const t=from; const tc=fromCity; setFrom(to); setFromCity(toCity); setTo(t); setToCity(tc);}}/>

                    <div className="position-relative flex-grow-1">
                        <SearchBox label="TO" value={activeSearch === 'to' ? '' : toCity} isActive={activeSearch === 'to'} onClick={() => setActiveSearch('to')}>
                            {activeSearch === 'to' && <input autoFocus className="form-control border-0 p-0 shadow-none fw-bold" style={{fontSize:'14px', marginTop:'-20px'}} placeholder="Type City..." onChange={(e) => handleAirportSearch(e.target.value)} />}
                        </SearchBox>
                        {activeSearch === 'to' && filteredAirports.length > 0 && <div style={styles.dropdownMenu}>{filteredAirports.map((a, i) => <div key={i} className="p-2 border-bottom cursor-pointer" onClick={() => selectAirport(a, 'to')}>{a.city} ({a.iata_code})</div>)}</div>}
                    </div>

                    <div className="position-relative" style={{width: '160px'}}><SearchBox label="DEPART" value={formatDateDisplay(date)}><input type="date" className="position-absolute w-100 h-100 top-0 start-0 opacity-0" onChange={(e) => setDate(e.target.value)} /></SearchBox></div>
                    
                    <div className="position-relative" style={{width: '160px'}}>
                        <SearchBox label="RETURN" value={type==='One Way' ? <span className="fw-normal text-muted" style={{fontSize:'11px'}}>Tap to add</span> : formatDateDisplay(returnDate)} showClose={type!=='One Way'} onClose={()=>{setType('One Way'); setReturnDate('')}} onClick={()=>{if(type==='One Way') setType('Round Trip')}}>
                             <input type="date" className="position-absolute w-100 h-100 top-0 start-0 opacity-0" disabled={type==='One Way'} onChange={(e) => {setReturnDate(e.target.value); setType('Round Trip')}} />
                        </SearchBox>
                    </div>

                    <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
                </div>
            )}

            {/* B. MULTI-CITY LAYOUT */}
            {type === 'Multi-City' && (
                <div className="d-flex flex-column gap-2">
                    {segments.map((seg, i) => (
                        <div className="d-flex align-items-center gap-2" key={i}>
                            <div className="fw-bold text-muted" style={{width:'20px'}}>{i+1}</div>
                            
                            <div className="position-relative flex-grow-1">
                                <SearchBox label="FROM" value={activeSearch === `seg-from-${i}` ? '' : seg.fromCity} isActive={activeSearch === `seg-from-${i}`} onClick={() => setActiveSearch(`seg-from-${i}`)}>
                                    {activeSearch === `seg-from-${i}` && <input autoFocus className="form-control border-0 p-0 shadow-none fw-bold" style={{fontSize:'14px', marginTop:'-20px'}} placeholder="Type City..." onChange={(e) => handleAirportSearch(e.target.value)} />}
                                </SearchBox>
                                {activeSearch === `seg-from-${i}` && filteredAirports.length > 0 && <div style={{...styles.dropdownMenu, zIndex: 2000}}>{filteredAirports.map((a, idx) => <div key={idx} className="p-2 border-bottom cursor-pointer" onClick={() => selectAirport(a, `seg-from-${i}`)}>{a.city} ({a.iata_code})</div>)}</div>}
                            </div>
                            
                            <div className="position-relative flex-grow-1">
                                <SearchBox label="TO" value={activeSearch === `seg-to-${i}` ? '' : seg.toCity} isActive={activeSearch === `seg-to-${i}`} onClick={() => setActiveSearch(`seg-to-${i}`)}>
                                    {activeSearch === `seg-to-${i}` && <input autoFocus className="form-control border-0 p-0 shadow-none fw-bold" style={{fontSize:'14px', marginTop:'-20px'}} placeholder="Type City..." onChange={(e) => handleAirportSearch(e.target.value)} />}
                                </SearchBox>
                                {activeSearch === `seg-to-${i}` && filteredAirports.length > 0 && <div style={{...styles.dropdownMenu, zIndex: 2000}}>{filteredAirports.map((a, idx) => <div key={idx} className="p-2 border-bottom cursor-pointer" onClick={() => selectAirport(a, `seg-to-${i}`)}>{a.city} ({a.iata_code})</div>)}</div>}
                            </div>

                            <div className="position-relative" style={{width: '180px'}}>
                                <SearchBox label="DATE" value={formatDateDisplay(seg.date)}>
                                    <input type="date" className="position-absolute w-100 h-100 top-0 start-0 opacity-0" onChange={(e) => {
                                        const newSegs = [...segments]; newSegs[i].date = e.target.value; setSegments(newSegs);
                                    }} />
                                </SearchBox>
                            </div>

                            {segments.length > 1 && (
                                <button className="btn btn-light text-danger" onClick={()=>{setSegments(segments.filter((_, idx) => idx !== i))}}>
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    
                    <div className="d-flex justify-content-between mt-2">
                         <button className="btn btn-outline-primary fw-bold btn-sm" onClick={()=>setSegments([...segments, {from:'', fromCity:'Select City', to:'', toCity:'Select City', date:''}])}>
                            <FaPlus className="me-1"/> Add Flight
                         </button>
                         <button style={styles.searchBtn} onClick={handleSearch}>Search Multi-City</button>
                    </div>
                </div>
            )}
        </div>

        {/* MOBILE VIEW */}
        <div className="d-lg-none bg-light p-3 rounded">
            <h6 className="fw-bold mb-3">Update Search ({type})</h6>
            <div className="mb-3">
                 <select className="form-select mb-2" value={type} onChange={(e)=>setType(e.target.value)}>
                    <option>One Way</option><option>Round Trip</option><option>Multi-City</option>
                </select>
                <div className="small text-muted mb-2">From: {fromCity}</div>
                <div className="small text-muted mb-2">To: {toCity}</div>
            </div>
            <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
        </div>
        
      </div>
    </div>
  );
};

export default ModifySearch;