# Clicksoft

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

## Sobre o Projeto

O projeto consiste em uma aplicação de organização de alunos, professores e salas de aulas. Dessa forma, o professor consegue manipular salas de aulas (adicionando e removendo alunos), e os alunos conseguem visualizar as salas as quais pertence. Tudo isso além dos CRUDs de professor, aluno e salas de aula.

## Funcionalidades

### Professores

- Ver meu perfil.
- Criação de professor.
- Edição de professor.
- Deleção de professor.

### Aluno

- Ver meu perfil.
- Criação de aluno.
- Edição de aluno.
- Deleção de aluno.

### Salas de aula

- Ver minha sala de aula.
- Criação de sala de aula.
- Edição de sala de aula.
- Deleção de sala de aula.
- Adição de aluno em sala de aula.
- Remoção de aluno em sala de aula
- Visualizar todas as minhas salas de aula como aluno.
- Visualizar todos os alunos da minha sala de aula como professor.
- Alterar a disponibilidade da sala.

## Como rodar o projeto

### Configurando banco de dados

Execute o comando ```node ace invoke @adonisjs/lucid```; Selecione a opção `sqlite3` e depois `In the terminal`.

Após, execute o comando ```node ace migration:run``` para executar todas as migrations e criar as tabelas e relacionamentos no banco de dados.

O arquivo de banco de dados se encontrará na pasta `tmp/db.sqlite3`.

### Iniciando o servidor

Execute o comando ```node ace serve --watch``` para iniciar o servidor; Ele inicializará em uma porta aleatória, não se esqueça de alterar no arquivo do Insomnia.

### Insomnia

O arquivo de requisições do Insomnia pode ser encontrado [aqui](https://gist.github.com/Seiixas/f54aa8386191bacbac0d6ffd23c6f721).