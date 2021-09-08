import React, {useContext} from 'react';
import './profile.css';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import { GlobalState } from '../../GlobalState';
import { Link } from 'react-router-dom';

const Profile = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;

  return (
    <>
    <NavBar/>
      <div className="container-fluid">
        <div class="profile-content p-0">
            <div class="profile-header">
                <div class="profile-header-cover"></div>
                <div class="profile-header-content">
                    <div class="profile-header-img">
                        <img src={user.avatar} alt={user.name} />
                    </div>

                    <div class="profile-header-info">
                        <h4 class="m-t-sm">{user.name}</h4>
                        <p class="m-b-sm">{user.title}</p>
                        <Link to="/edit" className="btn btn-xs btn-primary mb-3">Edit</Link>
                    </div>
                </div>

                <ul class="profile-header-tab nav nav-tabs">
                    <li class="nav-item"><a href="#profile-post" class="nav-link" data-toggle="tab">POSTS</a></li>
                    <li class="nav-item"><a href="#profile-about" class="nav-link active show" data-toggle="tab">ABOUT</a></li>
                    <li class="nav-item"><a href="#profile-photos" class="nav-link" data-toggle="tab">PHOTOS</a></li>
                    <li class="nav-item"><a href="#profile-videos" class="nav-link" data-toggle="tab">VIDEOS</a></li>
                    <li class="nav-item"><a href="#profile-friends" class="nav-link" data-toggle="tab">FRIENDS</a></li>
                </ul>
            </div>

            <div class="profile-container">
                <div class="row row-space-20">
                    <div class="col-md-8">
                        <div class="tab-content p-0">
                            <div class="tab-pane active show" id="profile-about">
                                <table class="table table-profile">
                                    <thead>
                                        <tr>
                                            <th colspan="2">WORK AND EDUCATION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="field">Work</td>
                                            <td class="value">
                                              {/* {
                                                Object.keys(user.work.map((work) => {
                                                  return (
                                                    <div class="m-b-5">
                                                        <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                        <span class="text-muted">{work}</span>
                                                    </div>
                                                    )
                                                }))
                                              } */}
                                                <div class="m-b-5">
                                                    <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                    <span class="text-muted">PHP Programmer</span>
                                                </div>
                                                <div>
                                                    <b>Neutrino IT (2012)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                    <span class="text-muted">UXUI / Frontend Developer</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="field">Education</td>
                                            <td class="value">
                                            {/* {
                                                Object.keys(user.education.map((education) => {
                                                  return (
                                                    <div class="m-b-5">
                                                      <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                      <span class="text-muted">{education}</span>
                                                  </div>
                                                    )
                                                }))
                                              } */}
                                                <div class="m-b-5">
                                                    <b>University (2009)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                    <span class="text-muted">University of Georgia, Athens, GA</span>
                                                </div>
                                                <div>
                                                    <b>High School (2006)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                    <span class="text-muted">Heritage High School, West Chestter, PA</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="field">Skills</td>
                                            <td class="value">
                                              {
                                                user.skills.map((skill) => {
                                                  return (<span>{skill}</span>)
                                                })
                                              }
                                                C++, PHP, HTML5, CSS, jQuery, MYSQL, Ionic, Laravel, Phonegap, Bootstrap, Angular JS, Angular JS, Asp.net
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="table table-profile">
                                    <thead>
                                        <tr>
                                            <th colspan="2">CONTACT INFORMATION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="field">Mobile Phones</td>
                                            <td class="value">
                                              {user.phone}
                                                +44 7700 900860
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="field">Email</td>
                                            <td class="value">
                                              {user.email}
                                                admin@infinite.com
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                        {/* {
                                                Object.keys(user.socialMedia.map((media) => {
                                                  return (
                                                    <div class="m-b-5">
                                                      <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                      <span class="text-muted">{media}</span>
                                                  </div>
                                                    )
                                                }))
                                              } */}
                                            <td class="field">Facebook</td>
                                            <td class="value">
                                                http://facebook.com/infinite.admin
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="field">Website</td>
                                            <td class="value">
                                                http://seantheme.com
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="field">Address</td>
                                            {/* {
                                                Object.keys(user.location.map((location) => {
                                                  return (
                                                    <div class="m-b-5">
                                                      <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                      <span class="text-muted">{location}</span>
                                                  </div>
                                                    )
                                                }))
                                              } */}
                                            <td class="value">
                                                Twitter, Inc. <a href="#" class="m-l-10">Edit</a><br />
                                                1355 Market Street, Suite 900<br />
                                                San Francisco, CA 94103
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="table table-profile">
                                    <thead>
                                        <tr>
                                            <th colspan="2">BASIC INFORMATION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="field">Facebook</td>
                                            <td class="value">
                                                http://facebook.com/infinite.admin
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                        <tr>
                                        {/* {
                                                Object.keys(user.websites.map((website) => {
                                                  return (
                                                    <div class="m-b-5">
                                                      <b>Magnificient IT (2017)</b> <a href="#" class="m-l-10">Edit</a><br />
                                                      <span class="text-muted">{website}</span>
                                                  </div>
                                                    )
                                                }))
                                              } */}
                                            <td class="field">Website</td>
                                            <td class="value">
                                                http://seantheme.com
                                                <a href="#" class="m-l-10">Edit</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 hidden-xs hidden-sm">
                        <ul class="profile-info-list">
                            <li class="title">PERSONAL INFORMATION</li>
                            <li>
                                <div class="field">Occupation:</div>
                                <div class="value">UXUI / Frontend Developer</div>
                            </li>
                            <li>
                                <div class="field">Skills:</div>
                                <div class="value">C++, PHP, HTML5, CSS, jQuery, MYSQL, Ionic, Laravel, Phonegap, Bootstrap, Angular JS, Angular JS, Asp.net</div>
                            </li>
                            <li>
                                <div class="field">Country:</div>
                                <div class="value">San Francisco</div>
                            </li>
                            <li>
                                <div class="field">Address:</div>
                                <div class="value">
                                    <address class="m-b-0">
                                        Twitter, Inc.<br />
                                        1355 Market Street, Suite 900<br />
                                        San Francisco, CA 94103
                                    </address>
                                </div>
                            </li>
                            <li>
                                <div class="field">Phone No.:</div>
                                <div class="value">
                                    (123) 456-7890
                                </div>
                            </li>
                            <li class="title">FRIEND LIST (9)</li>
                            <li class="img-list">
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar4.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar5.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar8.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" /></a>
                                <a href="#" class="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Profile;
