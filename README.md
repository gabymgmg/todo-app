# TO-DO (Task Tracker) Application

A simple tool for managing tasks, built with a Node.js and Express backend, a PostgreSQL database hosted on AWS RDS, and containerized using Docker for easy deployment. It also includes user login functionality implemented with Passport, and uses JWT for securing subsequent routes and API interactions.

## Key Features

* User login and authentication using Passport.
* Secure user sessions managed with JSON Web Tokens (JWT).
* Create, read, update, and delete tasks (CRUD operations).
* Simple and intuitive user interface.
* Backend API built with Node.js and Express.
* Persistent data storage using PostgreSQL on AWS RDS.
* Basic containerization with Docker for deployment.
* Deployed to an AWS EC2 instance.

  

https://github.com/user-attachments/assets/012f2bf3-be7e-4bfe-88eb-5e7c71bd28bd



## Technologies Used

* Backend: Node.js, Express
* Database: PostgreSQL
* ORM: Sequelize
* Containerization: Docker
* Authentication: Passport
* Authorization & Security: JSON Web Tokens (JWT)
* Deployment: AWS EC2, AWS RDS

## Quick Start (Local Development)

1.  Clone the repository: `git clone [repository-url]`
2.  Navigate to the project directory: `cd your-task-tracker-repo`
3.  Install dependencies: `npm install` or `yarn install`
4.  Set up environment variables: Copy `.env.example` to `.env` and configure your local PostgreSQL connection details.
5.  Run the application: `npm start` 

## Containerization

This project utilizes Docker for containerization, ensuring a consistent environment across development and deployment. The `Dockerfile` file defines how the Docker image is built. 

## Deployment to AWS

The application is deployed to an Amazon EC2 instance, with the database hosted on AWS Relational Database Service (RDS). The deployment process involves building and pushing a Docker image to ECR and running it on the EC2 instance. For a detailed walkthrough.

