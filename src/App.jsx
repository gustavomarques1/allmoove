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
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NaoAutorizado from "./Components/NaoAutorizado/NaoAutorizado";
import { ROLES } from "./hooks/useAuth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login (sem Navbar, pública) */}
        <Route path="/" element={<Inicial />} />

        {/* Página de Não Autorizado */}
        <Route path="/nao-autorizado" element={<NaoAutorizado />} />

        {/* ===== ROTAS ASSISTÊNCIA TÉCNICA (com Navbar e proteção) ===== */}
        <Route
          path="/assistencia/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
              <Layout userType="assistencia">
                <TelaDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistencia/loja"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
              <Layout userType="assistencia">
                <PaginaLoja />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistencia/delivery-options"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
              <Layout userType="assistencia">
                <TelaEntrega />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistencia/pagamento"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
              <Layout userType="assistencia">
                <TelaPagamento />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistencia/payment-success"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ASSISTENCIA_TECNICA]}>
              <Layout userType="assistencia">
                <TelaConfirmacao />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ===== ROTAS DISTRIBUIDOR (com Navbar e proteção) ===== */}
        <Route
          path="/distribuidor/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DISTRIBUIDOR]}>
              <Layout userType="distribuidor">
                <DistribuidorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ===== ROTAS ENTREGADOR (com Navbar e proteção) ===== */}
        <Route
          path="/entregador/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ENTREGADOR]}>
              <Layout userType="entregador">
                <TelaEntregador />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota de teste para debug de pedidos (apenas desenvolvimento) */}
        <Route path="/teste-pedido" element={<TestePedido />} />
      </Routes>
    </Router>
  );
}

export default App;
