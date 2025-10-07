import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja";
import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";
import TelaEntrega from "./Components/TelaEntrega/TelaEntrega";
import TelaPagamento from "./Components/TelaCheckout/TelaPagamento";

// 1. Importe o componente da nova tela de Confirmação
// (Ajuste o caminho se você salvou o arquivo em outro lugar)
import TelaConfirmacao from "./Components/TelaPagamentoConfirmado/TelaConfirmacao";
import TestePedido from "./Components/TestePedido/TestePedido";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia/dashboard" element={<TelaDashboard />} />
        
        

        <Route 
          path="/assistencia/loja" 
          element={<PaginaLoja />} 
        />

        <Route 
          path="/assistencia/delivery-options"
          element={<TelaEntrega />}
        />

        <Route
          path="/assistencia/pagamento"
          element={<TelaPagamento />}
        />

        {/* 2. Rota para a tela de Pagamento Confirmado adicionada aqui */}
        <Route 
          path="/assistencia/payment-success"
          element={<TelaConfirmacao />}
        />

        <Route path="/distribuidor/dashboard" element={<DistribuidorDashboard/>} />

        {/* Rota de teste para debug de pedidos */}
        <Route path="/teste-pedido" element={<TestePedido />} />
      </Routes>
    </Router>
  );
}

export default App;
