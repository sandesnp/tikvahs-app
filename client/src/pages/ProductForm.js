// ProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('/api/image/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.filename; // Assuming the API returns the filename
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      console.log(1, product);
      const filename = await uploadImage();
      setProduct({ ...product, imageUrl: filename });
    }
    try {
      await axios.post('/api/product', product);
      window.alert('uploaded');

      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='name'
        placeholder='Name'
        value={product.name}
        onChange={handleChange}
      />
      <textarea
        name='description'
        placeholder='Description'
        value={product.description}
        onChange={handleChange}
      />
      <input
        type='number'
        name='price'
        placeholder='Price'
        value={product.price}
        onChange={handleChange}
      />
      <input type='file' name='image' onChange={handleFileChange} />
      <button type='submit'>Submit</button>
    </form>
  );
}
