# 🚀 GUIA RÁPIDO - COMEÇAR EM 5 MINUTOS

## Passo 1: Instalar (1 min)
```bash
npm install
```

## Passo 2: Iniciar (30 seg)
```bash
npm run dev
```

✅ Abra: http://localhost:3000

## Passo 3: Testar (1 min)
- Clique em "Entrar"
- Email: `admin@freguesia.pt`
- Password: `Admin123!@#`
- ✅ Está logado como admin!

## Passo 4: Reportar Incidência (1 min)
- Clique "Reportar Incidência"
- Preencha o formulário
- Submeta
- ✅ Aparece nas incidências!

## Passo 5: Deploy (2 min)

### Opção A: Vercel (MAIS RÁPIDO!)
```bash
npm i -g vercel
vercel --prod
```
✅ Pronto! URL: `sua-app.vercel.app`

### Opção B: EasyPanel
1. Push para GitHub
2. EasyPanel → Add Service → GitHub
3. Selecione o repo
4. Build: Nixpacks
5. Deploy!

---

## ⚡ Atalhos Úteis

### Ver todos os endpoints disponíveis:
- Incidências: GET `/api/incidents/public`
- Notícias: GET `/api/news`
- Slides: GET `/api/slides`
- Links: GET `/api/links`

### Criar conteúdo via API:
```bash
# Exemplo: Criar notícia (precisa de token admin)
curl -X POST https://api.seu-dominio.com/api/news \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nova Notícia",
    "excerpt": "Resumo",
    "content": "Conteúdo completo",
    "image": "https://via.placeholder.com/800x400",
    "published": true
  }'
```

---

## 🎨 Personalizar Cores

Ficheiro: `src/App.jsx`

Procure e substitua:
- `bg-blue-600` → Sua cor principal
- `bg-yellow-100` → Pendentes
- `bg-green-100` → Resolvidas

---

## 📝 Adicionar Slides/Links/Notícias

### Via Postman:

**Criar Slide:**
```
POST /api/slides
Authorization: Bearer TOKEN
{
  "title": "Evento X",
  "image": "URL_DA_IMAGEM",
  "order": 1,
  "active": true
}
```

**Criar Link:**
```
POST /api/links
Authorization: Bearer TOKEN
{
  "title": "Câmara Municipal",
  "url": "https://cm-pontelima.pt",
  "order": 1,
  "active": true
}
```

---

## ✅ Checklist de Produção

- [ ] Backend online e funcional
- [ ] Frontend faz build sem erros (`npm run build`)
- [ ] URL do backend correta em `src/services/api.js`
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Testado em mobile/tablet/desktop
- [ ] Admin consegue login
- [ ] Utilizadores conseguem registar
- [ ] Incidências aparecem corretamente

---

## 🆘 Problemas?

**Não consigo fazer login:**
- Confirme que o backend está online
- Teste a API: `curl https://api.seu-dominio.com/health`

**Incidências não aparecem:**
- Abra console do browser (F12)
- Veja erros na tab Console
- Confirme URL do backend

**Build falha:**
- Delete `node_modules` e execute `npm install` novamente
- Confirme Node.js 18+ instalado

---

✅ **Tudo pronto?** Comece a usar o portal!
