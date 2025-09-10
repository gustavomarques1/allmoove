import React, { useState } from 'react';
import { X, Mail, ArrowLeft } from 'lucide-react';
import './ModalRecuperarSenha.css';

function ModalRecuperarSenha({ onClose }) {
  const [email, setEmail] = useState('');

  // Verifica se o e-mail está vazio (depois de remover espaços em branco)
  const isEmailEmpty = email.trim() === '';

  const handleSend = () => {
    // Uma segurança extra, embora o botão esteja desabilitado
    if (isEmailEmpty) {
      alert('Por favor, digite seu e-mail.');
      return;
    }
    alert(`Instruções de recuperação enviadas para: ${email}`);
    onClose();
  };
  
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <Mail size={24} className="modal-header-icon" />
          <h2>Recuperar Senha</h2>
        </div>
        
        <p className="modal-description">
          Digite seu e-mail para receber instruções de recuperação de senha
        </p>

        <div className="modal-form">
          <label htmlFor="email-recuperacao">E-mail</label>
          <input
            type="email"
            id="email-recuperacao"
            placeholder="Digite seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-back-button" onClick={onClose}>
            <ArrowLeft size={16} />
            Voltar
          </button>
          
          {/* BOTÃO MODIFICADO ABAIXO */}
          <button 
            className={`modal-send-button ${isEmailEmpty ? 'disabled' : ''}`} 
            onClick={handleSend}
            disabled={isEmailEmpty} // Desabilita o botão se o e-mail estiver vazio
          >
            <Mail size={16} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRecuperarSenha;