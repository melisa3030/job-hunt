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

    public function refreshUserData($data)
    {
        $requiredFields = ["token"];
        validateBody($requiredFields, $data);

        // Get the currently authenticated user (from middleware)
        $currentUser = Flight::get('user');
        if (!$currentUser) {
            throw new Exception("User not authenticated", 401);
        }

        // Decode the token being refreshed
        $decoded = JWT::decode(
            $data["token"],
            new Key(Config::JWT_SECRET(), 'HS256')
        );

        // Get the user from the token
        $tokenUserId = $decoded->user->id;

        // Security check: ensure the current user can only refresh their own token
        if ($currentUser->id !== $tokenUserId) {
            throw new Exception("You can only refresh your own token", 403);
        }

        // Fetch fresh user data from database
        $user = $this->userDao->getById($tokenUserId);
        if (!$user) {
            throw new Exception("User not found", 404);
        }

        // Generate new token
        $jwt_payload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'role' => $user['role']
        ];

        $newToken = JWT::encode(
            $jwt_payload,
            Config::JWT_SECRET(),
            'HS256'
        );

        // Clean sensitive data
        unset($user['password']);
        unset($user['email']);
        unset($user['created_at']);

        // Return user data with new token
        return ['data' => array_merge($user, ['token' => $newToken])];
    }
}
