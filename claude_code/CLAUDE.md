# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a heart disease testing project for CBNU (Chungbuk National University) with a full-stack application architecture:

- `backend/` - Spring Boot backend application with JPA entities and repositories
- `frontend/` - Frontend application directory (planned)
- `docs/` - Project documentation and specifications

## Project Architecture

Full-stack application for heart disease testing/analysis:

- **Backend**: Spring Boot REST API with:
  - JPA entities for User, Check, Prediction, Payment, Subscription management
  - PostgreSQL database integration
  - Docker support with docker-compose.yml
  - Gradle build system

- **Frontend**: Web interface for user interaction and data visualization (to be implemented)

- **Documentation**: System design, API specifications, and development plans

## Development Setup

### Backend (Spring Boot)
```bash
cd backend
./gradlew build          # Build project
./gradlew test           # Run tests
./gradlew bootRun        # Run application
docker-compose up        # Run with Docker
```

### Project Structure
```
backend/
├── src/main/java/ac/cbnu/heartcheck/
│   ├── entity/          # JPA entities
│   ├── repository/      # Data repositories
│   └── ...
├── src/test/           # Test files
├── build.gradle        # Gradle configuration
└── docker-compose.yml  # Docker setup
```

## Notes

- Backend uses Spring Boot 3.x with Java
- Database: PostgreSQL
- Build tool: Gradle
- Testing: JUnit with entity tests implemented
- Consider medical data privacy and security requirements (HIPAA compliance if applicable)