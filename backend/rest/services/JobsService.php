<?php

require_once __DIR__ . '/../../data/ExperienceLevel.php';
require_once __DIR__ . '/../../data/WorkType.php';
require_once __DIR__ . '/../../helpers.php';

class JobsService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new JobsDao();
    }

    public function getAllJobs()
    {
        return $this->dao->getAll();
    }

    public function getJobById($id)
    {
        $job = $this->dao->getById($id);
        if ($job) {
            return $job;
        } else {
            throw new Exception("Job not found", 404);
        }
    }

    public function getJobsByEmployerId($id)
    {
        $jobs = $this->dao->getByField('posted_by', $id);
        if ($jobs) {
            return $jobs;
        } else {
            throw new Exception("No jobs found for this employer", 404);
        }
    }

    public function getJobsForAuthUser()
    {
        $user = Flight::get('user');
        if (!$user) {
            throw new Exception("User not authenticated", 401);
        }

        $jobs = $this->dao->getByField('posted_by', $user->id);
        return $jobs;
    }

    public function createJob($data)
    {
        $user = Flight::get('user');
        if (!$user) {
            throw new Exception("User not authenticated", 401);
        }

        $requiredFields = ['job_title_id', 'company_id', 'category_id', 'description', 'city', 'country', 'work_type', 'experience_level', 'salary', 'expires_at'];
        validateBody($requiredFields, $data);

        if (!Flight::companiesService()->getCompanyById($data['company_id'])) {
            throw new Exception("Company not found", 404);
        }
        if (!Flight::jobTitlesService()->getById($data['job_title_id'])) {
            throw new Exception("Job title not found", 404);
        }
        if (!Flight::userService()->getUserById($user->id)) {
            throw new Exception("User not found", 404);
        }

        if (!Flight::jobCategoriesService()->getJobCategoryById($data['category_id'])) {
            throw new Exception("Category not found", 404);
        }

        if (isset($data['expires_at'])) {
            $date = DateTime::createFromFormat('m/d/Y', $data['expires_at']);
            if (!$date || $date->format('m/d/Y') !== $data['expires_at']) {
                throw new Exception("Invalid date format for expires_at. Expected mm/dd/yyyy", 400);
            }
            $data['expires_at'] = $date->format('Y-m-d H:i:s');
        }

        try {
            WorkType::from(trim($data['work_type']));
        } catch (\ValueError $e) {
            throw new Exception("Invalid value for work_type. Must be REMOTE, HYBRID, or ON-SITE.", 400);
        }

        try {
            ExperienceLevel::from(trim($data['experience_level']));
        } catch (\ValueError $e) {
            throw new Exception("Invalid value for experience_level. Must be JUNIOR, INTERMEDIATE, or SENIOR.", 400);
        }

        $data['posted_by'] = $user->id;

        if (!$this->dao->insert($data)) {
            throw new Exception("Error creating job", 500);
        }

        return ["message" => "Job created successfully"];
    }

    public function updateJob($id, $data, $user)
    {

        $job = $this->getJobById($id);
        if (!$job) {
            throw new Exception("Job not found", 404);
        }

        $userRole = Roles::from($user->role);

        if ($userRole !== Roles::ADMIN && $job['posted_by'] != $user->id) {
            throw new Exception("Forbidden: You can only update your own jobs", 403);
        }

        $requiredFields = ['job_title_id', 'company_id', 'category_id', 'description', 'city', 'country', 'work_type', 'experience_level', 'salary', 'expires_at'];
        $hasRequiredField = false;

        foreach ($requiredFields as $field) {
            if (isset($data[$field]) && !empty($data[$field])) {
                $hasRequiredField = true;
                break;
            }
        }

        if (!$hasRequiredField) {
            throw new Exception("Update requires at least one of these fields: " . implode(', ', $requiredFields), 400);
        }

        // Validate only the fields that are present in the request
        if (isset($data['company_id']) && !Flight::companiesService()->getCompanyById($data['company_id'])) {
            throw new Exception("Company not found", 404);
        }
        if (isset($data['job_title_id']) && !Flight::jobTitlesService()->getById($data['job_title_id'])) {
            throw new Exception("Job title not found", 404);
        }
        if (isset($data['posted_by']) && !Flight::userService()->getUserById($data['posted_by'])) {
            throw new Exception("User not found", 404);
        }
        if (isset($data['category_id']) && !Flight::jobCategoriesService()->getJobCategoryById($data['category_id'])) {
            throw new Exception("Category not found", 404);
        }

        if (isset($data['expires_at'])) {
            $date = DateTime::createFromFormat('m/d/Y', $data['expires_at']);
            if (!$date || $date->format('m/d/Y') !== $data['expires_at']) {
                throw new Exception("Invalid date format for expires_at. Expected mm/dd/yyyy", 400);
            }
            // Convert the DateTime object back to a string format that MySQL expects
            $data['expires_at'] = $date->format('Y-m-d H:i:s');
        }

        // Validate enum values only if they are present
        if (isset($data['work_type'])) {
            try {
                WorkType::from(trim($data['work_type']));
            } catch (\ValueError $e) {
                throw new Exception("Invalid value for work_type. Must be REMOTE, HYBRID, or ON-SITE.", 400);
            }
        }

        if (isset($data['experience_level'])) {
            try {
                ExperienceLevel::from(trim($data['experience_level']));
            } catch (\ValueError $e) {
                throw new Exception("Invalid value for experience_level. Must be JUNIOR, INTERMEDIATE, or SENIOR.", 400);
            }
        }

        if (!$this->dao->update($id, $data)) {
            throw new Exception("Error updating job", 500);
        }

        return ["message" => "Job updated successfully"];
    }

    public function deleteJob($id, $user)
    {
        $job = $this->dao->getById($id);
        if (!$job) {
            throw new Exception("Job not found", 404);
        }

        $userRole = Roles::from($user->role);

        if ($userRole !== Roles::ADMIN && $job['posted_by'] != $user->id) {
            throw new Exception("Forbidden: You can only delete your own jobs", 403);
        }


        if (!$this->dao->delete($id)) {
            throw new Exception("Error deleting job", 500);
        }

        return ["message" => "Job deleted successfully"];
    }
}
