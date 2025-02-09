create table jobs (
  id character varying(40) not null primary key,
  title character varying(300),
  description character varying(2000),
  published_at timestamptz,
  expired_at timestamptz,
  position character varying(100),
  location character varying(1000),
  quantity integer default 1,
  applicant_count integer default 1,
  requirements character varying(2000),
  benefit character varying(1000),
  skills character varying[],
  company_id character varying(40)
);

insert into jobs(id, title, description, published_at, expired_at, position, location, quantity, applicant_count, requirements, benefit, company_id)  values ('senior-backend-developer', 'Senior Backend Developer (Java, Kotlin, MySQL)', '• Analyze and organize raw data
• Build data systems and pipelines
• Prepare data for prescriptive and predictive modeling
• Combine raw information from different sources
• Explore ways to enhance data quality and reliability
• Identify opportunities for data acquisition
• Data pipeline maintenance/testing.', '2023-05-24 17:00:00+00', '2023-05-29 17:00:00+00', 'Senior Backend Developer', 'Hanoi', 1, 1, 'asdsadasd', 'Analyze and organize raw data

Build data systems and pipelines

Prepare data for prescriptive and predictive modeling

Combine raw information from different sources
Explore ways to enhance data quality and reliability
Identify opportunities for data acquisition
Data pipeline maintenance/testing.', 'mb-bank');
insert into jobs(id, title, description, published_at, expired_at, position, location, quantity, applicant_count, requirements, benefit, company_id) values ('business-analyst-jp', 'Business Analyst (Japanese)', 'Previous experience as a data engineer or in a similar role

Technical expertise with data models, data mining, and segmentation techniques

Knowledge of programming languages (e.g. Java and Python)
Experience with data architecture and data modeling
Hands-on experience with SQL database design
Great numerical and analytical skills

Degree in Computer Science, IT, or similar field; a Masters is a plus

Data engineering certification (e.g IBM Certified Data Engineer) is a plus
', '2023-05-24 17:00:00+00', '2023-05-30 17:00:00+00', 'Business Analyst', 'Danang', 1, 2, '<ul style="padding: 0px 0px 0px 2rem; margin-right: 0px; margin-bottom: 1rem; margin-left: 0px; color: rgb(58, 58, 58); font-family: Roboto, sans-serif; font-size: 16px; letter-spacing: normal;"><li>Previous experience as a data engineer or in a similar role</li><li>Technical expertise with data models, data mining, and segmentation techniques</li><li>Knowledge of programming languages (e.g. Java and Python)</li><li>Experience with data architecture and data modeling</li><li>Hands-on experience with SQL database design</li><li>Great numerical and analytical skills</li><li>Degree in Computer Science, IT, or similar field; a Masters is a plus</li><li>Data engineering certification (e.g IBM Certified Data Engineer) is a plus</li></ul>', '• • • Previous experience as a data engineer or in a similar role
• • • Technical expertise with data models, data mining, and segmentation techniques
• • • Knowledge of programming languages (e.g. Java and Python)
• • • Experience with data architecture and data modeling', 'mb-bank');
insert into jobs(id, title, description, published_at, expired_at, position, location, quantity, applicant_count, requirements, benefit, company_id) values ('senior-devops-engineer', 'Senior DevOps Engineer - Salary Up to $2800', '1. Collaborate with Front-End Developers to integrate user-facing elements with server-side logic and other applications APIs;
2. Maintain and improve running-functionality as well as design and develop new system, new feature; d
3. Develop and maintain Back-End Code that improves analytical and statistical modeling and forecasting methods to support business tribes in their decision-making process;
4. Create data structures from scratch;
5. Actively test and debug code defect;
6. Research to learn technology and knowledge needed to develop products for the global market.', '2023-05-24 17:00:00+00', '2023-05-30 17:00:00+00', 'Senior Devops Engineer', 'Cantho', 1, 1, '1. Analyze and organize raw data
2. Build data systems and pipelines
3. Prepare data for prescriptive and predictive modeling
4. Combine raw information from different sources
5. Explore ways to enhance data quality and reliability
6. Identify opportunities for data acquisition
7. Data pipeline maintenance/testing.', '1. Analyze and organize raw data
2. Build data systems and pipelines
3. Prepare data for prescriptive and predictive modeling
4. Combine raw information from different sources
5. Explore ways to enhance data quality and reliability
6. Identify opportunities for data acquisition
7. Data pipeline maintenance/testing.
8. ', 'mb-bank');