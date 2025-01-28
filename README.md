# Birthday Reminder Service

## Prerequisites

- Node.js (version 20 or higher)

- Docker & Docker Compose

## Setup

- Clone the repository and navigate to the project's root directory:

```
git clone <repository-url>
cd <project-directory>
```

- Run the Docker Compose command with available npm script for a quick setup:

```
npm run compose:up
```

> Ensure ports 8080 and 8081 are available.

> Also stop any local services running on the following ports:

> MongoDB: port 27017

> RabbitMQ: ports 5672 and 15672

## API Documentation & Playground (Swagger UI)

- Once the development server is running, you can access the API documentation via Swagger UI:

  - URL: http://localhost:8080/api

- This Swagger UI page provides:

  - API Documentation: Detailed information about endpoints.
  
  - Interactive Playground: A Postman-like interface for testing User Management (CRUD) APIs directly.

## Feature Notes

- List of available time zones (IANA string) can be accessed from GET /time-zones

- Birthday messages is logged on the service worker, can be accessed with command:

```
docker logs hbrs-worker-birthday-messaging
```

- Currently the only available unit test is for user creation & it's validations on app-server package. To run the test:
```
cd packages/app-server
npm run test
```

## Security Notes

- For simplicity and ease of setup, MongoDB and RabbitMQ containers are currently configured without authentication.

- **Warning**: Do not use the provided docker-compose.yml file in a production environment. Secure configurations must be applied for production deployments.
