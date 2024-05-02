import React, { useState, useContext, useEffect } from 'react'
import { Button, Row, Table, Card, Container, } from 'react-bootstrap';
import {CircleImage} from '../../Layout/Image/styledImage';
import { GlobalState } from '../../GlobalState';
import axios from "axios";
import Loading from '../Loading/Loading';
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom';

const UploadList = () =>  {
  const state = useContext(GlobalState)
  const [products] = state.productsAPI.products
  const [token] = state.token
  const [uploads, setUploads] = useState([])
  const [active, setActive] = useState(false)
  const [uploadView, setUploadView] = useState(false)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(false)
  // const [combinedList, setCombinedList] = useState([])
  const [isAdmin] = state.userAPI.isAdmin
  const history = useHistory()

  useEffect(async () => {
    const getAllUploads = async () => {
        const res = await axios.post(`/api/allImages`)
        setUploads(res.data.result.resources)
        console.log(res.data, 'res.data')
        console.log(products, 'products')
        console.log(uploads, 'uploads')
        // console.log(combinedList, 'combinedList')
      }
    getAllUploads()
    // checkIfProduct()
}, [active])

const deleteUpload = async (id) => {
  try {
    const destroyImg = axios.post('/api/destory', { public_id: id }, {
      headers: { Authorization: token }
    })
      await destroyImg
      setActive(!active)
  } catch (err) {
      alert(err.response.data.msg)
  }
}

const addUpload = async e => {
  e.preventDefault()
  try {
      if (!isAdmin) return alert("You're not an admin")
      const file = e.target.files[0]
      if (!file) return alert("File not exist")
      if (file.size > 1024 * 1024) return alert("Size too large")
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert("File format is incorrect")

      const formData = new FormData()
      formData.append('file', file)
      setLoading(true)

      const res = await axios.post('/api/upload', formData, {
          headers: { 'content-type': 'multipart/form-data', Authorization: token }
      })
      setActive(true)
      setLoading(false)
      setImages({
        url: res.data.result.secure_url,
        id: res.data.result.public_id
      })
      setUploadView(false)
      history.push('/uploads')


  } catch (err) {
      alert(err.response.data.msg)
  }
}

// const checkIfProduct = async () => {
//   const array = []
//   console.log(products.length)
//   console.log(uploads.length)
//   for(let i = 0; i < products.length; i++) {
//     uploads.map(upload => {
//       if (upload.public_id !== products[i].images.id) {
//         array.push(upload)
//         console.log(array)
//       }
//     })
//   }
//   await setCombinedList(array)
//   setActive(true)
//   console.log(array, 'array')
// }

  const timeFormater = (date) => {
    return moment.utc(date).format('MMMM Do YYYY')
  }

  const styleUpload = {
    display: images ? "block" : "none"
  }

  const adduploadView = () => {
    return (
      <>
        <Container style={{minHeight: '60vh', display: 'flex', alignItems: 'center'}}>
            <Row>
            <h3>Add Photo</h3>
            </Row>
            <Row>
              <Card.Body>
                <div className="create_product">
                      <div className="upload">
                          <input type="file" name="file" id="file_up"
                              onChange={addUpload} />
                          {
                              loading ?
                                  <div id="file_img"><Loading /></div>
                                  :
                                  <div id="file_img" style={styleUpload}>
                                      <img src={images ? images.url : ''} alt="" />
                                      <span onClick={deleteUpload}>X</span>
                                  </div>
                          }

                      </div>
                  </div>
                  <Button color="primary" onClick={() => setUploadView(false)}>Cancel</Button>
              </Card.Body>
            </Row>
          </Container>
      </>
  )}

  const productList = (item) => {
    return (
      <>
        <tr key = {item._id}>
          <td> <CircleImage Secondary src={item.images.url} alt={item._id} /> </td>
          <td> {item._id} </td>
          <td> {item.title} </td>
          <td> {"N/A"} </td>
          <td>
              {/* <Button onClick={ ()=> this.edituser(employee.id) } color="primary">Update</Button> */}
            <Button style={{marginLeft: "1em"}} onClick={ ()=> deleteUpload(item.images.id) } variant="danger">Delete</Button>
          </td>
        </tr>
      </>
    )}
  const UploadList = (item) => {
    return (
        <>
          <tr key = {item.asset_id}>
            <td> <CircleImage Secondary src={item.secure_url} alt={item.asset_id} /> </td>
            <td> {item.public_id} </td>
            <td> {item.folder} </td>
            <td> {timeFormater(item.created_at)} </td>
            <td>
                {/* <Button onClick={ ()=> this.edituser(employee.id) } color="primary">Update</Button> */}
              <Button style={{marginLeft: "1em"}} onClick={ ()=> deleteUpload(item.public_id) } variant="danger">Delete</Button>
            </td>
          </tr>
        </>
    )}

    return (
            <>
              {uploadView && adduploadView()}
              {!uploadView &&
              <>
              <Container style={{minHeight: '80vh'}}>
                <h2 className="text-center" style={{padding:"1em"}}>Upload Management</h2>
                <div style={{textAlign:'left'}}>
                  <Button color="primary" onClick={() => setUploadView(true)}>Add Upload</Button>
                </div>
                  <Row>
                      <Table striped bordered responsive hover>
                          <thead>
                              <tr>
                                  <th>Photo</th>
                                  <th>Product Id</th>
                                  <th>Product Name / Folder Location</th>
                                  <th>Created</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {
                                products.map(
                                  item =>
                                    productList(item)
                                    )
                                  }
                              {
                              uploads.map(
                                item =>
                                  UploadList(item)
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

    export default UploadList;

