export const companies = [
  {
    id: 1,
    name: 'Google',
    country: 'USA',
    city: 'Mountain View',
    description: 'Google is a global leader in technology and innovation.',
    created_at: '2025-01-01',
  },
  {
    id: 2,
    name: 'Microsoft',
    country: 'USA',
    city: 'Redmond',
    description: 'Microsoft develops software, services, and devices.',
    created_at: '2025-01-02',
  },
  {
    id: 3,
    name: 'Amazon',
    country: 'USA',
    city: 'Seattle',
    description:
      'Amazon is a multinational technology company focusing on e-commerce, cloud computing, and AI.',
    created_at: '2025-01-03',
  },
  {
    id: 4,
    name: 'Apple',
    country: 'USA',
    city: 'Cupertino',
    description:
      'Apple designs and manufactures consumer electronics and software.',
    created_at: '2025-01-04',
  },
];

export const jobCategories = [
  { id: 1, name: 'Software Development' },
  { id: 2, name: 'Data Science' },
  { id: 3, name: 'DevOps' },
];

export const jobTitles = [
  { id: 1, name: 'Frontend Developer' },
  { id: 2, name: 'Backend Developer' },
  { id: 3, name: 'Full Stack Developer' },
  { id: 4, name: 'Data Scientist' },
  { id: 5, name: 'DevOps Engineer' },
  { id: 6, name: 'Mobile Developer' },
];

export const jobs = [
  {
    id: 1,
    job_title_id: 1,
    company_id: 1,
    category_id: 1,
    description: 'Develop and maintain web applications using React and Redux.',
    city: 'Redmond',
    country: 'USA',
    work_type: 'Remote',
    experience_level: 'Intermediate',
    salary: 120000,
    posted_by: 1,
    expires_at: '2025-04-03',
    created_at: '2025-03-01',
  },
  {
    id: 2,
    job_title_id: 2,
    company_id: 2,
    category_id: 1,
    description:
      'Build and maintain server-side applications using Node.js and Express.',
    city: 'Mountain View',
    country: 'USA',
    work_type: 'On-site',
    experience_level: 'Senior',
    salary: 130000,
    posted_by: 2,
    expires_at: '2025-04-10',
    created_at: '2025-03-05',
  },
  {
    id: 3,
    job_title_id: 3,
    company_id: 3,
    category_id: 1,
    description:
      'Develop and maintain full stack applications using React and Node.js.',
    city: 'Seattle',
    country: 'USA',
    work_type: 'Remote',
    experience_level: 'Junior',
    salary: 100000,
    posted_by: 3,
    expires_at: '2025-04-15',
    created_at: '2025-03-10',
  },
  {
    id: 4,
    job_title_id: 4,
    company_id: 4,
    category_id: 2,
    description: 'Analyze data and build machine learning models using Python.',
    city: 'Menlo Park',
    country: 'USA',
    work_type: 'Hybrid',
    experience_level: 'Senior',
    salary: 140000,
    posted_by: 4,
    expires_at: '2025-04-20',
    created_at: '2025-03-15',
  },
];

export const reviews = [
  {
    id: 1,
    company_id: 1,
    job_title_id: 1,
    rating: 4,
    positive_review: 'Great salary, top talent engineers',
    negative_review:
      'Turned into a corp, profit is the only thing that matters',
    currently_working: 'yes',
    recommend: 'yes',
    employment_type: 'Full Time',
    employment_duration: '1-2 years',
    created_at: '2025-03-19',
    technologies: ['React', 'Redux'],
  },
  {
    id: 2,
    company_id: 2,
    job_title_id: 2,
    rating: 5,
    positive_review: 'Amazing work environment and benefits',
    negative_review: 'Long working hours sometimes',
    currently_working: 'no',
    recommend: 'yes',
    employment_type: 'Full Time',
    employment_duration: '3-5 years',
    created_at: '2025-03-18',
    technologies: ['Node.js', 'Express'],
  },
  {
    id: 3,
    company_id: 3,
    job_title_id: 3,
    rating: 3,
    positive_review: 'Great learning opportunities',
    negative_review: 'High pressure and tight deadlines',
    currently_working: 'yes',
    recommend: 'no',
    employment_type: 'Contract',
    employment_duration: 'Less than a year',
    created_at: '2025-03-17',
    technologies: ['React', 'Node.js'],
  },
];

export const perks = [
  { id: 1, name: 'Remote' },
  { id: 2, name: 'Full-time' },
  { id: 3, name: '$120k - $150k' },
];

export const jobPerks = [
  { job_id: 1, perk_id: 1 },
  { job_id: 1, perk_id: 2 },
  { job_id: 1, perk_id: 3 },
];

export const tags = [
  { id: 1, name: 'React' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'HTML' },
  { id: 4, name: 'CSS' },
  { id: 5, name: 'Redux' },
];

export const jobTags = [
  { job_id: 1, tag_id: 1 },
  { job_id: 1, tag_id: 2 },
  { job_id: 1, tag_id: 3 },
  { job_id: 1, tag_id: 4 },
  { job_id: 1, tag_id: 5 },
];
