<?php

require_once __DIR__ . "/vendor/autoload.php";

require_once __DIR__ . '/routes/users.php';
require_once __DIR__ . '/routes/companies.php';
require_once __DIR__ . '/routes/perks.php';
require_once __DIR__ . '/routes/tags.php';
require_once __DIR__ . '/routes/job_titles.php';
require_once __DIR__ . '/routes/job_categories.php';
require_once __DIR__ . '/routes/reviews.php';
require_once __DIR__ . '/routes/review_tags.php';
require_once __DIR__ . '/routes/jobs.php';
require_once __DIR__ . '/routes/job_tags.php';
require_once __DIR__ . '/routes/job_perks.php';
require_once __DIR__ . '/routes/job_categories.php';
require_once __DIR__ . '/routes/bookmarked_jobs.php';
require_once __DIR__ . '/routes/applications.php';

require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/TagsService.php';
require_once __DIR__ . '/services/ReviewsService.php';
require_once __DIR__ . '/services/CompaniesService.php';
require_once __DIR__ . '/services/ReviewTagsService.php';
require_once __DIR__ . '/services/PerksService.php';

Flight::register('userService', 'UserService');
Flight::register('tagsService', 'TagsService');
Flight::register('reviewsService', 'ReviewsService');
Flight::register('companiesService', 'CompaniesService');
Flight::register('reviewTagsService', 'ReviewTagsService');
Flight::register('perksService', 'PerksService');



Flight::route('GET /', function () {
    echo 'Welcome to the Job Hunt API!';
});

// Start Flight PHP
Flight::start();
