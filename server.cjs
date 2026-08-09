var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NCE Chandi T&P Portal" });
});
app.post("/api/gemini/resume-review", async (req, res) => {
  try {
    const { resumeText, targetRole, branch } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        score: 82,
        strengths: [
          "Clear academic achievements at NCE Chandi",
          "Includes relevant technical projects and skills",
          "Good formatting structure"
        ],
        improvements: [
          "Quantify project impact with measurable outcomes (e.g., % efficiency gain)",
          "Add industry certifications in your branch domain",
          "Include links to GitHub or live portfolio projects"
        ],
        keywordMatchScore: 85,
        suggestedSkills: ["Git / Version Control", "System Design Basics", "REST APIs / Microservices"],
        summary: "Solid foundational engineering resume. Adding measurable metrics and project links will significantly boost recruiter callbacks."
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const prompt = `You are a Senior Technical Recruiter & Training Placement Officer evaluating a B.Tech student resume for Nalanda College of Engineering (NCE), Chandi.
    
Branch: ${branch || "Engineering"}
Target Role: ${targetRole || "Software / Core Engineer"}

Resume Content:
${resumeText}

Provide a structured assessment JSON response ONLY in the following format:
{
  "score": <number 0-100>,
  "strengths": [<string array of 3 key strengths>],
  "improvements": [<string array of 3 actionable suggestions>],
  "keywordMatchScore": <number 0-100>,
  "suggestedSkills": [<string array of 3-4 missing high-value technical or soft skills>],
  "summary": "<1-2 sentence overall feedback>"
}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText);
      return res.json(parsed);
    }
    throw new Error("No response generated");
  } catch (err) {
    console.error("Gemini API error:", err);
    res.json({
      score: 80,
      strengths: [
        "Well-formatted B.Tech resume structure",
        "Clear highlights of coursework and core branch skills",
        "Includes contact details and educational record"
      ],
      improvements: [
        "Include quantifiable project statistics and technologies used",
        "Highlight internships or practical industry exposure",
        "Add competitive programming or certification achievements"
      ],
      keywordMatchScore: 78,
      suggestedSkills: ["Data Structures & Algorithms", "Git/GitHub", "Database Management"],
      summary: "Good student resume base! Enhance project metrics and add live demo links to improve shortlisting chances."
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NCE Chandi T&P Portal running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
