# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot backend application for a heart disease testing system for CBNU (Chungbuk National University). The project is built with Java 17 and Spring Boot 3.5.6, designed to support a React Native frontend application for heart disease diagnosis and management.

## Technology Stack

- **Framework**: Spring Boot 3.5.6
- **Java Version**: Java 17
- **Build Tool**: Gradle
- **Database**: MySQL
- **ORM**: Spring Data JPA
- **Security**: Spring Security
- **Session Management**: Spring Session with Redis
- **Testing**: JUnit 5

## Development Commands

### Build and Run
```bash
# Build the project
./gradlew build

# Run the application
./gradlew bootRun

# Run tests
./gradlew test

# Run a specific test class
./gradlew test --tests "com.example.heart_disease.YourTestClass"

# Clean build
./gradlew clean build

# Generate bootJar
./gradlew bootJar
```

### Development Workflow
```bash
# Check dependencies
./gradlew dependencies

# Check for outdated dependencies
./gradlew dependencyUpdates

# Generate project report
./gradlew projectReport
```

## Project Architecture

This backend follows a typical Spring Boot architecture with the following key components:

### Core Dependencies
- **Spring Boot Starter Web**: REST API endpoints
- **Spring Boot Starter Data JPA**: Database operations with MySQL
- **Spring Boot Starter Security**: Authentication and authorization
- **Spring Session Data Redis**: Session management
- **Lombok**: Code generation for reducing boilerplate

### Package Structure
```
src/main/java/com/example/heart_disease/
├── HeartDiseaseApplication.java     # Main Spring Boot application class
└── [additional packages to be developed]

src/main/resources/
├── application.properties           # Main configuration
└── [additional configuration files]

src/test/java/com/example/heart_disease/
└── HeartDiseaseApplicationTests.java # Main test class
```

### Key Features (From Requirements)
This application is designed to implement:

1. **User Management**: Account creation, authentication, profile management
2. **Heart Disease Testing**: Store and retrieve test results (text/image/classification)
3. **Payment Management**: In-app purchase and subscription management
4. **Settings Management**: User preferences and configuration
5. **Admin Dashboard**: Management interface for users, payments, and diagnostics
6. **Security**: Data encryption and secure data handling
7. **Multi-platform Support**: API endpoints for iOS/Android React Native frontend

## Development Notes

### Database Configuration
- MySQL database integration is configured but connection details need to be added to `application.properties`
- Redis is configured for session management

### Security Considerations
- Spring Security is included for authentication/authorization
- Medical data requires special security considerations (HIPAA compliance if applicable)
- User data encryption is a requirement per the specifications

### Multi-Agent Development Context
This project is part of a larger system with:
- React Native frontend (separate repository/agent)
- Shared API specifications and data models
- Coordinated Git workflow using modified Git Flow strategy

### Configuration Files
- `application.properties`: Main Spring configuration (currently minimal)
- `build.gradle`: Project dependencies and build configuration
- `settings.gradle`: Project name configuration

### Testing
- JUnit Platform configured for testing
- Spring Boot Test framework included
- Security testing capabilities available

## Code Standards and Conventions

**IMPORTANT**: All development work in this repository must follow the established coding conventions. Before writing any code, Claude Code must review and adhere to the standards defined in:

📋 **[Backend Code Convention](docs/backend_code_convention.md)** - Comprehensive Java and Spring Boot coding standards

This document includes:
- Java coding conventions (formatting, naming, comments)
- Spring Boot best practices (annotations, layers, security)
- Package structure guidelines
- Exception handling patterns
- Logging standards with medical data privacy considerations
- Testing conventions
- Security coding practices for medical data

**Key Requirements:**
- Follow Java 17 and Spring Boot 3.5.6 best practices
- Implement medical data security and encryption
- Use proper validation for heart disease testing data
- Follow established package structure and naming conventions
- Include comprehensive JavaDoc documentation
- Write tests for all new functionality
- Ensure HIPAA compliance considerations for medical data handling

When implementing any feature, always reference the code convention document first to ensure consistency and quality.