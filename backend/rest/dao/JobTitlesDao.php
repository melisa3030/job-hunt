<?php

require_once 'BaseDao.php';

class JobTitlesDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct("job_titles");
    }

    public function getByName($name)
    {
        try {
            $query = "SELECT * FROM job_titles WHERE name = :name";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new PDOException("Database error in getByName(): " . $e->getMessage());
        }
    }
}
