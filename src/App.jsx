import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";

// 1. Importe o componente da nova rota
import TelaPartsRequest from "./Components/TelaAssistenciaPartsRequest/TelaPartsRequest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia/dashboard" element={<TelaDashboard />} />
        
        {/* 2. Adicione a nova rota aqui */}
        <Route 
          path="/assistencia/parts-request" 
          element={<TelaPartsRequest />} 
        />
        
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;