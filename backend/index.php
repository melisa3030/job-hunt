<?php

require_once __DIR__ . "/vendor/autoload.php";

// Routes
require_once __DIR__ . '/rest/routes/users.php';
require_once __DIR__ . '/rest/routes/companies.php';
require_once __DIR__ . '/rest/routes/perks.php';
require_once __DIR__ . '/rest/routes/tags.php';
require_once __DIR__ . '/rest/routes/job_titles.php';
require_once __DIR__ . '/rest/routes/job_categories.php';
require_once __DIR__ . '/rest/routes/reviews.php';
require_once __DIR__ . '/rest/routes/review_tags.php';
require_once __DIR__ . '/rest/routes/jobs.php';
require_once __DIR__ . '/rest/routes/job_tags.php';
require_once __DIR__ . '/rest/routes/job_perks.php';
require_once __DIR__ . '/rest/routes/job_categories.php';
require_once __DIR__ . '/rest/routes/bookmarked_jobs.php';
require_once __DIR__ . '/rest/routes/applications.php';

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




Flight::route('GET /', function () {
    echo 'Welcome to the Job Hunt API!';
});

// Start Flight PHP
Flight::start();
