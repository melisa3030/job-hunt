<?php

require_once 'BaseDao.php';
require_once __DIR__ . '/CompaniesDao.php';
require_once __DIR__ . '/UsersDao.php';
require_once __DIR__ . '/PerksDao.php';
require_once __DIR__ . '/TagsDao.php';
require_once __DIR__ . '/JobTitlesDao.php';
require_once __DIR__ . '/ApplicationsDao.php';
require_once __DIR__ . '/BookmarkedJobsDao.php';
require_once __DIR__ . '/JobCategoriesDao.php';
require_once __DIR__ . '/JobPerksDao.php';
require_once __DIR__ . '/JobsDao.php';
require_once __DIR__ . '/JobTagsDao.php';
require_once __DIR__ . '/ReviewsDao.php';
require_once __DIR__ . '/ReviewTagsDao.php';

function testCompaniesDao()
{
  $companiesDao = new CompaniesDao();
  echo "Initial Companies:\n";
  print_r($companiesDao->getAll());

  $companiesDao->insert(['name' => 'Test Company', 'country' => 'Test Country', 'city' => 'Test City']);
  echo "After Insert:\n";
  print_r($companiesDao->getAll());

  $companiesDao->update(1, ['name' => 'Updated Company']);
  echo "After Update:\n";
  print_r($companiesDao->getById(1));

  $companiesDao->delete(1);
  echo "After Delete:\n";
  print_r($companiesDao->getAll());
}

function testUsersDao()
{
  $usersDao = new UsersDao();
  echo "Initial Users:\n";
  print_r($usersDao->getAll());

  $usersDao->insert(['name' => 'Test User', 'username' => 'testuser', 'email' => 'test@example.com', 'password' => 'password', 'role' => 'applicant']);
  echo "After Insert:\n";
  print_r($usersDao->getAll());

  $usersDao->update(1, ['name' => 'Updated User']);
  echo "After Update:\n";
  print_r($usersDao->getById(1));

  $usersDao->delete(1);
  echo "After Delete:\n";
  print_r($usersDao->getAll());
}

function testPerksDao()
{
  $perksDao = new PerksDao();
  echo "Initial Perks:\n";
  print_r($perksDao->getAll());

  $perksDao->insert(['name' => 'Test Perk']);
  echo "After Insert:\n";
  print_r($perksDao->getAll());

  $perksDao->update(1, ['name' => 'Updated Perk']);
  echo "After Update:\n";
  print_r($perksDao->getById(1));

  $perksDao->delete(1);
  echo "After Delete:\n";
  print_r($perksDao->getAll());
}

function testTagsDao()
{
  $tagsDao = new TagsDao();
  echo "Initial Tags:\n";
  print_r($tagsDao->getAll());

  $tagsDao->insert(['name' => 'Test Tag']);
  echo "After Insert:\n";
  print_r($tagsDao->getAll());

  $tagsDao->update(1, ['name' => 'Updated Tag']);
  echo "After Update:\n";
  print_r($tagsDao->getById(1));

  $tagsDao->delete(1);
  echo "After Delete:\n";
  print_r($tagsDao->getAll());
}

function testJobTitlesDao()
{
  $jobTitlesDao = new JobTitlesDao();
  echo "Initial Job Titles:\n";
  print_r($jobTitlesDao->getAll());

  $jobTitlesDao->insert(['name' => 'Test Job Title']);
  echo "After Insert:\n";
  print_r($jobTitlesDao->getAll());

  $jobTitlesDao->update(1, ['name' => 'Updated Job Title']);
  echo "After Update:\n";
  print_r($jobTitlesDao->getById(1));

  $jobTitlesDao->delete(1);
  echo "After Delete:\n";
  print_r($jobTitlesDao->getAll());
}

function testApplicationsDao()
{
  $applicationsDao = new ApplicationsDao();
  echo "Initial Applications:\n";
  print_r($applicationsDao->getAll());

  $applicationsDao->insert(['applicant_id' => 1, 'job_id' => 1, 'status' => 'pending']);
  echo "After Insert:\n";
  print_r($applicationsDao->getAll());

  $applicationsDao->update(1, ['status' => 'accepted']);
  echo "After Update:\n";
  print_r($applicationsDao->getById(1));

  $applicationsDao->delete(1);
  echo "After Delete:\n";
  print_r($applicationsDao->getAll());
}

function testBookmarkedJobsDao()
{
  $bookmarkedJobsDao = new BookmarkedJobsDao();
  echo "Initial Bookmarked Jobs:\n";
  print_r($bookmarkedJobsDao->getAll());

  $bookmarkedJobsDao->insert(['user_id' => 1, 'job_id' => 1]);
  echo "After Insert:\n";
  print_r($bookmarkedJobsDao->getAll());

  $bookmarkedJobsDao->update(1, ['user_id' => 2]);
  echo "After Update:\n";
  print_r($bookmarkedJobsDao->getById(1));

  $bookmarkedJobsDao->delete(1);
  echo "After Delete:\n";
  print_r($bookmarkedJobsDao->getAll());
}

function testJobCategoriesDao()
{
  $jobCategoriesDao = new JobCategoriesDao();
  echo "Initial Job Categories:\n";
  print_r($jobCategoriesDao->getAll());

  $jobCategoriesDao->insert(['name' => 'Test Category']);
  echo "After Insert:\n";
  print_r($jobCategoriesDao->getAll());

  $jobCategoriesDao->update(1, ['name' => 'Updated Category']);
  echo "After Update:\n";
  print_r($jobCategoriesDao->getById(1));

  $jobCategoriesDao->delete(1);
  echo "After Delete:\n";
  print_r($jobCategoriesDao->getAll());
}

function testJobPerksDao()
{
  $jobPerksDao = new JobPerksDao();
  echo "Initial Job Perks:\n";
  print_r($jobPerksDao->getAll());

  $jobPerksDao->insert(['job_id' => 1, 'perk_id' => 1]);
  echo "After Insert:\n";
  print_r($jobPerksDao->getAll());

  $jobPerksDao->update(1, ['job_id' => 2]);
  echo "After Update:\n";
  print_r($jobPerksDao->getById(1));

  $jobPerksDao->delete(1);
  echo "After Delete:\n";
  print_r($jobPerksDao->getAll());
}

function testJobsDao()
{
  $jobsDao = new JobsDao();
  echo "Initial Jobs:\n";
  print_r($jobsDao->getAll());

  $jobsDao->insert(['title' => 'Test Job', 'description' => 'Test Description']);
  echo "After Insert:\n";
  print_r($jobsDao->getAll());

  $jobsDao->update(1, ['title' => 'Updated Job']);
  echo "After Update:\n";
  print_r($jobsDao->getById(1));

  $jobsDao->delete(1);
  echo "After Delete:\n";
  print_r($jobsDao->getAll());
}

function testJobTagsDao()
{
  $jobTagsDao = new JobTagsDao();
  echo "Initial Job Tags:\n";
  print_r($jobTagsDao->getAll());

  $jobTagsDao->insert(['job_id' => 1, 'tag_id' => 1]);
  echo "After Insert:\n";
  print_r($jobTagsDao->getAll());

  $jobTagsDao->update(1, ['job_id' => 2]);
  echo "After Update:\n";
  print_r($jobTagsDao->getById(1));

  $jobTagsDao->delete(1);
  echo "After Delete:\n";
  print_r($jobTagsDao->getAll());
}

function testReviewsDao()
{
  $reviewsDao = new ReviewsDao();
  echo "Initial Reviews:\n";
  print_r($reviewsDao->getAll());

  $reviewsDao->insert(['company_id' => 1, 'user_id' => 1, 'rating' => 5, 'comment' => 'Test Review']);
  echo "After Insert:\n";
  print_r($reviewsDao->getAll());

  $reviewsDao->update(1, ['rating' => 4]);
  echo "After Update:\n";
  print_r($reviewsDao->getById(1));

  $reviewsDao->delete(1);
  echo "After Delete:\n";
  print_r($reviewsDao->getAll());
}

function testReviewTagsDao()
{
  $reviewTagsDao = new ReviewTagsDao();
  echo "Initial Review Tags:\n";
  print_r($reviewTagsDao->getAll());

  $reviewTagsDao->insert(['review_id' => 1, 'tag_id' => 1]);
  echo "After Insert:\n";
  print_r($reviewTagsDao->getAll());

  $reviewTagsDao->update(1, ['review_id' => 2]);
  echo "After Update:\n";
  print_r($reviewTagsDao->getById(1));

  $reviewTagsDao->delete(1);
  echo "After Delete:\n";
  print_r($reviewTagsDao->getAll());
}

testCompaniesDao();
// testUsersDao();
// testPerksDao();
// testTagsDao();
// testJobTitlesDao();
// testApplicationsDao();
// testBookmarkedJobsDao();
// testJobCategoriesDao();
// testJobPerksDao();
// testJobsDao();
// testJobTagsDao();
// testReviewsDao();
// testReviewTagsDao();
