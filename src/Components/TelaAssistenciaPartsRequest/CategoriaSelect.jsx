import React, { useState } from 'react';
import styles from './CategoriaSelect.module.css';
import { ChevronDown } from 'lucide-react';

export default function CategoriaSelect({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const categorias = [
    { id: 1, nome: "Eletrônicos" },
    { id: 2, nome: "Display" },
    { id: 3, nome: "Energia" },
    { id: 4, nome: "Bateria" },
    { id: 5, nome: "Câmera" }
  ];

  const handleSelect = (categoria) => {
    setSelected(categoria);
    onSelect(categoria.id);
    setIsOpen(false);
  };

  return (
    <div className={styles.categoriaWrapper}>
      <div className={styles.categoriaSelect}>
        <label>Selecionar Categoria</label>
        <div 
          className={styles.dropdownHeader} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selected ? selected.nome : "Selecione a Categoria"}</span>
          <ChevronDown 
            className={styles.arrowIcon} 
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} 
          />
        </div>
        {isOpen && (
          <ul className={styles.dropdownList}>
            {categorias.map((c) => (
              <li 
                key={c.id} 
                onClick={() => handleSelect(c)}
                className={styles.dropdownItem}
              >
                {c.nome}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
