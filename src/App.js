
import './App.css';
import Host from './Pages/Host';
import EditEvent from './Pages/EditEvent';
import ReadMe from './Pages/ReadMe';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Success from './Pages/Success';
import AllEvents from './Pages/AllEvents';
import EventDetails from './Pages/EventDetails';



function App() {
  return (
    <div className="App">



<Router>

      <Routes>


        
      <Route path="/" element={<Host />} />

      <Route path="/host/form/:planId" element={<Host />} />

      <Route path="/EditEvent" element={<EditEvent />} />

      <Route path="/ReadMe" element={<ReadMe />} />

      <Route path="/success" element={<Success />} />

      <Route path="/all-events" element={<AllEvents />} />

      <Route path="/event-details/:id" element={<EventDetails />} />

      </Routes>

      </Router>
     
    </div>
  );
}

export default App;
