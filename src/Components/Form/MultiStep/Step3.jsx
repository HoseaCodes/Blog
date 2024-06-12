import React from "react";
import axios from "axios";
import Loading from "../../../Loading";

const Step3 = ({
  article,
  prevStep,
  nextStep,
  loading,
  images,
  setImages,
  setLoading,
  history,
  token,
  onEdit,
  handleChangeInput,
}) => {
  const handleDestory = async () => {
    try {
      setLoading(true);
      await axios.post("/api/destroy", { public_id: images.public_id });
      setLoading(false);
      setImages("");
      history.push("/blog");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) return alert("File not exist");
      if (file.size > 1024 * 1024) return alert("Size too large");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("File format is incorrect");

      const imageFormData = new FormData();
      imageFormData.append("file", file);

      setLoading(true);

      const res = await axios.post("/api/upload", imageFormData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data.result);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="container mt-5">
      <h2>Step 3</h2>
      <div className="col-md-6">
        <div id="div_id_image" className="required">
          <label for="id_image" className="control-label requiredField">
            Article Image
            <span className="asteriskField">*</span>{" "}
          </label>
          <div className="controls mb upload">
            <input
              className="input-md emailinput form-control mb"
              name="file"
              id="file_up"
              onChange={handleUpload}
              placeholder="Enter Project Id"
              type="file"
            />
            {loading ? (
              <div id="file_img">
                <Loading />
              </div>
            ) : (
              <div id="file_img" style={styleUpload}>
                <img src={images ? images.url : ""} alt="" />
                <span onClick={handleDestory}>X</span>
              </div>
            )}
            {onEdit && (
              <div id="file_img" style={styleUpload}>
                <img src={images ? images.url : ""} alt="" />
                <span onClick={handleDestory}>X</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div id="div_description" className=" required">
          <label for="p_name" className="control-label requiredField">
            Description<span className="asteriskField">*</span>{" "}
          </label>
          <div className="controls ">
            <textarea
              className="mb bg-transparent"
              name="description"
              required
              value={article.description}
              onChange={handleChangeInput}
              style={{ width: "100%" }}
              rows="5"
              cols="50"
            ></textarea>
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={prevStep}>
        Back
      </button>
      <button type="button" className="btn btn-primary" onClick={nextStep}>
        Next
      </button>
    </div>
  );
};

export default Step3;
