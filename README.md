# Electricity app
Solita Academy Exercise

## How to use:
### Prerequisites
- Docker Desktop (running)
- Node.js 
### Installation and Setup:
1. Clone the repository  

```
git clone https://github.com/MinnaNordqvist/electric
cd electric
```

2. Create .env file from the template  

```
cp .env.example .env      # On Mac/Linux
copy .env.example .env    # On Windows PowerShell
```


3. Start Database and Docker  

```
docker compose up -d --build 
```

4. Verify containers are healthy  

```
docker compose ps
```

5. Run the frontend  

```
npm install
npm start
```

Open browser window at `http://localhost:5173`  

Backend at `http://localhost:3001`



## Done:
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
Select a date to see a graph visualisation by the hour.  
**Consumption, production, price.**  
Find the hour with most electricity consumption compared to production, and the cheapest electricity hours for the day at one glance.  
✅ Running backend in Docker  


## Not done:
❌ Mobile optimization  
❌ Dark theme  
❌ Make it pretty


  