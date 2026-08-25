/*
# Seed demo profiles

Inserts 12 realistic demo candidate profiles into the profiles table,
along with their associated skills (profile_skills) and interests (profile_interests).

These match the DEMO_CANDIDATES array from the frontend demoData.ts file.
*/

DO $$
DECLARE
  p1 uuid; p2 uuid; p3 uuid; p4 uuid; p5 uuid; p6 uuid;
  p7 uuid; p8 uuid; p9 uuid; p10 uuid; p11 uuid; p12 uuid;
BEGIN
  -- Profile 1: Sarah Chen
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Sarah Chen', 'Full-Stack Engineer', 'Advanced', '10-20',
    'Full-stack engineer who loves building secure, data-heavy products. Shipped two campus safety tools.')
  RETURNING id INTO p1;

  -- Profile 2: Marcus Rivera
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Marcus Rivera', 'Cybersecurity Specialist', 'Expert', '10-20',
    'Security researcher focused on threat detection and incident response. CTF regular and open-source contributor.')
  RETURNING id INTO p2;

  -- Profile 3: Priya Nair
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Priya Nair', 'UI/UX Designer', 'Intermediate', '10-20',
    'Product designer obsessed with accessible interfaces. Background in edtech and civic tech.')
  RETURNING id INTO p3;

  -- Profile 4: David Okafor
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('David Okafor', 'ML Engineer', 'Advanced', '20-30',
    'ML engineer building explainable models for high-stakes domains. Published at NeurIPS workshop.')
  RETURNING id INTO p4;

  -- Profile 5: Lena Fischer
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Lena Fischer', 'Data Engineer', 'Intermediate', '10-20',
    'Data engineer passionate about climate data pipelines. Built emissions tracking dashboards.')
  RETURNING id INTO p5;

  -- Profile 6: James Carter
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('James Carter', 'Product Manager', 'Expert', '5-10',
    'PM who turns ambiguous problems into shipped products. Ex-fintech, now mentoring student teams.')
  RETURNING id INTO p6;

  -- Profile 7: Aisha Khan
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Aisha Khan', 'Mobile Developer', 'Intermediate', '10-20',
    'Mobile developer focused on health apps. Cross-platform specialist with an eye for detail.')
  RETURNING id INTO p7;

  -- Profile 8: Tom Becker
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Tom Becker', 'DevOps Engineer', 'Advanced', '20-30',
    'DevOps engineer who automates everything. Runs reproducible infra for research labs.')
  RETURNING id INTO p8;

  -- Profile 9: Mia Rossi
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Mia Rossi', 'Frontend Developer', 'Beginner', '5-10',
    'Frontend developer building delightful data UIs. Recent bootcamp grad, fast learner.')
  RETURNING id INTO p9;

  -- Profile 10: Kevin Wu
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Kevin Wu', 'Backend Developer', 'Advanced', '10-20',
    'Backend engineer who likes clean APIs and boring, reliable infrastructure.')
  RETURNING id INTO p10;

  -- Profile 11: Sofia Alvarez
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Sofia Alvarez', 'Data Scientist', 'Intermediate', '10-20',
    'Data scientist turning messy datasets into decisions. Climate and health focus.')
  RETURNING id INTO p11;

  -- Profile 12: Noah Patel
  INSERT INTO profiles (name, role, experience, availability, bio)
  VALUES ('Noah Patel', 'Security Engineer', 'Intermediate', '10-20',
    'Security engineer building defensive tooling. Loves threat modeling and secure defaults.')
  RETURNING id INTO p12;

  -- Skills for each profile
  INSERT INTO profile_skills (profile_id, skill_name) VALUES
    (p1, 'React'), (p1, 'TypeScript'), (p1, 'Node.js'), (p1, 'Python'), (p1, 'PostgreSQL'),
    (p2, 'Cybersecurity'), (p2, 'Python'), (p2, 'Docker'), (p2, 'Go'), (p2, 'PostgreSQL'),
    (p3, 'UI/UX'), (p3, 'Figma'), (p3, 'React'), (p3, 'Accessibility'),
    (p4, 'Machine Learning'), (p4, 'TensorFlow'), (p4, 'Python'), (p4, 'Data Analysis'), (p4, 'NLP'),
    (p5, 'Data Engineering'), (p5, 'Python'), (p5, 'PostgreSQL'), (p5, 'AWS'), (p5, 'Data Analysis'),
    (p6, 'Product Management'), (p6, 'Data Analysis'), (p6, 'UI/UX'),
    (p7, 'React Native'), (p7, 'Swift'), (p7, 'Kotlin'), (p7, 'TypeScript'),
    (p8, 'DevOps'), (p8, 'Docker'), (p8, 'Kubernetes'), (p8, 'AWS'), (p8, 'Go'),
    (p9, 'React'), (p9, 'TypeScript'), (p9, 'GraphQL'), (p9, 'UI/UX'), (p9, 'Figma'),
    (p10, 'Node.js'), (p10, 'Go'), (p10, 'PostgreSQL'), (p10, 'GraphQL'), (p10, 'Python'),
    (p11, 'Python'), (p11, 'Data Analysis'), (p11, 'Machine Learning'), (p11, 'Data Visualization'), (p11, 'TensorFlow'),
    (p12, 'Cybersecurity'), (p12, 'Python'), (p12, 'Rust'), (p12, 'Docker');

  -- Interests for each profile
  INSERT INTO profile_interests (profile_id, interest_name) VALUES
    (p1, 'Cybersecurity'), (p1, 'Applied AI'), (p1, 'Developer Tools'),
    (p2, 'Cybersecurity'), (p2, 'Open Source'),
    (p3, 'Accessibility'), (p3, 'Education'), (p3, 'Social Impact'),
    (p4, 'Applied AI'), (p4, 'Healthcare'), (p4, 'Data Visualization'),
    (p5, 'Sustainability'), (p5, 'Climate Tech'), (p5, 'Data Visualization'),
    (p6, 'Fintech'), (p6, 'Developer Tools'), (p6, 'Education'),
    (p7, 'Healthcare'), (p7, 'Accessibility'), (p7, 'Social Impact'),
    (p8, 'Open Source'), (p8, 'Developer Tools'), (p8, 'Cybersecurity'),
    (p9, 'Data Visualization'), (p9, 'Accessibility'), (p9, 'Education'),
    (p10, 'Developer Tools'), (p10, 'Fintech'), (p10, 'Open Source'),
    (p11, 'Sustainability'), (p11, 'Climate Tech'), (p11, 'Healthcare'),
    (p12, 'Cybersecurity'), (p12, 'Open Source'), (p12, 'Developer Tools');
END $$;
