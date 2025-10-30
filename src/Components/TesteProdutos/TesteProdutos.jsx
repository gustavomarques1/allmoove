import React, { useState } from 'react';
import api from '../../api/api';
import styles from './TesteProdutos.module.css';

/**
 * Componente de Teste da API de Produtos
 * Acesse em: /teste-produtos
 */
function TesteProdutos() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const testarGetProdutos = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/Produtos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const campos = response.data.length > 0 ? Object.keys(response.data[0]) : [];

      setResultado({
        endpoint: 'GET /api/Produtos',
        total: response.data.length,
        campos: campos,
        primeiroProduto: response.data[0],
        produtos: response.data
      });
    } catch (error) {
      setErro(error.message);
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const testarGetProdutosDistribuidor = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem('token');
      const idDistribuidor = localStorage.getItem('idDistribuidor') || localStorage.getItem('idPessoa') || '20';

      const response = await api.get(`/api/Produtos/distribuidor/${idDistribuidor}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const campos = response.data.length > 0 ? Object.keys(response.data[0]) : [];

      setResultado({
        endpoint: `GET /api/Produtos/distribuidor/${idDistribuidor}`,
        total: response.data.length,
        campos: campos,
        primeiroProduto: response.data[0],
        produtos: response.data
      });
    } catch (error) {
      setErro(error.message);
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const testarGetProdutoEscolhaCarrinho = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/ProdutoEscolhaCarrinho', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const campos = response.data.length > 0 ? Object.keys(response.data[0]) : [];

      setResultado({
        endpoint: 'GET /api/ProdutoEscolhaCarrinho',
        total: response.data.length,
        campos: campos,
        primeiroProduto: response.data[0],
        produtos: response.data
      });
    } catch (error) {
      setErro(error.message);
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔍 Teste API Produtos - AllMoove</h1>
        <p>Teste os endpoints da API de produtos e veja exatamente quais campos estão sendo retornados.</p>
      </div>

      <div className={styles.actions}>
        <button onClick={testarGetProdutos} disabled={loading}>
          📦 GET /api/Produtos
        </button>
        <button onClick={testarGetProdutosDistribuidor} disabled={loading}>
          🏢 GET /api/Produtos/distribuidor/&#123;id&#125;
        </button>
        <button onClick={testarGetProdutoEscolhaCarrinho} disabled={loading}>
          🛒 GET /api/ProdutoEscolhaCarrinho
        </button>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando...</p>
        </div>
      )}

      {erro && (
        <div className={styles.erro}>
          <h2>❌ Erro</h2>
          <p>{erro}</p>
        </div>
      )}

      {resultado && !loading && (
        <div className={styles.resultado}>
          <h2>✅ Sucesso!</h2>

          <div className={styles.info}>
            <p><strong>Endpoint:</strong> {resultado.endpoint}</p>
            <p><strong>Total de produtos:</strong> {resultado.total}</p>
          </div>

          {resultado.total > 0 && (
            <>
              <h3>📋 Campos Retornados ({resultado.campos.length}):</h3>
              <div className={styles.campos}>
                {resultado.campos.map((campo, index) => (
                  <span key={index} className={styles.campo}>{campo}</span>
                ))}
              </div>

              <h3>🔍 Primeiro Produto (exemplo):</h3>
              <pre className={styles.json}>
                {JSON.stringify(resultado.primeiroProduto, null, 2)}
              </pre>

              <h3>📊 Tabela de Produtos (primeiros 10):</h3>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Marca</th>
                      <th>Distribuidor ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.produtos.slice(0, 10).map((produto, index) => (
                      <tr key={index}>
                        <td>{produto.id || '-'}</td>
                        <td>{produto.nome || 'Sem nome'}</td>
                        <td>
                          {produto.quantidade || 0}
                          {produto.quantidade > 10 ?
                            <span className={styles.badgeSuccess}>OK</span> :
                            <span className={styles.badgeWarning}>Baixo</span>
                          }
                        </td>
                        <td>R$ {(produto.precoVenda || produto.preco || 0).toFixed(2)}</td>
                        <td>{produto.marca || '-'}</td>
                        <td>{produto.idDistribuidor || produto.distribuidorId || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3>📄 JSON Completo:</h3>
              <details>
                <summary>Clique para expandir ({resultado.total} produtos)</summary>
                <pre className={styles.json}>
                  {JSON.stringify(resultado.produtos, null, 2)}
                </pre>
              </details>
            </>
          )}

          {resultado.total === 0 && (
            <p className={styles.warning}>⚠️ Nenhum produto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TesteProdutos;
