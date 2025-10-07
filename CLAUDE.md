# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AllMoove - Delivery** is a React-based delivery and parts ordering platform connecting Technical Assistance centers, Distributors, and Delivery Personnel for technical parts procurement.

**Tech Stack:** React 19 + Vite, React Router DOM, Axios, Context API for state management

**Backend API:** ASP.NET Core running on `https://localhost:44370/`

## Development Commands

```bash
# Start development server (typically runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Specialized Agents

This project uses specialized agents for complex tasks:

### Frontend/UX Agent (`.claude/agents/frontend-ux.md`)
**Use for:** Creating new screens, components, layouts, and UX improvements

**How to use:**
```
@frontend-ux crie uma tela de perfil do usuário com foto, nome, email e botão de editar
```

**The agent will:**
- Design consistent UI matching AllMoove's style
- Create responsive layouts
- Follow existing component patterns
- Provide complete code (JSX + CSS Module)
- Ensure accessibility compliance

### API Agent (`.claude/agents/api.md`)
**Use for:** Backend integration, API endpoints, data fetching

**How to use:**
```
@api integre a listagem de produtos com a API do backend
```

## Architecture & Key Patterns

### Route Structure

The application has three distinct user roles with dedicated routes:

1. **Technical Assistance (Primary Flow):**
   - `/` - Login (Inicial)
   - `/assistencia/dashboard` - Dashboard with order summary and category search
   - `/assistencia/loja` - Shop with 48 products from `/public/data/products.json`
   - `/assistencia/delivery-options` - Delivery method selection
   - `/assistencia/pagamento` - Payment processing (PIX/Credit Card)
   - `/assistencia/payment-success` - Order confirmation with delivery code

2. **Distributor:**
   - `/distribuidor/dashboard` - Order management, inventory, billing

3. **Delivery Person:**
   - `/entregador` - **Currently minimal (placeholder)** - needs implementation

### State Management

**Shop Context (`src/context/Provider.jsx`):**
- Wraps the entire shop flow (`/assistencia/loja`)
- Global state: `products`, `loading`, `cartItems`, `isCartVisible`
- Cart operations: `handleAddItem`, `handleRemoveItem`, `handleDecreaseItem`
- Cart items auto-merge by ID with quantity tracking

**Navigation State:**
- Cart data flows through checkout via `navigate(path, { state: { cartItems, ... } })`
- Used in: Cart → Delivery Options → Payment → Confirmation

**localStorage:**
- Authentication: `email`, `token`, `expiration`
- Used in API calls: `Authorization: Bearer ${token}`

### Data Flow Patterns

**Product Loading:**
- Static JSON file at `/public/data/products.json` (not API)
- 48 products across 4 categories: celulares, notebooks, acessorios, telas
- Each product has: `id`, `nome`, `categoria`, `price`, `imagem`, `fornecedor`

**Category Filtering:**
- URL params: `?categoria=celular`
- Fallback: If category returns no results, shows all products with notification

**Supplier-Based Grouping:**
- Payment screen groups cart items by `fornecedor` field
- Calculates separate shipping and subtotals per supplier
- Enables multi-supplier orders in single checkout

### API Integration

**Base Configuration:** `src/api/api.js`
```javascript
baseURL: "https://localhost:44370/"
```

**Endpoints:**
- `POST /api/account/loginuser` - Authentication (returns JWT token)
- `GET /api/Pedidos/assistencia/{idPessoa}` - Fetch user orders (requires Bearer token)

**Pattern:**
```javascript
const token = localStorage.getItem('token');
api.get('/endpoint', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Component Architecture

**CSS Strategy:**
- **CSS Modules** (`.module.css`) - For major screens (Dashboard, Payment, Confirmation)
- **Regular CSS** (`.css`) - For shared components (Header, Cart, Products)

**PropTypes:**
- Required on all components
- Validates props and documents component interface

**Component Organization:**
- Major screens have dedicated folders in `src/Components/`
- Subcomponents live within parent screen folder
- Shared components (e.g., PaginaDeCompras components) grouped by feature

### Important Utilities

**Currency Formatting (`src/utils/formatCurrency.js`):**
```javascript
formatCurrency(value, 'BRL') // Returns "R$ 1.234,56"
```

**Delivery Code Generation:**
- Format: `M####X#` (e.g., M5018X7)
- Used in order confirmation

## Known State & TODOs

### Completed Features:
- Full checkout flow for Technical Assistance users
- Product browsing with search and category filtering
- Shopping cart with quantity management
- Delivery options selection (Normal/Urgent)
- Payment interface (PIX/Credit Card UI)
- Order confirmation with delivery code
- Distributor dashboard UI (awaiting backend integration)

### Needs Implementation:
- **Delivery Person interface** (`/entregador`) - Currently just renders "oi"
- **Order history** - Dashboard shows "0" orders, needs API integration
- **Distributor order management** - "Aceitar Pedido" functionality
- **Payment processing** - Real gateway integration (currently mock)
- **Cart persistence** - Currently lost on page reload
- **CEP/Address lookup** - Real address validation from postal code

### Recently Removed:
- Old `TelaAssistenciaPartsRequest` components (Carrinho, CategoriaSelect, ProductCard, etc.)
- Replaced by current `PaginaDeCompras` implementation

## ESLint Configuration

Custom rule ignores unused variables starting with uppercase or underscore:
```javascript
'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
```

## Development Notes

- **StrictMode:** Currently commented out in `src/main.jsx`
- **Products data:** To add/modify products, edit `/public/data/products.json`
- **Backend:** Ensure ASP.NET Core API is running on `https://localhost:44370/` for auth/orders
- **Navigation:** Always pass `cartItems` through navigation state during checkout flow
- **Supplier field:** Required on all products for proper order grouping in payment screen
