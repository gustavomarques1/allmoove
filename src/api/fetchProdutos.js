// const fetchProducts = async (query) => {
//   const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
//   const data = await response.json();

//   return data.results;
// };

// export default fetchProducts;

// src/api/fetchProducts.js
async function fetchProducts(query = '') {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();

    // 💡 A CORREÇÃO ESTÁ AQUI:
    // Retorna todos os dados se a query for vazia
    if (!query) {
      return data;
    }

    // Caso contrário, aplica o filtro
    return data.filter(
      (item) =>
        item.nome.toLowerCase().includes(query.toLowerCase()) ||
        item.categoria.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
}

export default fetchProducts;
