<?php
// Debugging
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

//Flight::map('error', function (Exception $ex) {
//    Flight::json([
//        'error' => true,
//        'message' => $ex->getMessage()
//    ], 500);
//});

require_once __DIR__ . "/vendor/autoload.php";

require_once __DIR__ . '/rest/middleware/CorsMiddleware.php';
// Register CORS middleware before anything else
Flight::before('start', ['CorsMiddleware', 'handle']);

// Services
require_once __DIR__ . '/rest/services/UserService.php';
require_once __DIR__ . '/rest/services/TagsService.php';
require_once __DIR__ . '/rest/services/ReviewsService.php';
require_once __DIR__ . '/rest/services/CompaniesService.php';
require_once __DIR__ . '/rest/services/ReviewTagsService.php';
require_once __DIR__ . '/rest/services/PerksService.php';
require_once __DIR__ . '/rest/services/JobsService.php';
require_once __DIR__ . '/rest/services/JobTitlesService.php';
require_once __DIR__ . '/rest/services/JobCategoriesService.php';
require_once __DIR__ . '/rest/services/JobTagsService.php';
require_once __DIR__ . '/rest/services/JobPerksService.php';
require_once __DIR__ . '/rest/services/BookmarkedJobsService.php';
require_once __DIR__ . '/rest/services/ApplicationsService.php';
require_once __DIR__ . '/rest/services/AuthService.php';

Flight::register('userService', 'UserService');
Flight::register('tagsService', 'TagsService');
Flight::register('reviewsService', 'ReviewsService');
Flight::register('companiesService', 'CompaniesService');
Flight::register('reviewTagsService', 'ReviewTagsService');
Flight::register('perksService', 'PerksService');
Flight::register('jobsService', 'JobsService');
Flight::register('jobTitlesService', 'JobTitlesService');
Flight::register('jobCategoriesService', 'JobCategoriesService');
Flight::register('jobTagsService', 'JobTagsService');
Flight::register('jobPerksService', 'JobPerksService');
Flight::register('bookmarkedJobsService', 'BookmarkedJobsService');
Flight::register('applicationsService', 'ApplicationsService');
Flight::register('authService', 'AuthService');

// Middleware
require_once __DIR__ . '/rest/middleware/AuthMiddleware.php';
Flight::register('authMiddleware', 'AuthMiddleware');

// Global middleware for all routes
Flight::route('/*', function () {
    $current_path = Flight::request()->url;
    $current_method = Flight::request()->method;

    // Allow all /docs routes to be public
    if (strpos($current_path, '/docs') === 0) {
        return true;
    }

    // Array of [METHOD, PATH] pairs
    $public_routes = [
        // Auth
        ['POST', '/auth/login'],
        // Users
        ['POST', '/users'],
        // Tags
        ['GET', '/tags'],
        ['GET', '/tags/@id'],
        ['GET', '/tags'],
        // Review Tags
        ['GET', '/review_tags'],
        ['GET', '/review_tags/@id'],
        // Reviews
        ['GET', '/reviews'],
        ['GET', '/reviews/@id'],
        // Perks
        ['GET', '/perks'],
        ['GET', '/perks/@id'],
        ['GET', '/perks'],
        // Job Titles
        ['GET', '/job_titles'],
        ['GET', '/job_titles/@id'],
        // Job Tags
        ['GET', '/job_tags'],
        ['GET', '/job_tags/tag/@tag_id'],
        ['GET', '/job_tags/job/@job_id'],
        // Jobs
        ['GET', '/jobs'],
        ['GET', '/jobs/@id'],
        // Job Perks
        ['GET', '/job_perks'],
        ['GET', '/job_perks/@id'],
        // Job Categories
        ['GET', '/job_categories'],
        ['GET', '/job_categories/@id'],
        // Companies
        ['GET', '/companies'],
        ['GET', '/companies/@id'],
    ];

    foreach ($public_routes as [$method, $route]) {
        if ($current_method === $method && strpos($current_path, $route) === 0) {
            return true;
        }
    }

    try {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

        return Flight::authMiddleware()->verifyToken($token);
    } catch (Exception $e) {
        Flight::jsonHalt([
            'message' => $e->getMessage()
        ], $e->getCode() ?: 500);
        return false;
    }
});

// Routes
require_once __DIR__ . '/rest/routes/UserRoutes.php';
require_once __DIR__ . '/rest/routes/CompanyRoutes.php';
require_once __DIR__ . '/rest/routes/PerkRoutes.php';
require_once __DIR__ . '/rest/routes/TagRoutes.php';
require_once __DIR__ . '/rest/routes/JobTitleRoutes.php';
require_once __DIR__ . '/rest/routes/JobCategoryRoutes.php';
require_once __DIR__ . '/rest/routes/ReviewRoutes.php';
require_once __DIR__ . '/rest/routes/ReviewTagRoutes.php';
require_once __DIR__ . '/rest/routes/JobRoutes.php';
require_once __DIR__ . '/rest/routes/JobTagRoutes.php';
require_once __DIR__ . '/rest/routes/JobPerkRoutes.php';
require_once __DIR__ . '/rest/routes/JobCategoryRoutes.php';
require_once __DIR__ . '/rest/routes/BookmarkedJobRoutes.php';
require_once __DIR__ . '/rest/routes/ApplicationRoutes.php';
require_once __DIR__ . '/rest/routes/AuthRoutes.php';
require_once __DIR__ . '/rest/routes/SwaggerRoutes.php';

// Test route to debug
Flight::route('GET /test', function() {
    Flight::json(['message' => 'Flight is working!']);
});

// Start Flight PHP
Flight::start();
