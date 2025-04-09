# Task Tracker Application

A simple task management application with user login. This project demonstrates basic containerization with Docker and deployment to AWS.
This project demonstrates basic login, containerization with Docker and deployment to AWS.

## Key Features

* User login and authentication using Passport.
* Secure user sessions managed with JSON Web Tokens (JWT).
* Create, read, update, and delete tasks (CRUD operations).
* Simple and intuitive user interface.
* Backend API built with Node.js and Express.
* Persistent data storage using PostgreSQL on AWS RDS.
* Basic containerization with Docker for deployment.
* Deployed to an AWS EC2 instance.

## Technologies Used

* Backend: Node.js, Express
* Database: PostgreSQL
* ORM: Sequelize
* Containerization: Docker
* Authentication: Passport
* Authorization & Security: JSON Web Tokens (JWT)
* Deployment: AWS EC2, AWS RDS

## Documentation

For details on setup and deployment, see the [docs](./docs/) directory.

## Quick Start (Local Development)

1.  Clone the repository: `git clone [repository-url]`
2.  Navigate to the project directory: `cd your-task-tracker-repo`
3.  Install dependencies: `npm install` or `yarn install`
4.  Set up environment variables: Copy `.env.example` to `.env` and configure your local PostgreSQL connection details.
5.  Run the application: `npm start` 

## Containerization

This project utilizes Docker for containerization, ensuring a consistent environment across development and deployment. The `Dockerfile` in the `docker/` directory defines how the Docker image is built. For more details, see the [Containerization Documentation](./docs/containerization.md).

## Deployment to AWS

The application is deployed to an Amazon EC2 instance, with the database hosted on AWS Relational Database Service (RDS). The deployment process involves building and pushing a Docker image to ECR and running it on the EC2 instance. For a detailed walkthrough, see the [Deployment Documentation](./docs/deployment.md).

## Architecture

A high-level overview of the application's architecture and component interactions can be found in the [Architecture Documentation](./docs/architecture.md).

## Setup

Detailed instructions for setting up the application for both local development and running within a Docker container can be found in the [Setup Documentation](./docs/setup.md).
