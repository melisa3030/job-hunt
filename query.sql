-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema job-hunt-app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema job-hunt-app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `job-hunt-app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `job-hunt-app` ;

-- -----------------------------------------------------
-- Table `job-hunt-app`.`companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`companies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NULL DEFAULT NULL,
  `city` VARCHAR(100) NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`job_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`job_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('employer', 'applicant') NOT NULL,
  `company_id` INT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  CONSTRAINT `users_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `job-hunt-app`.`companies` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`job_titles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`job_titles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_title_id` INT NOT NULL,
  `company_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `description` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `work_type` ENUM('Remote', 'Hybrid', 'On-site') NOT NULL,
  `experience_level` ENUM('junior', 'intermediate', 'senior') NOT NULL,
  `salary` DECIMAL(10,2) NULL DEFAULT NULL,
  `posted_by` INT NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  INDEX `posted_by` (`posted_by` ASC) VISIBLE,
  INDEX `jobs_ibfk_4` (`job_title_id` ASC) VISIBLE,
  CONSTRAINT `jobs_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `job-hunt-app`.`companies` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `job-hunt-app`.`job_categories` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_3`
    FOREIGN KEY (`posted_by`)
    REFERENCES `job-hunt-app`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `jobs_ibfk_4`
    FOREIGN KEY (`job_title_id`)
    REFERENCES `job-hunt-app`.`job_titles` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`applications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_id` INT NOT NULL,
  `applicant_id` INT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NULL DEFAULT 'pending',
  `applied_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `job_id` (`job_id` ASC) VISIBLE,
  INDEX `applicant_id` (`applicant_id` ASC) VISIBLE,
  CONSTRAINT `applications_ibfk_1`
    FOREIGN KEY (`job_id`)
    REFERENCES `job-hunt-app`.`jobs` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2`
    FOREIGN KEY (`applicant_id`)
    REFERENCES `job-hunt-app`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`bookmarked_jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`bookmarked_jobs` (
  `user_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `job_id`),
  INDEX `job_id` (`job_id` ASC) VISIBLE,
  CONSTRAINT `bookmarked_jobs_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `job-hunt-app`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `bookmarked_jobs_ibfk_2`
    FOREIGN KEY (`job_id`)
    REFERENCES `job-hunt-app`.`jobs` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`perks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`perks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`job_perks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`job_perks` (
  `job_id` INT NOT NULL,
  `perk_id` INT NOT NULL,
  PRIMARY KEY (`job_id`, `perk_id`),
  INDEX `perk_id` (`perk_id` ASC) VISIBLE,
  CONSTRAINT `job_perks_ibfk_1`
    FOREIGN KEY (`job_id`)
    REFERENCES `job-hunt-app`.`jobs` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `job_perks_ibfk_2`
    FOREIGN KEY (`perk_id`)
    REFERENCES `job-hunt-app`.`perks` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`job_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`job_tags` (
  `job_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`job_id`, `tag_id`),
  INDEX `tag_id` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `job_tags_ibfk_1`
    FOREIGN KEY (`job_id`)
    REFERENCES `job-hunt-app`.`jobs` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `job_tags_ibfk_2`
    FOREIGN KEY (`tag_id`)
    REFERENCES `job-hunt-app`.`tags` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `company_id` INT NOT NULL,
  `job_title_id` INT NOT NULL,
  `rating` INT NOT NULL,
  `positive_review` TEXT NULL DEFAULT NULL,
  `negative_review` TEXT NULL DEFAULT NULL,
  `currently_working` ENUM('yes', 'no') NULL DEFAULT NULL,
  `recommend` ENUM('yes', 'no') NULL DEFAULT NULL,
  `employment_type` ENUM('Full Time', 'Part Time', 'Contract', 'Internship') NULL DEFAULT NULL,
  `employment_duration` ENUM('Less than a year', '1-2 years', '3-5 years', 'More than 5 years') NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `company_id` (`company_id` ASC) VISIBLE,
  INDEX `reviews_ibfk_2_idx` (`job_title_id` ASC) VISIBLE,
  CONSTRAINT `reviews_ibfk_1`
    FOREIGN KEY (`company_id`)
    REFERENCES `job-hunt-app`.`companies` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2`
    FOREIGN KEY (`job_title_id`)
    REFERENCES `job-hunt-app`.`job_titles` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `job-hunt-app`.`review_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `job-hunt-app`.`review_tags` (
  `review_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`review_id`, `tag_id`),
  INDEX `tag_id` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `review_tags_ibfk_1`
    FOREIGN KEY (`review_id`)
    REFERENCES `job-hunt-app`.`reviews` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_tags_ibfk_2`
    FOREIGN KEY (`tag_id`)
    REFERENCES `job-hunt-app`.`tags` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
