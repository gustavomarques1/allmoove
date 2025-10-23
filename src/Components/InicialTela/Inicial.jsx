import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Inicial.module.css";
import logger from "../../utils/logger";
import { Package, AlertCircle } from "lucide-react";
import ModalRecuperarSenha from "../ModalSenha/ModalRecuperarSenha";
import ModalContato from "./ModalContato";
import Button from "../Shared/Button/Button";
import Logo from "../Shared/Logo/Logo";
import { useAuth } from "../../hooks/useAuth";

function Inicial() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);

  const navigate = useNavigate();
  const { login, loading: isLoading, getDashboardRoute } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    // Usa o hook useAuth para fazer login
    const result = await login(email, password);

    if (result.success) {
      logger.info('✅ Login bem-sucedido! Papel do usuário:', result.role);

      // Redireciona para o dashboard apropriado baseado no papel
      // IMPORTANTE: Usa result.role diretamente para evitar race condition
      const dashboardRoute = getDashboardRoute(result.role);
      logger.info('🔀 Redirecionando para:', dashboardRoute);
      navigate(dashboardRoute);
    } else {
      // Exibe mensagem de erro
      setError(result.error || 'Erro ao fazer login. Tente novamente.');
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const openContatoModal = () => setIsContatoModalOpen(true);
  const closeContatoModal = () => setIsContatoModalOpen(false);

  return (
    <>
      <div className={styles.inicial_container}>
        <form className={styles.inicial_form} onSubmit={handleLogin}>
          <Logo size={40} className={styles.inicial_icon} />
          <p className={styles.inicial_description}>
            Peças de reposição. Peça AllMoove.
          </p>

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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            leftIcon={!isLoading && <Package size={18} />}
          >
            {isLoading ? 'Entrando...' : 'Iniciar Sessão'}
          </Button>
          
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