<?php

require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../../data/Roles.php';
require_once __DIR__ . '/../../helpers.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService
{
    private $userDao;

    public function __construct()
    {
        $this->userDao = new UsersDao();
    }

    public function getCurrentUserData()
    {
        $user = Flight::get('user');
        if (!$user) {
            throw new Exception("User not authenticated", 401);
        }

        unset($user->password);
        unset($user->email);
        unset($user->company_id);
        unset($user->created_at);

        return $user;
    }


    public function login($data)
    {
        $requiredFields = ["email", "password"];
        validateBody($requiredFields, $data);

        $user = $this->userDao->getByEmail($data["email"]);

        if (!$user || !password_verify($data["password"], $user["password"])) {
            throw new Exception("Invalid email or password", 401);
        }

        $jwt_payload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24),
            'role' => $user['role']
        ];

        $token = JWT::encode(
            $jwt_payload,
            Config::JWT_SECRET(),
            'HS256'
        );

        return ['data' => array_merge($user, ['token' => $token])];
    }
}
