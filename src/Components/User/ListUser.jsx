import React, { useState, useContext, useEffect } from 'react'
import { Button, Row, Table, Card, Col, Form,
   Container, } from 'react-bootstrap';
import {CircleImage} from '../../Layout/Image/styledImage';
import { GlobalState } from '../../GlobalState';
import axios from "axios";
import moment from 'moment-timezone'
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

const initialState = {
  name: "",
  email: "",
  password: "",
  role: 0
}
const UsersList = () =>  {
  const state = useContext(GlobalState)
  const [user] = state.userAPI.user
  const [users, setUsers] = useState([])
  const [active, setActive] = useState(false)
  const [userView, setUserView] = useState(false)
	const [createdUser, setCreatedUser] = useState(initialState);

  useEffect(() => {
    const getAllUsers = async () => {
        const res = await axios.get(`/api/user/${user._id}`)
        console.log(res)
        console.log(users)
        setUsers(res.data.users)
    }
    getAllUsers()
}, [user, active])

const deleteUser = async (id) => {
  try {
      const deleteUser = axios.delete(`/api/user/${id}`)
      await deleteUser
      setActive(!active)
  } catch (err) {
      alert(err.response.data.msg)
  }
}

const addUser = async () => {
  try {
      const addUser = axios.post(`/api/user/register`, { ...createdUser })
      await addUser
      setUserView(false)
  } catch (err) {
      alert(err.response.data.msg)
  }
}

  const timeFormater = (date) => {
    return moment.utc(date).format('MMMM Do')
  }

  const joinedDate = (date) => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const createdDateYear = moment.utc(date).format('YYYY')
    const createdDateMonth = moment.utc(date).format('M')
    const returnYear = year - createdDateYear
    const returnMonth = createdDateMonth - month
    return `${returnMonth} Mon. ${returnYear} Yr.`
  }

  const handleChangeInput = e => {
    const { name, value } = e.target
    console.log(name)
    console.log(value)
    setCreatedUser({ ...createdUser, [name]: value })
}

const {name, email, password, role} = createdUser;

  const addUserView = () => {
    return (
      <>
        <NavBar/>
        <Container style={{height: '60vh', display: 'flex', alignItems: 'center'}}>
            <Row>
            <h3>Add User</h3>
            </Row>
            <Row>
              <Card.Body>
                <Form>
                  <Row className="mb-3">
                    <Form.Group as={Col} >
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={name} onChange={handleChangeInput} placeholder="User name..." />
                    </Form.Group>
                    <Form.Group as={Col} >
                      <Form.Label>Role</Form.Label>
                      <Form.Control name="role" type="number" className='form-control' value={role} onChange={handleChangeInput}/>
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3"  controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                      <Form.Control name="email" type="email" value={email} onChange={handleChangeInput} placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3"  controlId="formGridPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control name="password" value={password} onChange={handleChangeInput} type="password" placeholder="Password" />
                  </Form.Group>
                  <Button color="success" onClick={addUser}>Save</Button>
                  <Button color="primary" onClick={() => setUserView(false)}>Cancel</Button>
                </Form>
              </Card.Body>
            </Row>
          </Container>
        <Footer/>
      </>
  )}

    return (
            <>
              {userView && addUserView()}
              {!userView &&
              <>
              <NavBar/>
              <Container style={{height: '80vh'}}>
                <h2 className="text-center" style={{padding:"1em"}}>User Management</h2>
                <div style={{textAlign:'left'}}>
                  <Button color="primary" onClick={() => setUserView(true)}>Add Employee</Button>
                </div>
                  <Row>
                      <Table striped bordered responsive hover>
                          <thead>
                              <tr>
                                  <th>Avatar</th>
                                  <th>First Name</th>
                                  <th>Last Name</th>
                                  <th>Email ID</th>
                                  <th>Account Type</th>
                                  <th>Anniversary</th>
                                  <th>Member Since</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {
                                users.map(
                                  user =>
                                  <tr key = {user._id}>
                                          <td> <CircleImage Secondary src={user.avatar} alt={user._id} /> </td>
                                          <td> {user.name.split(' ')[0]} </td>
                                          <td> {user.name.split(' ')[1] || "N/A"} </td>
                                          <td> {user.email} </td>
                                          <td> {user.role === 1 ? "Admin" : "Basic"} </td>
                                          <td> {timeFormater(user.createdAt)} </td>
                                          <td> {joinedDate(user.createdAt)} </td>
                                          <td>
                                              {/* <Button onClick={ ()=> this.edituser(employee.id) } color="primary">Update</Button> */}
                                            <Button style={{marginLeft: "1em"}} onClick={ ()=> deleteUser(user._id) } variant="danger">Delete</Button>
                                          </td>
                                      </tr>
                                  )
                                }
                          </tbody>
                      </Table>
                  </Row>
                </Container>
                <Footer/>
              </>
              }
            </>
        )
    }

    export default UsersList;

