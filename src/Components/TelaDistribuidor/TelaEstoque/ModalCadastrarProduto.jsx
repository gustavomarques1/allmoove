import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ModalCadastrarProduto.module.css';
import logger from '../../../utils/logger';
import PropTypes from 'prop-types';

function ModalCadastrarProduto({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    descricao: '',
    quantidade: 0,
    valorUnitario: 0,
    localFisico: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fecha modal ao clicar no overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Fecha modal e reseta formulário
  const handleClose = () => {
    if (isSubmitting) return;
    setFormData({
      nome: '',
      marca: '',
      descricao: '',
      quantidade: 0,
      valorUnitario: 0,
      localFisico: ''
    });
    setErrors({});
    onClose();
  };

  // Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Valida formulário
  const validate = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca é obrigatória';
    }

    if (formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade não pode ser negativa';
    }

    if (formData.valorUnitario < 0) {
      newErrors.valorUnitario = 'Valor não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submete formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Converte strings para números
      const produtoData = {
        ...formData,
        quantidade: parseInt(formData.quantidade) || 0,
        valorUnitario: parseFloat(formData.valorUnitario) || 0
      };

      await onSubmit(produtoData);
      handleClose();
    } catch (error) {
      logger.error('Erro ao cadastrar produto:', error);
      // Você pode adicionar um toast de erro aqui se quiser
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Cadastrar novo produto</h2>
            <p className={styles.subtitle}>
              Preencha as informações para adicionar um novo produto ao estoque
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Nome e Marca */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome <span className={styles.required}>*</span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Ex: Placa Principal"
                value={formData.nome}
                onChange={handleChange}
                className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
              {errors.nome && <span className={styles.errorText}>{errors.nome}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="marca" className={styles.label}>
                Marca <span className={styles.required}>*</span>
              </label>
              <input
                id="marca"
                name="marca"
                type="text"
                placeholder="Ex: Samsung"
                value={formData.marca}
                onChange={handleChange}
                className={`${styles.input} ${errors.marca ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
              {errors.marca && <span className={styles.errorText}>{errors.marca}</span>}
            </div>
          </div>

          {/* Descrição */}
          <div className={styles.formGroup}>
            <label htmlFor="descricao" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              placeholder="Ex: Placa principal para smartphone Samsung Galaxy A54"
              value={formData.descricao}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Qtde e Valor */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="quantidade" className={styles.label}>
                Qtde
              </label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                placeholder="0"
                min="0"
                value={formData.quantidade}
                onChange={handleChange}
                className={`${styles.input} ${errors.quantidade ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
              {errors.quantidade && <span className={styles.errorText}>{errors.quantidade}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="valorUnitario" className={styles.label}>
                Valor (R$)
              </label>
              <input
                id="valorUnitario"
                name="valorUnitario"
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={formData.valorUnitario}
                onChange={handleChange}
                className={`${styles.input} ${errors.valorUnitario ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
              {errors.valorUnitario && <span className={styles.errorText}>{errors.valorUnitario}</span>}
            </div>
          </div>

          {/* Local Físico */}
          <div className={styles.formGroup}>
            <label htmlFor="localFisico" className={styles.label}>
              Local Físico
            </label>
            <input
              id="localFisico"
              name="localFisico"
              type="text"
              placeholder="Ex: A1-B2"
              value={formData.localFisico}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          {/* Footer com botões */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalCadastrarProduto.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ModalCadastrarProduto;
