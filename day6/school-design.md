# School Database Design

## 1. Tables

The database has three tables: students, courses, and enrolments.

The **students** table stores each student's ID, name, and email address. The student ID is the primary key, and each email address must be unique.

The **courses** table stores course information, including the course ID, course name, and description. The course ID is the primary key.

The **enrolments** table connects students to courses. It stores the enrolment ID, student ID, course ID, and grade. The student ID and course ID are foreign keys that reference the students and courses tables.

## 2. Relationships

The relationship between students and enrolments is one-to-many because one student can enrol in several courses, while each enrolment belongs to one student.

The relationship between courses and enrolments is also one-to-many because one course can have many students, while each enrolment belongs to one course.

Students and courses have a many-to-many relationship. A student can take several courses, and each course can have several students.

The enrolments table is needed to connect students and courses. It also stores additional information, such as each student's grade. A UNIQUE constraint on student_id and course_id prevents a student from enrolling in the same course more than once.

## 3. Index

I created an index on the student_id column in the enrolments table. This helps the database find a student's enrolments more quickly when retrieving their courses. An index can improve search performance, although it also uses storage space and may add some overhead when records are inserted or updated.

## 4. SQL vs NoSQL

I would choose SQL for this school database because the information is structured and has clear relationships between students, courses, and enrolments. SQL supports primary keys, foreign keys, unique constraints, and JOIN queries, which help maintain accurate records and retrieve related information. NoSQL databases are useful for other types of data, but a relational database is a suitable choice for this school system because it needs to manage enrolments and grades consistently.
