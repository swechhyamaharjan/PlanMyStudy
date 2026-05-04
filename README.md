# 📚 PlanMyStudy

> An AI-powered study planner that helps students automatically generate personalized study schedules based on their subjects and exam dates.

---

## ✨ Features

- **AI Study Plan Generator** — Uses Google Gemini to generate a personalized day-by-day study schedule based on your subjects and upcoming exams
- **Subjects Management** — Add, edit, and delete subjects with difficulty levels (Easy / Medium / Hard)
- **Exam Scheduler** — Schedule exams per subject with date tracking and urgency indicators
- **Task Management** — Create, complete, and delete study tasks with subject and date assignment
- **Dashboard** — Live overview of total subjects, upcoming exams, pending tasks, and today's tasks
- **Settings** — Update profile (name/email), change password, toggle light/dark theme, and manage notification preferences
- **Authentication** — JWT-based login and registration with bcrypt password hashing

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | CSS Modules + Tailwind CSS |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io/) |
| Auth | JWT + bcryptjs |
| AI | [Google Gemini API](https://aistudio.google.com/) (`gemini-2.0-flash`) |
| HTTP Client | Axios |
| Icons | React Icons (Feather) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/planmystudy.git
cd planmystudy
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/planmystudy"

# JWT
JWT_SECRET="your_jwt_secret_here"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key_here"
```

**4. Set up the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**5. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
planmystudy/
├── app/
│   ├── (auth)/
│   │   ├── signin/          # Login page
│   │   └── signup/          # Register page
│   ├── (dashboard)/
│   │   ├── dashboard/       # Main dashboard
│   │   ├── subjects/        # Subjects management
│   │   ├── exams/           # Exam scheduling
│   │   ├── tasks/           # Task management
│   │   └── setting/         # User settings
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/       # POST - Login
│   │   │   ├── register/    # POST - Register
│   │   │   └── logout/      # POST - Logout
│   │   ├── subjects/
│   │   │   ├── route.ts     # GET, POST
│   │   │   └── [id]/        # PUT, DELETE
│   │   ├── exams/
│   │   │   ├── route.ts     # GET, POST
│   │   │   └── [id]/        # PUT, DELETE
│   │   ├── studyTasks/
│   │   │   ├── route.ts     # GET, POST
│   │   │   └── [id]/        # PUT, DELETE
│   │   ├── users/
│   │   │   ├── profile/     # GET, PUT
│   │   │   └── password/    # PUT
│   │   └── ai/
│   │       └── plan/        # POST - Generate AI study plan
│   └── components/
│       ├── Sidebar.tsx
│       └── PlanMyStudy.tsx
├── prisma/
│   └── schema.prisma
├── utils/
│   ├── checkAuth.ts
│   └── generateToken.ts
└── public/
```

---

## 🗄 Database Schema

```prisma
model User {
  id         Int          @id @default(autoincrement())
  name       String
  email      String       @unique
  password   String
  subjects   Subject[]
  studyTasks StudyTask[]
}

model Subject {
  id         Int         @id @default(autoincrement())
  name       String
  difficulty String
  userId     Int
  user       User        @relation(fields: [userId], references: [id])
  exams      Exam[]
  studyTasks StudyTask[]
}

model Exam {
  id        Int      @id @default(autoincrement())
  examDate  DateTime
  subjectId Int
  subject   Subject  @relation(fields: [subjectId], references: [id])
}

model StudyTask {
  id        Int      @id @default(autoincrement())
  title     String
  taskDate  DateTime
  completed Boolean  @default(false)
  userId    Int
  subjectId Int
  user      User     @relation(fields: [userId], references: [id])
  subject   Subject  @relation(fields: [subjectId], references: [id])
}
```

---

## 🤖 AI Study Plan

The AI planner uses **Google Gemini** to analyze your subjects and exam schedule, then generates a realistic day-by-day study plan:

- Allocates more sessions to **harder subjects**
- Prioritizes **sooner exams**
- Creates **1–3 tasks per day** with specific, actionable titles
- Allows **rest days** — doesn't over-schedule
- Automatically **replaces incomplete tasks** when regenerated

To use it, make sure you have at least one subject and one upcoming exam added.

---

## 🔐 Authentication

- Passwords are hashed with **bcryptjs** (salt rounds: 10)
- Auth uses **JWT tokens** stored in HTTP-only cookies
- Protected routes check the token via `checkAuth` middleware
- Theme preference is persisted in **localStorage**

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙋 Author

Built by **Swechhya Maharjan**
