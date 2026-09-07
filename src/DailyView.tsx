import { useEffect, useState, } from "react"

interface Daily {
    date: string,
    starttime: string,
    productionamount: number,
    consumptionamount: number,
    hourlyprice: number
}



export function DailyView(){
    const [dailyRows, setDailyRows] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [dateBounds, setDateBounds] = useState<{ min: string; max: string }>({
        min: "",
        max: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Fetch available min/max date bounds once on mount
  useEffect(() => {
    fetch("/api/range")
      .then((res) => res.json())
      .then((bounds) => {
        if (bounds.min_date && bounds.max_date) {
          setDateBounds({
            min: bounds.min_date,
            max: bounds.max_date,
          });
        }
      })
      .catch((err) => console.error("Error fetching date range:", err));
    }, []);
     

    // 2. Fetch daily records only when a valid date is explicitly selected
    useEffect(() => {
        if (!selectedDate) {
            setDailyRows([]);
            return;
        }

        setIsLoading(true);
        fetch(`/api/day?date=${selectedDate}`)
        .then((res) => res.json())
        .then((resData) => {
            setDailyRows(resData);
            setIsLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching daily stats:", err);
            setIsLoading(false);
        });
    }, [selectedDate]);

   

    return (
        <div className="table-wrapper">
            <div className="filter-bar" style={{ marginBottom: "16px" }}>
               <div className="filter-bar">
                <label htmlFor="date-filter">Select Date:</label>
                <input
                    id="date-filter"
                    type="date"
                    className="date-picker-input"
                    min={dateBounds.min}
                    max={dateBounds.max}
                    value={selectedDate}
                    onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || val.length === 10) {
                        setSelectedDate(val);
              
                    }
                    }}
                />
                 {selectedDate && (
                    <button
                        className="btn-clear-filter"
                         onClick={() => {
                        setSelectedDate("");
             
                         }}
                    >
                    Clear Date
                    </button>
                )}
      </div>
       </div>

            <p className="record-count">Daily view for {selectedDate} ({dailyRows.length} records found)</p>

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
                    {isLoading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                Loading hourly data...
              </td>
            </tr>
          ) : dailyRows.length > 0 ? (
            dailyRows.map((row) => (
              <tr key={`${row.date}-${row.starttime}`}>
                <td>{row.date}</td>
                <td>{row.starttime}</td>
                <td>{Number(row.productionamount).toLocaleString()}</td>
                <td>{Number(row.consumptionamount).toLocaleString()}</td>
                <td>{Number(row.hourlyprice)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                {selectedDate
                  ? "No records found for this date."
                  : "No date selected."}
              </td>
            </tr>
          )}
                </tbody>
            </table>
       
        </div>
    )
}