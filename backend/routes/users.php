<?php
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /users', function () {
  $userDao = new UsersDao();
  Flight::json($userDao->getAll());
});

Flight::route('GET /users/@id', function ($id) {
  $userDao = new UsersDao();
  $user = $userDao->getById($id);
  if ($user) {
    Flight::json($user);
  } else {
    Flight::jsonHalt((["message" => "User not found"]), 404);
  }
});

Flight::route('POST /users', function () {
  $userDao = new UsersDao();
  $data = Flight::request()->data->getData();

  validateBody(['name', 'username', 'email', 'password'], $data);

  if (!isset($data['role'])) {
    $data['role'] = 'applicant';
  }

  $existingUser = $userDao->getByEmail($data['email']);
  if ($existingUser) {
    Flight::jsonHalt((["message" => "User with this email already exists"]), 409);
  }

  $existingUser = $userDao->getByUsername($data['username']);
  if ($existingUser) {
    Flight::jsonHalt((["message" => "User with this username already exists"]), 409);
  }

  if ($userDao->insert($data)) {
    // $newUser = $userDao->getByEmail($data['email']);
    // Flight::json(["message" => "User created successfully"], $newUser, 201);
    Flight::json(["message" => "User created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating user"]), 500);
  }
});

Flight::route('PUT /users/@id', function ($id) {
  $userDao = new UsersDao();
  $data = Flight::request()->data->getData();

  if ($userDao->update($id, $data)) {
    Flight::json(["message" => "User updated successfully"], 200);
  } else {
    Flight::jsonHalt((["message" => "Error updating user"]), 500);
  }
});

Flight::route('DELETE /users/@id', function ($id) {
  $userDao = new UsersDao();

  $user = $userDao->getById($id);

  if (!$user) {
    Flight::jsonHalt(["message" => "User not found with provided ID"], 404);
  }

  if ($userDao->delete($id)) {
    Flight::json(["message" => "User deleted successfully"]);
  } else {
    Flight::jsonHalt(["message" => "Error deleting user"], 500);
  }
});
