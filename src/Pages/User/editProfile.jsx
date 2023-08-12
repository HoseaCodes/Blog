import React, { useContext, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import Loading from '../../Loading';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

// const initialState = {
//     name: '',
//     email: '',
//     title: '',
//     phone: '',
//     location: '',
//     avatar: {},
//     work: [],
//     education: [],
//     skills: [],
//     socialMedia: [],
//     websites: []
// }

function Editprofile() {
    const state = useContext(GlobalState)
    const [profile, setProfile] = useState()
    const [avatar, setAvatar] = useState('')
    // const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const [user] = state.userAPI.user

    const styleUpload = {
        display: avatar ? "block" : "none"
    }
console.log(user)
console.log(avatar)
    const handleUpload = async e => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
            if (!file) return alert("File not exist")
            if (file.size > 1024 * 1024) return alert("Size too large")
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert("File format is incorrect")

            const formData = new FormData()
            formData.append('file', file)

            setLoading(true)

            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            setLoading(false)
            setAvatar(res.data.result)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestory = async () => {
        try {
            setLoading(true)
            await axios.post('/api/destroy', { public_id: avatar.public_id })
            setLoading(false)
            setAvatar('')
            history.push('/profile')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e => {
        const { name } = e.target
        let { value } = e.target
        if (name === 'skills' || name === 'websites' || name === 'work'
        || name === 'education' || name === 'socialMedia') {
          value = value.split(',')
        }
        setProfile({ ...profile, [name]: value })
    }


    const handleSubmit = async e => {
      console.log('clicks')
      console.log('submit profile', ...profile, avatar)
      e.preventDefault()
      try {
        console.log('submit profile', ...profile, avatar)
        // if (!avatar) return alert("No Image Upload")
        // await axios.put(`/api/user/${user._id}`, { ...profile, avatar })
        // history.push('/profile')
      } catch (err) {
          console.log('error')
          console.log(err)
            alert(err)
        }
    }

    return (
        <>
            <NavBar />
            <div className="create_article" >
                <div className="container fluid col-md-12">
                    <div id="signupbox" >
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <div className="panel-title text-center"> Edit Profile</div>
                            </div>
                            <div className="panel-body" >
                                <form onSubmit={handleSubmit} className="row g-3" >
                                    <div className="col-md-6">
                                        <div id="div_p_name" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Title<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <input className="input-md emailinput form-control mb" placeholder="Enter Your Title" type="text"
                                                    name="title"
                                                    required value={user.title}
                                                    onChange={handleChangeInput}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_p_name" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Name<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <input className="input-md emailinput form-control mb" placeholder="Enter Name" type="text"
                                                    name="name"
                                                    required value={user.name}
                                                    onChange={handleChangeInput}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div id="div_p_id" className="form-group required">
                                            <label for="p_id" className="control-label col-md-4  requiredField">Email<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <input className="input-md emailinput form-control mb"
                                                    name="email"
                                                    required value={user.email}
                                                    onChange={handleChangeInput}
                                                    placeholder="Enter your email" type="text" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div id="div_id_downloads" className="form-group required">
                                            <label for="p_downloads" className="control-label col-md-4  requiredField">Phone Number<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <input className="input-md emailinput form-control mb"
                                                    name="phone"
                                                    required value={user.phone}
                                                    onChange={handleChangeInput}
                                                    placeholder="Enter Phone Number" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_description" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Skills<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                              <label htmlFor="">Separate by comma</label>
                                                <textarea className="mb"
                                                    name="skills"
                                                    value={user.skills}
                                                    onChange={handleChangeInput}
                                                    style={{ width: '100%' }}
                                                    rows="5"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_description" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Websites<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                              <label htmlFor="">Separate by comma</label>
                                                <textarea className="mb"
                                                    name="websites"
                                                    value={user.websites}
                                                    onChange={handleChangeInput}
                                                    style={{ width: '100%' }}
                                                    rows="5"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_description" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Social Media<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <textarea className="mb"
                                                    name="socialMedia"
                                                    value={user.socialMedia}
                                                    onChange={handleChangeInput}
                                                    style={{ width: '100%' }}
                                                    rows="5"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_id_downloads" className="form-group required">
                                            <label for="p_downloads" className="control-label col-md-4  requiredField">Location<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <input className="input-md emailinput form-control mb"
                                                     name="location"
                                                     value={user.location}
                                                     onChange={handleChangeInput}
                                                     placeholder="Enter City State" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_description" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Work<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <textarea className="mb"
                                                    name="work"
                                                    value={user.work}
                                                    onChange={handleChangeInput}
                                                    style={{ width: '100%' }}
                                                    rows="5"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_description" className="form-group required">
                                            <label for="p_name" className="control-label col-md-4  requiredField">Education<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 ">
                                                <textarea className="mb"
                                                    name="education"
                                                    value={user.education}
                                                    onChange={handleChangeInput}
                                                    style={{ width: '100%' }}
                                                    rows="5"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div id="div_id_image" className="form-group required">
                                            <label for="id_image" className="control-label col-md-4  requiredField">Avatar<span className="asteriskField">*</span> </label>
                                            <div className="controls col-md-8 mb upload" >

                                                <input className="input-md emailinput form-control mb"
                                                    name="file" id="file_up"
                                                    onChange={handleUpload}
                                                    placeholder="Enter Project Id" type="file" />

                                                {
                                                    loading ?
                                                        <div id="file_img"><Loading /></div>
                                                        :
                                                        <div id="file_img" style={styleUpload}>
                                                            <img src={avatar ? avatar.url : ''} alt="" />
                                                            <span onClick={handleDestory}>X</span>
                                                        </div>

                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <div className="mauto maxwidth col-md-12 text-center d-flex justify-content-center">
                                            <br />
                                            <button className="btn btn-info btn-md">Update Profile</button>
                                            <button className="btn btn-danger btn-md" type="reset"><a href="/blog">Cancel</a> </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
            <Footer />
        </>
    )
}

export default Editprofile;
