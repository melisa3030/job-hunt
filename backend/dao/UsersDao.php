<?php

require_once __DIR__ . '/BaseDao.php';

class UsersDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("users");
  }

  public function getByEmail($email)
  {
    $stmt = $this->connection->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    return $stmt->fetch();
  }

  public function getByUsername($username)
  {
    $stmt = $this->connection->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    return $stmt->fetch();
  }
}
