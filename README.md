# Electricity app
Solita Academy Exercise  

## About the app and the development process
This app gives the user access to an interactive data table and single-day graph view using the provided dataset.  

**AI disclosure**  
The app was developed with AI assistance. 
Generative AI (Google Gemini 3.6 Flash and 3.1 Pro) was a collaborative partner for technical troubleshooting and UI Styling/Layout design.
(I don't typically use this much AI but I was on a tight schedule.)  

### Architectural Decisions & Engineering Philosophy

* **Lightweight & Low Tech Debt:** Avoided bloated scaffolding toolkits like `create-vite` or CRA in favor of a clean, minimal setup (`npm install vite`). Keeping dependencies strictly to what is necessary ensures a transparent, maintainable build pipeline.
* **Zero UI Library Overhead:** Intentionally opted against heavy third-party UI packages for components like datepickers or data tables. Leveraged native browser elements (e.g., standard `<input type="date">`) and native HTML tables styled with lightweight CSS. This keeps bundle sizes minimal, prevents deep dependency vulnerabilities, and defers control rendering to the user's native browser engine.
* **Strict Backend Query Footprint:** Designed the backend around **only two core SQL endpoints** (one for the daily aggregated table, one for the detailed single-day view). Fetching from the backend is kept to an absolute minimum to reduce database load.
* **Client-Side Derived Metrics:** Analytics like the peak consumption-to-production hour ratio are calculated in memory on the frontend using data already fetched for the chart. Reusing existing payload state eliminates redundant HTTP requests and database round-trips.

## Features:
### Done:
✅ Daily Statistics table:
- Total electricity consumption per day
- Total electricity production per day
- Average electricity price per day
- Longest consecutive time in hours, when electricity price has been negative, per day

✅ Pagination  
✅ Ordering per column  
✅ Searching  
✅ Filtering  

✅ Single Day View:  
Select a date to see a graph visualization by the hour.  
**Consumption, production, price.**  
Find the hour with most electricity consumption compared to production, and the cheapest electricity hours for the day at one glance.  
✅ Running backend in Docker  


### Not done:
❌ Implement E2E tests  
❌ Mobile optimization  
❌ Dark theme  
❌ Make it pretty


## How to use:
### Prerequisites
- Docker Desktop (running)
- Node.js 
### Installation and Setup:
1. Clone the repository and set the working directory  

```
git clone https://github.com/MinnaNordqvist/electric
cd electric
```

2. Create .env file from the .env.example template  

```
cp .env.example .env   
```


3. Start Database and Docker  

```
docker compose up -d --build 
```

4. Verify containers are healthy  

```
docker compose ps
```

5. Install the npm packages and run the frontend  

```
npm install
npm start
```

Open browser window at `http://localhost:5173`  

(Backend at `http://localhost:3001`)

Stop the app with `Ctrl + C` and confirm with `y`





  