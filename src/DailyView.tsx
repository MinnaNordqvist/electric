import { useEffect, useState } from "react"

interface Daily {
    date: string,
    starttime: string,
    productionamount: number,
    consumptionamount: number,
    hourlyprice: number
}



export function DailyView(){
    const [data, setData] = useState<any[]>([]);  
    const [selectedDate, setSelectedDate] = useState<string>("2024-09-29");
    
    
   if (!selectedDate) return;
   useEffect(() => {
        fetch(`/api/day?date=${selectedDate}`)
            .then((res) => res.json())
            .then((resData) => {
                setData([...resData]);
            })
            .catch((err) => console.error("Error fetching daily stats:", err));
    }, [selectedDate]);


    return (
        <div className="table-wrapper">
            <div className="filter-bar" style={{ marginBottom: "16px" }}>
                <label htmlFor="daily-date-picker">Select Date: </label>
                <input
                    id="daily-date-picker"
                    type="date"
                    className="date-picker-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <p className="record-count">Daily view for {selectedDate} ({data.length} records found)</p>

            <table className="dataTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>Production (MWh/h)</th>
                        <th>Consumption (kWh)</th>
                        <th>Hourly Price (snt/kWh)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={`${row.date}-${row.starttime}`}>
                            <td>{row.date}</td>
                            <td>{row.starttime}</td>
                            <td>{Number(row.productionamount).toLocaleString()}</td>
                            <td>{Number(row.consumptionamount).toLocaleString()}</td>
                            <td>{Number(row.hourlyprice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}