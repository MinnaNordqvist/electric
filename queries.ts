import { timeStamp } from 'console';
import pool from './connection.js'




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
    //console.log(result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }

}


export async function searchDay(date: string) {
   let searchTerm = date.toString();
    
   const query = `SELECT date::text AS date, starttime, productionamount, consumptionamount, hourlyprice FROM electricitydata WHERE date = '${searchTerm}'` 
     try {
      const result = await pool.query(query);
     // console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
}







