import pool from './connection.js'

let helloWorld = "Hello World";

console.log(helloWorld);

async function getNegprice() {
  const query = 'SELECT date::text AS date, hourlyprice FROM electricitydata WHERE hourlyprice < 0';
  try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function selectAll(){
    const query = 'SELECT * FROM electricitydata';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function selectSpecial(){
  const query = `
  WITH negative_hours AS (
    SELECT 
      DATE(starttime) AS streak_date,
      starttime,
      ROW_NUMBER() OVER (PARTITION BY DATE(starttime) ORDER BY starttime) AS rn
    FROM electricitydata
    WHERE hourlyprice < 0
  ),
  streaks AS (
    SELECT 
      streak_date,
      COUNT(*) AS streak_length
    FROM negative_hours
    GROUP BY streak_date, (starttime - (rn * INTERVAL '1 hour'))
  ),
  max_streaks AS (
    SELECT 
      streak_date,
      MAX(streak_length)::int AS longest_consecutive_negative_hours
    FROM streaks
    GROUP BY streak_date
  )
  SELECT 
    DATE(e.date)::text AS date, 
    SUM(e.productionamount) AS total_production, 
    SUM(e.consumptionamount) AS total_consumption, 
    ROUND(AVG(e.hourlyprice)::numeric, 2) AS average_price,
    COALESCE(MAX(ms.longest_consecutive_negative_hours), 0) AS longest_consecutive_negative_hours
  FROM electricitydata e
  LEFT JOIN max_streaks ms ON DATE(e.date) = ms.streak_date
  GROUP BY DATE(e.date)
  ORDER BY date ASC
`;
     try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }

}

async function getConsecutiveNeg(){
    const query = "WITH negative_hours AS (SELECT DATE(starttime) AS date, starttime, ROW_NUMBER() OVER (PARTITION BY DATE(starttime) ORDER BY starttime) AS rn FROM electricitydata WHERE hourlyprice < 0), streaks AS (SELECT date, COUNT(*) AS streak_length FROM negative_hours GROUP BY date, (starttime - (rn * INTERVAL '1 hour')))SELECT date::text AS date, MAX(streak_length) AS longest_consecutive_negative_hours FROM streaks GROUP BY date ORDER BY date DESC;"
     try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function getTotalDailyConsumption() {
    const query = "SELECT date::text AS date, SUM(consumptionamount) AS total_consumption FROM electricitydata GROUP BY DATE(date) ORDER BY date DESC"
     try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function getTotalDailyProduction(){
    const query = "SELECT date::text AS date, SUM(productionamount) AS total_production FROM electricitydata GROUP BY DATE(date) ORDER BY date DESC"
     try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

async function getDailyAveragePrice(){
    const query = "SELECT date::text AS date, ROUND(AVG(hourlyprice)::numeric, 2) AS average_price FROM electricitydata GROUP BY DATE(date) ORDER BY date DESC"
     try {
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}



//await getDailyAveragePrice()
//await getTotalDailyProduction()
//await getTotalDailyConsumption()
//await getConsecutiveNeg()
//await selectSpecial();
//await getNegprice();
//await selectAll();