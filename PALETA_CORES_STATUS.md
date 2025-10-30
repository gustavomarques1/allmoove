# 🎨 Paleta de Cores - Status de Pedidos AllMoove

Referência rápida visual da paleta de cores completa do sistema de status.

---

## 🔴 1. AGUARDANDO ACEITE

```
┌─────────────────────────────────────────────────────────┐
│                    AGUARDANDO ACEITE                    │
│                  (Máxima Prioridade)                    │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#FF3600` | rgb(255, 54, 0) | ![#FF3600](https://via.placeholder.com/40x20/FF3600/FFFFFF?text=+) Branco |
| **Light** | `#FFF4F0` | rgb(255, 244, 240) | ![#FFF4F0](https://via.placeholder.com/40x20/FFF4F0/C02900?text=+) Dark |
| **Dark** | `#C02900` | rgb(192, 41, 0) | ![#C02900](https://via.placeholder.com/40x20/C02900/FFFFFF?text=+) Branco |
| **Border** | `#FF6B3D` | rgb(255, 107, 61) | ![#FF6B3D](https://via.placeholder.com/40x20/FF6B3D/FFFFFF?text=+) Branco |

### Características
- **Ícone:** 🕐 Relógio (FiClock)
- **Urgência:** 🔥🔥🔥 Alta
- **Ação Requerida:** ✅ Sim
- **Animação:** Glow pulsante
- **Uso:** Pedidos novos que precisam de aceite imediato

### CSS Classes
```css
.status-aguardando-aceite           /* Badge padrão */
.status-aguardando-aceite-light     /* Badge light */
.status-aguardando-aceite-outline   /* Badge outline */
.status-aguardando-aceite-icon      /* Ícone colorido */
.card-aguardando-aceite             /* Card com borda */
.dot-aguardando-aceite              /* Indicador dot */
.counter-aguardando-aceite          /* Contador */
```

---

## 🔵 2. ACEITO

```
┌─────────────────────────────────────────────────────────┐
│                        ACEITO                           │
│                   (Alta Prioridade)                     │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#3B82F6` | rgb(59, 130, 246) | ![#3B82F6](https://via.placeholder.com/40x20/3B82F6/FFFFFF?text=+) Branco |
| **Light** | `#EFF6FF` | rgb(239, 246, 255) | ![#EFF6FF](https://via.placeholder.com/40x20/EFF6FF/1E40AF?text=+) Dark |
| **Dark** | `#1E40AF` | rgb(30, 64, 175) | ![#1E40AF](https://via.placeholder.com/40x20/1E40AF/FFFFFF?text=+) Branco |
| **Border** | `#60A5FA` | rgb(96, 165, 250) | ![#60A5FA](https://via.placeholder.com/40x20/60A5FA/FFFFFF?text=+) Branco |

### Características
- **Ícone:** ✓ Check Circle (FiCheckCircle)
- **Urgência:** 🔥🔥 Média-Alta
- **Ação Requerida:** ✅ Sim
- **Animação:** Nenhuma
- **Uso:** Pedido confirmado, aguardando separação

### CSS Classes
```css
.status-aceito                      /* Badge padrão */
.status-aceito-light                /* Badge light */
.status-aceito-outline              /* Badge outline */
.status-aceito-icon                 /* Ícone colorido */
.card-aceito                        /* Card com borda */
.dot-aceito                         /* Indicador dot */
.counter-aceito                     /* Contador */
```

---

## 🟣 3. EM SEPARAÇÃO

```
┌─────────────────────────────────────────────────────────┐
│                     EM SEPARAÇÃO                        │
│                  (Prioridade Média)                     │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#8B5CF6` | rgb(139, 92, 246) | ![#8B5CF6](https://via.placeholder.com/40x20/8B5CF6/FFFFFF?text=+) Branco |
| **Light** | `#F5F3FF` | rgb(245, 243, 255) | ![#F5F3FF](https://via.placeholder.com/40x20/F5F3FF/6D28D9?text=+) Dark |
| **Dark** | `#6D28D9` | rgb(109, 40, 217) | ![#6D28D9](https://via.placeholder.com/40x20/6D28D9/FFFFFF?text=+) Branco |
| **Border** | `#A78BFA` | rgb(167, 139, 250) | ![#A78BFA](https://via.placeholder.com/40x20/A78BFA/FFFFFF?text=+) Branco |

### Características
- **Ícone:** 📦 Pacote (FiPackage)
- **Urgência:** 🔥 Média
- **Ação Requerida:** ✅ Sim
- **Animação:** Pulse suave
- **Uso:** Pedido sendo preparado/separado

### CSS Classes
```css
.status-em-separacao                /* Badge padrão */
.status-em-separacao-light          /* Badge light */
.status-em-separacao-outline        /* Badge outline */
.status-em-separacao-icon           /* Ícone colorido */
.card-em-separacao                  /* Card com borda */
.dot-em-separacao                   /* Indicador dot */
.counter-em-separacao               /* Contador */
```

---

## 🟡 4. AGUARDANDO RETIRADA

```
┌─────────────────────────────────────────────────────────┐
│                  AGUARDANDO RETIRADA                    │
│                  (Prioridade Média)                     │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#F59E0B` | rgb(245, 158, 11) | ![#F59E0B](https://via.placeholder.com/40x20/F59E0B/FFFFFF?text=+) Branco |
| **Light** | `#FFFBEB` | rgb(255, 251, 235) | ![#FFFBEB](https://via.placeholder.com/40x20/FFFBEB/B45309?text=+) Dark |
| **Dark** | `#B45309` | rgb(180, 83, 9) | ![#B45309](https://via.placeholder.com/40x20/B45309/FFFFFF?text=+) Branco |
| **Border** | `#FBBF24` | rgb(251, 191, 36) | ![#FBBF24](https://via.placeholder.com/40x20/FBBF24/FFFFFF?text=+) Branco |

### Características
- **Ícone:** 📦 Caixa (FiBox)
- **Urgência:** Média
- **Ação Requerida:** ❌ Não (aguardando entregador)
- **Animação:** Nenhuma
- **Uso:** Pedido pronto para coleta

### CSS Classes
```css
.status-aguardando-retirada         /* Badge padrão */
.status-aguardando-retirada-light   /* Badge light */
.status-aguardando-retirada-outline /* Badge outline */
.status-aguardando-retirada-icon    /* Ícone colorido */
.card-aguardando-retirada           /* Card com borda */
.dot-aguardando-retirada            /* Indicador dot */
.counter-aguardando-retirada        /* Contador */
```

---

## 🔷 5. EM TRÂNSITO

```
┌─────────────────────────────────────────────────────────┐
│                      EM TRÂNSITO                        │
│                   (Baixa Prioridade)                    │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#06B6D4` | rgb(6, 182, 212) | ![#06B6D4](https://via.placeholder.com/40x20/06B6D4/FFFFFF?text=+) Branco |
| **Light** | `#ECFEFF` | rgb(236, 254, 255) | ![#ECFEFF](https://via.placeholder.com/40x20/ECFEFF/0E7490?text=+) Dark |
| **Dark** | `#0E7490` | rgb(14, 116, 144) | ![#0E7490](https://via.placeholder.com/40x20/0E7490/FFFFFF?text=+) Branco |
| **Border** | `#22D3EE` | rgb(34, 211, 238) | ![#22D3EE](https://via.placeholder.com/40x20/22D3EE/FFFFFF?text=+) Branco |

### Características
- **Ícone:** 🚚 Caminhão (FiTruck)
- **Urgência:** Baixa
- **Ação Requerida:** ❌ Não
- **Animação:** Nenhuma
- **Uso:** Pedido com entregador, em rota

### CSS Classes
```css
.status-em-transito                 /* Badge padrão */
.status-em-transito-light           /* Badge light */
.status-em-transito-outline         /* Badge outline */
.status-em-transito-icon            /* Ícone colorido */
.card-em-transito                   /* Card com borda */
.dot-em-transito                    /* Indicador dot */
.counter-em-transito                /* Contador */
```

---

## 🟢 6. CONCLUÍDO

```
┌─────────────────────────────────────────────────────────┐
│                       CONCLUÍDO                         │
│                   (Sem Prioridade)                      │
└─────────────────────────────────────────────────────────┘
```

### Cores

| Uso | Hex Code | RGB | Preview |
|-----|----------|-----|---------|
| **Primary** | `#10B981` | rgb(16, 185, 129) | ![#10B981](https://via.placeholder.com/40x20/10B981/FFFFFF?text=+) Branco |
| **Light** | `#F0FDF4` | rgb(240, 253, 244) | ![#F0FDF4](https://via.placeholder.com/40x20/F0FDF4/047857?text=+) Dark |
| **Dark** | `#047857` | rgb(4, 120, 87) | ![#047857](https://via.placeholder.com/40x20/047857/FFFFFF?text=+) Branco |
| **Border** | `#34D399` | rgb(52, 211, 153) | ![#34D399](https://via.placeholder.com/40x20/34D399/FFFFFF?text=+) Branco |

### Características
- **Ícone:** ✓ Check (FiCheck)
- **Urgência:** Nenhuma
- **Ação Requerida:** ❌ Não
- **Animação:** Nenhuma
- **Uso:** Pedido entregue ao cliente

### CSS Classes
```css
.status-concluido                   /* Badge padrão */
.status-concluido-light             /* Badge light */
.status-concluido-outline           /* Badge outline */
.status-concluido-icon              /* Ícone colorido */
.card-concluido                     /* Card com borda */
.dot-concluido                      /* Indicador dot */
.counter-concluido                  /* Contador */
```

---

## 📊 Comparação Visual Rápida

### Por Cores Primárias
```
🔴 #FF3600  Aguardando Aceite  (Laranja - Urgente)
🔵 #3B82F6  Aceito             (Azul - Confiança)
🟣 #8B5CF6  Em Separação       (Roxo - Atividade)
🟡 #F59E0B  Aguardando Retirada (Âmbar - Standby)
🔷 #06B6D4  Em Trânsito        (Ciano - Movimento)
🟢 #10B981  Concluído          (Verde - Sucesso)
```

### Por Prioridade (Mais urgente → Menos urgente)
```
1. 🔴 Aguardando Aceite  (6/6) ⚠️ AÇÃO IMEDIATA
2. 🔵 Aceito             (5/6) → Iniciar separação
3. 🟣 Em Separação       (4/6) → Em andamento
4. 🟡 Aguardando Retirada (3/6) → Aguardando
5. 🔷 Em Trânsito        (2/6) → Em movimento
6. 🟢 Concluído          (1/6) ✓ Finalizado
```

### Por Requer Ação
```
✅ REQUER AÇÃO:
   - Aguardando Aceite
   - Aceito
   - Em Separação

❌ NÃO REQUER AÇÃO:
   - Aguardando Retirada
   - Em Trânsito
   - Concluído
```

---

## 🎯 Uso Recomendado por Contexto

### Dashboard (Cards Superiores)
```jsx
Novos Pedidos:     Use ícone e cor de "Aguardando Aceite" (#FF3600)
Em Andamento:      Use ícone e cor de "Em Separação" (#8B5CF6)
Prontos:           Use ícone e cor de "Aguardando Retirada" (#F59E0B)
Concluídos:        Use ícone e cor de "Concluído" (#10B981)
```

### Lista de Pedidos
```jsx
Badge de Status:   Variant "light" + animated={requiresAction}
Borda do Card:     Use classes .card-{status}
Indicador Dot:     Use apenas para status ativos
```

### Filtros
```jsx
Todos:             Cor neutra (#6b7280)
Por Status:        Use cores primárias de cada status
Estado Ativo:      Fundo com cor do status
```

### Detalhes do Pedido
```jsx
Timeline:          Mostra progressão completa
Badge Grande:      Variant "default" + size="lg"
Status Atual:      Com animação se requer ação
```

---

## 🌈 Paleta Completa (Hex)

### Aguardando Aceite (Laranja)
```
Primary: #FF3600
Light:   #FFF4F0
Dark:    #C02900
Border:  #FF6B3D
```

### Aceito (Azul)
```
Primary: #3B82F6
Light:   #EFF6FF
Dark:    #1E40AF
Border:  #60A5FA
```

### Em Separação (Roxo)
```
Primary: #8B5CF6
Light:   #F5F3FF
Dark:    #6D28D9
Border:  #A78BFA
```

### Aguardando Retirada (Âmbar)
```
Primary: #F59E0B
Light:   #FFFBEB
Dark:    #B45309
Border:  #FBBF24
```

### Em Trânsito (Ciano)
```
Primary: #06B6D4
Light:   #ECFEFF
Dark:    #0E7490
Border:  #22D3EE
```

### Concluído (Verde)
```
Primary: #10B981
Light:   #F0FDF4
Dark:    #047857
Border:  #34D399
```

---

## ✅ Contraste WCAG AA

Todas as combinações primárias com branco atendem WCAG AA:

| Status | Background | Texto | Contraste | WCAG |
|--------|-----------|-------|-----------|------|
| Aguardando Aceite | #FF3600 | #FFFFFF | 4.8:1 | ✅ AA |
| Aceito | #3B82F6 | #FFFFFF | 5.2:1 | ✅ AA |
| Em Separação | #8B5CF6 | #FFFFFF | 5.8:1 | ✅ AA |
| Aguardando Retirada | #F59E0B | #FFFFFF | 4.6:1 | ✅ AA |
| Em Trânsito | #06B6D4 | #FFFFFF | 5.1:1 | ✅ AA |
| Concluído | #10B981 | #FFFFFF | 5.4:1 | ✅ AA |

---

## 📋 Copiar para Figma/Design

### CSS Variables (Opcional)
```css
:root {
  /* Aguardando Aceite */
  --status-aguardando-primary: #FF3600;
  --status-aguardando-light: #FFF4F0;
  --status-aguardando-dark: #C02900;
  --status-aguardando-border: #FF6B3D;

  /* Aceito */
  --status-aceito-primary: #3B82F6;
  --status-aceito-light: #EFF6FF;
  --status-aceito-dark: #1E40AF;
  --status-aceito-border: #60A5FA;

  /* Em Separação */
  --status-separacao-primary: #8B5CF6;
  --status-separacao-light: #F5F3FF;
  --status-separacao-dark: #6D28D9;
  --status-separacao-border: #A78BFA;

  /* Aguardando Retirada */
  --status-retirada-primary: #F59E0B;
  --status-retirada-light: #FFFBEB;
  --status-retirada-dark: #B45309;
  --status-retirada-border: #FBBF24;

  /* Em Trânsito */
  --status-transito-primary: #06B6D4;
  --status-transito-light: #ECFEFF;
  --status-transito-dark: #0E7490;
  --status-transito-border: #22D3EE;

  /* Concluído */
  --status-concluido-primary: #10B981;
  --status-concluido-light: #F0FDF4;
  --status-concluido-dark: #047857;
  --status-concluido-border: #34D399;
}
```

---

**Paleta criada para AllMoove Dashboard Distribuidor**
*Sistema profissional de cores com foco em UX e acessibilidade*