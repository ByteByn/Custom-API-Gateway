# Custom API Gateway (TypeScript + Native Node.js)

A fully custom API Gateway built from scratch using:

-   Node.js native `http` module (no Express)
-   TypeScript
-   Manual JWT implementation (no `jsonwebtoken`)
-   HMAC-SHA256 signing
-   Stateless authentication

This project is built for deep understanding of backend architecture and
authentication systems.

------------------------------------------------------------------------

# 🚀 Features

-   Custom JWT implementation
-   Manual Base64URL encoding
-   Manual HMAC SHA256 signature generation
-   Stateless authentication
-   Custom middleware system
-   Modular folder structure
-   No external backend frameworks

------------------------------------------------------------------------

# 📁 Project Structure

```
src/
│ ├── core/
│ ├── crypto/
│ │ ├── base64url.ts
│ │ ├── hmac.ts
│ │
│ ├── jwt/
│ │ ├── jwt.ts
│ │ ├── types.ts
│ │
│ ├── middleware/
│ │ ├── auth.ts
│ │
│ ├── utils/
│ │ ├── time.ts
│ ├── server.ts
```
------------------------------------------------------------------------

# 🧠 How JWT Works

A JWT consists of:

`HEADER.PAYLOAD.SIGNATURE`

### Header

`{ "alg": "HS256", "typ": "JWT" }`

### Payload

`{ "sub": "user123", "role": "user", "iat": 1710000000, "exp": 1710003600
}`

### Signature

`HMAC_SHA256( base64Url(header) + "." + base64Url(payload), secret )`

If payload changes → signature becomes invalid.

------------------------------------------------------------------------

# ⚙️ Setup Instructions

## Initialize Project

`mkdir custom-api-gateway cd custom-api-gateway npm init -y`

## Install Dependencies

`npm install -D typescript @types/node ts-node`

## Initialize TypeScript

`npx tsc --init`

Update `tsconfig.json`:
```
{ "compilerOptions": { "target": "ES2020", "module": "CommonJS",
"rootDir": "./src", "outDir": "./dist", "strict": true,
"esModuleInterop": true } }
```
## Add Scripts
```
"scripts": { "dev": "ts-node src/server.ts", "build": "tsc", "start":
"node dist/server.js" }
```
------------------------------------------------------------------------

# ▶️ Running

Development: `npm run dev`

Production: `npm run build npm start`

Server runs at: http://localhost:3000

------------------------------------------------------------------------

# 🔐 API Endpoints

## POST /login

Request: `{ "userId": "ari123" }`

Response: `{ "token": "xxxxx.yyyyy.zzzzz" }`

------------------------------------------------------------------------

## GET /protected

Header: Authorization: Bearer `<token>`

Response: `{ "message": "Protected route accessed", "user": { "sub":
"ari123", "role": "user", "iat": 1710000000, "exp": 1710003600 } }`

------------------------------------------------------------------------

# 🛡 Authentication Flow

Login: 
1. Client sends credentials 
2. Server verifies user 
3. Server generates JWT 
4. Client stores token

Protected Route: 
1. Client sends JWT 
2. Server verifies signature 
3. Server checks expiration 
4. If valid → request allowed

Stateless authentication. No sessions stored.

------------------------------------------------------------------------

# 🔍 Security Notes

-   Payload is signed, not encrypted
-   Never hardcode secrets in production
-   Use environment variables
-   Use short-lived access tokens
-   Consider RS256 for distributed systems

 ---
**Learning Resource:** https://jwt.io/introduction