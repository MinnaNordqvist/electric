import { useEffect, useState } from "react";
import "./App.css"
import { DataTable } from "./DataTable";

export function App() {

  
  return(
    <>
    
    <div className="header">
    <h1>Electricity Dashboard</h1>
  
    </div>
    
    <DataTable />

    <section id="spacer"></section>
    <div className="footer">
      <p>Data source: Fingrid and porssisahko.net </p>
    </div>


  </>
  )
 
}