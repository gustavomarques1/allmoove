const formatCurrency = (value, currency) => {
  // Se o valor for null ou undefined, retorna R$ 0,00
  if (value == null || value === undefined || isNaN(value)) {
    return (0).toLocaleString('pt-br', { style: 'currency', currency });
  }
  return value.toLocaleString('pt-br', { style: 'currency', currency });
};

export default formatCurrency;
