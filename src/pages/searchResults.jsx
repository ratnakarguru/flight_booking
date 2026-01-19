import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaArrowRight,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaSuitcase,
  FaFileInvoiceDollar,
  FaExchangeAlt,
  FaInfoCircle,
  FaAngleDown,
  FaAngleUp,
  FaCircle,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import FlightFilters from "./flightfilters"; 

// --- 1. SUB-COMPONENT: Scrollable Fare Calendar (Updated Logic) ---
const FareCalendar = ({ initialDate, minPrice }) => {
  const [viewStartDate, setViewStartDate] = useState(new Date(initialDate || new Date()));
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date(initialDate || new Date()).toDateString()
  );
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // If minPrice is not yet available (loading), use a default base
    const basePrice = minPrice || 4500; 

    const tempDates = [];
    const initialDateObj = new Date(initialDate || new Date());

    for (let i = 0; i < 15; i++) {
      const d = new Date(viewStartDate);
      d.setDate(viewStartDate.getDate() + i);
      
      const isSelectedDay = d.toDateString() === initialDateObj.toDateString();
      
      // LOGIC: If it's the selected date, show ACTUAL Lowest Price.
      // For other dates, show a randomized variation around that price.
      let displayPrice;
      if (isSelectedDay && minPrice) {
        displayPrice = minPrice;
      } else {
        // Randomize slightly: Base - 500 to Base + 1500
        const variation = Math.floor(Math.random() * 2000) - 500;
        displayPrice = basePrice + variation;
      }

      tempDates.push({
        dateStr: d.toDateString(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        dateNum: d.getDate(),
        price: displayPrice < 3000 ? 3000 : displayPrice // Ensure no unrealistic low prices
      });
    }
    setDates(tempDates);
  }, [viewStartDate, minPrice, initialDate]);

  const shiftDates = (days) => {
    const newStart = new Date(viewStartDate);
    newStart.setDate(newStart.getDate() + days);
    setViewStartDate(newStart);
  };

  return (
    <div className="bg-white shadow-sm py-3 mb-3 border-bottom sticky-top" style={{top: '70px', zIndex: 1010}}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <button className="btn btn-light rounded-circle border shadow-sm" onClick={() => shiftDates(-7)}><FaChevronLeft /></button>
          <div className="d-flex gap-2 overflow-auto px-1 py-1 w-100" style={{ scrollbarWidth: 'none' }}>
            {dates.map((item, idx) => {
              const isActive = item.dateStr === selectedDateStr;
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`card border-0 px-2 py-2 text-center flex-shrink-0 rounded-3 ${isActive ? 'bg-dark text-white shadow' : 'bg-light text-muted'}`} 
                  style={{ minWidth: '100px', cursor: 'pointer', transition: 'all 0.2s ease', border: isActive ? 'none' : '1px solid #eee' }}
                >
                  <div className={`small fw-bold ${isActive ? 'text-white' : 'text-dark'}`} style={{fontSize:'0.85rem'}}>{item.dateNum} {item.month}, {item.day}</div>
                  <div className={`small fw-bold ${isActive ? 'text-warning' : 'text-secondary'}`} style={{fontSize:'0.8rem'}}>₹{item.price.toLocaleString()}</div>
                  {isActive && <div className="mt-1 bg-warning rounded-pill mx-auto" style={{width: '20px', height:'3px'}}></div>}
                </div>
              );
            })}
          </div>
          <button className="btn btn-light rounded-circle border shadow-sm" onClick={() => shiftDates(7)}><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

// --- 2. SUB-COMPONENT: Flight Itinerary Item ---
const FlightItem = ({ itinerary, getAirlineLogo, airportMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('flight');

  const isMultiCity = itinerary.flights.length > 1;

  // Formatting Helpers
  const getCity = (code) => airportMap[code]?.city || code;
  const formatDate = (dateStr) => {
    if(!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' });
  };

  return (
    <div className="card border-0 shadow-sm mb-3 hover-shadow transition-all bg-white">
      <div className="card-body p-3 p-md-4">
        <div className="row align-items-center">
          
          <div className="col-md-9">
            {isMultiCity ? (
               <div className="d-flex flex-column gap-3">
                  {itinerary.flights.map((flight, idx) => (
                    <div key={idx} className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-1">
                       <div className="d-flex align-items-center gap-3" style={{width: '25%'}}>
                          <div style={{width:'40px', height:'40px'}} className="bg-light rounded-circle d-flex align-items-center justify-content-center">
                             <img src={getAirlineLogo(flight.airline)} alt={flight.airline} style={{maxHeight:'20px', maxWidth:'100%'}} />
                          </div>
                          <div>
                            <div className="small fw-bold text-dark">{flight.airline}</div>
                            <div className="small text-muted" style={{fontSize:'0.7rem'}}>{flight.flightCode}</div>
                          </div>
                       </div>
                       <div className="d-flex align-items-center gap-4 flex-grow-1 justify-content-center">
                          <div className="text-center">
                             <div className="h5 mb-0 fw-bold">{flight.departureTime}</div>
                             <div className="small fw-bold text-muted">{flight.origin}</div>
                          </div>
                          <div className="d-flex flex-column align-items-center px-2">
                             <small className="text-muted mb-1" style={{fontSize:'0.7rem'}}>{flight.duration}</small>
                             <div className="d-flex align-items-center w-100">
                                <FaCircle size={6} className="text-secondary opacity-50"/>
                                <div className="border-top border-secondary w-100 mx-1" style={{width:'60px', borderStyle: 'dashed'}}></div>
                                <FaPlane size={12} className="text-primary"/>
                             </div>
                          </div>
                          <div className="text-center">
                             <div className="h5 mb-0 fw-bold">{flight.arrivalTime}</div>
                             <div className="small fw-bold text-muted">{flight.destination}</div>
                          </div>
                       </div>
                       <div className="ms-4 text-end" style={{width: '20%'}}>
                          <div className="badge bg-light text-dark border fw-normal px-2 py-1">
                            <FaCalendarAlt className="me-1 text-secondary" size={10}/> 
                            {formatDate(flight.date)}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            ) : (
               <div className="row align-items-center text-center text-md-start">
                  <div className="col-md-4 mb-3 mb-md-0 d-flex align-items-center gap-3">
                    <div style={{ width: "50px", height: "50px" }} className="d-flex align-items-center justify-content-center bg-light rounded-circle">
                      <img src={getAirlineLogo(itinerary.flights[0].airline)} alt="logo" className="img-fluid" style={{ maxHeight: "30px" }} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{itinerary.flights[0].airline}</div>
                      <div className="small text-muted">{itinerary.flights[0].flightCode}</div>
                    </div>
                  </div>
                  <div className="col-md-8">
                     <div className="d-flex align-items-center justify-content-between px-2">
                        <div className="text-center">
                           <div className="h4 mb-0 fw-bold">{itinerary.flights[0].departureTime}</div>
                           <div className="small text-muted fw-bold">{itinerary.flights[0].origin}</div>
                        </div>
                        <div className="d-flex flex-column align-items-center small text-muted px-2 w-50">
                           <span className="mb-1"><FaClock className="me-1"/>{itinerary.totalDuration}</span>
                           <div className="position-relative w-100 my-2">
                              <div className="border-top border-secondary opacity-25 w-100"></div>
                              <FaPlane className="position-absolute top-0 start-50 translate-middle text-primary bg-white px-1" style={{ fontSize: "14px", marginTop: '-1px' }} />
                           </div>
                           <span className="badge bg-light text-secondary border">{formatDate(itinerary.flights[0].date)}</span>
                        </div>
                        <div className="text-center">
                           <div className="h4 mb-0 fw-bold">{itinerary.flights[0].arrivalTime}</div>
                           <div className="small text-muted fw-bold">{itinerary.flights[0].destination}</div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </div>

          <div className="col-md-3 border-start-md ps-md-4 d-flex flex-column align-items-center justify-content-center gap-3">
            <div className="text-end w-100 text-center text-md-end">
              <div className="h3 mb-0 fw-bold text-dark">₹{itinerary.totalPrice.toLocaleString()}</div>
              <div className="small text-success fw-bold">Partially Refundable</div>
            </div>
            <button className="btn fw-bold text-white rounded-1 px-4 shadow-sm w-100 py-2" style={{ backgroundColor: "#ff6b00" }}>
                BOOK NOW
            </button>
            <button className="btn btn-link text-decoration-none btn-sm p-0 text-secondary" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? 'Hide' : 'View'} Details {isOpen ? <FaAngleUp/> : <FaAngleDown/>}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-top bg-light">
            <div className="d-flex border-bottom bg-white overflow-auto">
                {[{id: 'flight', label: 'Itinerary', icon: <FaInfoCircle/>}, {id: 'fare', label: 'Fare', icon: <FaFileInvoiceDollar/>}, {id: 'baggage', label: 'Baggage', icon: <FaSuitcase/>}, {id: 'rules', label: 'Rules', icon: <FaExchangeAlt/>}].map(tab => (
                    <button key={tab.id} className={`btn btn-sm rounded-0 py-2 px-3 d-flex align-items-center gap-2 border-end ${activeTab === tab.id ? 'btn-white text-primary border-bottom border-primary border-2 fw-bold' : 'text-secondary bg-light'}`} onClick={() => setActiveTab(tab.id)}>{tab.icon} {tab.label}</button>
                ))}
            </div>
            <div className="p-4 bg-white overflow-hidden">
                {activeTab === 'flight' && (
                    <div className="d-flex overflow-auto pb-3 pt-2" style={{ scrollbarWidth: 'thin' }}>
                        {itinerary.flights.map((segment, index) => (
                            <React.Fragment key={index}>
                                <div className="d-flex flex-column align-items-center" style={{minWidth: '160px'}}>
                                    <div className="badge bg-primary mb-2 shadow-sm">{formatDate(segment.date)}</div>
                                    <div className="fw-bold text-primary mb-1">{segment.departureTime}</div>
                                    <div className="position-relative d-flex align-items-center justify-content-center mb-2">
                                        <FaCircle className="text-primary z-1" size={12} />
                                        <div className="position-absolute start-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>
                                        {index > 0 && <div className="position-absolute end-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>}
                                    </div>
                                    <div className="fw-bold">{segment.origin}</div>
                                    <div className="small text-muted text-center text-truncate w-100 px-2">{getCity(segment.origin)}</div>
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-center px-2" style={{minWidth: '180px'}}>
                                    <div className="badge bg-light text-dark border mb-1">{segment.airline}</div>
                                    <div className="border-top border-2 border-secondary border-dashed w-100 my-1 position-relative">
                                         <FaPlane className="position-absolute top-0 start-50 translate-middle bg-white text-secondary px-1" />
                                    </div>
                                    <div className="small text-muted">{segment.duration}</div>
                                </div>
                                {index === itinerary.flights.length - 1 && (
                                    <div className="d-flex flex-column align-items-center" style={{minWidth: '160px'}}>
                                        <div className="badge bg-secondary mb-2 shadow-sm">{formatDate(segment.date)}</div>
                                        <div className="fw-bold text-dark mb-1">{segment.arrivalTime}</div>
                                        <div className="position-relative d-flex align-items-center justify-content-center mb-2">
                                            <FaCircle className="text-dark z-1" size={12} />
                                            <div className="position-absolute end-50 border-top border-2 border-primary w-100" style={{top: '6px'}}></div>
                                        </div>
                                        <div className="fw-bold">{segment.destination}</div>
                                        <div className="small text-muted text-center text-truncate w-100 px-2">{getCity(segment.destination)}</div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {/* Other tabs content (fare, baggage, rules) can remain here */}
            </div>
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};
  
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airportMap, setAirportMap] = useState({});
  const [priceRange, setPriceRange] = useState(50000);

  // Filters (State Only)
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedDepTimes, setSelectedDepTimes] = useState([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState([]); 

  const getCode = (str) => {
    if (!str) return "";
    return str.match(/\(([^)]+)\)/)?.[1] || str; 
  };

  // --- CALC LOWEST PRICE FOR CALENDAR ---
  const lowestPrice = itineraries.length > 0 
    ? Math.min(...itineraries.map(it => it.totalPrice)) 
    : 0;

  const getRouteTitle = () => {
    if (searchParams.type === 'Multi-City' && searchParams.segments?.length > 0) {
      return searchParams.segments.map((seg, index) => {
        const fromCode = getCode(seg.from);
        const toCode = getCode(seg.to);
        const fromCity = airportMap[fromCode]?.city || fromCode;
        const toCity = airportMap[toCode]?.city || toCode;
        if (index === 0) return `${fromCity} ➝ ${toCity}`;
        return ` ➝ ${toCity}`;
      }).join("");
    }
    const f = getCode(searchParams.from);
    const t = getCode(searchParams.to);
    return `${airportMap[f]?.city || f || "Origin"} ➝ ${airportMap[t]?.city || t || "Dest"}`;
  };

  useEffect(() => {
    setLoading(true);
    const AIRPORTS_API = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';
    const FLIGHTS_API = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    Promise.all([
        fetch(AIRPORTS_API).then(res => res.json()),
        fetch(FLIGHTS_API).then(res => res.json())
    ]).then(([airportsData, flightsData]) => {
        
        const map = {};
        airportsData.forEach(ap => { if(ap.iata_code) map[ap.iata_code] = { city: ap.city, name: ap.name }; });
        setAirportMap(map);

        let constructedItineraries = [];

        if (searchParams.type === 'Multi-City' && searchParams.segments) {
            for(let i=0; i<5; i++) { 
                const itineraryFlights = [];
                let totalPrice = 0;
                let valid = true;

                searchParams.segments.forEach(seg => {
                    const from = getCode(seg.from);
                    const to = getCode(seg.to);
                    const matches = flightsData.filter(f => f.origin === from && f.destination === to);

                    if(matches.length > 0) {
                        const flight = matches[i % matches.length]; 
                        itineraryFlights.push({...flight, date: seg.date}); 
                        totalPrice += flight.price;
                    } else {
                        valid = false;
                    }
                });

                if(valid && itineraryFlights.length > 0) {
                    constructedItineraries.push({
                        id: i,
                        flights: itineraryFlights,
                        totalPrice: totalPrice,
                        totalDuration: `${itineraryFlights.length * 2 + 1}h 30m`, 
                        airline: itineraryFlights[0].airline 
                    });
                }
            }
        } else {
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            const matches = flightsData.filter(f => (!fromCode || f.origin === fromCode) && (!toCode || f.destination === toCode));

            constructedItineraries = matches.map((f, idx) => ({
                id: idx,
                flights: [{...f, date: searchParams.date }], 
                totalPrice: f.price,
                totalDuration: f.duration,
                airline: f.airline
            }));
        }
        setItineraries(constructedItineraries);
        setLoading(false);

    }).catch(err => { console.error(err); setLoading(false); });
  }, [searchParams]);

  const uniqueAirlines = [...new Set(itineraries.map(i => i.airline))];
  const getAirlineLogo = (name) => {
    const logos = {
      IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg",
      "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg",
      Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg",
      SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png",
      "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806",
      AirAsia: "https://www.logo.wine/a/logo/AirAsia_India/AirAsia_India-Logo.wine.svg",
    };
    return logos[name] || null;
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-dark text-white py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                {getRouteTitle()}
              </h5>
              <small className="text-white-50">{searchParams.type} | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate("/")}>Modify</button>
          </div>
        </div>
      </div>

      {/* Passing Lowest Price to Calendar */}
      <FareCalendar initialDate={searchParams.date || new Date()} minPrice={lowestPrice} />

      <div className="container mt-4">
        <div className="row">
          <FlightFilters 
             priceRange={priceRange} setPriceRange={setPriceRange}
             selectedStops={selectedStops} setSelectedStops={setSelectedStops}
             selectedAirlines={selectedAirlines} setSelectedAirlines={setSelectedAirlines}
             selectedDepTimes={selectedDepTimes} setSelectedDepTimes={setSelectedDepTimes}
             selectedArrTimes={selectedArrTimes} setSelectedArrTimes={setSelectedArrTimes}
             uniqueAirlines={uniqueAirlines}
          />

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Scanning flights...</p>
              </div>
            ) : itineraries.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h5 className="fw-bold text-dark mb-0">Available Options</h5>
                   <span className="badge bg-dark">{itineraries.length} Results</span>
                </div>
                {itineraries.map((itinerary) => (
                  <FlightItem 
                    key={itinerary.id} 
                    itinerary={itinerary} 
                    getAirlineLogo={getAirlineLogo} 
                    airportMap={airportMap} 
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-5 bg-white rounded shadow-sm">
                 <FaFilter size={40} className="text-muted mb-3 opacity-25" />
                 <h4>No flights found</h4>
                 <p className="text-muted">Try changing dates or cities.</p>
                 <button className="btn btn-primary mt-2" onClick={() => navigate("/")}>Go Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;