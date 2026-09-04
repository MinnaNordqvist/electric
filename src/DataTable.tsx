import { useEffect, useState } from "react";

interface Electric {
    date: string,
    total_production: number,
    total_consumption: number,
    average_price: number,
    longest_consecutive_negative_hours: number
}


export function DataTable(){
const [data, setData] = useState<any[]>([]);  
  useEffect(() => {
     fetch('/api')
    .then((res) => res.json())
    .then((resData) => {
        setData([...resData]); 
      });
    }, []);



    return(
        <>
        <div className="table-wrapper">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Production (MWh/h)</th>
              <th>Consumption (kWh)</th>
              <th>Avg Price (snt/kWh)</th>
              <th>Longest Negative Streak (h)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
             <tr key={row.date}>
             <td>{row.date}</td>
             <td>{Number(row.total_production).toLocaleString()}</td>
             <td>{Number(row.total_consumption).toLocaleString()}</td>
             <td>{Number(row.average_price)}</td>
             <td>{Number(row.longest_consecutive_negative_hours)}</td>
             </tr>   
            ))}
          </tbody>
        </table>
        </div>
        </>
    )
}