import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import TelaPartsRequest from "./Components/TelaAssistenciaPartsRequest/TelaPartsRequest"; 
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja";
import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";

// 1. Importe o componente da nova tela de entrega
// (Ajuste o caminho se você salvou o arquivo em outro lugar)
import TelaEntrega from "./Components/TelaEntrega/TelaEntrega";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia/dashboard" element={<TelaDashboard />} />
        
        <Route 
          path="/assistencia/parts-request" 
          element={<TelaPartsRequest />} 
        />

        <Route 
          path="/assistencia/loja" 
          element={<PaginaLoja />} 
        />

        {/* 2. Adicione a nova rota para a tela de opções de entrega */}
        <Route 
          path="/assistencia/delivery-options"
          element={<TelaEntrega />}
        />

        <Route path="/distribuidor/dashboard" element={<DistribuidorDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;