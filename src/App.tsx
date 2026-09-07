
import "./App.css"
import { Dashboard } from "./Dashboard";

export function App() {

  
  return(
    <>
    
    <div className="header">
    <h1>Electricity Dashboard</h1>
    
  
    </div>
    
   <Dashboard />

    <section id="spacer"></section>
    <div className="footer">
      <p>Data source: Fingrid and porssisahko.net </p>
    </div>


  </>
  )
 
}