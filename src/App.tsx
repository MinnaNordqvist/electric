import { useEffect, useState } from "react";
import "./App.css"


export function App() {
  const [data, setData] = useState<any[]>([]);  
  useEffect(() => {
     fetch('/api')
    .then((res) => res.json())
    .then((resData) => {
        console.log('Fetched:', resData);
        setData([...resData]); 
      });
    }, []);
  
  return(
    <>
    
    <div className="header">
    <h1>Electricity Dashboard</h1>
    <p>Data rows loaded: {data.length}</p>
    </div>
    <section id="spacer"></section>
    <div className="footer">
      <p>Data source: Fingrid and porssisahko.net </p>
    </div>


  </>
  )
 
}