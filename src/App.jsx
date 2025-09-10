import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
// ...outras telas...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia/dashboard" element={<TelaDashboard/>} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;