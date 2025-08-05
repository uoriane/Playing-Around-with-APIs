# SkillSprint

SkillSprint is a web application designed to help users learn new skills in a few days through curated plans, videos, quizzes, and readings. The platform covers tech, freelance, and business skills, providing a guided experience for beginners.

## Table of Contents

- [Features](#features)
- [Running Locally](#running-locally)
- [Deployment to Web Servers](#deployment-to-web-servers)
- [APIs Used](#apis-used)
- [Challenges & Solutions](#challenges--solutions)
- [Credits](#credits)

---

## Features

- **Category & Skill Selection:** Choose from Tech, Freelance, or Business categories, then select a skill to start learning.
- **Daily Learning Plan:** Each skill comes with a multi-day plan including video lessons, quizzes, and reading summaries.
- **Progress Tracking:** Your progress is saved locally so you can continue where you left off.
- **Responsive Design:** Works well on desktop and mobile devices.

---

## Running Locally

1. **Clone the Repository**
   ```bash
   git clone <repo-url>
   cd SkillSPrint
   ```

2. **Install Dependencies**
   No dependencies required for static usage. All code is client-side JavaScript, HTML, and CSS.

3. **Start a Local Web Server**
   You can use [Nginx](https://nginx.org/) or any static server. For quick testing:
   ```bash
   # Python 3.x
   python -m http.server 8080
   # Or use Nginx (see Dockerfile)
   docker build -t skillsprint .
   docker run -p 8080:80 skillsprint
   ```

4. **Open in Browser**
   Visit [http://localhost:8080](http://localhost:8080) to use the app.

---

## Deployment to Provided Web Servers

### Using Docker Compose (Web Infrastructure Lab)

1. **Build and Start Containers**
   ```bash
   cd web_infra_lab
   docker compose up -d --build
   ```

2. **Access the Application**
   - `web-01`: [http://localhost:8080](http://localhost:8080)
   - `web-02`: [http://localhost:8081](http://localhost:8081)
   - Load balancer (`lb-01`): [http://localhost:8082](http://localhost:8082) (HAProxy alternates between web-01 and web-02)

3. **SSH Access**
   See [web_infra_lab/README.md](web_infra_lab/README.md) for SSH instructions.

---

## APIs Used

- **YouTube Data API v3**  
  Used for fetching educational videos for each skill.  
  [Official Docs](https://developers.google.com/youtube/v3/docs/search)

- **Wikipedia REST API**  
  Used for fetching reading summaries and fallback content.  
  [Official Docs](https://www.mediawiki.org/wiki/API:REST_API)

- **Dev.to Articles API**  
  Used for fetching relevant articles for daily reading.  
  [Official Docs](https://developers.forem.com/api)

---

## Challenges & Solutions

- **API Rate Limits:**  
  YouTube and Wikipedia APIs have rate limits. Implemented caching and fallback logic to minimize requests and handle failures gracefully.

- **CORS Issues:**  
  Some APIs restrict cross-origin requests. Used only APIs that support client-side requests or provided fallback content.

- **Dynamic Content Loading:**  
  Ensured smooth user experience by loading videos, quizzes, and readings asynchronously and providing loading indicators.

- **Container Networking:**  
  Configured Docker Compose with static IPs and custom bridge network for reliable inter-container communication.

---

## Credits

- **API Developers:**  
  - [YouTube Data API](https://developers.google.com/youtube/v3)  
  - [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API)  
  - [Dev.to API](https://developers.forem.com/api)

- **Libraries & Resources:**  
  - [Nginx](https://nginx.org/) (web server)
  - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
  - [HAProxy](http://www.haproxy.org/) (load balancer)

- **Icons, Fonts, and UI Inspiration:**  
  - [Google Fonts](https://fonts.google.com/)
  - [CSS Tricks](https://css-tricks.com/)

Here is a Live demo of my APP "https://youtu.be/s94saKzW7QU". Due to the short amount of time I did not show my load balancer but, I attached the screenshot in my files above.
---

Enjoy learning with SkillSprint!
