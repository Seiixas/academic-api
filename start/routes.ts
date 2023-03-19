import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/:id', 'StudentsController.show');
    Route.post('/', 'StudentsController.store').middleware('validateEmail');
    Route.put('/:id', 'StudentsController.update').middleware('validateEmail');
    Route.delete('/:id', 'StudentsController.destroy').middleware('validateEmail');
  }).prefix('/students');

  Route.group(() => {
    Route.get('/:id', 'TeachersController.show');
    Route.post('/', 'TeachersController.store').middleware('validateEmail');
    Route.put('/:id', 'TeachersController.update').middleware('validateEmail');
    Route.delete('/:id', 'TeachersController.destroy').middleware('validateEmail');
  }).prefix('/teachers');

  Route.group(() => {
    Route.get('/:id', 'ClassroomsController.show');
    Route.post('/', 'ClassroomsController.store').middleware('validateEmail');
    Route.put('/:id', 'ClassroomsController.update').middleware('validateEmail');
    Route.delete('/:id', 'ClassroomsController.destroy').middleware('validateEmail');

    Route.post('/students/:id', 'ClassroomsController.addStudent')
    Route.delete('/students/:id', 'ClassroomsController.removeStudent')
    Route.get('/students/:id', 'ClassroomsController.showStudents')
    Route.get('/my-classes/:id', 'ClassroomsController.myClasses')
    Route.patch('/availability/:id', 'ClassroomsController.changeAvailability')
  }).prefix('/classrooms');
}).prefix('/api');