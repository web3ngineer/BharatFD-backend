# BharatFD Beckend Project - Typescript

A modern Express.js REST API built with TypeScript, MongoDB, and Redis. This project supports multi-language translations, caching, and is designed to be scalable with proper code quality, testing, and Docker support.

**Live Demo:** [LIVE LINK](https://bharatfd-backend-oxvx.onrender.com)  
**Postman Testing Collection:** [Postman Collection Link](https://documenter.getpostman.com/view/33610151/2sAYX3r45U)

---

## Table of Contents

- [Project Description](#project-description)
- [Setup Methods](#setup-methods)
  - [Method 1: Local Environment](#method-1-local-environment)
  - [Method 2: Docker Environment](#method-2-docker-environment)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Project Description

This project is a backend API built using Express.js and TypeScript. It incorporates best practices including:
- Use of ES modules via `"type": "module"` in Node.
- Strict type-checking and linting with ESLint and Prettier.
- A MongoDB connection for storing FAQs and Redis for caching API responses.
- Automated multi-language translation support using external translation APIs.
- Docker support for containerized development and deployment.

---

## Setup Methods

### Method 1: Local Environment

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Intall dependencies**

   ```bash
   npm i
   ```

3. **Setup Environment Variable**

   ```bash
    PORT=8080
    CORS_ORIGIN=

    MONGODB_URL=your_mongodb_connection_url

    # Either provide a REDIS_URL or define the following:
    REDIS_URL=redis://localhost:6379
    or
    REDIS_HOST=your_redis_host
    REDIS_PORT=your_redis_port
    REDIS_USERNAME=your_redis_username
    REDIS_PASSWORD=your_redis_password

   ```
4. **Run & Build Application**

   ```bash
   npm run dev

    # for build the application
    npm run build 
    npm start
   ```

### Method 2: Docker Environment

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Setup Environment Variable**

    <p>Create a .env file in the project root (or configure your Docker environment) with the following variables:</p>

   ```bash
    PORT=8080
    CORS_ORIGIN=

    MONGODB_URL=your_mongodb_connection_url

    # Either provide a REDIS_URL or define the following:
    REDIS_URL=redis://localhost:6379
    or
    REDIS_HOST=your_redis_host
    REDIS_PORT=your_redis_port
    REDIS_USERNAME=your_redis_username
    REDIS_PASSWORD=your_redis_password

   ```
3. **Build Image with Docker Compose**

   ```bash
   docker-compose up --build -d

   #check docker image 
   docker image
   ```
4. **Run a Container from the image**

   ```bash
   #replace the my-image-name with actual dcoker image name
   docker run -d -p 8080:8080 --env-file .env --name my-container my-image-name

   ```


## Available Scripts

In the project directory, you can run:

Runs the app in development mode using TS-Node Dev.
``` bash 
npm run dev
```

Compiles TypeScript files into JavaScript in the dist folder.
```bash
npm run build
```


Runs the production build from the dist folder.
```bash
npm start
```

Lints your code using ESLint.
```bash
npm run lint
```

Formats the code using Prettier.
```bash 
npm run format
```

## Environment Variables

The project requires the following environment variables to be set:

- **PORT**  
  The port on which the application runs (default: `8080`).

- **CORS_ORIGIN**  
  The allowed origin(s) for Cross-Origin Resource Sharing.

- **MONGODB_URL**  
  MongoDB connection string (without the database name).

- **REDIS_URL (optional)**  
  Full Redis connection URL (e.g., `redis://localhost:6379`).  
  Alternatively, set the following variables:

  - **REDIS_HOST**  
    Hostname for Redis.

  - **REDIS_PORT**  
    Port for Redis.

  - **REDIS_USERNAME**  
    Username for Redis (if applicable).

  - **REDIS_PASSWORD**  
    Password for Redis (if applicable).

---

## License

This project is licensed under the [MIT License](LICENSE).
