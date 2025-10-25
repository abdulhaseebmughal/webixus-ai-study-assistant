# API Documentation - AI Study Assistant

## Base URL
```
http://localhost:3000/api (Development)
https://your-domain.com/api (Production)
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123abc",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123abc",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Document Endpoints

### 1. Upload Document
**POST** `/api/documents`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Machine Learning Research Paper",
  "content": "Full text content of the document...",
  "fileType": "text"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc123",
      "title": "Machine Learning Research Paper",
      "fileType": "text",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Get All Documents
**GET** `/api/documents`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc123",
        "title": "Machine Learning Research Paper",
        "fileType": "text",
        "fileSize": 15000,
        "hasSummary": true,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### 3. Get Single Document
**GET** `/api/documents/[id]`

### 4. Delete Document
**DELETE** `/api/documents/[id]`

---

## AI Features

### 1. Generate Summary
**POST** `/api/summarize`

**Request Body:**
```json
{
  "text": "Long text to summarize...",
  "documentId": "doc123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Summary generated successfully",
  "data": {
    "summary": {
      "tldr": "Brief 2-3 sentence summary",
      "detailed": "Detailed paragraph summary",
      "keyPoints": [
        "Key point 1",
        "Key point 2",
        "Key point 3"
      ]
    }
  }
}
```

### 2. Generate Quiz
**POST** `/api/quizzes`

**Request Body:**
```json
{
  "text": "Content to generate quiz from...",
  "documentId": "doc123",
  "title": "ML Quiz",
  "questionCount": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Quiz generated successfully",
  "data": {
    "quiz": {
      "id": "quiz123",
      "title": "ML Quiz",
      "totalQuestions": 5,
      "questions": [
        {
          "question": "What is machine learning?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "B",
          "explanation": "Because..."
        }
      ]
    }
  }
}
```

### 3. Submit Quiz Answers
**POST** `/api/quizzes/[id]/submit`

**Request Body:**
```json
{
  "answers": {
    "0": "B",
    "1": "A",
    "2": "C"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 80,
    "correctAnswers": 4,
    "totalQuestions": 5,
    "questions": [...]
  }
}
```

### 4. Generate Flashcards
**POST** `/api/flashcards`

**Request Body:**
```json
{
  "text": "Content to create flashcards from...",
  "documentId": "doc123",
  "title": "ML Flashcards",
  "cardCount": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Flashcards generated successfully",
  "data": {
    "deck": {
      "id": "deck123",
      "title": "ML Flashcards",
      "totalCards": 10,
      "cards": [
        {
          "front": "What is supervised learning?",
          "back": "Learning from labeled data",
          "status": "new"
        }
      ]
    }
  }
}
```

### 5. Update Flashcard Status
**PATCH** `/api/flashcards/[id]/update`

**Request Body:**
```json
{
  "cardIndex": 0,
  "status": "learned"
}
```

### 6. Chat with Study Buddy
**POST** `/api/chat`

**Request Body:**
```json
{
  "question": "Can you explain neural networks?",
  "context": "I'm studying deep learning"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "question": "Can you explain neural networks?",
    "answer": "Neural networks are...",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

### 7. Rewrite Text
**POST** `/api/rewrite`

**Request Body:**
```json
{
  "text": "Text to rewrite...",
  "style": "clear"
}
```

**Styles:** `clear`, `concise`, `detailed`, `simple`, `academic`

---

## Progress Tracking

### Get User Progress
**GET** `/api/progress`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "totalStudyHours": 24.5,
      "sessionsCompleted": 18,
      "averageScore": 82,
      "streak": 7,
      "quizzesCompleted": 12,
      "flashcardsReviewed": 150,
      "documentsProcessed": 5,
      "lastStudyDate": "2025-01-01T00:00:00.000Z",
      "stats": [...]
    }
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (dev only)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## Deployment Notes

1. Set all environment variables in your hosting platform
2. Ensure MongoDB connection string is correct
3. Generate a strong JWT_SECRET
4. Configure CORS if needed
5. Enable HTTPS in production
