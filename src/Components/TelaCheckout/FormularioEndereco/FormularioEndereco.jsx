import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './FormularioEndereco.module.css';

/**
 * Componente de formulário para coleta de endereço de entrega
 */
function FormularioEndereco({ onEnderecoChange, enderecoInicial = {} }) {
  const [endereco, setEndereco] = useState({
    cep: enderecoInicial.cep || '',
    logradouro: enderecoInicial.logradouro || '',
    numero: enderecoInicial.numero || '',
    complemento: enderecoInicial.complemento || '',
    bairro: enderecoInicial.bairro || '',
    cidade: enderecoInicial.cidade || '',
    estado: enderecoInicial.estado || '',
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');

  /**
   * Busca endereço via API ViaCEP
   */
  const buscarCep = async (cep) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErroCep('CEP inválido');
      return;
    }

    setBuscandoCep(true);
    setErroCep('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErroCep('CEP não encontrado');
        return;
      }

      const novoEndereco = {
        ...endereco,
        cep: formatarCep(cepLimpo),
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      };

      setEndereco(novoEndereco);
      onEnderecoChange(novoEndereco);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErroCep('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setBuscandoCep(false);
    }
  };

  /**
   * Formata CEP para padrão #####-###
   */
  const formatarCep = (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  /**
   * Atualiza campo de endereço
   */
  const handleChange = (campo, valor) => {
    const novoEndereco = { ...endereco, [campo]: valor };
    setEndereco(novoEndereco);
    onEnderecoChange(novoEndereco);
  };

  /**
   * Trata mudança no CEP com busca automática
   */
  const handleCepChange = (e) => {
    const cep = e.target.value;
    handleChange('cep', formatarCep(cep));

    // Busca automática quando CEP completo
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(cep);
    }
  };

  return (
    <div className={styles.formularioContainer}>
      <h3 className={styles.titulo}>Endereço de Entrega</h3>

      <div className={styles.formGrid}>
        {/* CEP */}
        <div className={`${styles.formGroup} ${styles.cepField}`}>
          <label htmlFor="cep">CEP *</label>
          <div className={styles.cepInputWrapper}>
            <input
              type="text"
              id="cep"
              value={endereco.cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className={erroCep ? styles.inputError : ''}
              required
            />
            {buscandoCep && <span className={styles.loading}>Buscando...</span>}
          </div>
          {erroCep && <span className={styles.erro}>{erroCep}</span>}
        </div>

        {/* Logradouro */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="logradouro">Logradouro *</label>
          <input
            type="text"
            id="logradouro"
            value={endereco.logradouro}
            onChange={(e) => handleChange('logradouro', e.target.value)}
            placeholder="Rua, Avenida, etc."
            required
          />
        </div>

        {/* Número */}
        <div className={styles.formGroup}>
          <label htmlFor="numero">Número *</label>
          <input
            type="text"
            id="numero"
            value={endereco.numero}
            onChange={(e) => handleChange('numero', e.target.value)}
            placeholder="123"
            required
          />
        </div>

        {/* Complemento */}
        <div className={styles.formGroup}>
          <label htmlFor="complemento">Complemento</label>
          <input
            type="text"
            id="complemento"
            value={endereco.complemento}
            onChange={(e) => handleChange('complemento', e.target.value)}
            placeholder="Apto, Sala, etc."
          />
        </div>

        {/* Bairro */}
        <div className={styles.formGroup}>
          <label htmlFor="bairro">Bairro *</label>
          <input
            type="text"
            id="bairro"
            value={endereco.bairro}
            onChange={(e) => handleChange('bairro', e.target.value)}
            placeholder="Centro"
            required
          />
        </div>

        {/* Cidade */}
        <div className={styles.formGroup}>
          <label htmlFor="cidade">Cidade *</label>
          <input
            type="text"
            id="cidade"
            value={endereco.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            placeholder="São Paulo"
            required
          />
        </div>

        {/* Estado */}
        <div className={styles.formGroup}>
          <label htmlFor="estado">Estado *</label>
          <select
            id="estado"
            value={endereco.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>
        </div>
      </div>
    </div>
  );
}

FormularioEndereco.propTypes = {
  onEnderecoChange: PropTypes.func.isRequired,
  enderecoInicial: PropTypes.shape({
    cep: PropTypes.string,
    logradouro: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    bairro: PropTypes.string,
    cidade: PropTypes.string,
    estado: PropTypes.string,
  }),
};

export default FormularioEndereco;
