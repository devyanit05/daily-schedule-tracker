// ==========================================
// MOCK DATA FILE
// You can edit this file safely to configure
// questions, quotes, and content.
// ==========================================

const CAREER_MILESTONES = [
  { id: 'c1', title: 'Resume: Highlight AWS Dev Cert & Automation Experience' },
  { id: 'c2', title: 'Jenkins: Practice Declarative Pipelines (using Groovy)' },
  { id: 'c3', title: 'K8s Phase 1: Master Pods, Deployments, and Services' },
  { id: 'c4', title: 'K8s Phase 2: Learn ConfigMaps, Secrets, and Ingress' },
  { id: 'c5', title: 'K8s Phase 3: Understand Helm Charts & RBAC' },
  { id: 'c6', title: 'IaC Expansion: Learn basic Terraform or CloudFormation' },
  { id: 'c7', title: 'SDET: Build simple E2E API Test Framework (RestAssured/Postman)' },
  { id: 'c8', title: 'SDET: Practice UI Automation logic (Page Object Model)' },
  { id: 'c9', title: 'SDET: Set up parallel test execution (Selenium Grid/Cypress)' },
  { id: 'c10', title: 'Git Mastery: Review Rebase, Cherry-pick, and merge conflicts' },
  { id: 'c11', title: 'Mock Interview: Conduct a peer mock interview focusing on K8s' },
  { id: 'c12', title: 'Apply to 5 DevOps or SDET roles daily' }
];

const PRACTICE_QUESTIONS = [
  { topic: 'K8s', q: 'What is the absolute smallest deployable unit in Kubernetes?', a: 'A Pod. It wraps one or more containers sharing storage and network resources.' },
  { topic: 'K8s', q: 'What is the main difference between a Deployment and a StatefulSet?', a: 'Deployments are for stateless apps (interchangeable replicas). StatefulSets maintain sticky identities and stable storage for stateful apps (like DBs).' },
  { topic: 'K8s', q: 'What is a DaemonSet?', a: 'A DaemonSet ensures that a copy of a specific Pod runs on all (or some matching) Nodes in a cluster. Useful for log collection or monitoring agents.' },
  { topic: 'K8s', q: 'Explain the role of the Kubelet.', a: 'The Kubelet is an agent that runs on each node. It communicates with the master API and ensures that containers are running in a Pod according to the PodSpecs.' },
  { topic: 'Jenkins', q: 'How should you securely pass AWS credentials to a Jenkins pipeline?', a: 'Use Jenkins Credentials Binding plugin, or better, assign an IAM Role directly to the Jenkins EC2 instance/pod.' },
  { topic: 'Jenkins', q: 'How do you reuse common pipeline code across multiple Jenkins projects?', a: 'By creating a Jenkins Shared Library written in Groovy and importing it at the top of the Jenkinsfile (@Library).' },
  { topic: 'SDET', q: 'Explain the "Test Pyramid".', a: 'A strategy emphasizing writing many fast Unit tests at the bottom, fewer Integration/API tests in the middle, and very few slow UI/End-to-End tests at the top.' },
  { topic: 'SDET', q: 'How do you handle "flaky tests" in a CI/CD pipeline?', a: 'Isolate them to avoid blocking builds, investigate root causes (network, timing issues), use explicit waits instead of hard sleeps, and mock external dependencies.' },
  { topic: 'SDET', q: 'Difference between TDD and BDD?', a: 'TDD (Test-Driven Development) focuses on writing technical unit tests before code. BDD (Behavior-Driven Development) uses natural language (Gherkin/Cucumber) to define system behavior before coding.' },
  { topic: 'AWS', q: 'What is the difference between AWS SNS and SQS?', a: 'SNS is a Pub/Sub service pushing messages to multiple subscribers. SQS is a message queue where consumers pull messages.' },
  { topic: 'AWS', q: 'What is the difference between an ALB and an NLB?', a: 'Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) and routes based on URL paths. Network Load Balancer (NLB) operates at Layer 4 (TCP/UDP) and is meant for extreme ultra-low latency performance.' },
  { topic: 'AWS', q: 'What is an IAM Role?', a: 'An identity with specific permissions, assumed temporarily by users or services (like EC2), eliminating the need for hardcoded access keys.' },
  { topic: 'Git', q: 'What is the difference between git merge and git rebase?', a: 'Merge creates a new commit that ties two histories together preserving original branches. Rebase moves your branch base to the tip of main, rewriting history for a clean linear path.' }
];

const MOCK_INTERVIEWS = [
  { type: 'Technical Design', q: 'How would you design a CI/CD pipeline for a microservices architecture using Jenkins and Kubernetes?', tips: ['Mention code checkout and unit testing', 'Dockerize the application and push to an ECR/DockerHub registry', 'Use Helm or kubectl apply to deploy the new image to a K8s cluster', 'Mention running automated API/UI tests post-deployment'] },
  { type: 'Behavioral', q: 'Tell me about a time your automated test suite caught a critical bug before it reached production.', tips: ['Use the STAR method', 'Explain the specific bug and the test that caught it', 'Highlight the impact (saved money, prevented downtime)'] },
  { type: 'Technical Problem Solving', q: 'You notice the CI/CD pipeline is taking 45 minutes to run, heavily delaying developer feedback. How do you optimize it?', tips: ['Parallelize independent test suites', 'Utilize Docker layer caching to speed up builds', 'Shift heavy UI tests to nightly builds, keeping fast API/Unit tests on every commit'] },
  { type: 'Behavioral', q: 'Describe a time you had to learn a complex new tool (similar to how you need to learn Kubernetes) under pressure.', tips: ['Highlight your structured learning approach (docs, hands-on labs)', 'Mention starting small (POC) before scaling', 'Show enthusiasm for continuous learning'] },
  { type: 'HR/Cultural', q: 'Why do you want to transition deeper into DevOps/SDET from your current role?', tips: ['Highlight your AWS Dev cert and Jenkins experience', 'Express passion for automation, scale, and preventing issues rather than just fixing them'] },
  { type: 'Behavioral', q: 'Tell me about a time you had to push back on a developer who wanted to merge untested or risky code.', tips: ['Keep the tone collaborative, not combative', 'Explain how you focused on the shared goal of system stability', 'Mention offering to help them write the tests or pair-program the CI checks'] },
  { type: 'Technical Problem Solving', q: 'If an end-to-end automation test fails randomly 10% of the time, how exactly do you debug it?', tips: ['Check for asynchronous timing issues (explicit vs implicit waits)', 'Verify if test data is conflicting or state is leaking between tests', 'Add heavy logging/screenshots strictly on failure to capture state'] },
  { type: 'Technical Design', q: 'How would you automate the rollback of a bad deployment in AWS or Kubernetes?', tips: ['Mention relying on health checks and readiness probes', 'Discuss Blue/Green or Canary deployment strategies', 'In Jenkins, having a generic pipeline parameter for executing a "helm rollback" or reverting an ASG'] }
];

const ENGLISH_EXERCISES = [
  { type: 'Idiom', word: 'Bite the bullet', meaning: 'To decide to do something difficult or unpleasant that one has been putting off.', example: 'I hate going to the dentist, but I just have to bite the bullet and go.', para: 'Technology changes so fast that many professionals occasionally feel left behind. Rather than ignoring the new tools, the best approach is to bite the bullet, enroll in a crash course, and adapt to the changing landscape.' },
  { type: 'Vocabulary', word: 'Meticulous', meaning: 'Showing great attention to detail; very careful and precise.', example: 'The candidate was meticulous in checking his code for bugs before deploying.', para: 'When writing a technical specification, one must be deeply meticulous. A single misunderstanding in the document can lead to weeks of wasted engineering effort. Therefore, clear communication is just as important as good code.' },
  { type: 'Phrase', word: 'Get up to speed', meaning: 'To learn the necessary information or acquire the skills to do a new job or understand a situation.', example: 'It took me a few weeks to get up to speed with the new codebase.', para: 'Joining a new company is always overwhelming at first. There are new frameworks, different naming conventions, and unfamiliar team dynamics. However, by asking the right questions and pairing with senior developers, anyone can quickly get up to speed.' },
  { type: 'Vocabulary', word: 'Leverage', meaning: 'To use something to maximum advantage.', example: 'We should leverage our existing network to find better job opportunities.', para: 'In modern cloud computing, companies no longer want to build everything from scratch. Instead, they leverage existing managed services from AWS or Azure to speed up their development cycle and focus purely on business logic.' },
  { type: 'Idiom', word: 'Boil the ocean', meaning: 'To undertake an impossible task or try to do everything at once.', example: 'Let us just automate the core critical path first; we do not need to boil the ocean for MVP.', para: 'When implementing a new CI/CD pipeline, many teams try to automate every single edge case immediately. This approach only creates frustration. Instead of trying to boil the ocean, it is better to start small, automate the most tedious tasks, and iteratively improve.' },
  { type: 'Phrase', word: 'Bandwidth', meaning: 'The energy or mental capacity required to deal with a situation.', example: 'I would love to help you with the AWS migration, but I frankly do not have the bandwidth this week.', para: 'Engineering teams often suffer from burnout because they say yes to too many projects. Communication is key to a healthy work environment. If reaching your goals requires working nights and weekends, you must communicate with management that you lack the bandwidth.' },
  { type: 'Vocabulary', word: 'Robust', meaning: 'Strong and healthy; vigorous and resilient to failure.', example: 'Our new Kubernetes architecture proved to be highly robust during the Black Friday traffic spike.', para: 'A good software deployment is not just about moving code from a laptop to a server. It is about creating a robust system that can heal itself. If a container crashes, the system should instantly spin up a new replica without the end user ever noticing.' }
];

const QUOTES = [
  "🚀 The secret of getting ahead is getting started. — Mark Twain",
  "💡 It always seems impossible until it's done. — Nelson Mandela",
  "⚡ Automate what you can, document what you can't.",
  "🌟 Success is the sum of small efforts repeated day in and day out.",
  "🎯 Focus on being productive instead of busy.",
  "🔥 In DevOps, speed is important, but reliability is paramount.",
  "🌈 Believe you can and you're halfway there. — Theodore Roosevelt",
  "💪 Discipline is the bridge between goals and accomplishment.",
  "✨ Testing shouldn't be an afterthought, it's the foundation of agility.",
  "🏆 Champions keep playing until they get it right. — Billie Jean King",
  "💻 'If it hurts, do it more often.' — Martin Fowler (on CI/CD)",
  "📊 Quality is not an act, it is a habit. — Aristotle"
];
