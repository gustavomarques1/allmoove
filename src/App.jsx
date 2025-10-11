import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja";
import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";
import TelaEntrega from "./Components/TelaEntrega/TelaEntrega";
import TelaPagamento from "./Components/TelaCheckout/TelaPagamento";
import TelaConfirmacao from "./Components/TelaPagamentoConfirmado/TelaConfirmacao";
import TestePedido from "./Components/TestePedido/TestePedido";
import Layout from "./Components/Shared/Layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login (sem Navbar) */}
        <Route path="/" element={<Inicial />} />

        {/* Rotas Assistência Técnica (com Navbar) */}
        <Route
          path="/assistencia/dashboard"
          element={
            <Layout userType="assistencia">
              <TelaDashboard />
            </Layout>
          }
        />

        <Route
          path="/assistencia/loja"
          element={
            <Layout userType="assistencia">
              <PaginaLoja />
            </Layout>
          }
        />

        <Route
          path="/assistencia/delivery-options"
          element={
            <Layout userType="assistencia">
              <TelaEntrega />
            </Layout>
          }
        />

        <Route
          path="/assistencia/pagamento"
          element={
            <Layout userType="assistencia">
              <TelaPagamento />
            </Layout>
          }
        />

        <Route
          path="/assistencia/payment-success"
          element={
            <Layout userType="assistencia">
              <TelaConfirmacao />
            </Layout>
          }
        />

        {/* Rotas Distribuidor (com Navbar) */}
        <Route
          path="/distribuidor/dashboard"
          element={
            <Layout userType="distribuidor">
              <DistribuidorDashboard />
            </Layout>
          }
        />

        {/* Rotas Entregador (com Navbar) */}
        <Route
          path="/entregador"
          element={
            <Layout userType="entregador">
              <TelaEntregador />
            </Layout>
          }
        />

        {/* Rota de teste para debug de pedidos */}
        <Route path="/teste-pedido" element={<TestePedido />} />
      </Routes>
    </Router>
  );
}

export default App;
