-- First, truncate all tables to start fresh
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE review_tags;
TRUNCATE TABLE job_tags;
TRUNCATE TABLE job_perks;
TRUNCATE TABLE bookmarked_jobs;
TRUNCATE TABLE applications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE jobs;
TRUNCATE TABLE users;
TRUNCATE TABLE companies;
TRUNCATE TABLE job_categories;
TRUNCATE TABLE job_titles;
TRUNCATE TABLE tags;
TRUNCATE TABLE perks;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert job categories
INSERT INTO job_categories (name) VALUES
('Software Development'),
('Data Science'),
('DevOps'),
('UI/UX Design'),
('Project Management'),
('Digital Marketing'),
('Customer Support');

-- Insert job titles
INSERT INTO job_titles (name) VALUES
('Software Engineer'),
('Full Stack Developer'),
('Data Scientist'),
('DevOps Engineer'),
('UI/UX Designer'),
('Project Manager'),
('Digital Marketing Specialist'),
('Customer Support Representative'),
('Product Manager'),
('Frontend Developer'),
('Backend Developer');

-- Insert tags
INSERT INTO tags (name) VALUES
('JavaScript'),
('Python'),
('React'),
('Node.js'),
('AWS'),
('Docker'),
('Kubernetes'),
('Machine Learning'),
('SQL'),
('NoSQL'),
('Git'),
('Agile'),
('Scrum');

-- Insert perks
INSERT INTO perks (name) VALUES
('Health Insurance'),
('Dental Insurance'),
('401k Matching'),
('Remote Work'),
('Flexible Hours'),
('Unlimited PTO'),
('Professional Development'),
('Gym Membership'),
('Company Events'),
('Stock Options'),
('Performance Bonus');

-- Insert users (1 admin, 5 employers, 10 applicants)
-- Note: All passwords are 'password123'
INSERT INTO users (name, username, email, password, role) VALUES
-- Admin
('Admin User', 'admin', 'admin@jobhunt.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'ADMIN'),

-- Employers
('John Smith', 'johnsmith', 'john.smith@techcorp.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'EMPLOYER'),
('Sarah Johnson', 'sarahj', 'sarah.j@innovatech.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'EMPLOYER'),
('Michael Brown', 'mikeb', 'mike.brown@datasoft.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'EMPLOYER'),
('Emily Davis', 'emilyd', 'emily.davis@designco.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'EMPLOYER'),
('David Wilson', 'davidw', 'david.wilson@webtech.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'EMPLOYER'),

-- Applicants
('Alice Cooper', 'alicec', 'alice.cooper@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Bob Martinez', 'bobm', 'bob.martinez@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Carol White', 'carolw', 'carol.white@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Daniel Lee', 'danlee', 'daniel.lee@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Eva Green', 'evag', 'eva.green@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Frank Miller', 'frankm', 'frank.miller@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Grace Kim', 'gracek', 'grace.kim@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Henry Ford', 'henryf', 'henry.ford@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Iris Wong', 'irisw', 'iris.wong@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT'),
('Jack Thompson', 'jackt', 'jack.thompson@email.com', '$2y$10$n.BtuDN5DuJ.F8STGZgcw.RjT.gH9LH220ad.tNM0M47Y82SrZOmW', 'APPLICANT');

-- Insert companies
INSERT INTO companies (name, country, city, description, employer_id) VALUES
('TechCorp', 'United States', 'San Francisco', 'Leading technology solutions provider', 2),
('InnovaTech', 'United States', 'New York', 'Innovative software development company', 3),
('DataSoft', 'United Kingdom', 'London', 'Data analytics and software solutions', 4),
('DesignCo', 'Canada', 'Toronto', 'Creative design and development studio', 5),
('WebTech', 'Germany', 'Berlin', 'Web development and cloud solutions', 6);

-- Update users with company_id for employers
UPDATE users SET company_id = 1 WHERE id = 2;
UPDATE users SET company_id = 2 WHERE id = 3;
UPDATE users SET company_id = 3 WHERE id = 4;
UPDATE users SET company_id = 4 WHERE id = 5;
UPDATE users SET company_id = 5 WHERE id = 6;

-- Insert jobs
INSERT INTO jobs (job_title_id, company_id, category_id, description, city, country, work_type, experience_level, salary, posted_by, expires_at) VALUES
(1, 1, 1, 'Looking for an experienced software engineer to join our team. Must have strong background in full-stack development.', 'San Francisco', 'United States', 'HYBRID', 'SENIOR', 120000.00, 2, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(2, 2, 1, 'Full stack developer position available. Experience with React and Node.js required.', 'New York', 'United States', 'REMOTE', 'INTERMEDIATE', 95000.00, 3, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(3, 3, 2, 'Data Scientist position open. Must have experience with Python and Machine Learning.', 'London', 'United Kingdom', 'ON-SITE', 'SENIOR', 85000.00, 4, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(4, 4, 4, 'UI/UX Designer needed for our growing team. Experience with Figma required.', 'Toronto', 'Canada', 'HYBRID', 'INTERMEDIATE', 75000.00, 5, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(5, 5, 1, 'Backend Developer position. Experience with Python and Django required.', 'Berlin', 'Germany', 'REMOTE', 'JUNIOR', 65000.00, 6, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY));

-- Insert job tags
INSERT INTO job_tags (job_id, tag_id) VALUES
(1, 1), (1, 3), (1, 4), -- JavaScript, React, Node.js
(2, 1), (2, 3), (2, 4), -- JavaScript, React, Node.js
(3, 2), (3, 8), (3, 9), -- Python, Machine Learning, SQL
(4, 1), (4, 3), -- JavaScript, React
(5, 2), (5, 9), (5, 10); -- Python, SQL, NoSQL

-- Insert job perks
INSERT INTO job_perks (job_id, perk_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Health, Dental, 401k, Remote Work
(2, 1), (2, 4), (2, 5), (2, 6), -- Health, Remote Work, Flexible Hours, Unlimited PTO
(3, 1), (3, 2), (3, 7), (3, 10), -- Health, Dental, Professional Dev, Stock Options
(4, 1), (4, 4), (4, 8), (4, 9), -- Health, Remote Work, Gym, Company Events
(5, 1), (5, 4), (5, 5), (5, 11); -- Health, Remote Work, Flexible Hours, Performance Bonus

-- Insert applications
INSERT INTO applications (job_id, applicant_id, status) VALUES
(1, 7, 'PENDING'),
(1, 8, 'ACCEPTED'),
(2, 9, 'PENDING'),
(2, 10, 'REJECTED'),
(3, 11, 'PENDING'),
(4, 12, 'ACCEPTED'),
(5, 13, 'PENDING');

-- Insert bookmarked jobs
INSERT INTO bookmarked_jobs (user_id, job_id) VALUES
(7, 1),
(7, 2),
(8, 1),
(9, 3),
(10, 4),
(11, 5);

-- Insert reviews
INSERT INTO reviews (company_id, job_title_id, rating, positive_review, negative_review, currently_working, recommend, employment_type, employment_duration, anonymous, user_id) VALUES
(1, 1, 5, 'Great work environment and culture', 'Sometimes long hours', 'YES', 'YES', 'FULL_TIME', 'ONE_TO_TWO_YEARS', 0, 7),
(2, 2, 4, 'Good work-life balance', 'Communication could be better', 'YES', 'YES', 'FULL_TIME', 'LESS_THAN_A_YEAR', 0, 8),
(3, 3, 5, 'Excellent learning opportunities', 'High pressure environment', 'NO', 'YES', 'FULL_TIME', 'THREE_TO_FIVE_YEARS', 1, 9),
(4, 4, 3, 'Creative freedom', 'Limited growth opportunities', 'NO', 'NO', 'FULL_TIME', 'ONE_TO_TWO_YEARS', 0, 10),
(5, 5, 4, 'Great remote work culture', 'Project management needs improvement', 'YES', 'YES', 'FULL_TIME', 'LESS_THAN_A_YEAR', 0, 11);

-- Insert review tags
INSERT INTO review_tags (review_id, tag_id) VALUES
(1, 12), (1, 13), -- Agile, Scrum
(2, 11), (2, 12), -- Git, Agile
(3, 8), (3, 9), -- Machine Learning, SQL
(4, 1), (4, 3), -- JavaScript, React
(5, 2), (5, 4); -- Python, Node.js 