# Mental Health Companion

A comprehensive mental wellness platform built with React (frontend) and Spring Boot (backend), designed to help users understand, monitor, and improve their mental health through scientifically validated assessments.

## Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Mental Health Assessments**: PHQ-9, GAD-7, and other validated screening tools
- **Initial Screening**: Comprehensive initial mental health questionnaire
- **Vital Monitoring**: Track vital signs with emergency detection
- **Emergency Contacts**: Manage emergency contacts with alert functionality
- **Doctor Search**: Find nearby mental health professionals
- **Mobile Responsive**: Optimized for mobile devices with bottom navigation
- **Profile Management**: Complete user profiles with address and contact information

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui components
- TanStack Query

### Backend
- Spring Boot 3.3.4
- Java 21
- PostgreSQL
- Spring Security (JWT)
- Flyway (database migrations)
- OpenAPI/Swagger documentation

## Project Structure

```
mind-trap/
├── backend/          # Spring Boot backend API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mindtrap/
│   │   │   │   ├── domain/      # JPA entities
│   │   │   │   ├── repository/   # Data repositories
│   │   │   │   ├── service/      # Business logic
│   │   │   │   ├── web/         # REST controllers
│   │   │   │   ├── dto/         # Data transfer objects
│   │   │   │   ├── config/      # Configuration
│   │   │   │   └── security/    # Security config
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/  # Flyway migrations
│   │   └── test/
│   └── pom.xml
├── src/              # React frontend
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities & API client
│   └── integrations/ # Legacy Supabase (can be removed)
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Java 21+
- Maven 3.8+
- PostgreSQL 12+

### Backend Setup

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE mindtrap;
```

2. **Configure environment variables:**
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/mindtrap
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export JWT_SECRET=your-secret-key-min-256-bits-here
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

Or create a `.env` file in the `backend` directory (requires Spring Boot support for .env files).

3. **Build and run:**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`

4. **Access API documentation:**
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v1/v3/api-docs

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

To enable the embedded map + nearby provider search on the **Find Doctors** page, your Google Cloud project should have:
- **Maps JavaScript API** enabled
- **Places API** enabled

3. **Run development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

See `backend/API_CONTRACT.md` for detailed API documentation.

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Profiles
- `GET /profiles/me` - Get current profile
- `PUT /profiles/me` - Update profile
- `POST /profiles/initial-screening` - Complete initial screening

### Assessments
- `GET /assessments` - List assessments
- `GET /assessments/{id}` - Get assessment details
- `POST /assessments` - Create assessment

### Emergency Contacts
- `GET /contacts` - List contacts
- `POST /contacts` - Create contact
- `PUT /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact
- `POST /contacts/{id}/alert` - Send emergency alert

### Vital Readings
- `GET /vitals` - List readings
- `GET /vitals/{id}` - Get reading details
- `POST /vitals` - Create reading

### Doctor Search
- `GET /doctors/search` - Search doctors
- `GET /doctors/suggestions` - Get specialty suggestions

## Mobile Features

The frontend includes mobile-optimized features:
- Bottom navigation bar for easy access on mobile devices
- Responsive layouts that adapt to screen size
- Touch-friendly UI elements
- Mobile-first design approach

## Development

### Running Tests

**Backend:**
```bash
cd backend
./mvnw test
```

**Frontend:**
```bash
npm run lint
```

### Building for Production

**Backend:**
```bash
cd backend
./mvnw clean package
java -jar target/mind-trap-api-0.1.0-SNAPSHOT.jar
```

**Frontend:**
```bash
npm run build
npm run preview  # Preview production build
```

## Security

- JWT tokens with configurable TTL
- BCrypt password hashing
- CORS configuration
- Input validation
- SQL injection protection via JPA
- XSS protection via React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues and questions, please contact the development team.
