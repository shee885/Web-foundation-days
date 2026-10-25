-- Day 6 Assignment: School Database

DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- Create the students table
CREATE TABLE students (
student_id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE
);

-- Create the courses table
CREATE TABLE courses (
course_id INTEGER PRIMARY KEY,
course_name TEXT NOT NULL,
description TEXT
);

-- Create the enrolments table
CREATE TABLE enrolments (
enrolment_id INTEGER PRIMARY KEY,
student_id INTEGER NOT NULL,
course_id INTEGER NOT NULL,
grade TEXT,

```
FOREIGN KEY (student_id) REFERENCES students(student_id),
FOREIGN KEY (course_id) REFERENCES courses(course_id),

UNIQUE (student_id, course_id)
```

);

-- Insert sample students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Mary Wanjiku', '[mary@example.com](mailto:mary@example.com)'),
(2, 'John Kamau', '[john@example.com](mailto:john@example.com)'),
(3, 'Peter Otieno', '[peter@example.com](mailto:peter@example.com)'),
(4, 'Grace Akinyi', '[grace@example.com](mailto:grace@example.com)');

-- Insert sample courses
INSERT INTO courses (course_id, course_name, description) VALUES
(1, 'Database Systems', 'Introduction to databases and SQL'),
(2, 'Web Development', 'Building websites and web applications'),
(3, 'Python Programming', 'Introduction to Python programming');

-- Insert sample enrolments
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 3, 3, 'A'),
(5, 2, 3, 'C');

-- ==========================================
-- QUERY 1: Find all courses taken by one student
-- ==========================================

SELECT students.name, courses.course_name, enrolments.grade
FROM students
JOIN enrolments ON students.student_id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE students.name = 'Mary Wanjiku';

-- ==========================================
-- QUERY 2: Find all students enrolled in one course
-- ==========================================

SELECT students.name, courses.course_name
FROM students
JOIN enrolments ON students.student_id = enrolments.student_id
JOIN courses ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Database Systems';

-- ==========================================
-- QUERY 3: Count students enrolled in each course
-- ==========================================

SELECT courses.course_name,
COUNT(enrolments.student_id) AS number_of_students
FROM courses
LEFT JOIN enrolments ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

-- ==========================================
-- QUERY 4: Find students who have no enrolments
-- ==========================================

SELECT students.student_id, students.name, students.email
FROM students
LEFT JOIN enrolments ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL;

-- ==========================================
-- QUERY 5: Update one enrolment's grade
-- ==========================================

UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 3;

-- Create an index to speed up searches by student
CREATE INDEX idx_enrolments_student_id
ON enrolments(student_id);



