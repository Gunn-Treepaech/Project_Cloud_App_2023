import Content from "./components/content/content"
import Calculator from "./components/content/calculator"
import Navbar from "./components/navbar/navbar"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import DataContext from "./data/DataContext"
import Calcul from "./components/content/calculatortwo"
import Test from "./components/content/test"
function App() {
  const [posts, setPosts] = useState([]);
  //
   useEffect(() => {
      fetch('/api/showdatadb')
         .then((response) => response.json())
         .then((data) => {
            setPosts(data);
         })
         
   }, []);
   console.log("ter",posts);
  return (
  
  <html>
  <DataContext.Provider value={posts} key={uuidv4()} >
    
  <div className="snap-mandatory overflow-auto snap-y ">
  <Content />
  <Calculator value={posts} key={uuidv4()} />
  </div>
  
 
  </DataContext.Provider>
  </html>
  );

}

export default App
