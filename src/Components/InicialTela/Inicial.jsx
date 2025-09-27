import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inicial.css";
import { Package } from "lucide-react";
import ModalRecuperarSenha from "../ModalSenha/ModalRecuperarSenha";  

function Inicial() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. Crie o estado para controlar o modal
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === "entregador") {
      navigate("/entregador");
    } else if (email.trim().toLowerCase() === "assistencia") {
      navigate("/assistencia/dashboard");
    } else if (email.trim().toLowerCase() === "distribuidor") {
      navigate("/distribuidor/dashboard");
    } else if (email.trim().toLowerCase() === "allmoove") {
      alert("Rota de administração não implementada!");
    } else {
      alert("Usuário não reconhecido!");
    }
  };

  // Funções para abrir e fechar o modal
  // const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <> {/* Use um Fragment para agrupar os elementos sem adicionar um nó extra ao DOM */}
      <div className="inicial_container">
        
        <Package className="inicial_icon" />
        <h1 className="inicial_title">AllMoove - Delivery</h1>
        <p className="inicial_description">
          Sistema de Entregas - Portal do Entregador
        </p>

        <form className="inicial_form" onSubmit={handleSubmit}>
          <h2 className="inicial_subtitle">Fazer Login</h2>
          <p className="inicial_info">
            Entre com suas credenciais para acessar o sistema
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Digite 'entregador', 'assistencia', 'distribuidor', 'allmoove' ou seu e-mail"
            className="inicial_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            className="inicial_input"
          />

          <button type="submit" className="inicial_button">
            <Package className="icon_button" />
            Entrar no Sistema
          </button>

          {/* <div className="inicial_links"> */}
            {/* 3. Adicione o evento onClick para abrir o modal */}
            {/* <span className="inicial_rec" onClick={openModal} style={{cursor: 'pointer'}}>
              Esqueci minha senha
            </span>
            <span className="inicial_cadastrar">Cadastrar</span>
          </div> */}
    
          {/* <div className="inicial_acessos">
            <strong>Acessos rápidos:</strong>
            <ul>
              <li>• "entregador" - Sistema de entregas</li>
              <li>• "assistencia" - Assistência técnica</li>
              <li>• "distribuidor" - Distribuição de peças</li>
              <li>• "allmoove" - Administração</li>
            </ul>
          </div> */}

          <div className="inicial_contato">
            Problemas para acessar? <a href="#">Entre em contato</a>
          </div>
        </form>
      </div>
      
      {/* 4. Renderize o modal condicionalmente */}
      {isModalOpen && <ModalRecuperarSenha onClose={closeModal} />}
    </>
  );
}

export default Inicial;