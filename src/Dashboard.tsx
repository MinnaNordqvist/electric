import { useState } from "react";
import { DataTable } from "./DataTable";
import { DailyView } from "./DailyView";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <div className="dashboard-layout">
      {/* Date picker lives in DataTable, updates parent state */}
      <DataTable 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      {/* DailyView receives selectedDate to render the chart */}
      <DailyView selectedDate={selectedDate} />
    </div>
  );
}