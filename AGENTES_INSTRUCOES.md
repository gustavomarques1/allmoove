# 🤖 Guia de Agentes Especializados - AllMoove

## 📁 Localização dos Agentes

Os agentes estão na pasta `.claude/agents/` (não versionada no git)

## 🎯 Agentes Disponíveis

### 1. Frontend/UX Agent
**Arquivo:** `.claude/agents/frontend-ux.md`

**Especialidade:**
- Design de interfaces
- Componentes React
- Layouts responsivos
- Acessibilidade (a11y)
- Animações e transições
- UX/UI best practices

**Quando usar:**
- ✅ Criar novas telas
- ✅ Desenvolver componentes visuais
- ✅ Melhorar layouts
- ✅ Ajustar responsividade
- ✅ Implementar animações

**Como usar:**
```
@frontend-ux crie uma tela de histórico de pedidos com filtros
```

---

## 💡 Exemplos Práticos

### Criar Nova Tela

```
@frontend-ux crie uma tela de perfil do usuário que mostre:
- Foto de perfil (com upload)
- Nome completo
- Email
- Telefone
- Botões de editar e salvar
- Layout responsivo
```

**O agente vai entregar:**
- `src/Components/TelaPerfil/TelaPerfil.jsx`
- `src/Components/TelaPerfil/TelaPerfil.module.css`
- Subcomponentes necessários
- Instruções de integração

### Criar Componente Reutilizável

```
@frontend-ux crie um componente de Toast/Notificação com:
- Variantes: success, error, warning, info
- Auto-dismiss após 5 segundos
- Animação de entrada/saída
- Posicionamento no canto superior direito
- Suporte a ícones
```

### Melhorar UX Existente

```
@frontend-ux melhore a tela de pagamento adicionando:
- Indicador de progresso (step 1/3, 2/3, 3/3)
- Animação de transição entre steps
- Validação visual em tempo real nos campos
- Feedback de loading durante processamento
```

### Criar Sistema de Design

```
@frontend-ux crie um conjunto de componentes de formulário:
- Input de texto
- Textarea
- Select/Dropdown
- Checkbox
- Radio button
- Toggle switch
Todos com: label, error state, disabled state, helper text
```

---

## 🎨 Padrões do Projeto

### Cores

```css
/* Primary */
--primary: #ff6400;

/* Neutrals */
--dark: #333;
--gray: #666;
--light-gray: #f5f5f5;
--white: #ffffff;

/* Status */
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

### Espaçamento

Base de 8px:
- xs: 8px
- sm: 16px
- md: 24px
- lg: 32px
- xl: 40px

### Breakpoints

```css
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

### Tipografia

```css
h1 { font-size: 32px; font-weight: 700; }
h2 { font-size: 24px; font-weight: 600; }
h3 { font-size: 20px; font-weight: 600; }
body { font-size: 16px; font-weight: 400; }
small { font-size: 14px; }
```

---

## 📂 Estrutura de Componentes

```
src/Components/
├── NomeTela/
│   ├── NomeTela.jsx              # Componente principal
│   ├── NomeTela.module.css       # Estilos
│   └── Subcomponente/            # Subcomponentes (opcional)
│       ├── Subcomponente.jsx
│       └── Subcomponente.module.css
```

**Exemplo:**
```
src/Components/
├── TelaPerfil/
│   ├── TelaPerfil.jsx
│   ├── TelaPerfil.module.css
│   ├── AvatarUpload/
│   │   ├── AvatarUpload.jsx
│   │   └── AvatarUpload.module.css
│   └── FormDados/
│       ├── FormDados.jsx
│       └── FormDados.module.css
```

---

## ✅ Checklist ao Criar Tela

- [ ] Componente criado em pasta própria
- [ ] CSS Module criado
- [ ] PropTypes definidos
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Estados de loading/erro/vazio
- [ ] Acessibilidade (semantic HTML, ARIA labels)
- [ ] Navegação funcional (botões, links)
- [ ] Consistente com design system
- [ ] Testado no navegador
- [ ] Build passa sem erros

---

## 🚀 Fluxo de Trabalho

1. **Solicite ao agente:**
   ```
   @frontend-ux crie uma tela de notificações
   ```

2. **Revise o código gerado**
   - Verifique se segue padrões
   - Teste responsividade
   - Valide acessibilidade

3. **Integre no projeto:**
   ```jsx
   // src/App.jsx
   import TelaPerfil from './Components/TelaPerfil/TelaPerfil';

   <Route path="/perfil" element={<TelaPerfil />} />
   ```

4. **Teste:**
   ```bash
   npm run dev
   # Acesse http://localhost:5173/perfil
   ```

5. **Build:**
   ```bash
   npm run build
   ```

6. **Commit:**
   ```bash
   git add .
   git commit -m "feat(perfil): adiciona tela de perfil do usuário"
   ```

---

## 🆘 Solução de Problemas

### Agente não encontrado

**Problema:** Claude não reconhece `@frontend-ux`

**Solução:**
1. Verifique se o arquivo existe: `.claude/agents/frontend-ux.md`
2. Recarregue a janela do Claude Code
3. Use menção explícita na primeira mensagem

### Código gerado não compila

**Problema:** Erros de import ou sintaxe

**Solução:**
1. Verifique imports de ícones: `import { Icon } from 'lucide-react'`
2. Verifique PropTypes: `import PropTypes from 'prop-types'`
3. Execute `npm run build` para ver erros específicos

### Estilo não está sendo aplicado

**Problema:** CSS Module não funciona

**Solução:**
1. Verifique se o arquivo termina em `.module.css`
2. Confirme que está importando: `import styles from './Component.module.css'`
3. Use classes como: `className={styles.nomeClasse}`

---

## 📚 Recursos Úteis

- **Ícones:** [Lucide React](https://lucide.dev) - Todos os ícones disponíveis
- **Cores:** [Coolors.co](https://coolors.co) - Paleta de cores
- **Layout:** [CSS Grid Generator](https://cssgrid-generator.netlify.app)
- **Responsivo:** [Responsively App](https://responsively.app)

---

## 💬 Suporte

Se tiver dúvidas:
1. Leia este documento
2. Veja exemplos em `.claude/agents/README.md`
3. Confira componentes existentes no projeto
4. Pergunte ao Claude Code diretamente

---

**Versão:** 1.0
**Última atualização:** Janeiro 2025
