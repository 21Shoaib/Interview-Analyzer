const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Technical questions that can be asked in the interview"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The behavioral question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Behavioral questions that can be asked in the interview"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill which the candidate is lacking"),
    severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
  })).describe("List of skill gaps in the candidate's profile"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number in the preparation plan, starting from 1"),
    focus: z.string().describe("The main focus of this day"),
    tasks: z.array(z.string()).describe("List of tasks to be done on this day")
  })).describe("A day-wise preparation plan for the candidate"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateInterviewReport({ resume, selfDescription, jobDescription, title }) {
  const prompt = `
  Analyze the resume, self description, and job description.

  Generate a complete interview preparation report in STRICT JSON format.

  Rules:
  - Do NOT leave any array empty.
  - Generate minimum:
    - 5 technical questions
    - 3 behavioral questions
    - 3 skill gaps
    - 5 preparation plan days
  - matchScore must be between 0 and 100.
  - Return ONLY valid JSON.
  - Do not add markdown.
  - Do not add explanation text.

  Expected JSON format:
  {
    "matchScore": number,
    "technicalQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
    "behavioralQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
    "skillGaps": [{ "skill": "string", "severity": "low | medium | high" }],
    "preparationPlan": [{ "day": number, "focus": "string", "tasks": ["string"] }],
    "title": "string"
  }

  Resume:
  ${resume}

  Self Description:
  ${selfDescription}

  Job Description:
  ${jobDescription}

  Title:
  ${title}
  `;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(response.text);

    } catch (error) {
      attempts++;

      if (error.status === 429 || error.message?.includes("429")) {
        console.warn(`[AI Service] Quota exceeded. Attempt ${attempts} of ${maxAttempts}. Retrying in 10s...`);
        if (attempts < maxAttempts) {
          await sleep(10000);
          continue;
        }
      }

      console.error("Error generating report:", error);
      throw error;
    }
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        margin: {
          top: "8mm",
          bottom: "8mm",
          left: "15mm",
          right: "15mm",
        },
        printBackground: true,
      })
    );

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription, title }) {
  const prompt = `
    Generate a resume for a candidate with the following details:

    <title>${title}</title>
    <resume>${resume}</resume>
    <self_description>${selfDescription}</self_description>
    <job_description>${jobDescription}</job_description>

     Instructions:
    - Tailor the resume for the given job description and highlight relevant experience.
    - The HTML should be well-formatted, visually appealing, and professional.
    - Do NOT sound AI-generated; write naturally like a human-crafted resume.
    - Use subtle colors or font styles, but keep the overall design simple and clean.
    - Must be ATS-friendly (easily parsable, no tables for layout, semantic HTML).
    - STRICT ONE PAGE ONLY — content must fit in a single A4 page, no overflow.
    - Use compact spacing: line-height 1.3, font-size 12-13px for body, 14-15px for headings.
    - Minimize padding and margins between sections (6-7px between sections).
    - Use a two-column layout where appropriate to save vertical space.
    - Only include the most impactful and relevant information.
    - Include all necessary CSS inline or in a <style> tag within the HTML.
    - Do not use external fonts or assets that require network requests.
    - Set the body width to 794px (A4 width) and height to auto in CSS.

    Return ONLY a valid JSON object in this exact format, no markdown, no explanation:
    {
      "html": "the complete HTML string of the resume"
    }
  `;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  } catch (err) {
    throw new Error(`AI content generation failed: ${err.message}`);
  }

  let jsonContent;
  try {
    const clean = response.text.replace(/```json|```/g, "").trim();
    jsonContent = JSON.parse(clean);
  } catch (err) {
    throw new Error(`Failed to parse AI response as JSON: ${err.message}`);
  }

  if (!jsonContent.html || typeof jsonContent.html !== "string") {
    throw new Error(`AI response missing html field. Got: ${JSON.stringify(jsonContent)}`);
  }

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };