import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/utils/checkAuth";
import OpenAI from "openai";

// GROQ CLIENT
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  let userId: number;

  // CHECK AUTH
  try {
    const { user } = await checkAuth(req);
    userId = user.id;
  } catch {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // FETCH SUBJECTS
    const subjects = await prisma.subject.findMany({
      where: { userId },
    });

    // FETCH UPCOMING EXAMS
    const exams = await prisma.exam.findMany({
      where: {
        examDate: {
          gte: new Date(),
        },
      },
      include: {
        subject: true,
      },
      orderBy: {
        examDate: "asc",
      },
    });

    // VALIDATION
    if (subjects.length === 0) {
      return NextResponse.json(
        { message: "Add some subjects first!" },
        { status: 400 }
      );
    }

    if (exams.length === 0) {
      return NextResponse.json(
        { message: "Add some upcoming exams first!" },
        { status: 400 }
      );
    }

    // CHECK EXISTING TASKS
    const existingTasks = await prisma.studyTask.findMany({
      where: {
        userId,
        completed: false,
        taskDate: {
          gte: new Date(),
        },
      },
    });

    if (existingTasks.length > 0) {
      return NextResponse.json(
        {
          message: "Study plan already exists!",
          count: existingTasks.length,
        },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // BUILD EXAM LIST
    const examList = exams
      .map(
        (e) =>
          `- Subject: "${e.subject.name}" | Exam date: ${e.examDate.toISOString().split("T")[0]
          } | Difficulty: ${e.subject.difficulty} | subjectId: ${e.subject.id
          }`
      )
      .join("\n");

    // AI PROMPT
    const prompt = `
You are a smart AI study planner.

Today is ${today}.

The student has these upcoming exams:
${examList}

Generate a realistic day-by-day study schedule from today until the final exam.

RULES:
- Allocate more sessions to hard subjects
- Prioritize exams coming sooner
- Create 1-3 tasks per day
- Allow occasional rest days
- Keep task titles specific and actionable
- Do not create tasks after a subject's exam date
- Spread tasks evenly

IMPORTANT:
Respond ONLY with a valid JSON array.
No markdown.
No backticks.
No explanations.

FORMAT:
[
  {
    "title": "Practice past papers",
    "taskDate": "2026-05-04",
    "subjectId": 1
  }
]

Only use these subjectIds:
${subjects.map((s) => `${s.id} (${s.name})`).join(", ")}
`;

    // GENERATE PLAN
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an intelligent study planning assistant that ONLY returns valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const raw =
      response.choices[0]?.message?.content?.trim() || "";

    // CLEAN RESPONSE
    const cleaned = raw
      .replace(/^```json/gm, "")
      .replace(/^```/gm, "")
      .replace(/```$/gm, "")
      .trim();

    // PARSE JSON
    let tasks;

    try {
      tasks = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("RAW AI RESPONSE:", raw);

      return NextResponse.json(
        {
          message: "Failed to parse AI response",
        },
        { status: 500 }
      );
    }

    // VALIDATE ARRAY
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        {
          message: "AI returned invalid task format",
        },
        { status: 500 }
      );
    }

    // VALIDATE TASKS
    const validSubjectIds = subjects.map((s) => s.id);

    const validTasks = tasks.filter((t: any) => {
      return (
        typeof t.title === "string" &&
        t.title.trim().length > 3 &&
        typeof t.taskDate === "string" &&
        !isNaN(new Date(t.taskDate).getTime()) &&
        validSubjectIds.includes(t.subjectId)
      );
    });

    if (validTasks.length === 0) {
      return NextResponse.json(
        {
          message: "AI generated invalid tasks",
        },
        { status: 500 }
      );
    }

    // SAVE TASKS
    await prisma.studyTask.createMany({
      data: validTasks.map(
        (t: {
          title: string;
          taskDate: string;
          subjectId: number;
        }) => ({
          title: t.title,
          taskDate: new Date(t.taskDate),
          subjectId: t.subjectId,
          userId,
          completed: false,
        })
      ),
    });

    return NextResponse.json(
      {
        message: "Study plan generated successfully!",
        count: validTasks.length,
        tasks: validTasks,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("GROQ ERROR:", err);

    if (err.status === 429) {
      return NextResponse.json(
        {
          message:
            "AI rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        message: "AI generation failed",
      },
      { status: 500 }
    );
  }
}