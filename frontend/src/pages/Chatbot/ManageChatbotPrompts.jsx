import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ManageChatbotPrompts = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState();
  const [categorySortOrder, setCategorySortOrder] = useState("none");
  const [dateSortOrder, setDateSortOrder] = useState("dateDesc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let response;
      if (categorySortOrder !== "none") {
        response = await axios.get(
          `http://localhost:5021/ChatbotPrompt?sortBy=${categorySortOrder}&search=${search.toLowerCase()}`
        );
      } else {
        response = await axios.get(
          `http://localhost:5021/ChatbotPrompt?sortBy=${dateSortOrder}&search=${search.toLowerCase()}`
        );
      }
      setPrompts(response.data);
    };

    fetchData();
  }, [categorySortOrder, dateSortOrder, search]);

  const deletePrompt = async (id) => {
    const response = await axios.delete(
      `http://localhost:5021/chatbotprompt/delete/${id}`
    );
    const { data } = await axios.get("http://localhost:5021/ChatbotPrompt");
    setPrompts(data);
  };

  const toggleSortOrder = (sortType) => {
    if (sortType === "category") {
      const newSortOrder =
        categorySortOrder === "none"
          ? "categoryAsc"
          : categorySortOrder === "categoryAsc"
          ? "categoryDesc"
          : "none";
      setCategorySortOrder(newSortOrder);
      setDateSortOrder("none"); // Reset dateSortOrder when toggling category sort
    } else if (sortType === "date") {
      const newSortOrder = dateSortOrder === "dateAsc" ? "dateDesc" : "dateAsc";
      setDateSortOrder(newSortOrder);
      setCategorySortOrder("none"); // Reset categorySortOrder when toggling date sort
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Step 3: Update search state on input change
  };

  return (
    <div>
      <Nav staff={true} />
      <div className="max-w-[1300px] mx-auto px-4 pt-28 pb-2">
        <h1 className="font-bold text-3xl">Manage Chatbot Prompts</h1>

        <div className="flex justify-between pt-8">
          <input
            type="text"
            placeholder="Search prompts"
            className="py-2 px-4 border outline-none rounded-lg border-gray-500 w-[300px]"
            onChange={handleSearchChange}
            value={search}
          />
          <button
            className="rounded-lg text-white font-medium px-4 py-2 text-lg"
            style={{
              background:
                "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            onClick={() => navigate("/create-chatbot-prompt")}
          >
            + Add Prompt
          </button>
        </div>

        <table
          className="mt-8 w-full rounded-lg"
          style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }}
        >
          <thead className="border-b-[3px] border-b-[#E6533F]">
            <tr>
              <td className="py-5 text-xl font-bold pl-6 w-[100px]">ID</td>
              <td
                className="py-5 text-xl font-bold w-[170px]"
                onClick={() => toggleSortOrder("category")}
              >
                Category{" "}
                <span className="cursor-pointer ml-1 text-sm">
                  {categorySortOrder === "none"
                    ? "▲▼"
                    : categorySortOrder === "categoryAsc"
                    ? "▲"
                    : "▼"}
                </span>
              </td>
              <td className="py-5 text-xl font-bold pl-6 w-[280px]">
                Question
              </td>
              <td className="py-5 text-xl font-bold pl-6 w-[280px]">Answer</td>
              <td
                className="py-5 text-xl font-bold pl-6 w-[160px]"
                onClick={() => toggleSortOrder("date")}
              >
                Updated At{" "}
                <span className="cursor-pointer ml-1 text-sm">
                  {dateSortOrder === "dateAsc" ? "▲" : "▼"}
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            {prompts?.map((prompt, index) => {
              return (
                <tr
                  className={`${index % 2 == 0 ? "bg-gray-50" : ""}`}
                  id={prompt.id}
                  key={prompt.id}
                >
                  <td className="pl-6 py-4 font-bold">{prompt.id}</td>
                  <td>{prompt.category}</td>
                  <td
                    className="overflow-hidden max-w-[200px] whitespace-nowrap text-ellipsis pl-6"
                    title={prompt.question}
                  >
                    {prompt.question}
                  </td>
                  <td
                    className="overflow-hidden max-w-[150px] whitespace-nowrap text-ellipsis pl-6"
                    title={prompt.answer}
                  >
                    {prompt.answer}
                  </td>
                  <td className="pl-6">{dayjs(prompt.updatedAt).fromNow()}</td>
                  <td className="pr-6 py-4 flex justify-end items-center gap-2">
                    <div className="flex gap-4 pl-6">
                      <button
                        className="text-sm rounded-lg text-white font-medium px-4 py-2 "
                        style={{
                          background:
                            "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                        onClick={() =>
                          navigate(`/update-chatbot-prompt/${prompt.id}`)
                        }
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="text-sm rounded-lg text-white font-medium px-4 py-2"
                        style={{
                          background:
                            "linear-gradient(111deg, #FF2424 -1.39%, #580C0C 143.42%)",
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageChatbotPrompts;
