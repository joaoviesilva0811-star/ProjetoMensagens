# 📋 Guia do Sistema de Registro

Olá! Este guia vai te explicar **o que este site faz** e **como colocá-lo para funcionar** no seu computador, mesmo que você não tenha muita experiência com tecnologia. Leia com calma, passo a passo!

---

## 🖥️ O que é este site?

Este é um site simples onde qualquer pessoa pode **preencher um formulário** com seus dados. Depois de enviar, as informações ficam **salvas em uma lista** que aparece direto na tela, sem precisar recarregar a página.

Pense nele como uma **lista de inscrições online** — alguém preenche os dados, clica em enviar, e o nome já aparece na tabela ao lado.

---

## 📝 Como usar o site (para quem vai preencher o formulário)

Ao abrir o site, você verá dois blocos na tela:

**Do lado esquerdo → o formulário para preencher:**

- **Nome completo** — digite seu nome, por exemplo: *Maria Silva*
- **E-mail** — atenção: o site aceita **somente e-mails do Gmail** (que terminam com @gmail.com). Se você tentar colocar outro tipo de e-mail, o site vai avisar com uma mensagem em vermelho.
- **Senha** — escolha uma senha com pelo menos 6 letras ou números. Uma barrinha colorida vai aparecer mostrando se sua senha é fraca, média ou forte.
- **Mensagem** — escreva o que quiser, mas o limite é de **250 caracteres** (um contador no canto vai mostrar quantos você já usou).

Depois de preencher tudo, clique no botão **"Enviar registro"**. Se tudo estiver certo, uma mensagem verde de sucesso vai aparecer e o formulário vai se limpar sozinho, pronto para a próxima pessoa.

**Do lado direito → a lista de registros:**

Aqui aparece uma tabela com todos os registros já enviados, mostrando o **nome**, o **e-mail** e a **mensagem** de cada pessoa. A senha nunca aparece nessa lista por segurança. A lista atualiza automaticamente após cada envio.

---

## ⚠️ Avisos importantes ao preencher

- Se você esquecer de preencher algum campo, o site vai destacar em vermelho onde está o erro e mostrar uma mensagem explicando o que falta.
- O e-mail **precisa terminar com @gmail.com**. Exemplo correto: `joao@gmail.com`. Exemplo incorreto: `joao@hotmail.com`.
- A mensagem não pode ter mais de 250 caracteres. O contador fica amarelo quando você está chegando perto do limite e vermelho quando atinge.

---

## 🔧 Como instalar e rodar o site no seu computador

Para que este site funcione, você precisa instalar um programa gratuito chamado **XAMPP**. Ele cria um "servidor" no seu próprio computador, que é o que faz o site funcionar.

### Passo 1 — Baixe e instale o XAMPP

1. Acesse o site: **https://www.apachefriends.org/pt_br/index.html**
2. Clique no botão de download para o seu sistema (Windows, Mac ou Linux)
3. Abra o arquivo baixado e siga as instruções de instalação (é como instalar qualquer outro programa — só clicar em "Próximo" algumas vezes)

### Passo 2 — Coloque os arquivos do site na pasta certa

Depois de instalar o XAMPP, ele vai criar uma pasta chamada `htdocs` no seu computador. É nessa pasta que o site precisa estar.

- **No Windows**, o caminho é: `C:\xampp\htdocs\`
- **No Mac**, o caminho é: `/Applications/XAMPP/htdocs/`

Crie uma pasta chamada `projeto` dentro de `htdocs` e copie todos os arquivos do site para dentro dela. No final deve ficar assim:

```
htdocs
└── projeto
    ├── index.php
    ├── api.php
    ├── config.php
    ├── database.sql
    └── assets
        ├── css
        │   └── style.css
        └── js
            └── script.js
```

### Passo 3 — Ligue o XAMPP

1. Abra o programa **XAMPP Control Panel** (ele aparece no menu iniciar ou na área de trabalho)
2. Clique em **Start** ao lado de **Apache**
3. Clique em **Start** ao lado de **MySQL**

Os dois devem ficar com fundo verde. Se ficarem verdes, está tudo certo!

### Passo 4 — Crie o banco de dados

O banco de dados é onde as informações do formulário ficam guardadas. Para criá-lo:

1. Abra o seu navegador (Chrome, Firefox, Edge...)
2. Digite na barra de endereços: **http://localhost/phpmyadmin** e pressione Enter
3. Uma tela vai abrir. Clique na aba **"SQL"** que fica no menu do topo
4. Abra o arquivo `database.sql` que está na pasta do projeto (pode abrir com o Bloco de Notas), copie todo o conteúdo e cole na caixa de texto que apareceu
5. Clique no botão **"Executar"**

Pronto! O banco de dados foi criado.

### Passo 5 — Abra o site

1. No seu navegador, digite: **http://localhost/projeto**
2. Pressione Enter

O site vai abrir e já está pronto para usar! 🎉

---

## ❓ Algo deu errado? Veja as soluções mais comuns

**O site não abre:**
Verifique se o Apache e o MySQL estão ligados (com fundo verde) no painel do XAMPP. Se não estiverem, clique em "Start" para os dois.

**Aparece uma mensagem de erro sobre banco de dados:**
Repita o Passo 4. Pode ser que o banco de dados não foi criado corretamente.

**O e-mail não é aceito:**
Certifique-se de que o e-mail termina exatamente com `@gmail.com`. Outros provedores como Hotmail, Yahoo ou Outlook não são aceitos neste sistema.

**A tabela do lado direito está vazia:**
Isso é normal quando ninguém enviou nada ainda! Basta preencher o formulário e enviar — o primeiro registro vai aparecer.

---

## 📁 Para que serve cada arquivo

Não precisa mexer nesses arquivos para usar o site, mas caso tenha curiosidade:

| Arquivo | O que ele faz |
|---|---|
| `index.php` | É a página principal — o que você vê no navegador |
| `api.php` | Recebe os dados do formulário e salva no banco |
| `config.php` | Guarda o usuário e a senha do banco de dados |
| `database.sql` | Cria a estrutura do banco de dados |
| `style.css` | Cuida das cores e do visual do site |
| `script.js` | Faz a validação dos campos e envia os dados sem recarregar a página |

---

