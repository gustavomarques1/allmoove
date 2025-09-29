import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Importa os estilos do seu módulo
import styles from "./Inicial.module.css";
import { Package } from "lucide-react";
import ModalRecuperarSenha from "../ModalSenha/ModalRecuperarSenha";
import ModalContato from "./ModalContato";

function Inicial() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);

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

  // Funções para o modal de senha
  const closeModal = () => setIsModalOpen(false);
  
  // Funções para o modal de contato
  const openContatoModal = () => setIsContatoModalOpen(true);
  const closeContatoModal = () => setIsContatoModalOpen(false);

  return (
    <>
      {/* 2. Aplica as classes usando o objeto 'styles' */}
      <div className={styles.inicial_container}>
        <Package className={styles.inicial_icon} />
        <h1 className={styles.inicial_title}>AllMoove - Delivery</h1>
        <p className={styles.inicial_description}>
          Sistema de Entregas - Portal do Entregador
        </p>

        <form className={styles.inicial_form} onSubmit={handleSubmit}>
          <h2 className={styles.inicial_subtitle}>Fazer Login</h2>
          <p className={styles.inicial_info}>
            Entre com suas credenciais para acessar o sistema
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Digite 'entregador', 'assistencia', 'distribuidor', 'allmoove' ou seu e-mail"
            className={styles.inicial_input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            className={styles.inicial_input}
          />

          <button type="submit" className={styles.inicial_button}>
            <Package className={styles.icon_button} />
            Entrar no Sistema
          </button>
          
          <div className={styles.inicial_contato}>
            Problemas para acessar? 
            <span onClick={openContatoModal} className={styles.linkContato}>
              Entre em contato
            </span>
          </div>
        </form>
      </div>
      
      {/* Renderiza o modal de recuperar senha (se o estado for true) */}
      {isModalOpen && <ModalRecuperarSenha onClose={closeModal} />}
      
      {/* Renderiza o novo modal de contato (se o estado for true) */}
      {isContatoModalOpen && <ModalContato onClose={closeContatoModal} />}
    </>
  );
}

export default Inicial;

