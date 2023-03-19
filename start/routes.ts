import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/:id', 'StudentsController.show');
    Route.post('/', 'StudentsController.store');
    Route.put('/:id', 'StudentsController.update');
    Route.delete('/:id', 'StudentsController.destroy');
  }).prefix('/students');

  Route.group(() => {
    Route.get('/:id', 'TeachersController.show');
    Route.post('/', 'TeachersController.store');
    Route.put('/:id', 'TeachersController.update');
    Route.delete('/:id', 'TeachersController.destroy');
  }).prefix('/teachers');

  Route.group(() => {
    Route.get('/:id', 'ClassroomsController.show');
    Route.post('/', 'ClassroomsController.store');
    Route.put('/:id', 'ClassroomsController.update');
    Route.delete('/:id', 'ClassroomsController.destroy');

    Route.post('/students/:id', 'ClassroomsController.addStudent')
    Route.delete('/students/:id', 'ClassroomsController.removeStudent')
    Route.get('/students/:id', 'ClassroomsController.showStudents')
    Route.get('/my-classes/:id', 'ClassroomsController.myClasses')
    Route.patch('/availability/:id', 'ClassroomsController.changeAvailability')
  }).prefix('/classrooms');
}).prefix('/api');