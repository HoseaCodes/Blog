import React from "react";
import "./MultiStepForm.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Step1 = ({
  article,
  nextStep,
  onEdit,
  handleChangeInput,
}) => {
  return (
    <fieldset>
      <legend>Blog Info</legend>
      <div className="container mt-5">
        <div className="col-md-6">
          <div>
            <label className="control-label requiredField">
              Title<span className="asteriskField">*</span>
            </label>
            <input
              className="input-md emailinput form-control"
              placeholder="Enter Article Title Name"
              type="text"
              name="title"
              required
              value={article.title}
              onChange={handleChangeInput}
              disabled={onEdit}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <label className="control-label requiredField">
              Subtitle<span className="asteriskField">*</span>{" "}
            </label>
            <div className="controls">
              <input
                className="input-md emailinput form-control"
                placeholder="Enter Article Subtitle Name"
                type="text"
                name="subtitle"
                required
                value={article.subtitle}
                onChange={handleChangeInput}
                disabled={onEdit}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <label className="control-label requiredField">
              Article Id<span className="asteriskField">*</span>{" "}
            </label>
            <div className="controls">
              <input
                className="input-md emailinput form-control mb"
                name="article_id"
                value={article.article_id}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-0">
          <div>
            <label for="tags" className="control-label" requiredField>
              {" "}
              Article Language Tag
              <span className="asteriskField">*</span>
            </label>
            <select
              name="tags"
              type="text"
              className="form-control mb"
              style={{ height: "auto" }}
            >
              <option value="">--Select One--</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="softwareengineering">Software Engineer</option>
            </select>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Next
        </button>
      </div>
    </fieldset>
  );
};

export default Step1;
