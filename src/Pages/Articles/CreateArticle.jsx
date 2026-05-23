// import React, { useContext, useState, useEffect } from "react";
// import { GlobalState } from "../../GlobalState";
// import Loading from "../../Loading";
// import { useHistory, useParams } from "react-router-dom";
// import axios from "axios";
// import "./CreateArticle.css";
// import marked from "marked";
// import { v4 as uuidv4 } from "uuid";
// import Error401 from "../Error/Error401";
// import { articleTempltes } from "./ArticleTemplate";
// import Preview from "../../Components/Article/Preview";
// import AITemplate from "../../Components/OpenAI/AITemplate";
// import { Button } from "../../Components/Button/Button";
// import { sleep, getBasicAuth } from "../../Utils/helperFunctions";
// import moment from "moment";
// import LinkedInLogin from "../../Components/SocialMedia/LinkedInLogin";

import EnterpriseCreateArticle from "../../Components/Article/EnterpriseCreateArticle";

// function CreateArticle() {
//   const [markdown, setMarkdown] = useState(articleTempltes[3].markdown);
//   const todaysDate = moment().format("YYYY-MM-DD");
//   const tomorrowsDate = moment().add(1, "days").format("YYYY-MM-DD");
//   const threeMonthsFromToday = moment().add(3, "months").format("YYYY-MM-DD");
//   const initialState = {
//     article_id: uuidv4(),
//     title: "Demo",
//     subtitle: "",
//     description: "Description",
//     markdown: markdown,
//     categories: "",
//     id: "",
//     series: "Hoseacodes",
//     dev: false,
//     medium: false,
//     archived: false,
//     draft: false,
//     scheduled: false,
//     linkedin: false,
//     linkedinContent: "",
//     scheduledDate: todaysDate,
//     images: {
//       secure_url: "",
//     },
//   };
//   const state = useContext(GlobalState);
//   const [token] = state.token;
//   const [article, setArticle] = useState(initialState);
//   const [images, setImages] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const history = useHistory();
//   const param = useParams();
//   const [articles] = state.articlesAPI.articles;
//   const [onEdit, setOnEdit] = useState(false);
//   const [callback, setCallback] = state.articlesAPI.callback;
//   const [user] = state.userAPI.user;
//   const [show, setShow] = useState(false);
//   const [showAITemplate, setShowAITemplate] = useState(false);
//   const loggedIn = localStorage.getItem("isLoggedIn");
//   const [selectedCategory, setselectedCategory] = useState("Programming");
//   const [allBlogCategory, setAllBlogCategory] = useState([]);
//   const [linkedinResult, setLinkedinResult] = useState("");
//   const [linkedinAccessToken, setLinkedinAccessToken] = useState("");

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");
//     if (code) {
//       setLinkedinAccessToken(code);
//     }
//   }, []);

//   useEffect(async () => {
//     const config = { headers: { "Content-Type": "application/json" } };
//     const res = await axios.get("/api/category", config);
//     if (res) {
//       setAllBlogCategory(res.data.categories);
//     }
//   }, []);

//   function handleClick(e) {
//     e.preventDefault();
//     window.location.href = "/blog";
//   }

//   useEffect(() => {
//     if (!loggedIn) {
//       sleep(5000);
//       history.push("/");
//     }
//   }, []);

//   useEffect(() => {
//     if (param.id) {
//       setOnEdit(true);
//       if (articles !== undefined) {
//         articles.forEach((article) => {
//           if (article._id === param.id) {
//             setArticle(article);
//             setImages(article.images);
//           }
//         });
//       }
//     } else {
//       setOnEdit(false);
//       setArticle(initialState);
//       // setImages(false)
//     }
//   }, [param.id, articles]);

//   const styleUpload = {
//     display: images ? "block" : "none",
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     try {
//       const file = e.target.files[0];
//       if (!file) return alert("File not exist");
//       if (file.size > 1024 * 1024) return alert("Size too large");
//       if (file.type !== "image/jpeg" && file.type !== "image/png")
//         return alert("File format is incorrect");

//       const formData = new FormData();
//       formData.append("file", file);

//       setLoading(true);

//       const res = await axios.post("/api/upload", formData, {
//         headers: {
//           "content-type": "multipart/form-data",
//           Authorization: token,
//         },
//       });
//       setLoading(false);
//       setImages(res.data.result);
//     } catch (err) {
//       alert(err.response.data.msg);
//     }
//   };

//   const handleDestory = async () => {
//     try {
//       setLoading(true);
//       await axios.post("/api/destroy", { public_id: images.public_id });
//       setLoading(false);
//       setImages("");
//       history.push("/blog");
//     } catch (err) {
//       alert(err.response.data.msg);
//     }
//   };

//   const handleChangeInput = (e) => {
//     const { name, value } = e.target;
//     if (name === "tags") {
//       setArticle({ ...article, [name]: [value] });
//     } else {
//       setArticle({ ...article, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!images) return alert("No Image Upload");
//       if (onEdit) {
//         await axios.put(
//           `/api/articles/${article._id}`,
//           {
//             ...articles,
//             images,
//           },
//           {
//             headers: { Authorization: token },
//           }
//         );
//       } else {
//         article.scheduledDate <= todaysDate
//           ? (article.scheduledDate = null)
//           : (article.scheduled = true);
//         setArticle({
//           ...article,
//           ["article_id"]: uuidv4(),
//           categories: [selectedCategory],
//           id: user.id,
//         });
//         setArticle({
//           ...article,
//           ["slug"]: article.title.toLowerCase().replace(/ /g, "-"),
//         });
//         const username = process.env.REACT_APP_USERNAME || "admin";
//         const password = process.env.REACT_APP_PASSWORD || "password";
//         const auth = getBasicAuth(username, password);
//         await axios.post(
//           "/api/articles",
//           { ...article, images, ...user, linkedinAccessToken },
//           {
//             headers: {
//               Authorization: auth,
//             },
//           }
//         );
//         setImages(false);
//         setArticle(initialState);
//       }
//       setCallback(!callback);

//       history.push("/blog");
//     } catch (err) {
//       alert(err.response.data.msg);
//     }
//   };

//   const updateMarkdown = (e) => {
//     const { name } = e.target;
//     setMarkdown(articleTempltes[e.target.options.selectedIndex].markdown);
//     setArticle({
//       ...article,
//       [name]: articleTempltes[e.target.options.selectedIndex].markdown,
//     });
//   };

//   const handlePublish = (e) => {
//     const { name, checked } = e.target;
//     setArticle({ ...article, [name]: checked });
//   };

//   console.log({ article });
//   return (
//     <>
//       {loggedIn ? (
//         <div className="create_article">
//           <div className="container fluid col-md-12">
//             <div id="signupbox">
//               <div className="panel panel-default">
//                 <div className="panel-heading">
//                   <div className="panel-title text-center">
//                     <h3>Add Article</h3>
//                   </div>
//                 </div>
//                 <div className="panel-body">
//                   <form className="row g-3" onSubmit={handleSubmit}>
//                     <div className="col-md-6">
//                       <div id="div_p_name" className=" required">
//                         <label
//                           for="p_name"
//                           className="control-label requiredField"
//                         >
//                           Title<span className="asteriskField">*</span>
//                         </label>
//                         <input
//                           className="input-md emailinput form-control"
//                           placeholder="Enter Article Title Name"
//                           type="text"
//                           name="title"
//                           required
//                           value={article.title}
//                           onChange={handleChangeInput}
//                           disabled={onEdit}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div id="div_p_name" className=" required">
//                         <label
//                           for="p_name"
//                           className="control-label requiredField"
//                         >
//                           Subtitle<span className="asteriskField">*</span>{" "}
//                         </label>
//                         <div className="controls">
//                           <input
//                             className="input-md emailinput form-control"
//                             placeholder="Enter Article Subtitle Name"
//                             type="text"
//                             name="subtitle"
//                             required
//                             value={article.subtitle}
//                             onChange={handleChangeInput}
//                             disabled={onEdit}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div id="div_p_id" className=" required">
//                         <label
//                           for="p_id"
//                           className="control-label requiredField"
//                         >
//                           Article Id<span className="asteriskField">*</span>{" "}
//                         </label>
//                         <div className="controls">
//                           <input
//                             className="input-md emailinput form-control mb"
//                             name="article_id"
//                             value={initialState.article_id}
//                             å
//                             disabled
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-6 mb-0">
//                       <div id="div_p_id" className=" required">
//                         <label
//                           for="tags"
//                           className="control-label"
//                           requiredField
//                         >
//                           {" "}
//                           Article Language Tag
//                           <span className="asteriskField">*</span>
//                         </label>
//                         <select
//                           name="tags"
//                           type="text"
//                           className="form-control mb"
//                           style={{ height: "auto" }}
//                         >
//                           <option value="java">Java</option>
//                           <option value="python">Python</option>
//                           <option value="javascript">JavaScript</option>
//                           <option value="softwareengineering">
//                             Software Engineer
//                           </option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div id="div_description" className=" required">
//                         <label
//                           for="p_name"
//                           className="control-label requiredField"
//                         >
//                           Description<span className="asteriskField">*</span>{" "}
//                         </label>
//                         <div className="controls ">
//                           <textarea
//                             className="mb bg-transparent"
//                             name="description"
//                             required
//                             value={article.description}
//                             onChange={handleChangeInput}
//                             style={{ width: "100%" }}
//                             rows="5"
//                             cols="50"
//                           ></textarea>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={onEdit ? "d-none" : `col-md-6`}>
//                       <div id="div_id_downloads" className="required">
//                         {
//                           !linkedinAccessToken && (
//                             <LinkedInLogin />
//                           )
//                         }
//                         <div className="controls d-flex flex-row align-items-center">
//                           <label
//                             for="markdown"
//                             className="control-label"
//                             requiredField
//                           >
//                             Publish To LinkedIn
//                             <span className="pr-1 asteriskField">*</span>
//                           </label>
//                           <input
//                             className="bg-transparent"
//                             type="checkbox"
//                             name="linkedin"
//                             onChange={(e) => handlePublish(e)}
//                             aria-label="Checkbox for following text input"
//                           />
//                         </div>
//                         <div className="controls d-flex flex-row align-items-center">
//                           <label
//                             for="markdown"
//                             className="control-label"
//                             requiredField
//                           >
//                             Publish To Dev
//                             <span className="pr-1 asteriskField">*</span>
//                           </label>
//                           <input
//                             className="bg-transparent"
//                             type="checkbox"
//                             name="dev"
//                             onChange={(e) => handlePublish(e)}
//                             aria-label="Checkbox for following text input"
//                           />
//                         </div>
//                       </div>
//                       <div id="div_id_downloads" className=" required">
//                         <div className="controls d-flex flex-row align-items-center">
//                           <label
//                             for="markdown"
//                             className="control-label"
//                             requiredField
//                           >
//                             Publish To Medium
//                             <span className="pr-1 asteriskField">*</span>
//                           </label>
//                           <input
//                             type="checkbox"
//                             name="medium"
//                             onChange={(e) => handlePublish(e)}
//                             aria-label="Checkbox for following text input"
//                           />
//                         </div>
//                       </div>
//                       <div id="div_id_downloads" className=" required">
//                         <div className="controls d-flex flex-row align-items-center">
//                           <label
//                             for="markdown"
//                             className="control-label"
//                             requiredField
//                           >
//                             Save To Drafts
//                             <span className="pr-1 asteriskField">*</span>
//                           </label>
//                           <input
//                             type="checkbox"
//                             name="draft"
//                             onChange={(e) => handlePublish(e)}
//                             aria-label="Checkbox for following text input"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div id="div_id_image" className="required">
//                         <label
//                           for="id_image"
//                           className="control-label requiredField"
//                         >
//                           Article Image
//                           <span className="asteriskField">*</span>{" "}
//                         </label>
//                         <div className="controls mb upload">
//                           <input
//                             className="input-md emailinput form-control mb"
//                             name="file"
//                             id="file_up"
//                             onChange={handleUpload}
//                             placeholder="Enter Project Id"
//                             type="file"
//                           />
//                           {loading ? (
//                             <div id="file_img">
//                               <Loading />
//                             </div>
//                           ) : (
//                             <div id="file_img" style={styleUpload}>
//                               <img src={images ? images.url : ""} alt="" />
//                               <span onClick={handleDestory}>X</span>
//                             </div>
//                           )}
//                           {onEdit && (
//                             <div id="file_img" style={styleUpload}>
//                               <img src={images ? images.url : ""} alt="" />
//                               <span onClick={handleDestory}>X</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className={onEdit ? "d-none" : `col-md-6`}>
//                       <div id="div_id_downloads" className="required">
//                         <div className="controls d-flex flex-column ">
//                           <label
//                             for="markdown"
//                             className="control-label mb-8"
//                             requiredField
//                           >
//                             Schedule Post Time
//                             <span className="asteriskField">*</span>
//                             &nbsp;&nbsp;
//                             <span className="qs">
//                               ?{" "}
//                               <span className="popover above">
//                                 This will allow for scheduling a post time/date
//                                 for your post.
//                               </span>
//                             </span>
//                           </label>
//                           <input
//                             className="w-25"
//                             aria-label="Date"
//                             type="date"
//                             id="start"
//                             name="scheduledDate"
//                             onChange={handleChangeInput}
//                             value={article.scheduledDate}
//                             placeholder={tomorrowsDate}
//                             min={tomorrowsDate}
//                             max={threeMonthsFromToday}
//                           />
//                         </div>
//                       </div>
//                       <div id="div_description" className=" required">
//                         <br />
//                         <label
//                           for="p_name"
//                           className="control-label requiredField"
//                         >
//                           LinkedIn Content
//                           <span className="asteriskField">*</span>{" "}
//                         </label>{" "}
//                         &nbsp;&nbsp;
//                         {article.markdown !== "" && article.markdown && (
//                           <AITemplate
//                             articleInput={article.markdown}
//                             showAITemplate={showAITemplate}
//                             setShowAITemplate={setShowAITemplate}
//                             setLinkedinResult={setLinkedinResult}
//                           />
//                         )}
//                         <div className="controls ">
//                           <br />
//                           <textarea
//                             className="mb bg-transparent"
//                             name="linkedinContent"
//                             required
//                             value={article.linkedinContent || linkedinResult}
//                             onChange={handleChangeInput}
//                             style={{ width: "100%" }}
//                             rows="5"
//                             cols="50"
//                           ></textarea>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={onEdit ? "d-none" : `col-md-6`}>
//                       <div
//                         id="div_id_downloads"
//                         className="form-group required"
//                       >
//                         <div className="controls">
//                           <label
//                             for="markdown"
//                             className="control-label"
//                             requiredField
//                           >
//                             Article Template
//                             <span className="asteriskField">*</span>
//                             &nbsp;&nbsp;
//                             <span className="qs">
//                               ?{" "}
//                               <span className="popover above">
//                                 These templates will give you a starting point
//                                 to start writing a blog.
//                               </span>
//                             </span>
//                           </label>
//                           <select
//                             onChange={updateMarkdown}
//                             name="markdown"
//                             type="text"
//                             className="form-control mb"
//                             style={{ height: "auto" }}
//                           >
//                             {articleTempltes.map((article) => (
//                               <option key={article.id} value={article.name}>
//                                 {article.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     {!isMobileView && (
//                       <div className="blog__categoryMobile">
//                         <label className="blog__categoryList__label">
//                           Select A Category
//                         </label>{" "}
//                         <select
//                           className="blog__categoryList__select bg-transparent"
//                           value={selectedCategory}
//                           onChange={(e) => setselectedCategory(e.target.value)}
//                         >
//                           {allBlogCategory?.map((category) => {
//                             return (
//                               <option value={category.name}>
//                                 {" "}
//                                 {category.name}
//                               </option>
//                             );
//                           })}
//                         </select>
//                       </div>
//                     )}

//                     {/* <ReactMarkdown source={input} className="markdown" /> */}
//                     <div className="col-lg-12 col-md-6 pb-5">
//                       <div id="div_description" className=" required row">
//                         <label
//                           for="p_name"
//                           className="text-center control-label col-md-12 requiredField"
//                         >
//                           Markdown<span className="asteriskField">*</span>{" "}
//                         </label>
//                         <div className="controls col-lg-6">
//                           <h5 className="text-center">Enter your markdown</h5>
//                           <textarea
//                             className="preview d-flex jusify-self-center h-100 w-100 mb bg-transparent"
//                             name="markdown"
//                             required
//                             value={article.markdown}
//                             onChange={handleChangeInput}
//                           ></textarea>
//                         </div>
//                         <div className="col-lg-6" id="perview">
//                           <h5 className="text-center">See the result</h5>
//                           <div
//                             className="preview"
//                             dangerouslySetInnerHTML={{
//                               __html: marked(article.markdown),
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                     <br />
//                     <div className="form-group">
//                       <div className="mauto maxwidth col-md-12 text-center d-flex justify-content-center">
//                         <br /> <br />
//                         <Button primary label="Add Article" type="submit" />
//                         &nbsp;&nbsp;
//                         <Button
//                           primary
//                           onClick={handleClick}
//                           label={`Cancel`}
//                           type="reset"
//                         />
//                       </div>
//                     </div>
//                   </form>
//                   <div className="pb-5">
//                     <Preview
//                       show={show}
//                       setShow={setShow}
//                       marked={marked}
//                       article={article}
//                     />
//                   </div>
//                   <AITemplate
//                     showAITemplate={showAITemplate}
//                     setShowAITemplate={setShowAITemplate}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         //   <hr style d={{ background: "rgb(235,183,65)", width: "100%" }} />

//         <Error401 />
//       )}
//     </>
//   );
// }

// export default CreateArticle;
import React from 'react'

export default function CreateArticle() {
  return (
    <EnterpriseCreateArticle />
  )
}
