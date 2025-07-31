// main.js

const data = {
  categories: [
    { id: 'tech',      name: 'Tech & Digital Skills' },
    { id: 'freelance', name: 'Freelancer Beginner Guide' },
    { id: 'business',  name: 'Start a Small Business' }
  ],
  skills: {
    tech: [
      { id: 'web-dev',        name: 'Web Development',                         plan: generatePlan('Web Development') },
      { id: 'python',         name: 'Python Programming',                      plan: generatePlan('Python Programming') },
      { id: 'graphic-design', name: 'Graphic Design',                          plan: generatePlan('Graphic Design') },
      { id: 'data-analysis',  name: 'Data Analysis',                           plan: generatePlan('Data Analysis') },
      { id: 'ai-chatgpt',     name: 'Intro to AI and ChatGPT Prompting',       plan: generatePlan('AI and ChatGPT Prompting') }
    ],
    freelance: [
      { id: 'customer-support',   name: 'Customer Support',                               plan: generatePlan('Customer Support') },
      { id: 'remote-tools',       name: 'Remote Work Tools',                              plan: generatePlan('Remote Work Tools') },
      { id: 'data-entry',         name: 'Data Entry & Accuracy Skills',                   plan: generatePlan('Data Entry & Accuracy Skills') },
      { id: 'portfolio-building', name: 'How to Build a Portfolio (for freelancers)',     plan: generatePlan('Portfolio Building') }
    ],
    business: [
      { id: 'online-business',   name: 'How to Run a Small Online Business',          plan: generatePlan('Running a Small Online Business') },
      { id: 'phone-photography', name: 'Photography with a Smartphone',               plan: generatePlan('Smartphone Photography') },
      { id: 'crypto-blockchain', name: 'Intro to Cryptocurrency & Blockchain',        plan: generatePlan('Cryptocurrency & Blockchain') },
      { id: 'social-media',      name: 'Social Media Management (for businesses)',    plan: generatePlan('Social Media Management') }
    ]
  }
};

function getCategories() {
  return data.categories;
}

function getSkillsByCategory(catId) {
  return data.skills[catId] || [];
}

function goToSkills(categoryId) {
  window.location.href = `skill.html?cat=${categoryId}`;
}

// Other code for loading skills and plan goes here...


function generatePlan(skillName) {
  const plan = [];
  for (let i = 1; i <= 30; i++) {
    plan.push(`Learn and practice a focused topic in ${skillName} (Day ${i})`);
  }
  return plan;
}
