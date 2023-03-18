import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('/teachers', 'TeachersController').apiOnly()
  Route.resource('/students', 'StudentsController').apiOnly()
  Route.resource('/classrooms', 'ClassroomsController').apiOnly()

  Route.post('/classrooms/students/:id', 'ClassroomsController.addStudent')
  Route.delete('/classrooms/students/:id', 'ClassroomsController.removeStudent')
  Route.get('/classrooms/students/:id', 'ClassroomsController.showStudents')
  Route.get('/classrooms/my-classes/:id', 'ClassroomsController.myClasses')
  Route.patch('/classrooms/availability/:id', 'ClassroomsController.changeAvailability')
}).prefix('/api');