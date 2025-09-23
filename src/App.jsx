import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import TelaPartsRequest from "./Components/TelaAssistenciaPartsRequest/TelaPartsRequest"; 
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja";
import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";
import TelaEntrega from "./Components/TelaEntrega/TelaEntrega";

// 1. Importe o componente da nova tela de Pagamento
// (Ajuste o caminho se você salvou o arquivo em outro lugar)
import TelaPagamento from "./Components/TelaCheckout/TelaPagamento";

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

        <Route 
          path="/assistencia/delivery-options"
          element={<TelaEntrega />}
        />

        {/* 2. Adicione a nova rota para a tela de Pagamento aqui */}
        <Route
          path="/assistencia/pagamento"
          element={<TelaPagamento />}
        />

        <Route path="/distribuidor/dashboard" element={<DistribuidorDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;