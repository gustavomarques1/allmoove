import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Importa os estilos do seu módulo
import styles from "./Inicial.module.css";
import { Package, AlertCircle } from "lucide-react";
import ModalRecuperarSenha from "../ModalSenha/ModalRecuperarSenha";
import ModalContato from "./ModalContato";
import api from "../../api/api";

function Inicial() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = {
      email,
      password,
    };

    try {
      const response = await api.post('api/account/loginuser', data);

      localStorage.setItem('email', email);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('expiration', response.data.expiration);

      navigate('/assistencia/dashboard');

    } catch (err) {
      // --- LÓGICA DE ERRO MELHORADA ---
      if (err.response) {
        // O servidor respondeu com um status de erro (ex: 400, 401, 500)
        if (err.response.status === 400 || err.response.status === 401) {
          // Se o erro for 'Bad Request' ou 'Unauthorized', as credenciais estão erradas.
          setError('E-mail ou senha incorretos. Por favor, verifique e tente novamente.');
        } else {
          // Para qualquer outro erro do servidor (ex: 500 Internal Server Error)
          setError('Ocorreu um erro no servidor. Tente novamente mais tarde.');
        }
      } else if (err.request) {
        // A requisição foi feita, mas não houve resposta (servidor offline, problema de rede)
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Algum outro erro aconteceu ao configurar a requisição
        setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }
      console.error("Erro na autenticação:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const openContatoModal = () => setIsContatoModalOpen(true);
  const closeContatoModal = () => setIsContatoModalOpen(false);

  return (
    <>
      <div className={styles.inicial_container}>
        <Package className={styles.inicial_icon} />
        <h1 className={styles.inicial_title}>AllMoove - Delivery</h1>
        <p className={styles.inicial_description}>
          Sistema de Entregas - Portal do Entregador
        </p>

        <form className={styles.inicial_form} onSubmit={handleLogin}>
          <h2 className={styles.inicial_subtitle}>Fazer Login</h2>
          <p className={styles.inicial_info}>
            Entre com suas credenciais para acessar o sistema
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            className={styles.inicial_input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            className={styles.inicial_input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.inicial_button}
            disabled={isLoading}
          >
            {isLoading ? ('Entrando...') : (
              <>
                <Package className={styles.icon_button} />
                Entrar no Sistema
              </>
            )}
          </button>
          
          <div className={styles.inicial_contato}>
            Problemas para acessar? 
            <span onClick={openContatoModal} className={styles.linkContato}>
              Entre em contato
            </span>
          </div>
        </form>
      </div>
      
      {isModalOpen && <ModalRecuperarSenha onClose={closeModal} />}
      {isContatoModalOpen && <ModalContato onClose={closeContatoModal} />}
    </>
  );
}

export default Inicial;