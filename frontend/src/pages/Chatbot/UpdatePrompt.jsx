import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateChatbotPrompt = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
    const [formData, setFormData] = useState({
      category: "",
      question: "",
      answer: "",
    });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5021/chatbotprompt?id=${id}`
      );
      setSelectedCategory(response.data[0].category);
      setQuestion(response.data[0].question);
      setAnswer(response.data[0].answer);
      setLoading(false);
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmedData = {
      category: selectedCategory.trim(),
      question: question.trim(),
      answer: answer.trim(),
    };
    await axios.put(
      `http://localhost:5021/chatbotprompt/update/${id}`,
      trimmedData
    );
    navigate("/manage-chatbot-prompts");
  };
  

  return (
    <div className="max-w-[1300px] pt-28">
      <Nav staff={true}/>
      <div className="mx-auto px-20">
        <h1 className="font-bold text-2xl md:text-4xl">
          Update Chatbot Prompt
        </h1>
        {!loading && (
          <form className="mt-6 flex flex-col" onSubmit={onSubmit}>
            <label
              htmlFor="category"
              className="items-center font-semibold text-xl mt-3 pb-2"
            >
              Category<span className="text-red-500 text-lg ">*</span>
            </label>
            <select
              id="category"
              name="category"
              className="p-2 border border-gray-300 mt-1 max-w-[300px] rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="FAQs and Help">FAQs and Help</option>
              <option value="Payments and Refunds">Payments and Refunds</option>
              <option value="Contact Us">Contact Us</option>
              <option value="Others">Others</option>
            </select>

            <label
              htmlFor="question"
              className="items-center font-semibold text-xl mt-3 pb-2"
            >
              Question<span className="text-red-500 text-lg">*</span>
            </label>
            <textarea
              id="question"
              placeholder="Enter Question"
              className="p-2 border border-gray-300 outline-none max-w-[450px] rounded-md my-2"
              style={{
                minHeight: "42px",
              }}
              rows="1"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <label
              htmlFor="answer"
              className="items-center font-semibold text-xl mt-3 pb-2"
            >
              Answer<span className="text-red-500 text-lg">*</span>
            </label>
            <textarea
              id="answer"
              placeholder="Enter Answer"
              className="p-2 border border-gray-300 outline-none max-w-[450px] rounded-md my-2"
              style={{
                minHeight: "90px",
              }}
              required
              cols="30"
              rows="3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
            <button
              className="text-white font-semibold text-lg p-3 rounded-lg max-w-[177px] my-12"
              style={{
                background:
                  "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              type="submit"
            >
              Update Prompt
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateChatbotPrompt;
