import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaDashboard from "./Components/TelaDashboard/TelaDashboard";
import PaginaLoja from "./Components/PaginaDeCompras/PaginaLoja";
import DistribuidorDashboard from "./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard";
import TelaEstoque from "./Components/TelaDistribuidor/TelaEstoque/TelaEstoque";
import TelaEntrega from "./Components/TelaEntrega/TelaEntrega";
import TelaPagamento from "./Components/TelaCheckout/TelaPagamento";
import TelaConfirmacao from "./Components/TelaPagamentoConfirmado/TelaConfirmacao";
import TesteProdutos from "./Components/TesteProdutos/TesteProdutos";
import Layout from "./Components/Shared/Layout/Layout";
// import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
// import NaoAutorizado from "./Components/NaoAutorizado/NaoAutorizado";
// import { ROLES } from "./hooks/useAuth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login (sem Navbar, pública) */}
        <Route path="/" element={<Inicial />} />

        {/* ===== ROTAS ASSISTÊNCIA TÉCNICA (com Navbar, SEM proteção) ===== */}
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

        {/* ===== ROTAS DISTRIBUIDOR (com Navbar, SEM proteção) ===== */}
        <Route
          path="/distribuidor/dashboard"
          element={
            <Layout userType="distribuidor">
              <DistribuidorDashboard />
            </Layout>
          }
        />

        <Route
          path="/distribuidor/estoque"
          element={
            <Layout userType="distribuidor">
              <TelaEstoque />
            </Layout>
          }
        />

        {/* ===== ROTAS ENTREGADOR (com Navbar, SEM proteção) ===== */}
        <Route
          path="/entregador/dashboard"
          element={
            <Layout userType="entregador">
              <TelaEntregador />
            </Layout>
          }
        />

        {/* ===== ROTA DE TESTE API (sem Navbar) ===== */}
        <Route path="/teste-produtos" element={<TesteProdutos />} />

      </Routes>
    </Router>
  );
}

export default App;
