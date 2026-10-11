const moduleContent = {
  digilocker: {
    label: "MODULE 01 / DIGITAL DOCUMENTS",
    title: "Your documents, available digitally.",
    description: "DigiLocker is a platform for accessing and storing digital documents issued by participating organisations. Issued documents can be accessed through your account.",
    steps: [
      ["Open the official portal", "Visit DigiLocker using the official link in Resources. Check the web address before signing in."],
      ["Sign in or create an account", "Follow the current instructions on the official service. Keep credentials private and never share an OTP."],
      ["Find issued documents", "Use the service's document search or issued-document area to locate records available to you."],
      ["Access and verify", "Review the document details and follow the portal's guidance for viewing or sharing it."]
    ],
    official: "https://www.digilocker.gov.in/"
  },
  aadhaar: {
    label: "MODULE 02 / IDENTITY SERVICES",
    title: "Understand Aadhaar services with confidence.",
    description: "UIDAI provides official information and online services related to Aadhaar. The available options may depend on the service, verification method and current rules.",
    steps: [
      ["Visit the UIDAI website", "Use the official UIDAI website linked in Resources and choose the relevant Aadhaar service."],
      ["Check service requirements", "Read the current instructions, eligibility and whether the task is available online or requires an authorised centre."],
      ["Follow the official process", "Complete any required verification only on the genuine official service. This training site does not process Aadhaar requests."],
      ["Save your acknowledgement", "If the official process provides an acknowledgement or request number, keep it securely for future reference."]
    ],
    official: "https://uidai.gov.in/"
  },
  pan: {
    label: "MODULE 03 / TAX IDENTITY",
    title: "Get familiar with PAN-related services.",
    description: "A Permanent Account Number (PAN) is used for tax-related identification in India. Official portals provide guidance for PAN applications, corrections and related services.",
    steps: [
      ["Choose a verified official provider", "Start from the Income Tax e-Filing portal or an authorised PAN service provider linked in Resources."],
      ["Identify the right service", "Check whether you need a new PAN, a correction, a status check or another service."],
      ["Review documents and charges", "Read the latest requirements, fees and instructions on the provider's official website before proceeding."],
      ["Track your request safely", "Use the official tracking method and keep acknowledgements private. Never share passwords or OTPs with others."]
    ],
    official: "https://www.incometax.gov.in/iec/foportal/"
  }
};

const quizQuestions = [
  { q: "What is the main purpose of DigiLocker?", a: ["To access eligible digital documents", "To create social media accounts", "To replace every physical identity check", "To provide private email hosting"], correct: 0, explanation: "DigiLocker helps users access digital documents issued by participating organisations." },
  { q: "Which organisation is responsible for Aadhaar in India?", a: ["Reserve Bank of India", "Unique Identification Authority of India (UIDAI)", "Election Commission of India", "National Payments Corporation of India"], correct: 1, explanation: "UIDAI is the statutory authority responsible for Aadhaar." },
  { q: "What should you do with an OTP received during an online service process?", a: ["Share it with anyone claiming to be support", "Post it in a public chat for help", "Keep it private and enter it only in the verified process you initiated", "Save it as your permanent password"], correct: 2, explanation: "An OTP is sensitive authentication information. Never share it with another person." },
  { q: "What does PAN stand for in Indian tax services?", a: ["Personal Access Number", "Permanent Account Number", "Public Aadhaar Network", "Personal Application Name"], correct: 1, explanation: "PAN stands for Permanent Account Number." },
  { q: "Where should you check the latest service requirements and fees?", a: ["An unknown message link", "A random social media comment", "An unofficial site that promises instant approval", "The relevant official portal or authorised provider"], correct: 3, explanation: "Official portals and authorised providers are the right place to verify current requirements and fees." }
];

// Paste your deployed Google Apps Script Web App URL (the one ending in /exec) here.
// Keep the URL private for your project and do not collect Aadhaar/PAN numbers or OTPs.
const SHEETS_WEB_APP_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
let registeredStudent = null;

function submitRecord(record) {
  if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL.includes("PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    console.warn("Google Sheets URL is not configured. Record was not sent.", record);
    return Promise.resolve(false);
  }
  // text/plain avoids the browser's JSON preflight. Apps Script may return an opaque
  // response because no-cors is used, so verify records directly in the Google Sheet.
  return fetch(SHEETS_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(record)
  }).then(() => true).catch(error => {
    console.error("Could not send record to Google Sheets:", error);
    return false;
  });
}

const registrationForm = document.getElementById("studentRegistration");
registrationForm.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(registrationForm);
  registeredStudent = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    className: String(formData.get("className") || "").trim()
  };
  if (!registeredStudent.name || !registeredStudent.email || !registeredStudent.className) return;
  sessionStorage.setItem("digitalLearnStudent", JSON.stringify(registeredStudent));
  const status = document.getElementById("registrationStatus");
  status.textContent = "Registration details prepared. Sending to the Google Sheet…";
  const sent = await submitRecord({ ...registeredStudent, module: "Registration", score: "", completed: false });
  status.textContent = sent
    ? "Registration request sent. Check the Students tab in Google Sheets to confirm it was saved."
    : "Could not send registration. Check the Apps Script URL and deployment permissions, then try again.";
});
try {
  registeredStudent = JSON.parse(sessionStorage.getItem("digitalLearnStudent") || "null");
  if (registeredStudent && registeredStudent.name) {
    document.getElementById("studentName").value = registeredStudent.name;
    document.getElementById("studentEmail").value = registeredStudent.email || "";
    document.getElementById("studentClass").value = registeredStudent.className || "";
    document.getElementById("registrationStatus").textContent = "Registered for this browser session. Re-register if you want to submit the details again.";
  }
} catch (_) {}

function sendStudentProgress(moduleName, scoreValue, isCompleted) {
  if (!registeredStudent) {
    console.info("Register first to associate progress with a student.");
    return;
  }
  submitRecord({ ...registeredStudent, module: moduleName, score: scoreValue, completed: isCompleted });
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));
document.getElementById("year").textContent = new Date().getFullYear();

let currentModule = "digilocker";
const completed = new Set();
try {
  const saved = JSON.parse(localStorage.getItem("digitalSaathiCompleted") || "[]");
  saved.filter(key => moduleContent[key]).forEach(key => completed.add(key));
} catch (_) {}

function renderModule(key) {
  currentModule = key;
  const data = moduleContent[key];
  document.getElementById("guideLabel").textContent = data.label;
  document.getElementById("guideTitle").textContent = data.title;
  document.getElementById("guideDescription").textContent = data.description;
  document.getElementById("guideSteps").innerHTML = data.steps.map((step, i) =>
    `<li><span>${String(i + 1).padStart(2, "0")}</span><div><strong>${step[0]}</strong><p>${step[1]}</p></div></li>`
  ).join("");
  document.querySelectorAll(".module-tab").forEach(tab => {
    const active = tab.dataset.tab === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.getElementById("markComplete").innerHTML = completed.has(key) ? "Module completed ✓" : "Mark module as complete <span>✓</span>";
  document.getElementById("markComplete").classList.toggle("btn-secondary", completed.has(key));
  document.getElementById("markComplete").classList.toggle("btn-primary", !completed.has(key));
}
function updateProgress() {
  const count = completed.size;
  const percent = Math.round(count / 3 * 100);
  document.getElementById("progressCount").textContent = `${count} of 3 modules`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  try { localStorage.setItem("digitalSaathiCompleted", JSON.stringify([...completed])); } catch (_) {}
}
document.querySelectorAll("[data-tab]").forEach(tab => tab.addEventListener("click", () => renderModule(tab.dataset.tab)));
document.querySelectorAll("[data-open-module]").forEach(button => button.addEventListener("click", () => {
  renderModule(button.dataset.openModule);
  document.getElementById("moduleDetails").scrollIntoView({behavior: "smooth"});
}));
document.getElementById("markComplete").addEventListener("click", () => {
  const isNowCompleted = !completed.has(currentModule);
  if (isNowCompleted) completed.add(currentModule);
  else completed.delete(currentModule);
  renderModule(currentModule);
  updateProgress();
  if (isNowCompleted) sendStudentProgress(moduleContent[currentModule].title, "", true);
});
renderModule(currentModule);
updateProgress();

// Knowledge quiz: answers are checked locally in the browser; nothing is submitted.
let questionIndex = 0;
let score = 0;
let answered = false;
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const nextQuestion = document.getElementById("nextQuestion");
const quizFeedback = document.getElementById("quizFeedback");
const questionCounter = document.getElementById("questionCounter");
const quizProgressBar = document.getElementById("quizProgressBar");

function renderQuestion() {
  const item = quizQuestions[questionIndex];
  answered = false;
  questionCounter.textContent = `QUESTION ${questionIndex + 1} OF ${quizQuestions.length}`;
  quizProgressBar.style.width = `${questionIndex / quizQuestions.length * 100}%`;
  questionText.textContent = item.q;
  quizFeedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.textContent = questionIndex === quizQuestions.length - 1 ? "See results →" : "Next question →";
  answerList.innerHTML = item.a.map((answer, index) =>
    `<button class="answer-option" type="button" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span></button>`
  ).join("");
  answerList.querySelectorAll(".answer-option").forEach(button => button.addEventListener("click", () => chooseAnswer(Number(button.dataset.answer))));
}
function chooseAnswer(selected) {
  if (answered) return;
  answered = true;
  const item = quizQuestions[questionIndex];
  const options = [...answerList.querySelectorAll(".answer-option")];
  options.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    else if (index === selected) button.classList.add("wrong");
  });
  if (selected === item.correct) {
    score++;
    quizFeedback.textContent = "That's right! " + item.explanation;
  } else {
    quizFeedback.textContent = item.explanation;
  }
  nextQuestion.disabled = false;
  quizProgressBar.style.width = `${(questionIndex + 1) / quizQuestions.length * 100}%`;
}
nextQuestion.addEventListener("click", () => {
  if (!answered) return;
  questionIndex++;
  if (questionIndex >= quizQuestions.length) showResults();
  else renderQuestion();
});
function showResults() {
  document.getElementById("quizContent").classList.add("hidden");
  document.getElementById("quizResult").classList.remove("hidden");
  document.getElementById("questionCounter").textContent = "COMPLETED";
  quizProgressBar.style.width = "100%";
  document.getElementById("finalScore").textContent = `${score}/${quizQuestions.length}`;
  document.getElementById("resultTitle").textContent = score === quizQuestions.length ? "Excellent work!" : score >= 3 ? "Good progress!" : "Keep learning!";
  document.getElementById("resultText").textContent = score === quizQuestions.length ? "You answered every question correctly." : "Review the training modules and try again to strengthen your digital-service knowledge.";
  sendStudentProgress("Knowledge Quiz", `${score}/${quizQuestions.length}`, true);
}
document.getElementById("restartQuiz").addEventListener("click", () => {
  questionIndex = 0; score = 0;
  document.getElementById("quizContent").classList.remove("hidden");
  document.getElementById("quizResult").classList.add("hidden");
  renderQuestion();
});
renderQuestion();

// Keep the first FAQ open only initially; native details elements handle interaction accessibly.
