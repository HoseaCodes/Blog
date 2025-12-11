import React, { useState, useContext, useEffect } from 'react'
import { Button, Row, Table, Container } from 'react-bootstrap';
import {CircleImage} from '../../Layout/Image/styledImage';
import { GlobalState } from '../../GlobalState';
import axios from "axios";
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom';

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
  const history = useHistory()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://3ynqb3302m.execute-api.us-east-1.amazonaws.com';

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/auth/admin/${user._id}`,
        { headers: { Authorization: user.accesstoken } }
        )
        console.log(res.data.location, 'res')
        setUsers(res.data.users)
        console.log(users, 'users from userslist')
        console.log(user, 'user from userlist pulled from state')
    }
    getAllUsers()
}, [user, active])

const deleteUser = async (id) => {
  try {
      const deleteUser = axios.delete(`/api/user/${id}`)
      await deleteUser
      setActive(!active)
      history.push('/users')
  } catch (err) {
      alert(err.response.data.msg)
  }
}

const addUser = async () => {
  try {
      const addUser = axios.post(`${API_BASE_URL}/register`, { ...createdUser })
      await addUser
      setUserView(false)
      history.push('/users')
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
        <div className="create_product" style={{minHeight: '60vh', display: 'flex', alignItems: 'center'}}>
          <Row>
            <h3>Add User</h3>
          </Row>
            <form
                onSubmit={addUser}
            >
                <div className="row">
                    <label htmlFor="Name">Name</label>
                    <input type="text" name="name" id="name"
                        required  value={name}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="Role">Role</label>
                    <input type="number" name="role" id="role"
                        required value={role}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="email">Email</label>
                    <textarea type="email" name="email" id="email"
                        required value={email}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <div className="row">
                    <label htmlFor="password">Password</label>
                    <textarea type="text" name="password" id="password"
                        required value={password}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <button type="submit">Save</button>
                <div  onClick={() => setUserView(false)}>Cancel</div>
            </form>
        </div>
      </>
  )}

    return (
            <>
              {userView && addUserView()}
              {!userView &&
              <>
              <Container style={{height: '80vh'}}>
                <h2 className="text-center" style={{padding:"1em"}}>User Management</h2>
                <div style={{textAlign:'left'}}>
                  <Button color="primary" onClick={() => setUserView(true)}>Add User</Button>
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
              </>
              }
            </>
        )
    }

    export default UsersList;

