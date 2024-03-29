import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange =  (event) => {    
    const file = event.target.files[0]  
    setSelectedFile(file)


 return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result.split(',')[1]); 
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });  
  };


   

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
