<div align="center">
  <h1> Bella Pizza 🍕</h1>

  <img src="https://i.imgur.com/5p6MYS5.png" alt="ícone pizza" width="150" height="150">
</div>



<h2>➢ Descrição </h2>
O Bella Pizza é um sistema para gerenciamento de reservas em um restaurante. Ele foi desenvolvido em Node.js com arquitetura MVC, usando Express para o back-end, better-sqlite3 como banco de dados e um front-end em HTML, CSS e JavaScript.,

<h2>➢ Estrutura de Pastas</h2>

```text
bella_pizza/
│   │
│   └── A3SistemasDistribuidos/
│       ├── Controllers/ (Lógica de negócio e controle)                
│       │   ├── adminTable.js         
│       │   ├── cadastroController.js 
│       │   ├── loginController.js
│       │   ├── occupationController.js           
│       │   └── viewController.js
│       │      
│       ├── Models/ (Interação com o banco de dados)              
│       │   ├── check-db.js
│       │   ├── db.js
│       │   ├── init-db.js
│       │   ├── restaurante.db 
│       │   ├── seed.js
│       │   ├── testes-db.js      
│       │   └── usuarios.js
│       │
│       ├── Public/ (Front-end (HTML, CSS, JS, assets))
│       │   ├── AssetsAtendente/                 
│       │   │   ├── image/
│       │   │   │   └──(arquivos de imagem)
│       │   │   ├── styleAtendente.css
│       │   │   ├── styleCadastro.css
│       │   │   ├── styleCancelamento.css
│       │   │   ├── styleEdicao.css             
│       │   │   └── styleVisualizar.css
│       │   │     
│       │   ├── AssetsGarçom/                 
│       │   │   ├── styleGarcom.css                       
│       │   │   └── styleOcupacaoGarcom.css
│       │   │
│       │   ├── AssetsGerente/                 
│       │   │   ├── images/
│       │   │   │   └──(arquivos de imagem)
│       │   │   ├── styleConfirmacao.css
│       │   │   ├── styleEstatistica.css
│       │   │   ├── styleOcupacao.css
│       │   │   └── styleStatus.css             
│       │   │
│       │   ├── Atendente/                 
│       │   │   ├── atendente.html         
│       │   │   ├── atendente.js 
│       │   │   ├── cadastramento.html        
│       │   │   ├── cadastramento.js
│       │   │   ├── cancelar.html         
│       │   │   ├── cancelar.js
│       │   │   ├── edicao.html    
│       │   │   ├── edicao.js                
│       │   │   └── visualizar.html
│       │   │
│       │   ├── Garçom/                 
│       │   │   ├── atualizarGarcom.html          
│       │   │   ├── garcom.html
│       │   │   ├── ocupacaoGarcom.html
│       │   │   └── visualizarGarcom.html
│       │   │
│       │   ├── Gerente/                 
│       │   │   ├── atualizar_status.html          
│       │   │   ├── estatistica.html
│       │   │   ├── gerente.html         
│       │   │   ├── ocupacao.html     
│       │   │   └── visualizar_reserva_confirmada.html
│       │   │
│       │   ├── login.html 
│       │   ├── login.js
│       │   ├── occupationReserve.js
│       │   ├── searcgReserve.js
│       │   ├── styleLogin.css
│       │   ├── updateStatusRserve.js      
│       │   └── viewReserves.js
│       │          
│       ├── Routes/ (Definição de endpoints da API)              
│       │   ├── dashboardRoute.js 
│       │   ├── index.js
│       │   ├── loginRoute.js
│       │   ├── Reserve.js      
│       │   └── tableRoute.js
│       │
│       ├── package.json
│       ├── Relatório sobre o Progresso.txt
│       └── server.js
│                 
├── .gitignore 
└── README.md                 
```

<h2> ➢ Requisitos </h2>

Node.js 18 ou superior (Versões mais antigas podem causar incompatibilidades), pois para à aplicação funcionar é necessário que suporte as dependências: express, Cors e better-sqlite3.

<h2>➢ Instalação </h2>

<b> 1. Obtenha o código fonte (ou baixe manualmente o ZIP e extraia) </b>
```
git clone (https://github.com/Marissol01/Bella-Pizza)
cd Bella-Pizza
```

<b> 2. Confirme se a sua versão do Node instalada é 18 ou superior: </b>
```
node -v 
```
▸ Deve retornar v18.x ou superior <br>
▸ Sua versão é inferior? Atualize em nodejs.org

<b> 3. Instale o node: </b>
```
npm install
```
▸ Uma pasta node_modules será criada no seu projeto

<b> 4. Instale as dependências necessárias: </b>
```
npm install express cors better-sqlite3
```

<h2>➢  Como executar o projeto</h2>

<b> 1. Para iniciar o servidor, você executa o arquivo server.js através do comando: </b>
```
node --watch server.js
```
▸ Em resposta deve surgir esta mensagem no terminal:
``` " Tabelas criadas com sucesso! http://localhost:3000 " ```

<b> 2. Agora, popule o banco de dados com dados iniciais: </b>
```
node A3SistemasDistribuidos/models/seed.js
 ```

▸ Em resposta deve surgir a mensagem:
``` "Todos os dados foram inseridos!" ```

<b> 3. Por fim, para utilizar a aplicação deve se pegar a url ``` "http://localhost:3000" ``` e por no seu navegador </b>

<h3> Sua pizzaria digital está pronta para rodar! :D </h3> 

Problemas comuns:

▸ Erro "Cannot find module"? <br>
Verifique se está na pasta correta (Bella-Pizza)

▸ Banco de dados não carrega? Verifique: <br>
Se o arquivo seed.js está no caminho correto: A3SistemasDistribuidos/models/
Se better-sqlite3 instalou corretamente

<h2>➢ Tecnologias Utilizadas </h2>

<h2> ➢ Recursos Implementados </h2>

## 🧪 Credenciais de Teste
| Tipo de Funcionário | Nome de Usuário | Senha | 
|---------------------|------------------|--------|
| Atendente           | `joao`           | `123`  |
| Garçom              | `mario`          | `123`  |
| Gerente             | `maria`          | `123`  |
