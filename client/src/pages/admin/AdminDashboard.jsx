import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [responses, setResponses] = useState({ user: '', product: '' });
  useEffect(() => {
    requestData();
  }, []);
  const requestData = async () => {
    try {
      const response = await Promise.all([
        axios.get('/api/user'),
        axios.get('/api/product'),
      ]);
      setResponses({ user: response[0].data, product: response[1].data });
    } catch (err) {
      console.error(`Error fetching data: `, err);
    }
  };
  return (
    <>
      <div className='server-status'>
        <h2>Product Collection</h2>

        <div className='server'>
          <p>Document Count: {responses.product.length}</p>
          <p>All properties: name, price, description, imageUrl</p>
        </div>
      </div>
      <div className='server-status'>
        <h2>User Collection</h2>

        <div className='server'>
          <p>Document Count: {responses.user.length}</p>
          <p>All properties: email, password</p>
        </div>
      </div>
    </>
  );
}
