import { useState } from "react";
import { DataTable } from "./DataTable";
import { DailyView } from "./DailyView";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <div className="dashboard-layout">
     
      <DataTable 
        selectedDate={selectedDate} 
        onDateChange={setSelectedDate} 
      />

      
      <DailyView selectedDate={selectedDate} />
    </div>
  );
}