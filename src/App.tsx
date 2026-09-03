import { useEffect, useState } from "react";


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
    <div>
     <h1>Electricity Dashboard</h1>
     <p>Data rows loaded: {data.length}</p>
    </div>
  )
 
}