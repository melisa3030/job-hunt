<?php

require_once __DIR__ . '/../../data/Roles.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function verifyToken($token)
    {
        if (!$token) {
            throw new Exception("Unauthorized: No token provided", 401);
        }

        try {
            $decoded_token = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            Flight::set('user', $decoded_token->user);
            Flight::set('jwt_token', $token);
            return TRUE;
        } catch (Exception $e) {
            throw new Exception("Invalid token: " . $e->getMessage(), 401);
        }
    }

    public function authorizeRole(Roles $requiredRole)
    {
        $user = Flight::get('user');
        try {
            $roleEnum = Roles::from($user->role);
            if ($roleEnum !== $requiredRole) {
                throw new Exception('Access denied: insufficient privileges', 403);
            }
        } catch (ValueError $e) {
            throw new Exception('Invalid role', 403);
        }
    }

    public function authorizeRoles(array $roles)
    {
        $user = Flight::get('user');
        try {
            $userRoleEnum = Roles::from($user->role);
            // Ensure all roles are enums
            foreach ($roles as $role) {
                if (!$role instanceof Roles) {
                    throw new Exception('All roles must be Roles enum objects', 500);
                }
            }
            if (!in_array($userRoleEnum, $roles)) {
                throw new Exception('Access denied: permission missing', 403);
            }
        } catch (ValueError $e) {
            throw new Exception('Invalid role', 403);
        }
    }

    public function authorizePermission($permission)
    {
        $user = Flight::get('user');
        if (!in_array($permission, $user->permissions)) {
            throw new Exception('Access denied: permission missing', 403);
        }
    }
}
