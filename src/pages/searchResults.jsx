import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaPlane, 
  FaRupeeSign, 
  FaArrowRight, 
  FaFilter, 
  FaSun, 
  FaMoon, 
  FaCloudSun, 
  FaClock 
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {}; // Handles undefined state safely
  
  // Independent Dates
  const [depDate, setDepDate] = useState(searchParams.date || new Date().toDateString());
  const [retDate, setRetDate] = useState(searchParams.returnDate || new Date().toDateString());

  const [itineraries, setItineraries] = useState([]); 
  const [outboundList, setOutboundList] = useState([]); 
  const [returnList, setReturnList] = useState([]); 
  
  const [selectedOutboundId, setSelectedOutboundId] = useState(null);
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [airportMap, setAirportMap] = useState({});
  const [priceRange, setPriceRange] = useState(50000);

  // Filters
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedDepTimes, setSelectedDepTimes] = useState([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState([]); 

  const getCode = (str) => str ? str.match(/\(([^)]+)\)/)?.[1] || str : "";
  
  // Dynamic Title Logic
  const getRouteTitle = () => {
    if (searchParams.type === 'Multi-City') return "Multi-City Trip";
    const f = getCode(searchParams.from || 'DEL');
    const t = getCode(searchParams.to || 'BOM');
    return `${airportMap[f]?.city || f} ${searchParams.type === 'Round Trip' ? '⇄' : '➝'} ${airportMap[t]?.city || t}`;
  };

  useEffect(() => {
    setLoading(true);
    const AIRPORTS_API = 'https://raw.githubusercontent.com/algolia/datasets/master/airports/airports.json';
    const FLIGHTS_API = "https://gist.githubusercontent.com/ratnakarguru/9c7e9b4ffcdbf653fe8c467b470f2eec/raw";

    Promise.all([fetch(AIRPORTS_API).then(res => res.json()), fetch(FLIGHTS_API).then(res => res.json())])
    .then(([airportsData, flightsData]) => {
        const map = {};
        airportsData.forEach(ap => { if(ap.iata_code) map[ap.iata_code] = { city: ap.city, name: ap.name }; });
        setAirportMap(map);

        if (searchParams.type === 'Round Trip') {
            // ... (Round Trip Logic same as before)
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            let outFlights = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            let retFlights = flightsData.filter(f => f.origin === toCode && f.destination === fromCode);
            
            if (outFlights.length === 0) outFlights = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 5000, id: 901}];
            if (retFlights.length === 0) retFlights = outFlights.map(f => ({...f, origin: toCode || 'BOM', destination: fromCode || 'DEL', id: f.id + 100}));

            // Date & Price Randomization
            const depRand = Math.floor(Math.random() * 500); 
            const retRand = Math.floor(Math.random() * 500); 
            outFlights = outFlights.map(f => ({ ...f, date: depDate, price: f.price + depRand }));
            retFlights = retFlights.map(f => ({ ...f, date: retDate, price: f.price + retRand }));

            setOutboundList(outFlights);
            setReturnList(retFlights);
            if(!selectedOutboundId && outFlights[0]) setSelectedOutboundId(outFlights[0].id);
            if(!selectedReturnId && retFlights[0]) setSelectedReturnId(retFlights[0].id);

        } else if (searchParams.type === 'Multi-City') {
            // **FIXED MULTI-CITY LOGIC**
            // Fallback if segments are missing
            const segments = searchParams.segments && searchParams.segments.length > 0 
                ? searchParams.segments 
                : [
                    {from: 'DEL', to: 'BOM', date: new Date().toDateString()},
                    {from: 'BOM', to: 'BLR', date: new Date(new Date().setDate(new Date().getDate() + 2)).toDateString()}
                  ];

            const constructedItineraries = [];
            
            // Create 5 mock itinerary options
            for(let i=0; i<5; i++) { 
                const itineraryFlights = [];
                let totalPrice = 0;
                
                segments.forEach((seg, idx) => {
                    const fCode = getCode(seg.from);
                    const tCode = getCode(seg.to);
                    // Find a flight or use a fallback
                    let matches = flightsData.filter(f => f.origin === fCode && f.destination === tCode);
                    if(matches.length === 0) matches = [{...flightsData[0], origin: fCode, destination: tCode, price: 4000 + (idx*1000), id: 999+i+idx}];
                    
                    const flight = matches[i % matches.length];
                    itineraryFlights.push({...flight, date: seg.date, price: flight.price});
                    totalPrice += flight.price;
                });
                
                constructedItineraries.push({ 
                    id: i, 
                    tripType: 'Multi-City', 
                    flights: itineraryFlights, 
                    totalPrice 
                });
            }
            setItineraries(constructedItineraries);

        } else {
            // One Way Logic
            const fromCode = getCode(searchParams.from);
            const toCode = getCode(searchParams.to);
            let matches = flightsData.filter(f => f.origin === fromCode && f.destination === toCode);
            if(matches.length === 0) matches = [{...flightsData[0], origin: fromCode || 'DEL', destination: toCode || 'BOM', price: 4000, id: 888}];
            const constructed = matches.map(f => ({ id: f.id, tripType: 'One Way', flights: [{...f, date: depDate}], totalPrice: f.price }));
            setItineraries(constructed);
        }
        setLoading(false);
    });
  }, [searchParams, depDate, retDate]);

  const getAirlineLogo = (name) => {
    const logos = { IndiGo: "https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg", "Air India": "https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg", Vistara: "https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg", SpiceJet: "https://1000logos.net/wp-content/uploads/2021/07/SpiceJet-Logo.png", "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Akasa_Air_logo.svg/960px-Akasa_Air_logo.svg.png?20211225210806" };
    return logos[name] || null;
  };

  const filterList = (list) => list.filter(f => (!priceRange || f.price <= priceRange) && (selectedStops.length === 0 || selectedStops.includes(f.stops)) && (selectedAirlines.length === 0 || selectedAirlines.includes(f.airline)));

  const filteredOutbound = filterList(outboundList);
  const filteredReturn = filterList(returnList);
  const selectedOutbound = outboundList.find(f => f.id === selectedOutboundId);
  const selectedReturn = returnList.find(f => f.id === selectedReturnId);
  const grandTotal = (selectedOutbound?.price || 0) + (selectedReturn?.price || 0);
  const uniqueAirlines = [...new Set([...outboundList, ...returnList, ...itineraries.flatMap(i => i.flights.map(f=>f.airline))].map(f => f.airline || f))];

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Header */}
      <div className="bg-dark text-white py-3 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">{getRouteTitle()}</h5>
              <small className="text-white-50">{searchParams.type || 'One Way'} | Economy</small>
            </div>
            <button className="btn btn-sm btn-outline-light rounded-pill px-4" onClick={() => navigate("/")}>Modify</button>
        </div>
      </div>

      {/* Render Dual Calendar for Round Trip, Single for others */}
      {searchParams.type === 'Round Trip' ? (
          <DualFareCalendar depDate={depDate} retDate={retDate} onDepChange={setDepDate} onRetChange={setRetDate} />
      ) : (
         <div className="container mt-3">
             <CalendarStrip startDate={depDate} selectedDate={depDate} onDateSelect={setDepDate} minPrice={4000} />
         </div>
      )}

      <div className="container mt-4">
        <div className="row">
          <FlightFilters 
             priceRange={priceRange} setPriceRange={setPriceRange} selectedStops={selectedStops} setSelectedStops={setSelectedStops}
             selectedAirlines={selectedAirlines} setSelectedAirlines={setSelectedAirlines} selectedDepTimes={selectedDepTimes} setSelectedDepTimes={setSelectedDepTimes}
             selectedArrTimes={selectedArrTimes} setSelectedArrTimes={setSelectedArrTimes} uniqueAirlines={uniqueAirlines}
          />
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : searchParams.type === 'Round Trip' ? (
                <>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="bg-white border rounded p-2" style={{minHeight: '500px'}}>
                                <div className="text-muted small fw-bold mb-2">Select Departure</div>
                                {filteredOutbound.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedOutboundId === f.id} onSelect={(x) => setSelectedOutboundId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-white border rounded p-2" style={{minHeight: '500px'}}>
                                <div className="text-muted small fw-bold mb-2">Select Return</div>
                                {filteredReturn.map(f => <SelectableFlightCard key={f.id} flight={f} isSelected={selectedReturnId === f.id} onSelect={(x) => setSelectedReturnId(x.id)} getAirlineLogo={getAirlineLogo} airportMap={airportMap}/>)}
                            </div>
                        </div>
                    </div>
                    {/* Sticky Footer for Round Trip */}
                    <div className="fixed-bottom bg-white shadow-lg p-3 border-top" style={{zIndex: 1050}}>
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center gap-4">
                                        <div><div className="small text-muted">Departure</div><div className="fw-bold">{selectedOutbound?.airline} {selectedOutbound?.flightCode}</div></div>
                                        <FaExchangeAlt className="text-secondary"/>
                                        <div><div className="small text-muted">Return</div><div className="fw-bold">{selectedReturn?.airline} {selectedReturn?.flightCode}</div></div>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    <div className="d-flex align-items-center justify-content-end gap-3">
                                        <div><div className="small text-muted text-uppercase">Total Fare</div><div className="h4 mb-0 fw-bold">₹{grandTotal.toLocaleString()}</div></div>
                                        <button className="btn btn-primary fw-bold px-4 rounded-pill">BOOK NOW</button>
                                    </div>
                                </div>
                            </div>
                            <div className="small text-success fw-bold" style={{ fontSize: '0.75rem' }}>Free Cancellation</div>
                          </div>
                          <button className="btn fw-bold text-white rounded-pill px-4 shadow-sm" style={{ backgroundColor: '#ff6b00' }}>
                            BOOK
                          </button>
                        </div>

                      </div>
                    </div>
                    <div style={{height: '80px'}}></div> 
                </>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold text-dark mb-0">Available Flights</h5>
                        <span className="badge bg-dark">{itineraries.length} Options</span>
                    </div>
                    {itineraries.map((itinerary) => (
                        <StandardFlightCard key={itinerary.id} itinerary={itinerary} getAirlineLogo={getAirlineLogo} airportMap={airportMap} />
                    ))}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;