/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('/teachers', 'TeachersController').apiOnly()
  Route.resource('/students', 'StudentsController').apiOnly()
  Route.resource('/classrooms', 'ClassroomsController').apiOnly()

  Route.post('/classrooms/students/:id', 'ClassroomsController.addStudent')
  Route.delete('/classrooms/students/:id', 'ClassroomsController.removeStudent')
  Route.get('/classrooms/students/:id', 'ClassroomsController.showStudents')
  Route.get('/classrooms/my-classes/:id', 'ClassroomsController.myClasses')
}).prefix('/api');