import React from "react";
import templates from "../../Constants/ai";
import { truncate } from "../../Utils/helperFunctions";

function OptionSelection(props) {
  const { selectOption, setInput, articleInput } = props;
  const arrayItems = [
    // {
    //     name: "Q&A",
    //     id: "q&a",
    //     description: "Answer questions based on existing knowledge",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0,
    //     max_tokens: 100,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "Grammer Correction",
    //     id: "grammerCorrection",
    //     description: "Corrects sentences into standard English.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0,
    //     max_tokens: 100,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    {
      name: "Generate LinkedIn Post",
      id: "summary",
      description: `${templates.linkedin}: ${articleInput} with tone: ${templates.tone}`,
      option: {
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
    },
    {
      name: "Generate Tweet",
      description: `${templates.twitter}: ${articleInput} with tone: ${templates.tone}`,
      option: {
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
    },
    // {
    //     name: "Summarize for a 2nd grader",
    //     id: "summary",
    //     description: "Translates difficult text into simpler concepts.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0.7,
    //     max_tokens: 64,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //   name: "English to Other languages",
    //   id: "translate",
    //   description: "Translates English text into French, Spanish and Japanese.",
    //   option: {
    //     model: "text-davinci-003",
    //     temperature: 0.3,
    //     max_tokens: 100,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //   },
    // },
    // {
    //   name: "Movie to Emoji",
    //   id: "movieToEmoji",
    //   description: "Convert movie titles into emoji.",
    //   option: {
    //     model: "text-davinci-003",
    //     temperature: 0,
    //     max_tokens: 100,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //   },
    // },
    // {
    //     name: "Calculate Time Complexity",
    //     id: "calculateTimeComplexity",
    //     description: "Find the time complexity of a function.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0,
    //     max_tokens: 64,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "Explain code",
    //     id: "explainCode",
    //     description: "Explain a complicated piece of code.",
    //     option: {
    //     model: "code-davinci-002",
    //     temperature: 0,
    //     max_tokens: 64,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "SQL request",
    //     id: "SQLRequest",
    //     description: "Create simple SQL queries.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0.3,
    //     max_tokens: 60,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "Ad from product description",
    //     id: "adFromProductDescription",
    //     description: "Turn a product description into ad copy.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0.5,
    //     max_tokens: 100,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "Third-person converter",
    //     id: "Third-personConverter",
    //     description: "Converts first-person POV to the third-person. This is modified from a community prompt to use fewer examples.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0,
    //     max_tokens: 60,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    {
      name: "Notes to summary",
      id: "NotesToSummary",
      description: "Turn meeting notes into a summary.",
      option: {
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
    },
    // {
    //     name: "Chat",
    //     id: "chat",
    //     description: "Open ended conversation with an AI assistant.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0.9,
    //     max_tokens: 150,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.6,
    //     },
    // },
    // {
    //     name: "Restaurant review creator",
    //     id: "restaurantReviewCreator",
    //     description: "Turn a few words into a restaurant review.",
    //     option: {
    //     model: "text-davinci-003",
    //     temperature: 0.5,
    //     max_tokens: 64,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
    // {
    //     name: "JavaScript to Python",
    //     id: "jstopy",
    //     description: "Convert simple JavaScript expressions into Python.",
    //     option: {
    //     model: "code-davinci-002",
    //     temperature: 0,
    //     max_tokens: 64,
    //     top_p: 1.0,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     },
    // },
  ];
  const handleClick = (item) => {
    selectOption(item.name);
    setInput(item.description);
  };
 
  if (!articleInput) return <h1>Loading...</h1>;
  return (
    <>
      <h1 className="heading">AI Solutions</h1>

      <div className="grid-main">
        {arrayItems.map((item) => {
          return (
            <div
              key={item.id}
              className="grid-child"
              onClick={() => handleClick(item)}
            >
              <h3>{item.name}</h3>
              <p>{truncate(item.description)}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default OptionSelection;
