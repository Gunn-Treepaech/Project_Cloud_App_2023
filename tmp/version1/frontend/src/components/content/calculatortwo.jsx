import Frompots2 from "./frompost2";
import React, { useState } from 'react';
function Calcul(){
    // สร้าง state เพื่อเก็บข้อมูลจากทั้งสองฟอร์ม
  const [formData1, setFormData1] = useState({});
  const handleForm2Submit = (data) => {
    console.log("888",data);
  };

  return (
    <div>
    

      
      <Frompots2 onSubmit={handleForm2Submit}  />

    
      <button onClick={sendApiRequest}>
        Submit and Send API Request
      </button>
    </div>
  );
};

export default Calcul