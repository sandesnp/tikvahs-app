import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  FormGroup,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import axios from 'axios';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    orderStatus: false,
    paymentStatus: false,
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    _id: '',
  });

  useEffect(() => {
    axios
      .get('/api/order')
      .then((response) => {
        setOrders(
          response.data.map((order) => ({
            ...order,
            email: order?.user?.email,
          }))
        );
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleUpdateClick = (order) => {
    setCurrentOrder({ ...order });
    toggleModal();
  };

  const handleInputChange = (e) => {
    if (e.target.name.startsWith('shippingAddress')) {
      setCurrentOrder({
        ...currentOrder,
        shippingAddress: {
          ...currentOrder.shippingAddress,
          [e.target.name.split('.')[1]]: e.target.value,
        },
      });
    } else {
      setCurrentOrder({ ...currentOrder, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `/api/order/${currentOrder._id}`,
        currentOrder
      );
      console.log(response.data);
      setOrders(
        orders.map((order) =>
          order._id === currentOrder._id ? { ...order, ...currentOrder } : order
        )
      );
      toggleModal();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/order/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Shipping Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <th scope='row'>{index + 1}</th>
              <td>{order.email} </td>
              <td>{order.orderStatus ? 'Completed' : 'Pending'}</td>
              <td>{order.paymentStatus ? 'Paid' : 'Unpaid'}</td>
              <td>
                {`${order.shippingAddress.line1}, ${order.shippingAddress.line2}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postal_code}, ${order.shippingAddress.country}`}
              </td>
              <td>
                <Button onClick={() => handleUpdateClick(order)}>Update</Button>{' '}
                <Button color='danger' onClick={() => handleDelete(order._id)}>
                  Delete
                </Button>{' '}
                {/* Delete Button */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update Order</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Email</Label>
            <Input type='email' value={currentOrder.email || ''} readOnly /> =
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type='checkbox'
                name='orderStatus'
                checked={currentOrder.orderStatus}
                onChange={(e) =>
                  setCurrentOrder({
                    ...currentOrder,
                    orderStatus: e.target.checked,
                  })
                }
              />{' '}
              Order Completed
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type='checkbox'
                name='paymentStatus'
                checked={currentOrder.paymentStatus}
                onChange={(e) =>
                  setCurrentOrder({
                    ...currentOrder,
                    paymentStatus: e.target.checked,
                  })
                }
              />{' '}
              Payment Completed
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for='shippingAddress.line1'>Address Line 1</Label>
            <Input
              type='text'
              name='shippingAddress.line1'
              id='shippingAddress.line1'
              placeholder='Address Line 1'
              value={currentOrder.shippingAddress.line1}
              onChange={handleInputChange}
            />
          </FormGroup>
          {/* Similar input fields for line2, city, state, postal_code, country */}
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
    </div>
  );
}
