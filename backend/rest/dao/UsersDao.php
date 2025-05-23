<?php

require_once 'BaseDao.php';

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

    public function getByName($name)
    {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByCompanyId($company_id)
    {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE company_id = :company_id");
        $stmt->bindParam(':company_id', $company_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByField($field, $value)
    {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE $field = :value");
        $stmt->bindParam(':value', $value);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
