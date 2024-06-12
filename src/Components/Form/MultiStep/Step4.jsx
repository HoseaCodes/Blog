import React from "react";

const Step4 = ({
  article,
  setArticle,
  prevStep,
  nextStep,
  handleChangeInput,
  onEdit,
  isMobileView,
  articleTempltes,
  setMarkdown,
  setselectedCategory,
  selectedCategory,
  allBlogCategory,
  marked,
}) => {

  const updateMarkdown = (e) => {
    const { name } = e.target;
    setMarkdown(articleTempltes[e.target.options.selectedIndex].markdown);
    setArticle({
      ...formData,
      [name]: articleTempltes[e.target.options.selectedIndex].markdown,
    });
  };
  
  return (
    <div className="container mt-5">
      <h2>Step 4</h2>
      <div className={onEdit ? "d-none" : `col-md-6`}>
        <div id="div_id_downloads" className="form-group required">
          <div className="controls">
            <label for="markdown" className="control-label" requiredField>
              Article Template
              <span className="asteriskField">*</span>
              &nbsp;&nbsp;
              <span className="qs">
                ?{" "}
                <span className="popover above">
                  These templates will give you a starting point to start
                  writing a blog.
                </span>
              </span>
            </label>
            <select
              onChange={updateMarkdown}
              name="markdown"
              type="text"
              className="form-control mb"
              style={{ height: "auto" }}
            >
              {articleTempltes.map((article) => (
                <option key={article.id} value={article.name}>
                  {article.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!isMobileView && (
        <div className="blog__categoryMobile">
          <label className="blog__categoryList__label">Select A Category</label>{" "}
          <select
            className="blog__categoryList__select bg-transparent"
            value={selectedCategory}
            onChange={(e) => setselectedCategory(e.target.value)}
          >
            {allBlogCategory?.map((category) => {
              return <option value={category.name}> {category.name}</option>;
            })}
          </select>
        </div>
      )}
      <div className="col-lg-12 col-md-6 pb-5">
        <div id="div_description" className=" required row">
          <label
            for="p_name"
            className="text-center control-label col-md-12 requiredField"
          >
            Markdown<span className="asteriskField">*</span>{" "}
          </label>
          <div className="controls col-lg-6">
            <h5 className="text-center">Enter your markdown</h5>
            <div className="d-flex justify-content-around text-center">
              <div>
                <h6>Words</h6>
                <h3>{article.markdown.trim().split(/\s+/).length}</h3>
              </div>
              <div>
                <h6>Characters</h6>
                <h3>{article.markdown.length}</h3>
              </div>
              <div>
                <h6>Sentences</h6>
                <h3>{article.markdown.match(/[^.!?]*[.!?]/g).length}</h3>
              </div>
              <div>
                <h6>Paragraph</h6>
                <h3>
                  {
                    article.markdown
                      .split(/\n+/)
                      .filter((paragraph) => paragraph.trim().length > 0).length
                  }
                </h3>
              </div>
              <div>
                <h6>Pages</h6>
                <h3>{Math.ceil(article.markdown.length / 1800)}</h3>
              </div>
            </div>
            <textarea
              className="preview d-flex jusify-self-center h-100 w-100 mb bg-transparent"
              name="markdown"
              required
              value={article.markdown}
              onChange={handleChangeInput}
            ></textarea>
          </div>
          <div className="col-lg-6" id="perview">
            <h5 className="text-center">See the result</h5>
            <div
              className="preview"
              dangerouslySetInnerHTML={{
                __html: marked(article.markdown),
              }}
            ></div>
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

export default Step4;
