import React, { useState, useEffect } from "react";
import LinkedInLogin from "../../SocialMedia/LinkedInLogin";
import AITemplate from "../../OpenAI/AITemplate";

const Step2 = ({
  article,
  setArticle,
  nextStep,
  prevStep,
  onEdit,
  linkedinAccessToken,
  setLinkedinAccessToken,
  handleChangeInput,
  tomorrowsDate,
  threeMonthsFromToday,
}) => {
  const [linkedinResult, setLinkedinResult] = useState("");
  const [twitterResult, setTwitterResult] = useState("");
  const [showAITemplate, setShowAITemplate] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setLinkedinAccessToken(code);
    }
  }, []);
  const handlePublish = (e) => {
    const { name, checked } = e.target;
    setArticle({ ...article, [name]: checked });
  };
  return (
    <fieldset>
      <legend>Other Social Media</legend>
      <div className="container mt-5">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row-reverse",
            width: "100%",
          }}
          className={onEdit ? "d-none" : `col-md-6`}
        >
          <div className="d-flex flex-column h-90 w-100 justify-content-between">
            {!linkedinAccessToken && <LinkedInLogin />}
            <div className="controls d-flex flex-row align-items-center">
              <label for="markdown" className="control-label" requiredField>
                Publish To LinkedIn
                <span className="pr-1 asteriskField">*</span>
              </label>
              <input
                className="bg-transparent"
                type="checkbox"
                name="linkedin"
                onChange={(e) => handlePublish(e)}
                aria-label="Checkbox for following text input"
              />
            </div>
            <div className="controls d-flex flex-row align-items-center">
              <label for="markdown" className="control-label" requiredField>
                Publish To Dev
                <span className="pr-1 asteriskField">*</span>
              </label>
              <input
                className="bg-transparent"
                type="checkbox"
                name="dev"
                onChange={(e) => handlePublish(e)}
                aria-label="Checkbox for following text input"
              />
            </div>
            <div className="controls d-flex flex-row align-items-center">
              <label for="markdown" className="control-label" requiredField>
                Publish To Twitter
                <span className="pr-1 asteriskField">*</span>
              </label>
              <input
                className="bg-transparent"
                type="checkbox"
                name="twitter"
                onChange={(e) => handlePublish(e)}
                aria-label="Checkbox for following text input"
              />
            </div>
          </div>
          <div className="d-flex flex-column h-90 w-100 justify-content-between">
            <div className="controls d-flex flex-column ">
              <label
                for="markdown"
                className="control-label mb-8"
                requiredField
              >
                Schedule Post Time
                <span className="asteriskField">*</span>
                &nbsp;&nbsp;
                <span className="qs">
                  ?{" "}
                  <span className="popover above">
                    This will allow for scheduling a post time/date for your
                    post.
                  </span>
                </span>
              </label>
              <input
                className="w-75"
                aria-label="Date"
                type="date"
                id="start"
                name="scheduledDate"
                onChange={handleChangeInput}
                value={article.scheduledDate}
                placeholder={tomorrowsDate}
                min={tomorrowsDate}
                max={threeMonthsFromToday}
              />
            </div>
            <div className="controls d-flex flex-row align-items-center">
              <label for="markdown" className="control-label" requiredField>
                Publish To Medium
                <span className="pr-1 asteriskField">*</span>
              </label>
              <input
                type="checkbox"
                name="medium"
                onChange={(e) => handlePublish(e)}
                aria-label="Checkbox for following text input"
              />
            </div>
            <div className="controls d-flex flex-row align-items-center">
              <label for="markdown" className="control-label" requiredField>
                Save To Drafts
                <span className="pr-1 asteriskField">*</span>
              </label>
              <input
                type="checkbox"
                name="draft"
                onChange={(e) => handlePublish(e)}
                aria-label="Checkbox for following text input"
              />
            </div>
          </div>
        </div>
        <div className={onEdit ? "d-none" : `col-md-6`}>
          <div id="div_description" className=" required">
            <br />
            <label for="p_name" className="control-label requiredField">
              Twitter Content
              <span className="asteriskField">*</span>{" "}
            </label>{" "}
            &nbsp;&nbsp;
            {article.markdown !== "" && article.markdown && (
              <AITemplate
                articleInput={article.markdown}
                showAITemplate={showAITemplate}
                setShowAITemplate={setShowAITemplate}
                setTwitterResult={setTwitterResult}
                setLinkedinResult={setLinkedinResult}
              />
            )}
            <div className="controls ">
              <br />
              <textarea
                className="mb bg-transparent"
                name="tweetContent"
                required
                value={article.tweetContent || twitterResult}
                onChange={handleChangeInput}
                style={{ width: "100%" }}
                rows="5"
                cols="50"
              ></textarea>
            </div>
          </div>
          <div id="div_description" className=" required">
            <br />
            <label for="p_name" className="control-label requiredField">
              LinkedIn Content
              <span className="asteriskField">*</span>{" "}
            </label>{" "}
            &nbsp;&nbsp;
            <div className="controls ">
              <br />
              <textarea
                className="mb bg-transparent"
                name="linkedinContent"
                required
                value={article.linkedinContent || linkedinResult}
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
    </fieldset>
  );
};

export default Step2;
