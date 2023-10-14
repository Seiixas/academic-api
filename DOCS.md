# 📕 Docs

## Módulo de Estudante

#### ` POST /students`

Cria um novo estudante na base de dados

Request Body example:

```json
{
  "name": "Mateus Silva Seixas",
  "email": "test@mail.com",
  "birthday": "2023-03-11T22:04:19.259Z"
}
```

#### `🟣 GET /students/{studentId}`

Retorna o perfil de um estudante.

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.

#### `🟠 PUT /students/{studentId}`

Atualiza um estudante existente na base de dados.

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.

Request Body example:

```json
{
  "name": "Mateus Seixas",
  "email": "mateusdev124334@dev.com.br",
  "birthday": "2021-03-15T14:55:33.506Z"
}
```

Os campos `name`, `email` e `birthday` são opcionais.

#### `🔴 DELETE /students/{studentId}`

Deleta o perfil de um estudante.

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.

## Módulo de Professor

#### `🟢 POST /teachers`

Cria um novo professor na base de dados

Request Body example:

```json
{
  "name": "Mateus Silva Seixas",
  "email": "test@teacher.com",
  "birthday": "2023-03-11T22:04:19.259Z"
}
```

#### `🟣 GET /teachers/{teacherId}`

Retorna o perfil de um professor.

`teacherId` é um valor numérico inteiro que corresponde ao id do professor.

#### `🟠 PUT /teachers/{teacherId}`

Atualiza um professor existente na base de dados.

`teacherId` é um valor numérico inteiro que corresponde ao id do professor.

Request Body example:

```json
{
  "name": "Mateus Seixas",
  "email": "mateusdev4@dev.com.br",
  "birthday": "2021-03-15T14:55:33.506Z"
}
```

Os campos `name`, `email` e `birthday` são opcionais.

#### `🔴 DELETE /teachers/{teacherId}`

Deleta o perfil de um professor.

`teacherId` é um valor numérico inteiro que corresponde ao id do professor.

## Módulo de Salas de Aula

#### `🟢 POST /classrooms`

Cria uma sala de aula

Request Body example:

```json
{
  "teacher_responsible": 2,
  "class_number": 1,
  "capacity": 2
}
```

`teacher_responsible`: ID do professor responsável pela sala de aula.

`class_number`: Número da sala de aula.

`capacity`: Quantidade de alunos comportada pela sala de aula.

#### `🟣 GET /classrooms/{classroomId}`

Retorna o perfil de uma sala de aula.

`classroomId` é um valor numérico inteiro que corresponde ao id da sala de aula.

#### `🟠 PUT /classrooms/{classroomId}`

Atualiza uma sala de aula existente na base de dados.

`classroomId` é um valor numérico inteiro que corresponde ao id da sala de aula.

Request Body example:

```json
{
  "teacher_responsible": 2
}
```

`teacher_responsible`: ID do professor responsável pela sala de aula.

#### `🟡 PATCH /classrooms/availability/{classroomId}`

Atualiza a disponibilidade de novos alunos na sala de aula.

Request Body example:

```json
{
  "teacher_responsible": 2,
  "status": true
}
```

`teacher_responsible`: ID do professor responsável pela sala de aula.

`status`: Se há ou não disponibilidade para inserir novos alunos.

#### `🔴 DELETE /classrooms/{classroomId}`

Deleta o perfil de uma sala de aula.

`classroomId` é um valor numérico inteiro que corresponde ao id da sala de aula.

#### `🟢 POST /classrooms/students/{studentId}`

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.

Adiciona estudantes na sala de aula:

Request Body example:

```json
{
  "classroom_id": 2,
  "teacher_id": 2
}
```

`classroom_id`: ID da sala de aula.

`teacher_id`: ID do professor responsável pela sala de aula.

#### `🔴 DELETE /classrooms/students/{studentId}`

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.

emove estudantes na sala de aula:

Request Body example:

```json
{
  "classroom_id": 2,
  "teacher_id": 2
}
```

`classroom_id`: ID da sala de aula.

`teacher_id`: ID do professor responsável pela sala de aula.

#### `🟣 GET /classrooms/students/{classroomId}`

Lista estudantes presentes em uma sala de aula.

`classroomId` é um valor numérico inteiro que corresponde ao id da sala de aula.

#### `🟣 GET /classrooms/my-classes/{studentId}`

Lista salas de aula em que o estudante está matriculado.

`studentId` é um valor numérico inteiro que corresponde ao id do estudante.
