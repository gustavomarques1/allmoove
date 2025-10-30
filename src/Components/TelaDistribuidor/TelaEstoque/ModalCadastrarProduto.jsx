import React, { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import styles from './ModalCadastrarProduto.module.css';
import logger from '../../../utils/logger';
import PropTypes from 'prop-types';
import { getSegmentos, getMarcas, getModelos, getGrupos, getTags } from '../../../api/produtosServices';

function ModalCadastrarProduto({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    ean: '',
    idSegmento: '',
    idMarca: '',
    idModelo: '',
    idGrupo: '',
    idTag: '',
    precoCusto: '',
    precoVenda: '',
    precoVendaPix: '',
    quantidade: '',
    posicao: '',
    imagem: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temCodigoBarras, setTemCodigoBarras] = useState(false);

  // Listas para dropdowns
  const [segmentos, setSegmentos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Carrega dados dos dropdowns ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      carregarDadosDropdowns();
    }
  }, [isOpen]);

  const carregarDadosDropdowns = async () => {
    try {
      setLoadingDropdowns(true);
      const [segmentosData, marcasData, modelosData, gruposData, tagsData] = await Promise.all([
        getSegmentos().catch(() => []),
        getMarcas().catch(() => []),
        getModelos().catch(() => []),
        getGrupos().catch(() => []),
        getTags().catch(() => [])
      ]);

      setSegmentos(segmentosData);
      setMarcas(marcasData);
      setModelos(modelosData);
      setGrupos(gruposData);
      setTags(tagsData);

      logger.info('✅ Dados dos dropdowns carregados:', {
        segmentos: segmentosData.length,
        marcas: marcasData.length,
        modelos: modelosData.length,
        grupos: gruposData.length,
        tags: tagsData.length
      });
    } catch (error) {
      logger.error('Erro ao carregar dados dos dropdowns:', error);
    } finally {
      setLoadingDropdowns(false);
    }
  };

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
      descricao: '',
      sku: '',
      ean: '',
      idSegmento: '',
      idMarca: '',
      idModelo: '',
      idGrupo: '',
      idTag: '',
      precoCusto: '',
      precoVenda: '',
      precoVendaPix: '',
      quantidade: '',
      posicao: '',
      imagem: ''
    });
    setErrors({});
    setTemCodigoBarras(false);
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

    // Campos obrigatórios básicos
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }

    // Nova validação: Descrição obrigatória (mínimo 20 caracteres)
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = 'Descrição deve ter no mínimo 20 caracteres';
    }

    // Classificação obrigatória
    if (!formData.idSegmento) {
      newErrors.idSegmento = 'Segmento é obrigatório';
    }

    if (!formData.idMarca) {
      newErrors.idMarca = 'Marca é obrigatória';
    }

    // Nova validação: Quantidade obrigatória
    if (!formData.quantidade && formData.quantidade !== 0 && formData.quantidade !== '0') {
      newErrors.quantidade = 'Quantidade é obrigatória';
    } else if (parseFloat(formData.quantidade) < 0) {
      newErrors.quantidade = 'Quantidade não pode ser negativa';
    }

    // Nova validação: Imagem obrigatória - REMOVIDA temporariamente para permitir imagem padrão
    // A imagem padrão será adicionada automaticamente se não fornecida
    // if (!formData.imagem.trim()) {
    //   newErrors.imagem = 'Imagem é obrigatória (URL ou será usada imagem padrão)';
    // }

    // Nova validação: EAN obrigatório se tem código de barras
    if (temCodigoBarras && !formData.ean.trim()) {
      newErrors.ean = 'Código de barras (EAN) é obrigatório';
    } else if (temCodigoBarras && !/^\d{13}$/.test(formData.ean.trim())) {
      newErrors.ean = 'EAN deve ter exatamente 13 dígitos numéricos';
    }

    // Validações de preço
    if (formData.precoCusto && parseFloat(formData.precoCusto) < 0) {
      newErrors.precoCusto = 'Preço de custo não pode ser negativo';
    }

    if (!formData.precoVenda || formData.precoVenda === '') {
      newErrors.precoVenda = 'Preço de venda é obrigatório';
    } else if (parseFloat(formData.precoVenda) <= 0) {
      newErrors.precoVenda = 'Preço de venda deve ser maior que zero';
    }

    if (formData.precoVendaPix && parseFloat(formData.precoVendaPix) < 0) {
      newErrors.precoVendaPix = 'Preço PIX não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para obter imagem padrão baseada no segmento
  const getDefaultImage = (segmentoId) => {
    // Busca o nome do segmento selecionado
    const segmentoSelecionado = segmentos.find(seg => seg.id === parseInt(segmentoId));
    const nomeSegmento = segmentoSelecionado?.nome?.toLowerCase() || '';

    // Mapeia nomes de segmentos para imagens
    if (nomeSegmento.includes('celular') || nomeSegmento.includes('smartphone')) {
      return '/images/default-celular.svg';
    } else if (nomeSegmento.includes('notebook') || nomeSegmento.includes('laptop')) {
      return '/images/default-notebook.svg';
    } else if (nomeSegmento.includes('tela') || nomeSegmento.includes('display')) {
      return '/images/default-tela.svg';
    } else if (nomeSegmento.includes('acessório') || nomeSegmento.includes('acessorio')) {
      return '/images/default-acessorio.svg';
    }

    // Fallback para imagem genérica
    return '/images/default-produto.svg';
  };

  // Submete formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Adiciona imagem padrão se não foi fornecida
      let imagemFinal = formData.imagem.trim();
      if (!imagemFinal) {
        imagemFinal = getDefaultImage(formData.idSegmento);
        logger.info('🖼️ Usando imagem padrão para segmento:', formData.idSegmento);
      }

      // Log do formData ANTES da conversão
      logger.info('📋 FormData ANTES da conversão:', {
        quantidade_raw: formData.quantidade,
        precoVenda_raw: formData.precoVenda,
        tipo_quantidade: typeof formData.quantidade,
        tipo_precoVenda: typeof formData.precoVenda
      });

      // Converte strings para números e prepara dados
      const quantidadeConvertida = formData.quantidade !== '' ? parseFloat(formData.quantidade) : 0;
      const precoVendaConvertido = formData.precoVenda !== '' ? parseFloat(formData.precoVenda) : 0;

      logger.info('🔢 Valores APÓS conversão:', {
        quantidade: quantidadeConvertida,
        precoVenda: precoVendaConvertido,
        tipo_quantidade: typeof quantidadeConvertida,
        tipo_precoVenda: typeof precoVendaConvertido
      });

      const produtoData = {
        ...formData,
        imagem: imagemFinal,
        quantidade: quantidadeConvertida,
        precoCusto: formData.precoCusto !== '' ? parseFloat(formData.precoCusto) : 0,
        precoVenda: precoVendaConvertido,
        precoVendaPix: formData.precoVendaPix !== '' ? parseFloat(formData.precoVendaPix) : 0,
        idSegmento: formData.idSegmento ? parseInt(formData.idSegmento) : null,
        idMarca: formData.idMarca ? parseInt(formData.idMarca) : null,
        idModelo: formData.idModelo ? parseInt(formData.idModelo) : null,
        idGrupo: formData.idGrupo ? parseInt(formData.idGrupo) : null,
        idTag: formData.idTag ? parseInt(formData.idTag) : null,
        // Remove EAN se não tem código de barras
        ean: temCodigoBarras ? formData.ean : ''
      };

      logger.info('📦 Dados do produto a cadastrar:', {
        ...produtoData,
        precoVenda_original: formData.precoVenda,
        precoVenda_convertido: produtoData.precoVenda,
        quantidade_original: formData.quantidade,
        quantidade_convertida: produtoData.quantidade
      });

      logger.info('🚀 ProdutoData FINAL sendo enviado para onSubmit:', JSON.stringify(produtoData, null, 2));
      logger.info('🔍 VERIFICAÇÃO CRÍTICA - Quantidade no produtoData:', {
        quantidade: produtoData.quantidade,
        tipo: typeof produtoData.quantidade,
        isNumber: typeof produtoData.quantidade === 'number',
        isZero: produtoData.quantidade === 0,
        isNaN: isNaN(produtoData.quantidade)
      });

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
          {loadingDropdowns && (
            <div className={styles.loadingMessage}>
              Carregando opções...
            </div>
          )}

          {/* SEÇÃO 1: Informações Básicas */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Informações Básicas</h3>

            {/* Nome e SKU */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>
                  Nome do Produto <span className={styles.required}>*</span>
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex: Tela iPhone 14 Pro OLED"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                />
                {errors.nome && <span className={styles.errorText}>{errors.nome}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sku" className={styles.label}>
                  SKU (Código) <span className={styles.required}>*</span>
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="Ex: TIP14PRO001"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.sku ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                />
                {errors.sku && <span className={styles.errorText}>{errors.sku}</span>}
              </div>
            </div>

            {/* Descrição */}
            <div className={styles.formGroup}>
              <label htmlFor="descricao" className={styles.label}>
                Descrição <span className={styles.required}>*</span>
              </label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o produto, suas características e diferenciais (mínimo 20 caracteres)"
                value={formData.descricao}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.descricao ? styles.inputError : ''}`}
                rows={3}
                minLength={20}
                maxLength={500}
                disabled={isSubmitting || loadingDropdowns}
              />
              {errors.descricao && <span className={styles.errorText}>{errors.descricao}</span>}
              <small className={styles.helpText}>
                {formData.descricao.length}/500 caracteres
              </small>
            </div>

            {/* EAN - Condicional */}
            <div className={styles.formGroup}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="temCodigoBarras"
                  checked={temCodigoBarras}
                  onChange={(e) => {
                    setTemCodigoBarras(e.target.checked);
                    if (!e.target.checked) {
                      setFormData(prev => ({ ...prev, ean: '' }));
                      if (errors.ean) {
                        setErrors(prev => ({ ...prev, ean: '' }));
                      }
                    }
                  }}
                  disabled={isSubmitting || loadingDropdowns}
                />
                <label htmlFor="temCodigoBarras" className={styles.checkboxLabel}>
                  Produto possui código de barras (EAN)
                </label>
              </div>

              {temCodigoBarras && (
                <div className={styles.eanInputGroup}>
                  <label htmlFor="ean" className={styles.label}>
                    EAN (Código de Barras) <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="ean"
                    name="ean"
                    type="text"
                    placeholder="Digite os 13 dígitos do código de barras"
                    pattern="[0-9]{13}"
                    maxLength="13"
                    value={formData.ean}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.ean ? styles.inputError : ''}`}
                    disabled={isSubmitting || loadingDropdowns}
                  />
                  {errors.ean && <span className={styles.errorText}>{errors.ean}</span>}
                </div>
              )}
            </div>
          </div>

          {/* SEÇÃO 2: Classificação */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Classificação</h3>

            {/* Segmento e Marca */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="idSegmento" className={styles.label}>
                  Segmento <span className={styles.required}>*</span>
                </label>
                <select
                  id="idSegmento"
                  name="idSegmento"
                  value={formData.idSegmento}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.idSegmento ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                >
                  <option value="">Selecione um segmento</option>
                  {segmentos.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.nome}
                    </option>
                  ))}
                </select>
                {errors.idSegmento && <span className={styles.errorText}>{errors.idSegmento}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idMarca" className={styles.label}>
                  Marca <span className={styles.required}>*</span>
                </label>
                <select
                  id="idMarca"
                  name="idMarca"
                  value={formData.idMarca}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.idMarca ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                >
                  <option value="">Selecione uma marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nome}
                    </option>
                  ))}
                </select>
                {errors.idMarca && <span className={styles.errorText}>{errors.idMarca}</span>}
              </div>
            </div>

            {/* Modelo e Grupo */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="idModelo" className={styles.label}>
                  Modelo
                </label>
                <select
                  id="idModelo"
                  name="idModelo"
                  value={formData.idModelo}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isSubmitting || loadingDropdowns}
                >
                  <option value="">Selecione um modelo</option>
                  {modelos.map((modelo) => (
                    <option key={modelo.id} value={modelo.id}>
                      {modelo.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idGrupo" className={styles.label}>
                  Grupo
                </label>
                <select
                  id="idGrupo"
                  name="idGrupo"
                  value={formData.idGrupo}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isSubmitting || loadingDropdowns}
                >
                  <option value="">Selecione um grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tag */}
            <div className={styles.formGroup}>
              <label htmlFor="idTag" className={styles.label}>
                Tag
              </label>
              <select
                id="idTag"
                name="idTag"
                value={formData.idTag}
                onChange={handleChange}
                className={styles.select}
                disabled={isSubmitting || loadingDropdowns}
              >
                <option value="">Selecione uma tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEÇÃO 3: Precificação e Estoque */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Precificação e Estoque</h3>

            {/* Preço de Custo e Preço de Venda */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="precoCusto" className={styles.label}>
                  Preço de Custo (R$)
                </label>
                <input
                  id="precoCusto"
                  name="precoCusto"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.precoCusto}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.precoCusto ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                />
                {errors.precoCusto && <span className={styles.errorText}>{errors.precoCusto}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="precoVenda" className={styles.label}>
                  Preço de Venda (R$) <span className={styles.required}>*</span>
                </label>
                <input
                  id="precoVenda"
                  name="precoVenda"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.precoVenda}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.precoVenda ? styles.inputError : ''}`}
                  disabled={isSubmitting || loadingDropdowns}
                />
                {errors.precoVenda && <span className={styles.errorText}>{errors.precoVenda}</span>}
              </div>
            </div>

            {/* Preço de Venda PIX */}
            <div className={styles.formGroup}>
              <label htmlFor="precoVendaPix" className={styles.label}>
                Preço de Venda PIX (R$)
              </label>
              <input
                id="precoVendaPix"
                name="precoVendaPix"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.precoVendaPix}
                onChange={handleChange}
                className={`${styles.input} ${errors.precoVendaPix ? styles.inputError : ''}`}
                disabled={isSubmitting || loadingDropdowns}
              />
              {errors.precoVendaPix && <span className={styles.errorText}>{errors.precoVendaPix}</span>}
              <small className={styles.helpText}>Preço especial para pagamento via PIX (opcional)</small>
            </div>

            {/* Quantidade */}
            <div className={styles.formGroup}>
              <label htmlFor="quantidade" className={styles.label}>
                Quantidade em Estoque <span className={styles.required}>*</span>
              </label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                placeholder="Ex: 50"
                min="0"
                step="1"
                value={formData.quantidade}
                onChange={handleChange}
                className={`${styles.input} ${errors.quantidade ? styles.inputError : ''}`}
                disabled={isSubmitting || loadingDropdowns}
                required
              />
              {errors.quantidade && <span className={styles.errorText}>{errors.quantidade}</span>}
              <small className={styles.helpText}>
                Informe a quantidade disponível em estoque (0 se sem estoque)
              </small>
            </div>
          </div>

          {/* SEÇÃO 4: Localização e Imagem */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Localização e Imagem</h3>

            {/* Posição/Local Físico */}
            <div className={styles.formGroup}>
              <label htmlFor="posicao" className={styles.label}>
                Posição/Local Físico
              </label>
              <input
                id="posicao"
                name="posicao"
                type="text"
                placeholder="Ex: A1-B2-C3"
                value={formData.posicao}
                onChange={handleChange}
                className={styles.input}
                disabled={isSubmitting || loadingDropdowns}
              />
            </div>

            {/* Imagem Principal */}
            <div className={styles.formGroup}>
              <label htmlFor="imagem" className={styles.label}>
                Imagem Principal
              </label>
              <input
                id="imagem"
                name="imagem"
                type="text"
                placeholder="URL da imagem (deixe vazio para usar imagem padrão)"
                value={formData.imagem}
                onChange={handleChange}
                className={`${styles.input} ${errors.imagem ? styles.inputError : ''}`}
                disabled={isSubmitting || loadingDropdowns}
              />
              {errors.imagem && <span className={styles.errorText}>{errors.imagem}</span>}
              <small className={styles.helpText}>
                {formData.imagem ? 'URL da imagem fornecida' : 'Será usada imagem padrão baseada no segmento'}
              </small>

              {/* Preview da imagem */}
              {(formData.imagem || formData.idSegmento) && (
                <div className={styles.imagePreview}>
                  <p className={styles.previewLabel}>Preview:</p>
                  {formData.imagem ? (
                    <img
                      src={formData.imagem}
                      alt="Preview do produto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div
                    className={styles.defaultImageNotice}
                    style={{ display: formData.imagem ? 'none' : 'block' }}
                  >
                    <Image size={48} />
                    <p>Imagem padrão será usada</p>
                  </div>
                </div>
              )}
            </div>
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
