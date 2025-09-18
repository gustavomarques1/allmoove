import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import TelaPartsRequest from "./Components/TelaAssistenciaPartsRequest/TelaPartsRequest"; 

// Importando a nova página principal da loja
// import PaginaLoja from "../src/Components/PaginaDeCompras/PaginaLoja"; 
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja"

import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia/dashboard" element={<TelaDashboard />} />
        
        {/* Rota ANTIGA (mantida para avaliação) */}
        <Route 
          path="/assistencia/parts-request" 
          element={<TelaPartsRequest />} 
        />

        {/* Rota NOVA que acabamos de criar */}
        <Route 
          path="/assistencia/loja" 
          element={<PaginaLoja />} 
        />

        <Route path="/distribuidor/dashboard" element={<DistribuidorDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;