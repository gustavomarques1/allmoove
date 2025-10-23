/**
 * Sistema de Cache em Memória
 *
 * Reduz chamadas desnecessárias à API
 * Melhora performance e reduz uso de memória
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Armazena dados no cache com TTL opcional
   * @param {string} key - Chave do cache
   * @param {any} value - Valor a ser armazenado
   * @param {number} ttl - Tempo de vida em milissegundos (padrão: 5 minutos)
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    // Limpa timer anterior se existir
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Armazena o valor
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });

    // Define timer para limpar o cache
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl);
      this.timers.set(key, timer);
    }
  }

  /**
   * Recupera dados do cache
   * @param {string} key - Chave do cache
   * @returns {any} Valor armazenado ou null
   */
  get(key) {
    const item = this.cache.get(key);
    return item ? item.value : null;
  }

  /**
   * Verifica se uma chave existe no cache
   * @param {string} key - Chave do cache
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Remove um item do cache
   * @param {string} key - Chave do cache
   */
  delete(key) {
    // Limpa o timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    // Remove do cache
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear() {
    // Limpa todos os timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    // Limpa o cache
    this.cache.clear();
  }

  /**
   * Retorna o tamanho do cache
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }

  /**
   * Retorna estatísticas do cache
   * @returns {object}
   */
  stats() {
    const items = Array.from(this.cache.entries());
    const totalSize = items.reduce((acc, [key, value]) => {
      const size = JSON.stringify(value).length;
      return acc + size;
    }, 0);

    return {
      itemCount: this.cache.size,
      approximateSizeInBytes: totalSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Caches específicos para diferentes tipos de dados
export const productCache = new MemoryCache();
export const orderCache = new MemoryCache();
export const userCache = new MemoryCache();

// Cache geral
const cache = new MemoryCache();
export default cache;