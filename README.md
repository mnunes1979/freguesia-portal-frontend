# 🏛️ Portal da Freguesia - Frontend

Frontend React moderno para o Portal da União de Freguesias.

## ✨ Funcionalidades

✅ **Interface Moderna e Responsiva**
- Design adaptado para mobile, tablet e desktop
- Cores e layout profissional

✅ **Sistema de Incidências**
- 4 colunas (Pendentes, Em Análise, Em Resolução, Resolvidas)
- Filtros avançados (pesquisa, localização, datas)
- Ver detalhes completos
- Reportar novas incidências (com autenticação)

✅ **Slideshow de Fotos**
- Navegação automática e manual
- Gerido pelo backoffice

✅ **Widget de Meteorologia**
- Temperatura atual
- Condições meteorológicas
- Humidade e vento

✅ **Autenticação Segura**
- Login/Registo de utilizadores
- JWT tokens
- Sessões persistentes

✅ **Notícias e Eventos**
- Cards modernos com imagens
- Publicadas pelo backoffice

✅ **Links Úteis**
- Configuráveis pelo admin

✅ **Chat de Suporte**
- Botão flutuante
- Interface de chat

✅ **Privacidade RGPD**
- Nomes de utilizadores anónimos
- Consentimento obrigatório

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- Backend já a funcionar

### Passo 1: Instalar Dependências

```bash
npm install
```

### Passo 2: Configurar Backend URL

Se o backend não estiver em `https://portal-freguesias-freguesia-api.3isjct.easypanel.host`, edite o ficheiro:

```
src/services/api.js
```

Linha 3, altere:
```javascript
const API_URL = 'https://SEU-BACKEND-URL/api';
```

### Passo 3: Iniciar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

### Passo 4: Build para Produção

```bash
npm run build
```

Os ficheiros de produção estarão na pasta `dist/`

## 📦 Deploy no EasyPanel

### Método 1: GitHub + EasyPanel (Recomendado)

1. **Criar Repositório no GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Frontend"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/freguesia-portal-frontend.git
git push -u origin main
```

2. **No EasyPanel**
- Clique em "+ Service"
- Escolha "App" → "GitHub"
- Selecione o repositório `freguesia-portal-frontend`
- Branch: `main`

3. **Configurar Build**
- Build Type: **Nixpacks**
- Build Command: `npm install && npm run build`
- Start Command: `npx serve -s dist -l 3000`
- Port: `3000`

4. **Configurar Domínio**
- Vá em "Domains"
- Adicione: `portal.seu-dominio.pt`
- SSL será ativado automaticamente

5. **Deploy!**
- Clique "Deploy"
- Aguarde 2-5 minutos

✅ **Pronto!** Frontend online!

### Método 2: Upload Manual

1. **Build Local**
```bash
npm run build
```

2. **Comprimir pasta dist**
```bash
cd dist
zip -r portal-frontend.zip .
```

3. **Upload para Servidor**
- Use FTP/SFTP
- Ou hospede em Vercel/Netlify (mais fácil!)

## 🌐 Deploy Alternativo - Vercel (Mais Fácil!)

### Opção A: Via Dashboard

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique "Add New" → "Project"
4. Selecione o repositório
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Clique "Deploy"

✅ **Pronto em 1 minuto!** Vercel dá URL grátis tipo: `freguesia-portal.vercel.app`

### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 🔧 Estrutura do Projeto

```
freguesia-portal-frontend/
├── public/                 # Ficheiros públicos
├── src/
│   ├── contexts/          # Context API (Auth)
│   │   └── AuthContext.jsx
│   ├── services/          # APIs e serviços
│   │   └── api.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── index.html            # HTML base
├── package.json          # Dependências
├── vite.config.js        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
└── README.md            # Este ficheiro
```

## 🎨 Personalização

### Cores

Edite `src/App.jsx` e procure por classes Tailwind:
- `bg-blue-600` → Cor principal (azul)
- `bg-yellow-100` → Pendentes (amarelo)
- `bg-green-100` → Resolvidas (verde)

### Textos

No `src/App.jsx`, procure por:
- `Portal da Freguesia` → Nome do portal
- `Ponte de Lima` → Localização

### Footer

Edite a secção `<footer>` no final do `src/App.jsx`

## 🔐 Utilizadores de Teste

Já criou o admin no backend:
- **Email:** admin@freguesia.pt
- **Password:** Admin123!@#
- **Role:** admin

## 📱 Responsive

✅ Mobile (< 768px)
✅ Tablet (768px - 1024px)
✅ Desktop (> 1024px)

## 🆘 Problemas Comuns

### Erro: "Failed to fetch"
- Verifique se o backend está online
- Confirme a URL do backend em `src/services/api.js`

### Erro: "Token expired"
- Faça login novamente
- O token expira após 24h

### Página em branco
- Verifique console do browser (F12)
- Execute `npm run dev` para ver erros

## 📚 Tecnologias

- **React 18** - Interface
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP requests
- **Lucide React** - Ícones
- **date-fns** - Datas

## 🔜 Próximos Passos

1. ✅ Frontend completo
2. 🔄 Criar Backoffice (painel admin)
3. 🔄 Sistema de upload de imagens
4. 🔄 Sistema de emails
5. 🔄 Notificações em tempo real

## 💡 Sugestões de Melhorias

- [ ] Upload direto de fotos (não só URLs)
- [ ] Notificações push
- [ ] Mapa interativo com GPS
- [ ] Exportar relatórios PDF
- [ ] Dashboard de estatísticas

## 📞 Suporte

Qualquer dúvida, reveja a documentação ou contacte o desenvolvedor.

---

**Desenvolvido para União de Freguesias**  
© 2025 - Todos os direitos reservados
