const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewReportController(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No PDF file uploaded.",
    });
  }

  let pdfData;
  try {
    pdfData = await pdfParse(req.file.buffer);
  } catch (err) {
    console.error("PDF parse error:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid or corrupted PDF file.",
    });
  }

  const { selfDescription, jobDescription, title } = req.body;

  let interViewReportByAi;
  try {
    interViewReportByAi = await generateInterviewReport({
      resume: pdfData.text,
      selfDescription,
      jobDescription,
      title,
    });
  } catch (err) {
    console.error("AI report generation error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report.",
    });
  }

  console.log("AI report:", interViewReportByAi);

  let interviewReport;
  try {
    interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: pdfData.text,
      selfDescription,
      jobDescription,
      title,
      ...interViewReportByAi,
    });
  } catch (err) {
    console.error("DB create error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save interview report.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Interview report created successfully.",
    interviewReport,
  });
}

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  let interviewReport;
  try {
    interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });
  } catch (err) {
    console.error("DB fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview report.",
    });
  }

  if (!interviewReport) {
    return res.status(404).json({
      success: false,
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

async function getAllInterviewReportsController(req, res) {
  let interviewReports;
  try {
    interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
  } catch (err) {
    console.error("DB fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview reports.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;
  console.log("interviewReportId:", interviewReportId);
  console.log("req.user.id:", req.user.id);

//   // temporarily bypass user filter
//   const all = await interviewReportModel.find({})
//   console.log("ALL reports in DB:", JSON.stringify(all, null, 2))

  const report = await interviewReportModel.findById(interviewReportId);
  console.log("report found (without user filter):", report);

  let interviewReport;
  try {
    interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,  // scope to the requesting user
    });
  } catch (err) {
    console.error("DB fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview report.",
    });
  }

  if (!interviewReport) {
    return res.status(404).json({
      success: false,
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription, title } = interviewReport;

let pdfBuffer;
  try {
    pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription, title });
  } catch (err) {
    console.error("PDF generation error:", err.message)
    console.error(err.stack)
    return res.status(500).json({
      success: false,
      message: "Failed to generate resume PDF.",
      error: err.message  // temporarily add this
    });
  }

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};