import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { sendMsg } from "../redux/message/messageSlice";

const MessageUser = ({ receiverId }) => {
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		console.log("im her closeModal message");
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		setMessage("");
		dispatch(sendMsg({ receiverId, message }));
	};

	return (
		<div>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						type="text"
						name="message"
						id="message"
						placeholder="Enter your message"
						className=" bg-gray-100 py-4 px-6  border rounded-md outline-none focus:border-gray-400"
					/>
				</div>
			</Modal>
			<div
				onClick={openModal}
				className=" bg-gray-500 w-11 h-11 rounded-full flex items-center justify-center text-white "
			>
				<AiOutlineMessage className=" text-2xl " />
			</div>
		</div>
	);
};

export default MessageUser;
