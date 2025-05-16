<?php

require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../../helpers.php';

enum ROLE: string
{
    case APPLICANT = 'APPLICANT';
    case RECRUITER = 'RECRUITER';
}

class UserService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new UsersDao();
    }

    public function getAllUsers()
    {
        return $this->dao->getAll();
    }

    public function getUserById($id)
    {
        $user = $this->dao->getById($id);
        if (!$user) {
            throw new Exception("User not found", 404);
        }
        return $user;
    }

    public function createUser($data)
    {
        $requiredFields = ['name', 'username', 'email', 'password'];

        validateBody($requiredFields, $data);

        $this->validateUniqueEmail($data['email']);
        $this->validateUniqueUsername($data['username']);

        if (!isset($data['role'])) {
            // If a role is not set, use the default value
            $data['role'] = ROLE::APPLICANT;
        } else {
            // If a role is set, validate it
            try {
                ROLE::from(trim($data['role']));
            } catch (\ValueError $e) {
                throw new Exception("Invalid value for role. Must be APPLICANT or RECRUITER.", 400);
            }
        }


        if (!$this->dao->insert($data)) {
            throw new Exception("Error creating user", 500);
        }
        return ["message" => "User created successfully"];
    }

    public function updateUser($id, $data)
    {
        $this->getUserById($id);

        // Check if at least one required field is present
        $requiredFields = ['name', 'email', 'username', 'password'];
        $hasRequiredField = false;

        foreach ($requiredFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $hasRequiredField = true;
                break;
            }
        }

        if (!$hasRequiredField) {
            throw new Exception("Update requires at least one of these fields: " . implode(", ", $requiredFields), 400);
        }

        if (isset($data['email'])) {
            $this->validateUniqueEmail($data['email'], $id);
        }

        if (isset($data['username'])) {
            $this->validateUniqueUsername($data['username'], $id);
        }

        if (!$this->dao->update($id, $data)) {
            throw new Exception("Error updating user", 500);
        }
        return ["message" => "User updated successfully"];
    }

    public function deleteUser($id)
    {
        $this->getUserById($id);

        if (!$this->dao->delete($id)) {
            throw new Exception("Error deleting user", 500);
        }
        return ["message" => "User deleted successfully"];
    }

    // excludeId is optional and used when updating a user to check for uniqueness excluding the current user
    private function validateUniqueEmail($email, $excludeId = null)
    {
        $existingUser = $this->dao->getByEmail($email);
        if ($existingUser && (!$excludeId || $existingUser['id'] != $excludeId)) {
            throw new Exception("User with this email already exists", 409);
        }
    }

    // excludeId is optional and used when updating a user to check for uniqueness excluding the current user
    private function validateUniqueUsername($username, $excludeId = null)
    {
        $existingUser = $this->dao->getByUsername($username);
        if ($existingUser && (!$excludeId || $existingUser['id'] != $excludeId)) {
            throw new Exception("User with this username already exists", 409);
        }
    }
}
