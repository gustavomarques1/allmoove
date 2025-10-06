# Git Workflow - Projeto AllMoove

## 📋 Estrutura de Branches

```
main (produção - sempre estável)
  ├── develop (desenvolvimento - integração contínua)
  │   ├── feature/* (novas funcionalidades)
  │   ├── fix/* (correções de bugs)
  │   ├── refactor/* (refatorações)
  │   └── chore/* (tarefas gerais)
  └── hotfix/* (correções urgentes de produção)
```

## 🎯 Nomenclatura de Branches

### Features (Novas Funcionalidades)
```bash
feature/produtos-api
feature/filtro-fornecedores
feature/checkout-pagamento
feature/dashboard-pedidos
```

### Fixes (Correções)
```bash
fix/bug-imagens-produtos
fix/erro-autenticacao
fix/filtro-categoria
```

### Refactor (Refatorações)
```bash
refactor/busca-segmentada
refactor/componentes-carrinho
refactor/api-services
```

### Chore (Tarefas Gerais)
```bash
chore/dependencias
chore/gitignore
chore/configuracao-eslint
```

## 📝 Padrão de Commits (Conventional Commits)

### Formato
```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(produtos): adiciona filtro por fornecedor` |
| `fix` | Correção de bug | `fix(api): corrige erro 400 em produtos` |
| `refactor` | Refatoração de código | `refactor(components): divide BuscaSegmentada` |
| `style` | Formatação, CSS | `style(header): ajusta responsividade mobile` |
| `docs` | Documentação | `docs(readme): atualiza instruções de setup` |
| `test` | Testes | `test(produtos): adiciona testes unitários` |
| `chore` | Tarefas gerais | `chore(deps): atualiza dependências` |
| `perf` | Performance | `perf(api): otimiza query de produtos` |

### Exemplos de Bons Commits

```bash
# Simples
git commit -m "feat(api): adiciona endpoint de fornecedores"
git commit -m "fix(images): corrige caminho de imagens por categoria"
git commit -m "refactor(busca): extrai componente CategoryCarousel"

# Com descrição detalhada
git commit -m "feat(produtos): integra API de produtos com frontend

- Cria serviço produtosServices.js
- Adiciona função fetchProdutos com fallback
- Atualiza componente Products para consumir API
- Trata erros de conexão com backend

Closes #123"
```

## 🔄 Fluxo de Trabalho Diário

### 1. Começar Nova Feature

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch de feature
git checkout -b feature/nome-da-feature

# Trabalhar...
```

### 2. Fazer Commits Frequentes

```bash
# Ver o que mudou
git status
git diff

# Adicionar arquivos
git add src/Components/NovoComponente.jsx
git add src/api/novoService.js

# Ou adicionar tudo
git add .

# Commit com mensagem semântica
git commit -m "feat(componente): adiciona novo componente X"
```

### 3. Finalizar Feature

```bash
# Atualizar com main antes de mergear
git checkout main
git pull origin main
git checkout feature/nome-da-feature
git merge main  # resolve conflitos se houver

# Voltar para main e mergear
git checkout main
git merge feature/nome-da-feature

# Push
git push origin main

# Deletar branch local (opcional)
git branch -d feature/nome-da-feature
```

## 🛠️ Comandos Úteis

### Salvar Trabalho Temporário (Stash)

```bash
# Salvar mudanças sem commitar
git stash save "WIP: trabalhando no filtro"

# Ver lista de stashes
git stash list

# Recuperar último stash
git stash pop

# Recuperar stash específico
git stash apply stash@{0}

# Limpar stashes
git stash clear
```

### Corrigir Último Commit

```bash
# Adicionar arquivo esquecido ao último commit
git add arquivo-esquecido.js
git commit --amend --no-edit

# Alterar mensagem do último commit
git commit --amend -m "Nova mensagem"
```

### Desfazer Mudanças

```bash
# Descartar mudanças em arquivo específico
git restore arquivo.js

# Descartar todas as mudanças não commitadas
git restore .

# Desfazer último commit (mantém arquivos modificados)
git reset --soft HEAD~1

# Desfazer último commit (PERDE as mudanças)
git reset --hard HEAD~1

# Desfazer commit já enviado (cria novo commit)
git revert HEAD
```

### Visualizar Histórico

```bash
# Log resumido
git log --oneline

# Log com gráfico de branches
git log --oneline --graph --all

# Ver mudanças de um commit
git show abc123

# Ver histórico completo (mesmo após reset)
git reflog
```

### Branches

```bash
# Listar branches
git branch

# Listar todas (incluindo remotas)
git branch -a

# Criar e mudar para nova branch
git checkout -b nova-branch

# Mudar de branch
git checkout nome-branch

# Deletar branch local
git branch -d nome-branch

# Deletar branch remota
git push origin --delete nome-branch
```

## 🚨 Regras de Ouro

1. ✅ **NUNCA** faça `git reset --hard` depois de fazer `git push`
2. ✅ **SEMPRE** faça `git pull` antes de começar a trabalhar
3. ✅ **Commits pequenos e frequentes** são melhores que commits grandes
4. ✅ **Teste** antes de fazer merge na main
5. ✅ **Use branches** para cada feature/fix
6. ✅ **Mensagens claras** nos commits
7. ✅ **Mantenha main estável** - sempre funcionando
8. ✅ **Delete branches** antigas após merge

## 📦 Estrutura do Projeto

```
my-app/
├── src/
│   ├── Components/       # Componentes React
│   ├── api/             # Serviços de API
│   ├── context/         # Context API
│   └── utils/           # Utilitários
├── public/
│   └── data/            # Dados estáticos
├── docs/                # Documentação (NOVO)
│   ├── data/            # Excel e dados
│   ├── sql/             # Scripts SQL
│   └── specs/           # Especificações
├── scripts/             # Scripts Node.js
├── .gitignore
├── package.json
└── GIT_WORKFLOW.md      # Este arquivo
```

## 🎓 Comandos de Emergência

### Recuperar Commit "Perdido"

```bash
# Ver histórico completo (até commits deletados)
git reflog

# Voltar para commit específico
git checkout abc123

# Criar branch do commit recuperado
git checkout -b recuperado abc123
```

### Resolver Conflitos

```bash
# Após git merge com conflitos
# 1. Abrir arquivos conflitantes no VS Code
# 2. Resolver conflitos manualmente
# 3. Adicionar arquivos resolvidos
git add arquivo-resolvido.js

# 4. Finalizar merge
git commit -m "merge: resolve conflitos da branch X"
```

### Limpar Arquivos Não Rastreados

```bash
# Ver o que será deletado (dry run)
git clean -n

# Deletar arquivos não rastreados
git clean -f

# Deletar pastas não rastreadas
git clean -fd
```

## 📞 Suporte

Se tiver dúvidas sobre Git:
- Documentação oficial: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com
- Conventional Commits: https://www.conventionalcommits.org/

---

**Última atualização:** 06/10/2025
**Desenvolvedor:** Gustavo Marques - AllMoove
