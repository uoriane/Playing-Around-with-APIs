// plan.js — per-day rotation (Video + Quiz + Reading), prev/next, saved progress

function normId(id) {
  const map = {
    "run-business":"online-business",
    "photography":"phone-photography",
    "crypto":"crypto-blockchain",
    "portfolio-building":"build-portfolio",
  };
  return map[id] || id;
}
function getParam(n){ return new URLSearchParams(location.search).get(n); }
function cap(s){ return (s||"").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()); }

// day counts by skill
const DAY_COUNT = {
  // Tech
  "web-dev": 21,
  "python": 21,
  "graphic-design": 14,
  "data-analysis": 14,
  // Freelancer
  "build-portfolio": 14,
  "proposal-pricing": 14,
  "customer-support": 14,
  "data-entry": 14,
  // Business
  "online-business": 14,
  "social-media": 14,
  "phone-photography": 14,
};

// per-skill reading subtopics (rotated daily)
const READ_TOPICS = {
  // Tech
  "web-dev": [
    "HTML","CSS","CSS Grid Layout","Flexbox","Responsive web design","JavaScript",
    "DOM (Document Object Model)","Fetch API","Accessibility","Web performance",
    "Search engine optimization","Web security","Testing (software)","Git","GitHub","REST",
    "Single-page application","Routing","State management","Animations","Deployment"
  ],
  "python": [
    "Python (programming language)","List (abstract data type)","Dictionary (data structure)","Tuple",
    "Loop (programming)","Function (computer science)","Exception handling","Object-oriented programming",
    "Pandas (software)","NumPy","Matplotlib","Requests (software)","JSON","Virtualenv",
    "Command-line interface","Unit testing","List comprehension","Generator (computer science)","Datetime","Packaging","Style guide for Python code"
  ],
  "graphic-design": [
    "Graphic design","Design elements and principles","Typography","Color theory","Visual hierarchy",
    "Layout (graphic design)","Grid (graphic design)","User experience design","User interface design",
    "Brand identity","Logo","Accessibility","Responsive web design","Portfolio (career)"
  ],
  "data-analysis": [
    "Data analysis","Exploratory data analysis","Descriptive statistics","Data visualization",
    "Histogram","Box plot","Correlation and dependence","Linear regression","Time series",
    "Pandas (software)","NumPy","Matplotlib","Jupyter","Data cleaning","Outlier",
  ],

  // Freelancer
  "build-portfolio": [
    "Portfolio (career)","Case study (design)","User experience design","Visual hierarchy","Call to action",
    "Typography","Color theory","Responsive web design","Accessibility","Search engine optimization",
    "Version control","Personal branding","Curriculum vitae","Cover letter"
  ],
  "proposal-pricing": [
    "Business proposal","Pricing strategies","Value-based pricing","Market research","Buyer persona",
    "Scope (project management)","Deliverable","Milestone (project management)","Terms of service",
    "Invoice","Payment","Negotiation","Upselling","Customer relationship management"
  ],
  "customer-support": [
    "Customer service","First contact resolution","Service-level agreement","Help desk","Knowledge base",
    "Live chat","Email","Tone (linguistics)","Empathy","Net Promoter Score","Feedback","Escalation",
    "Incident management","Crisis management"
  ],
  "data-entry": [
    "Data entry","Data validation","Data quality","Spreadsheet","CSV","Regular expression",
    "Keyboard shortcut","Double-checking","Proofreading","Version control","Audit trail","Template",
    "Optical character recognition","Transcription"
  ],

  // Business
  "online-business": [
    "E-commerce","Minimum viable product","Market research","Product–market fit","Business model",
    "Landing page","Conversion rate optimization","Digital marketing","Search engine marketing",
    "Email marketing","A/B testing","Customer relationship management","Gross margin","Cash flow"
  ],
  "social-media": [
    "Social media marketing","Content calendar","Hashtag","Engagement (digital)","Short-form video",
    "Influencer marketing","Community management","Analytics","Call to action","Brand voice",
    "Buyer persona","User-generated content","Channel strategy","Crisis management"
  ],
  "phone-photography": [
    "Mobile photography","Composition (visual arts)","Rule of thirds","Exposure (photography)","ISO","Shutter speed",
    "White balance","Portrait photography","Low-light photography","Backlighting","Leading lines","Color theory",
    "Storytelling","Photojournalism"
  ],
};

let cache = {}; // per-skill cache for extras

function getSavedDay(skill){
  const k = "day:"+skill;
  const v = localStorage.getItem(k);
  const n = v ? parseInt(v,10) : 1;
  const max = DAY_COUNT[skill] || 14;
  return Math.min(Math.max(n,1), max);
}
function saveDay(skill, day){ localStorage.setItem("day:"+skill, String(day)); }

async function loadDay(skill, day){
  const btns = document.getElementById("day-buttons");
  const videoEl = document.getElementById("plan-video");
  const qEl = document.getElementById("plan-quiz-question");
  const optsEl = document.getElementById("plan-quiz-options");
  const fbEl = document.getElementById("quiz-feedback");
  const summaryEl = document.getElementById("summary");

  // UI reset
  [...btns.querySelectorAll("button[data-day]")].forEach(b => b.classList.toggle("is-active", +b.dataset.day === day));
  videoEl.textContent = "Loading video…";
  qEl.textContent = "Loading quiz…";
  optsEl.innerHTML = "";
  fbEl.textContent = ""; fbEl.className = "";
  summaryEl.textContent = "Loading reading…";

  // extras (videos & local quiz) — fetch once per skill
  if (!cache[skill]) cache[skill] = await window.SkillAPI.getExtras(skill);
  const { videos = [], quiz = [] } = cache[skill];

  // Video of the day
  const v = videos.length ? videos[(day-1) % videos.length] : null;
  videoEl.innerHTML = v
    ? `<strong>Today’s Video:</strong> <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">${v.title}</a>`
    : "(No video today)";

  // Quiz of the day
  const q = quiz.length ? quiz[(day-1) % quiz.length] : null;
  if (!q) {
    qEl.textContent = "No quiz available.";
  } else {
    const question = q.q || q.question || "(No question)";
    const options  = q.opts || q.options || [];
    const answer   = q.a || q.answer;

    qEl.textContent = question;
    options.forEach(opt => {
      const b = document.createElement("button");
      b.textContent = opt;
      b.addEventListener("click", () => {
        optsEl.querySelectorAll("button").forEach(x => x.classList.remove("wrong"));
        const correct = answer === opt;
        if (correct) {
          b.classList.add("correct");
          fbEl.textContent = "✅ Correct!";
          fbEl.className = "ok";
          optsEl.querySelectorAll("button").forEach(x => x.disabled = true);
        } else {
          b.classList.add("wrong");
          fbEl.textContent = "❌ Try again";
          fbEl.className = "err";
        }
      });
      optsEl.appendChild(b);
    });
  }

  // Reading of the day (sub-topic summary)
  const topics = READ_TOPICS[skill] || [];
  const term = topics.length ? topics[(day-1) % topics.length] : null;
  let summary = null;
  if (term) summary = await window.SkillAPI.getTermSummary(term);
  if (!summary) summary = await window.SkillAPI.getSkillSummary(skill);

  summaryEl.innerHTML = (summary && (summary.extract || summary.title))
    ? `<strong>Today’s Reading:</strong> ${summary.extract || ""} ${summary.url ? `<a href="${summary.url}" target="_blank" rel="noopener">Read more</a>` : ""}`
    : "(No reading available)";

  saveDay(skill, day);
}

function buildUI(skill){
  document.getElementById("skill-title").textContent = cap(skill);

  const dayBtns = document.getElementById("day-buttons");
  dayBtns.innerHTML = "";

  const prev = document.createElement("button"); prev.textContent = "◀ Prev"; prev.id = "prev-day";
  const next = document.createElement("button"); next.textContent = "Next ▶"; next.id = "next-day";

  const max = DAY_COUNT[skill] || 14;
  const bar = document.createElement("div"); bar.className = "buttons";
  for (let d=1; d<=max; d++){
    const b = document.createElement("button");
    b.textContent = `Day ${d}`;
    b.dataset.day = d;
    b.addEventListener("click", () => loadDay(skill, d));
    bar.appendChild(b);
  }

  dayBtns.appendChild(prev);
  dayBtns.appendChild(bar);
  dayBtns.appendChild(next);

  prev.addEventListener("click", () => { const cur = getSavedDay(skill); loadDay(skill, Math.max(1, cur-1)); });
  next.addEventListener("click", () => { const cur = getSavedDay(skill); loadDay(skill, Math.min(max, cur+1)); });

  const start = getSavedDay(skill);
  loadDay(skill, start);
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = getParam("skill") || "build-portfolio";
  const skill = normId(raw);
  buildUI(skill);
});
