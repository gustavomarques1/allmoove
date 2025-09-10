import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicial from "./Components/InicialTela/Inicial";
import TelaEntregador from "./Components/TelaEntregador/TelaEntregador";
import TelaAssistencia from "./Components/TelaAssistencia/TelaAssistencia";
// ...outras telas...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/entregador" element={<TelaEntregador />} />
        <Route path="/assistencia" element={<TelaAssistencia />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;