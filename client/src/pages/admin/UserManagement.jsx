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

export default function User() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    email: '',
    password: '',
    id: '',
  });

  useEffect(() => {
    axios.get(`/api/user`).then((response) => {
      setUsers(response.data);
    });
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleUpdateClick = (user) => {
    setCurrentUser({ ...user, password: '' }); // Clear password for security
    toggleModal();
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`/api/user/${currentUser._id}`, {
        email: currentUser.email,
        password: currentUser.password,
      });
      setUsers(
        users.map((user) =>
          user._id === currentUser._id
            ? { ...user, email: currentUser.email }
            : user
        )
      );
      toggleModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`/api/user/${id}`);
    console.log(response.data);
    setUsers(users.filter((user) => user._id !== id));
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <th scope='row'>{index + 1}</th>
              <td>{user.email}</td>
              <td>
                <Button onClick={() => handleUpdateClick(user)}>Update</Button>
              </td>
              <td>
                <Button onClick={() => handleDelete(user._id)} color='danger'>
                  Delete User
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update User</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='email'>Email</Label>
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              value={currentUser.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='password'>Password</Label>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='New Password'
              value={currentUser.password}
              onChange={handleInputChange}
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
    </div>
  );
}
