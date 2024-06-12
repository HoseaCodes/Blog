import React, { useEffect } from "react";
import Preview from "../../Article/Preview";
import { Button } from "../../Button/Button";

const Step5 = ({
  article,
  prevStep,
  setShow,
  show,
  marked,
  setKeywords,
  setLoading,
  keywords,
  keywords2,
  setKeywords2,
}) => {
  
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = "/blog";
  };

  const extractKeywords = async (text) => {
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_Open_AI_Key}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt:
          "Extract keywords from this text. Make the first letter of every word uppercase and separate with commas:\n\n" +
          text +
          "",
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.8,
        presence_penalty: 0.0,
      }),
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/completions",
        options
      );
      const json = await response.json();
      console.log(json.choices[0].text.trim());
      setKeywords(json.choices[0].text.trim());
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const extractKeywords2 = (text) => {
    // Define words to ignore (definite articles, determiners, and conjunctions)
    const ignoreWords = [
      "a",
      "an",
      "the",
      "and",
      "but",
      "or",
      "for",
      "nor",
      "so",
      "if",
      "as",
      "at",
      "by",
      "in",
      "of",
      "on",
      "to",
      "with",
      "from",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];

    // Step 1: Normalize the text
    text = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    text = text.replace(/[^\w\s]/g, "");

    // Step 2: Split the text into words
    const words = text.split(/\s+/);

    // Step 3: Filter out the words to ignore
    const filteredWords = words.filter((word) => !ignoreWords.includes(word));

    // Step 4: Count the frequency of each word
    const wordCount = {};
    filteredWords.forEach((word) => {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });

    // Step 5: Calculate the total number of valid words
    const totalWords = filteredWords.length;

    // Step 6: Calculate the percentage of each word
    const wordStats = [];
    for (let word in wordCount) {
      const count = wordCount[word];
      const percentage = ((count / totalWords) * 100).toFixed(2);
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      wordStats.push({
        word: capitalizedWord,
        count,
        percentage: `${percentage}%`,
      });
    }

    // Step 7: Sort words by frequency
    wordStats.sort((a, b) => b.count - a.count);

    // Step 8: Return the formatted result
    return wordStats;
  };

  useEffect(() => {
    let kwords = extractKeywords2(article.markdown);
    kwords = kwords.splice(0, 5);
    setKeywords2(kwords);
    console.log(kwords);
    kwords.forEach((keyword) => {
      console.log(
        `${keyword.word}: Count - ${keyword.count}, Percentage - ${keyword.percentage}`
      );
    });
  }, [article.markdown]);

  console.log(article)
  return (
    <div className="container mt-5">
      <h2>Step 5</h2>
      <div id="div_description" className=" required">
        <br />
        <label for="p_name" className="control-label requiredField">
          Keyword
        </label>{" "}
        &nbsp;&nbsp;
        <div>
          <table className="table table-striped">
            <tbody className="container">
              {keywords2.length > 1 &&
                keywords2.map((keyword) => (
                  <tr className="row">
                    <td className="col">{keyword.word}</td>
                    <td className="col">{keyword.count}</td>
                    <td className="col">{keyword.percentage}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
          <label for="p_name" className="control-label requiredField">
            AI Keyword Extractor
            <span className="asteriskField">*</span>{" "}
          </label>{" "}
          &nbsp;&nbsp;
          <br />
          <Button
            onClick={() => extractKeywords(article.markdown)}
            primary
            label="Generate Keywords"
            type="submit"
          />
          {keywords.length > 1 && (
            <ul>
              Keywords: &nbsp;
              {keywords.split(",").map((keyword) => (
                <li className="badge bg-primary">{keyword}</li>
              ))}
            </ul>
          )}
          <br />
          <br />
        </div>
      </div>
      <div className="form-group">
        <div className="pb-5">
          <Preview
            show={show}
            setShow={setShow}
            marked={marked}
            article={article}
          />
        </div>
        <div className="mauto maxwidth col-md-12 text-center d-flex justify-content-center">
          <br /> <br />
          <Button primary label="Add Article" type="submit" />
          &nbsp;&nbsp;
          <Button primary onClick={handleClick} label={`Cancel`} type="reset" />
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={prevStep}>
        Back
      </button>
      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </div>
  );
};

export default Step5;
