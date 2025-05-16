<?php

require_once __DIR__ . "/vendor/autoload.php";

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

Flight::route('GET /', function () {
    echo 'Welcome to the Job Hunt API!';
});

// Start Flight PHP
Flight::start();
