import React, { useState } from "react";
import moment from "moment";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import marked from "marked";

const MultiStepForm = ({
  article,
  articleTempltes,
  allBlogCategory,
  history,
  images,
  onEdit,
  linkedinAccessToken,
  selectedCategory,
  setAllBlogCategory,
  setArticle,
  setImages,
  setLinkedinAccessToken,
  setMarkdown,
  setOnEdit,
  setselectedCategory,
  token,
}) => {
  const [step, setStep] = useState(1);
  const tomorrowsDate = moment().add(1, "days").format("YYYY-MM-DD");
  const threeMonthsFromToday = moment().add(3, "months").format("YYYY-MM-DD");
  const [loading, setLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [show, setShow] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywords2, setKeywords2] = useState([
    { word: "", count: 0, percentage: "" },
  ]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setArticle({ ...article, [name]: [value] });
    } else {
      setArticle({ ...article, [name]: value });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const progressPercentage = () => {
    switch (step) {
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 60;
      case 4:
        return 80;
      case 5:
        return 100;
      default:
        return 0;
    }
  };
  const handleStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            article={article}
            setArticle={setArticle}
            nextStep={nextStep}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            handleChangeInput={handleChangeInput}
          />
        );
      case 2:
        return (
          <Step2
            article={article}
            linkedinAccessToken={linkedinAccessToken}
            nextStep={nextStep}
            prevStep={prevStep}
            setArticle={setArticle}
            setLinkedinAccessToken={setLinkedinAccessToken}
            tomorrowsDate={tomorrowsDate}
            threeMonthsFromToday={threeMonthsFromToday}
          />
        );
      case 3:
        return (
          <Step3
            article={article}
            setArticle={setArticle}
            prevStep={prevStep}
            nextStep={nextStep}
            loading={loading}
            setLoading={setLoading}
            images={images}
            setImages={setImages}
            history={history}
            token={token}
            onEdit={onEdit}
            handleChangeInput={handleChangeInput}
          />
        );
      case 4:
        return (
          <Step4
            article={article}
            setArticle={setArticle}
            prevStep={prevStep}
            nextStep={nextStep}
            loading={loading}
            handleChangeInput={handleChangeInput}
            isMobileView={isMobileView}
            onEdit={onEdit}
            setMarkdown={setMarkdown}
            articleTempltes={articleTempltes}
            setselectedCategory={setselectedCategory}
            selectedCategory={selectedCategory}
            allBlogCategory={allBlogCategory}
            setAllBlogCategory={setAllBlogCategory}
            marked={marked}
          />
        );
      case 5:
        return (
          <Step5
            article={article}
            setArticle={setArticle}
            prevStep={prevStep}
            loading={loading}
            setShow={setShow}
            marked={marked}
            setKeywords={setKeywords}
            setKeywords2={setKeywords2}
            setLoading={setLoading}
            keywords={keywords}
            keywords2={keywords2}
          />
        );
      default:
        return <div>Error: Invalid step</div>;
    }
  };
  return (
    <div className="container mt-5">
      <div class="page-header text-center">
        <div class="well">
          <h2>Add Article</h2>
        </div>
        <div className="progress mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progressPercentage()}%` }}
            aria-valuenow={progressPercentage()}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progressPercentage()}%
          </div>
        </div>
      </div>
      {handleStep()}
    </div>
  );
};

export default MultiStepForm;
