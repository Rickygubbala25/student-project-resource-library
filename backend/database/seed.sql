INSERT INTO users
(
    full_name,
    email,
    password_hash,
    college,
    department,
    semester,
    student_id,
    role
)
VALUES
(
    'Demo Student',
    'demo@student.com',
    '$2b$10$abcdefghijklmnopqrstuu123456789012345678901234567890',
    'Aditya Polytechnic College',
    'Computer Engineering',
    '6',
    'DEMO001',
    'student'
);

INSERT INTO projects
(
    title,
    abstract,
    problem_statement,
    objectives,
    description,
    technologies,
    department,
    difficulty,
    project_type,
    submitted_by,
    status
)
VALUES
(
    'Student Project Resource Library',
    'A web platform for students to discover and share academic project resources.',
    'Students need a centralized platform to find useful project information and resources.',
    'Provide searchable projects, resources and project documentation.',
    'A full-stack resource library built for academic project sharing.',
    'HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, AWS',
    'Computer Engineering',
    'Intermediate',
    'Web Application',
    1,
    'approved'
);
