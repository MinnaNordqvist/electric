import { useEffect, useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



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

  const chartData = useMemo(() => {
    return dailyRows.map((row) => {
    let hourLabel = "00:00";

    if (row.starttime) {
      const d = new Date(row.starttime);
      
      // Local browser time:
      const hours = String(d.getHours()).padStart(2, "0");
      
      // Or UTC time:
      // const hours = String(d.getUTCHours()).padStart(2, "0");
      
      hourLabel = `${hours}:00`;
    }

   

    return {
      hour: hourLabel,
      productionkWh: Number(row.productionamount) * 1000 || 0,
      productionMWh: Number(row.productionamount) || 0,
      consumption: Number(row.consumptionamount) || 0,
      price: Number(row.hourlyprice) || 0,
    };
  });
}, [dailyRows]);

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

           <p className="record-count">
        {selectedDate
          ? `Daily Overview for ${selectedDate} (${chartData.length} hours plotted)`
          : "Select a date above to display the daily chart."}
      </p>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading daily chart...
        </div>
      ) : chartData.length > 0 ? (
        <div style={{ width: "100%", height: 450, marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
             <XAxis 
                dataKey="hour" 
                stroke="#64748b" 
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd" // Automatically skips overlapping labels on narrow screens
                minTickGap={10}
            />
              
             {/* Left Y-Axis: Unified Energy Scale in kWh */}
             <YAxis
              yAxisId="left"
              stroke="#2563eb"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => `${(val / 1000)}`} 
              label={{
                    value: "Energy Volume (kWh)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#2563eb", fontSize: 12 },
               }}
              />
              
              {/* Right Y-Axis: Price */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ef4444"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Price (snt/kWh)",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#ef4444", fontSize: 12 },
                }}
              />

            <Tooltip
                formatter={(value: any, name: any, item: any) => {
                    if (name === "Production") {
                        const mwh = item.payload.productionMWh;
                        return [`${Number(value).toLocaleString()} kWh (${mwh} MWh/h)`, name];
                    }
                    if (name === "Consumption") {
                         return [`${Number(value).toLocaleString()} kWh`, name];
                    }
                    if (name === "Price") {
                        return [`${value} snt/kWh`, name];
                    }
                    return [value, name];
                }}
                contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
            />
              <Legend wrapperStyle={{ paddingBottom: "10px" }} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="productionkWh"
                name="Production"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="consumption"
                name="Consumption (kWh)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                name="Price (snt/kWh)"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          No data available for this date.
        </div>
      )}
    </div>
  );
}
