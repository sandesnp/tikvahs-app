import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import axios from 'axios';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    id: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const [newProductModal, setNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [newProductFile, setNewProductFile] = useState(null);

  useEffect(() => {
    axios.get(`/api/product`).then((response) => {
      setProducts(response.data);
    });
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleUpdateClick = (product) => {
    setCurrentProduct({ ...product });
    setSelectedFile(null);
    toggleModal();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await axios.post('/api/image/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      return response.data.filename; // Assuming the API returns the filename
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUpdate = async () => {
    let imageUrl = currentProduct.imageUrl;
    if (selectedFile) {
      const filename = await uploadImage(selectedFile);
      if (filename) {
        imageUrl = filename;
      } else {
        return; // If image upload failed, stop the update process
      }
    }

    try {
      const updatedProduct = { ...currentProduct, imageUrl };
      console.log(updatedProduct);
      const response = await axios.patch(
        `/api/product/${currentProduct._id}`,
        updatedProduct
      );
      console.log(response.data);
      setProducts(
        products.map((prod) =>
          prod._id === currentProduct._id
            ? { ...prod, ...updatedProduct }
            : prod
        )
      );
      toggleModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`/api/product/${id}`);
    console.log(response.data);
    setProducts(products.filter((product) => product._id !== id));
  };

  const toggleNewProductModal = () => {
    setNewProductModal(!newProductModal);
  };

  const handleNewProductFileChange = (event) => {
    setNewProductFile(event.target.files[0]);
  };

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleCreateProduct = async () => {
    let imageUrl = newProduct.imageUrl;
    if (newProductFile) {
      const filename = await uploadImage(newProductFile);
      if (filename) {
        imageUrl = filename;
      } else {
        return; // If image upload failed, stop the creation process
      }
    }

    try {
      const createdProduct = { ...newProduct, imageUrl };

      const response = await axios.post(`/api/product`, createdProduct);
      console.log(response.data);
      setProducts([...products, response.data]);
      toggleNewProductModal();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <th scope='row'>{index + 1}</th>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <img
                  src={`/api/image/${product.imageUrl}`}
                  alt={product.name}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>
                <Button onClick={() => handleUpdateClick(product)}>
                  Update
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => handleDelete(product._id)}
                  color='danger'
                >
                  Delete Product
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button color='primary' onClick={toggleNewProductModal}>
        Create New Product
      </Button>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update Product</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='name'>Name</Label>
            <Input
              type='text'
              name='name'
              id='name'
              placeholder='Name'
              value={currentProduct.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='description'>Description</Label>
            <Input
              type='text'
              name='description'
              id='description'
              placeholder='Description'
              value={currentProduct.description}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='price'>Price</Label>
            <Input
              type='text'
              name='price'
              id='price'
              placeholder='Price'
              value={currentProduct.price}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='image'>Product Image</Label>
            <Input
              type='file'
              name='image'
              id='image'
              accept='.jpg, .jpeg, .png'
              onChange={handleFileChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleUpdate}>
            Update
          </Button>{' '}
          <Button color='secondary' onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={newProductModal} toggle={toggleNewProductModal}>
        <ModalHeader toggle={toggleNewProductModal}>
          Create New Product
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='name'>Name</Label>
            <Input
              type='text'
              name='name'
              id='name'
              placeholder='Name'
              value={newProduct.name}
              onChange={handleNewProductChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='description'>Description</Label>
            <Input
              type='text'
              name='description'
              id='description'
              placeholder='Description'
              value={newProduct.description}
              onChange={handleNewProductChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='price'>Price</Label>
            <Input
              type='text'
              name='price'
              id='price'
              placeholder='Price'
              value={newProduct.price}
              onChange={handleNewProductChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='image'>Product Image</Label>
            <Input
              type='file'
              name='image'
              id='image'
              accept='.jpg, .jpeg, .png'
              onChange={handleNewProductFileChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleCreateProduct}>
            Create
          </Button>{' '}
          <Button color='secondary' onClick={toggleNewProductModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
