

const __ENV__ = (typeof window !== "undefined" && window.ENV) ? window.ENV : {};
const CFG = {
  YOUTUBE_API_KEY: __ENV__.VITE_YOUTUBE_API_KEY || "AIzaSyC-pLqf0gQwL9lwxKtgZ4i_tbHBd2oX_fA",
  TIMEOUT_MS: 15000,
};


async function fetchJSON(url, options) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), CFG.TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, ...options });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}
function qs(params) {
  const p = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.append(k, v);
  });
  return p.toString();
}


const WIKI_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const SKILL_TITLES = {
  // Tech
  "web-dev": "Web_development",
  "python": "Python_(programming_language)",
  "cybersecurity-basics": "Computer_security",
  "digital-marketing": "Digital_marketing",
  "intro-html-css": "HTML",
  "mobile-app-design": "Mobile_app_development",

  // Freelance
  "canva-design": "Canva_(software)",
  "freelance-rates": "Freelancer",
  "email-communication": "Email",
  "customer-support": "Customer_service",
  "data-entry": "Data_entry",
  "build-portfolio": "Portfolio_(career)",

  // Business
  "run-business": "E-commerce",
  "budgeting-business": "Budget",
  "selling-instagram": "Instagram",
  "social-media": "Social_media_marketing",
  "digital-products": "Digital_goods"
};

async function getTermSummary(term) {
  try {
    const data = await fetchJSON(WIKI_SUMMARY + encodeURIComponent(term));
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page || data.content_urls?.mobile?.page,
    };
  } catch {
    return null;
  }
}
async function getSkillSummary(skillId) {
  const t = SKILL_TITLES[skillId];
  return t ? getTermSummary(t) : null;
}


async function youtubeSearch({ q, maxResults = 12 }) {
  try {
    if (!CFG.YOUTUBE_API_KEY) return [];
    const url = `https://www.googleapis.com/youtube/v3/search?${qs({
      key: CFG.YOUTUBE_API_KEY,
      part: "snippet",
      q,
      maxResults,
      type: "video",
      relevanceLanguage: "en",
      safeSearch: "moderate",
    })}`;
    const json = await fetchJSON(url);
    return (json.items || []).map((it) => ({
      id: it.id?.videoId,
      title: it.snippet?.title,
      channel: it.snippet?.channelTitle,
      thumbnail: it.snippet?.thumbnails?.medium?.url,
      publishedAt: it.snippet?.publishedAt,
    }));
  } catch {
    return [];
  }
}


const QUIZ = {
  // Tech
  "web-dev": [
    { q:"Best layout system for grid?", a:"CSS Grid", opts:["Tables","Inline styles","CSS Grid","<marquee>"] },
    { q:"Semantic HTML helps with…", a:"Accessibility & SEO", opts:["Only styling","Accessibility & SEO","DB speed","Hosting cost"] }
  ],
  "python": [
    { q:"Which tool installs packages?", a:"pip", opts:["npm","pip","gem","cargo"] },
    { q:"List comprehension returns a…", a:"List", opts:["Dict","Tuple","List","Set"] }
  ],
  "cybersecurity-basics": [
    { q:"What is phishing?", a:"Fraud to steal personal data", opts:["Fish farming","Code testing","Fraud to steal personal data","Social app"] },
    { q:"Strong password should include…", a:"Letters, numbers & symbols", opts:["Only letters","Simple name","1234","Letters, numbers & symbols"] }
  ],
  "digital-marketing": [
    { q:"What is SEO?", a:"Improving search visibility", opts:["Email campaigns","Improving search visibility","Selling offline","Banner ads only"] },
    { q:"Key metric for email marketing?", a:"Open rate", opts:["Scroll time","Pixel count","Open rate","Likes"] }
  ],
  "intro-html-css": [
    { q:"HTML stands for…", a:"HyperText Markup Language", opts:["Hyper Tool Language","HotMail Login","HighText Machine","HyperText Markup Language"] },
    { q:"What does CSS do?", a:"Styles HTML elements", opts:["Saves HTML","Styles HTML elements","Stores data","Optimizes speed"] }
  ],
  "mobile-app-design": [
    { q:"What’s wireframing?", a:"Sketching app layout before coding", opts:["Final coding","Sketching app layout before coding","Debugging","Testing bugs"] },
    { q:"UI means…", a:"User Interface", opts:["Upload Interface","User Interface","Universal Input","UI only"] }
  ],

  // Freelance
  "canva-design": [
    { q:"What is Canva mainly used for?", a:"Creating designs easily online", opts:["Coding","Spreadsheet math","Creating designs easily online","Gaming"] },
    { q:"Canva templates help with…", a:"Speed & consistency", opts:["Speed & consistency","Just colors","Offline marketing","3D animation"] }
  ],
  "freelance-rates": [
    { q:"What is value-based pricing?", a:"Price based on results/value", opts:["Fixed cost","Guessing","Price based on results/value","Free trial"] },
    { q:"A freelancer should charge based on…", a:"Skill, time, and value", opts:["Guess","Friend advice","Random pick","Skill, time, and value"] }
  ],
  "email-communication": [
    { q:"What’s a professional greeting?", a:"Hi [Name],", opts:["Wassup!","Yo dude","Hi [Name],","OMG!"] },
    { q:"Avoid this in formal email:", a:"Emojis & slang", opts:["Clear info","Subject lines","Emojis & slang","Signature"] }
  ],
  "customer-support": [
    { q:"Good first reply time target?", a:"Under 1 hour", opts:["24 hours","Under 1 hour","1 week","Only holidays"] },
    { q:"A good macro (template) should be…", a:"Personalized and actionable", opts:["Generic","All caps","Blaming","Personalized and actionable"] }
  ],
  "data-entry": [
    { q:"Key to accuracy in data entry?", a:"Validation & double-checking", opts:["Type fast","Guessing","Validation & double-checking","Ignore formats"] },
    { q:"Avoid transposition errors by…", a:"Chunking & reading aloud", opts:["Look away","Chunking & reading aloud","Speed typing","Ignore"] }
  ],
  "build-portfolio": [
    { q:"Best proof of skill?", a:"Case studies with outcomes", opts:["Only certificates","Stock images","Case studies with outcomes","Tool list"] },
    { q:"What’s a good CTA?", a:"Contact / Hire Me", opts:["More lorem","Just a logo","Contact / Hire Me","Read my diary"] }
  ],

  // Business
  "run-business": [
    { q:"First step before launching?", a:"Validate demand", opts:["Buy stock","Launch site","Validate demand","Get investors"] },
    { q:"Profitability metric?", a:"Gross margin", opts:["Likes","Time on site","Gross margin","App size"] }
  ],
  "budgeting-business": [
    { q:"What’s a budget?", a:"Spending plan", opts:["Invoice","Spending plan","Debt","Price list"] },
    { q:"Why track expenses?", a:"Control costs", opts:["Looks good","Confusion","Control costs","Revenue guess"] }
  ],
  "selling-instagram": [
    { q:"Best format for product posts?", a:"Short videos", opts:["Plain text","Long essays","Short videos","PDF flyers"] },
    { q:"What helps sales?", a:"Clear CTA + visuals", opts:["Dark photos","No price","Clear CTA + visuals","Silent posts"] }
  ],
  "social-media": [
    { q:"Best way to plan posts?", a:"Content calendar", opts:["Random posts","No schedule","Content calendar","Repost daily"] },
    { q:"Improve reach using…", a:"Short vertical video", opts:["Only text","Only photos","Short vertical video","Only ads"] }
  ],
  "digital-products": [
    { q:"Examples of digital products?", a:"Ebooks, courses, templates", opts:["Chairs","Toys","Ebooks, courses, templates","Snacks"] },
    { q:"Main advantage?", a:"Scalable and low-cost", opts:["Shipping cost","Perishable","Scalable and low-cost","Physical returns"] }
  ]
};


const VIDEO_QUERY = {
  // Tech
  "web-dev": "web development tutorial for beginners",
  "python": "python programming crash course",
  "cybersecurity-basics": "cybersecurity basics for beginners",
  "digital-marketing": "digital marketing full course",
  "intro-html-css": "html css tutorial for beginners",
  "mobile-app-design": "mobile app design ui ux tutorial",

  // Freelance
  "canva-design": "how to use canva for graphic design",
  "freelance-rates": "how to set freelance rates pricing",
  "email-communication": "email communication tips",
  "customer-support": "customer support training course",
  "data-entry": "data entry accuracy skills tutorial",
  "build-portfolio": "build an online portfolio case study",

  // Business
  "run-business": "how to run an online business",
  "budgeting-business": "budgeting for small business beginners",
  "selling-instagram": "how to sell on instagram tutorial",
  "social-media": "social media marketing strategy",
  "digital-products": "how to create and sell digital products"
};


async function getExtras(skillId) {
  const query = VIDEO_QUERY[skillId] || "";
  const videos = query ? await youtubeSearch({ q: query, maxResults: 12 }) : [];
  const quiz = QUIZ[skillId] || [];
  return { videos, quiz };
}


if (typeof window !== "undefined") {
  window.SkillAPI = { getExtras, getSkillSummary, getTermSummary };
}
