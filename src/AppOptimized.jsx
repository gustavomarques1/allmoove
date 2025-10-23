import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Shared/Layout/Layout";

// Carregamento imediato (tela de login é sempre necessária)
import Inicial from "./Components/InicialTela/Inicial";

// Lazy Loading - Carrega componentes apenas quando necessário
const TelaDashboard = lazy(() => import("./Components/TelaDashboard/TelaDashboard"));
const PaginaLoja = lazy(() => import("./Components/PaginaDeCompras/PaginaLoja"));
const TelaEntrega = lazy(() => import("./Components/TelaEntrega/TelaEntrega"));
const TelaPagamento = lazy(() => import("./Components/TelaCheckout/TelaPagamento"));
const TelaConfirmacao = lazy(() => import("./Components/TelaPagamentoConfirmado/TelaConfirmacao"));
const DistribuidorDashboard = lazy(() => import("./Components/TelaDistribuidor/TelaDistribuidorDashboard/DistribuidorDashboard"));
const TelaEstoque = lazy(() => import("./Components/TelaDistribuidor/TelaEstoque/TelaEstoque"));
const TelaEntregador = lazy(() => import("./Components/TelaEntregador/TelaEntregador"));

// Componente de Loading
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  }}>
    Carregando...
  </div>
);

function AppOptimized() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rota de Login (sem Navbar, pública) */}
          <Route path="/" element={<Inicial />} />

          {/* ===== ROTAS ASSISTÊNCIA TÉCNICA ===== */}
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

          {/* ===== ROTAS DISTRIBUIDOR ===== */}
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

          {/* ===== ROTAS ENTREGADOR ===== */}
          <Route
            path="/entregador/dashboard"
            element={
              <Layout userType="entregador">
                <TelaEntregador />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppOptimized;