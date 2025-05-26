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
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }

    public function getByUsername($username)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE username = :username");
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }

    public function getByName($name)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE name = :name");
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }

    public function getByCompanyId($company_id)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE company_id = :company_id");
            $stmt->bindParam(':company_id', $company_id);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }

    public function getByField($field, $value)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE $field = :value");
            $stmt->bindParam(':value', $value);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }

    public function getAllEmployers()
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM users WHERE role = 'employer'");
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            throw new PDOException("Database error: " . $e->getMessage());
        }
    }
}
