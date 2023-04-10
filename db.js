import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Example() {
  const [data, setData] = useState

  useEffect(()=> {
    axios.get('https://api.api-ninjas.com/v1/dogs?name=pug', 
    {
      headers: {
        'X-Api-Key': 'dGvRn6HL3d6O9+vlFGGVew==PnDY1BrdHYQ22BAj'
      }
    }).then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [])

  

  return (
    <div>
      {data.map(item => (
        <div key='hey'>
          <h2>{item.name}</h2>
          <img src={item.image_link}></img>
        </div>
      ))}
    </div>
  );
}