import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Misc from "./pages/misc/Misc";
import Comp from "./pages/components/components";
import Kif from "./pages/kif/kif";
import Summary from "./pages/summary/Summary";
import Rls from "./pages/rls/Rls";
import Form from "./pages/form/Form";
import Editform from "./pages/editform/Editform";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kif" element={<Kif />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/Components" element={<Comp />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/Rls" element={<Rls />} />
        <Route path="/form" element={<Form />} />
        <Route path="/edit/:deal_id" element={<Editform />} />     
      </Routes>
    </Router>
  );
}

export default App;
