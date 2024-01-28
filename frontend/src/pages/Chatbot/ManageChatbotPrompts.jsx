import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const ManageChatbotPrompts = () => {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState();

    useEffect(() => {
        (async () => {
            const response = await axios.get(("http://localhost:5021/ChatbotPrompt"))
            setPrompts(response.data)
        })();
    }, []);
    
    const deletePrompt = async (id) => {
		const response = await axios.delete(`http://localhost:5021/chatbotprompt/delete/${id}`);
		const { data } = await axios.get("http://localhost:5021/ChatbotPrompt");
		setPrompts(data);
	}

    return <div>
        <Nav staff={true}/>
        <div className="max-w-[1300px] mx-auto px-4 pt-28 pb-2" >
            <div className="flex justify-between">
            <h1 className="font-bold text-3xl">Manage Chatbot Prompts</h1> 
            <button className="rounded-lg text-white font-medium px-4 py-2 text-lg" style={{
					background: "linear-gradient(115deg, #933EFF -3.79%, #BA93FF 107.45%)",
					boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
				}} onClick={() => navigate("/create-chatbot-prompt")}>+ Add Prompt</button>
			</div>
            <table className="mt-12 w-full rounded-lg" style={{ boxShadow: "0px 1px 2px 2px rgba(0, 0, 0, 0.50)" }} >
				<thead className="border-b-[3px] border-b-[#E6533F]">
					<tr>
						<td className="py-5 text-xl font-bold pl-6 w-[100px]">ID</td>
						<td className="py-5 text-xl font-bold w-[170px]">Category</td>
						<td className="py-5 text-xl font-bold pl-6 w-[280px]">Question</td>
                        <td className="py-5 text-xl font-bold pl-6 w-[280px]">Answer</td>
                        <td className="py-5 text-xl font-bold pl-6 w-[150px]">Updated At</td>
					</tr>
				</thead>
				<tbody>
					{prompts?.map((prompt, index) => {
						return <tr className={`${index % 2 == 0 ? "bg-gray-50" : ""}`} id={prompt.id} key={prompt.id}>
							<td className="pl-6 py-4 font-bold">{prompt.id}</td>
							<td >{prompt.category}</td>
                            <td className="overflow-hidden max-w-[200px] whitespace-nowrap text-ellipsis pl-6" title={prompt.question}>{prompt.question}</td>
                            <td className="overflow-hidden max-w-[150px] whitespace-nowrap text-ellipsis pl-6" title={prompt.answer}>{prompt.answer}</td>
                            <td className="pl-6">{dayjs(prompt.updatedAt).fromNow()}</td>
							<td className="pr-6 py-4 flex justify-end items-center gap-2">
								<div className="flex gap-4 pl-6">
									<button className="text-sm rounded-lg text-white font-medium px-4 py-2 " style={{
										background: "linear-gradient(109deg, #EB4710 20.67%, #FBDA01 144.1%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}} onClick={() => navigate(`/update-chatbot-prompt/${prompt.id}`)}>Edit Details</button>
									<button onClick={() => deletePrompt(prompt.id)} className="text-sm rounded-lg text-white font-medium px-4 py-2" style={{
										background: "linear-gradient(111deg, #FF2424 -1.39%, #580C0C 143.42%)",
										boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
									}}>Delete</button>
								</div>
							</td>
						</tr>
					})}
					<tr>
						
					</tr>
				</tbody>	
			</table>
        </div>
        </div>
    
}

export default ManageChatbotPrompts;