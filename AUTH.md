Auth API Documentation for NextAuth.js Integration
Base URL: API_URL

Authentication Endpoints
POST /register
Content-Type: multipart/form-data

// Request Body
{
  username: string;     // Required: 3-20 characters
  email: string;       // Required: valid email format
  password: string;    // Required: minimum 6 characters
  avatar?: File;       // Optional: image file (jpg, jpeg, png, gif)
}

// Success Response: 201 Created
{
  status: 'success',
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      avatar?: string;  // URL to uploaded avatar
      createdAt: Date;
      updatedAt: Date;
    },
    accessToken: string;  // JWT token
  }
}

// Error Response: 400 Bad Request
{
  status: 'error',
  message: string
}

2. Login User
POST /login
Content-Type: application/json

// Request Body
{
  email: string;     // Required
  password: string;  // Required
}

// Success Response: 200 OK
{
  status: 'success',
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
      status: 'online' | 'offline';
      lastSeen?: Date;
      createdAt: Date;
      updatedAt: Date;
    },
    accessToken: string;  // JWT token for subsequent requests
  }
}

// Error Response: 401 Unauthorized
{
  status: 'error',
  message: string
}
3. Get Current User
GET /me
Authorization: Bearer {accessToken}

// Success Response: 200 OK
{
  status: 'success',
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
      status: 'online' | 'offline';
      lastSeen?: Date;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

// Error Response: 401 Unauthorized
{
  status: 'error',
  message: 'Unauthorized'
}

4. Refresh Token
POST /refresh-token
Content-Type: application/json

// Request Body
{
  refreshToken: string;  // Required: The refresh token received during login
}

// Success Response: 200 OK
{
  status: 'success',
  data: {
    accessToken: string;    // New access token
    refreshToken: string;   // New refresh token (if token rotation is enabled)
  }
}

// Error Response: 401 Unauthorized
{
  status: 'error',
  message: 'Invalid refresh token' | 'Refresh token expired'
}

5. Logout
POST /logout
Authorization: Bearer {accessToken}
Content-Type: application/json

// Request Body
{
  deviceId?: string;  // Optional: Logout from specific device
  allDevices?: boolean // Optional: Logout from all devices
}

// Success Response: 200 OK
{
  status: 'success',
  message: 'Logged out successfully'
}

// Error Response: 401 Unauthorized
{
  status: 'error',
  message: string
}

6. Get User Devices
GET /devices
Authorization: Bearer {accessToken}

// Success Response: 200 OK
{
  status: 'success',
  data: {
    devices: Array<{
      id: string;
      deviceName: string;     // e.g., "Chrome on Windows"
      deviceType: string;     // e.g., "browser", "mobile"
      lastActive: Date;
      ipAddress: string;
      isCurrentDevice: boolean;
      createdAt: Date;
    }>
  }
}

// Error Response: 401 Unauthorized
{
  status: 'error',
  message: string
}


Authentication Flow
Registration:
Submit user data with optional avatar
Receive user details and access token
Use token for subsequent authenticated requests
Login:
Submit email and password
Receive user details and access token
Store token in NextAuth.js session
Protected Routes:
Include access token in Authorization header
Token format: Bearer {accessToken}
Use /me endpoint to validate sessions

Error Codes
400 - Bad Request (Validation errors)
401 - Unauthorized (Invalid credentials)
403 - Forbidden (Invalid token)
404 - Not Found
500 - Internal Server Error


Email Routes Documentation
Password Reset Flow
1. Request Password Reset
POST /api/auth/request-password-reset
Request a password reset code to be sent to your email.
Request Body:
{
  "email": "user@example.com"
}
Response:
{
  "status": "success",
  "message": "If an account exists with this email, a reset code has been sent."
}
Notes:
For security reasons, the response is the same whether the email exists or not
A 6-digit code will be sent to the email
Code expires in 10 minutes
2. Verify Reset Code
POST /api/auth/verify-reset-code
Verify the reset code received in email.
Request Body:
{
  "email": "user@example.com",
  "code": "123456"
}
Response:
{
  "status": "success",
  "data": {
    "isValid": true
  }
}
3. Reset Password
POST /api/auth/reset-password
Reset password using the verified code.
Request Body:
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newSecurePassword123"
}
Response:
{
  "status": "success",
  "message": "Password has been reset successfully"
}
Notes:
All active sessions will be logged out for security
Password must be at least 6 characters long
Code must be valid and not expired
Email Template
The reset code email includes:
A clear subject line: "Password Reset Code"
A 6-digit code in large, easy-to-read format
Expiration time (10 minutes)
Security warning for unintended recipients
Security Features
Rate limiting (can be implemented)
10-minute code expiration
No email existence disclosure
All sessions logged out after password change
Secure code storage in Redis
One-time use codes
Error Cases
Invalid email format: 400 Bad Request
Invalid/expired code: 401 Unauthorized
Invalid password format: 400 Bad Request