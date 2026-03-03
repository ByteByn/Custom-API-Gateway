# Rate Limiter Module — Custom API Gateway

This folder contains a complete custom-built HTTP server, middleware engine, and Token Bucket rate limiter built using:

- Node.js (core HTTP module)
- TypeScript

No Express.  
No third-party middleware libraries.  
No external rate limiter packages.

This module demonstrates how backend infrastructure works internally.

Repository: Custom-API-Gateway

---

# 📁 Folder Architecture


```
rate-limiter/
├── src/
│ ├── server.ts
│ ├── core/
│ │ ├── app.ts
│ │ ├── types.ts
│ ├── middleware/
│ │ ├── rateLimiter.ts
│ │ ├── logger.ts
└── README.md
```


---

# 🧠 System Design Overview

## Request Lifecycle


```
             Incoming Request
                   ↓
             Logger Middleware
                   ↓
          Rate Limiter Middleware
                   ↓
              Route Handler
                   ↓
                Response
```


---

# 🧱 Components

## 1️⃣ Custom Middleware Engine (`core/app.ts`)

Implements:

- Middleware registration (`use`)
- Route registration (`get`)
- Sequential execution using `next()`
- Manual route matching via `METHOD:PATH`

This mimics how popular backend frameworks chain middleware internally.

---
## 2️⃣ Token Bucket Rate Limiter (`middleware/rateLimiter.ts`)

### Configuration

```ts
const MAX_TOKENS = 10;
const REFILL_RATE = 2; // tokens per second
```
### How It Works
* Each IP gets its own bucket.
* Bucket starts with MAX_TOKENS.
* Tokens refill over time.
* Each request consumes 1 token.
* If no tokens remain → HTTP 429 returned.

### Bucket Model
```ts
interface Bucket {
  tokens: number;
  lastRefill: number;
}
```
### Storage Strategy
```ts
const buckets: Record<string, Bucket> = {};
```

### In-memory
* Keyed by client IP
* Fast lookup
* Lightweight
---
## 3️⃣ Logger Middleware (middleware/logger.ts)

### Logs request lifecycle information:
```
GET / | 200 | 3ms
```
### Captures:
* HTTP method
* URL path
* Status code
* Response duration

Uses res.on("finish") for accurate timing.

### 🚀 Running the Module

From inside `rate-limiter/`:
```
npm install
npm run dev
```
Server runs at:
`http://localhost:3000`
---
### 🧪 Testing Rate Limiting

Basic Request

`curl http://localhost:3000`

Burst Test
```
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000; done
```
---
### Expected behavior:

Initial responses → 200

After token exhaustion → 429

---
### ⚠ Limitations
* In-memory storage (resets on restart)
* Not horizontally scalable
* No bucket cleanup for inactive IPs
* Not reverse-proxy aware
* No distributed coordination

---
**Resource:** https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter