
import "./App.css"
import { DataTable } from "./DataTable";

export function App() {

  
  return(
    <>
    
    <div className="header">
    <h1>Electricity Dashboard</h1>
    <p>31.12.2020 - 1.10.2024</p><br/>
  
    </div>
    
    <DataTable />

    <section id="spacer"></section>
    <div className="footer">
      <p>Data source: Fingrid and porssisahko.net </p>
    </div>


  </>
  )
 
}