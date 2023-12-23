import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { sendMsg } from "../redux/message/messageSlice";

import { LuSend, LuSendHorizonal } from "react-icons/lu";
import { logOutUser } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const MessageUser = ({ receiverId }) => {
	console.log(receiverId);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	const isBlocked = useSelector((store) => store.messageSlice.isBlocked);

	useEffect(() => {
		if (isBlocked) {
			dispatch(logOutUser());
			navigate("/");
		}
	}, [isBlocked]);

	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		setMessage("");
		dispatch(sendMsg({ receiverId, message }));
	};

	return (
		<div className=" font-inter">
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
						className=" bg-gray-100 dark:bg-dark py-2 px-2  border rounded-md outline-none focus:border-gray-400"
					/>
				</div>
			</Modal>
			<div
				onClick={openModal}
				className=" cursor-pointer p-2 rounded-full hover:bg-gray-500 hover:rounded-full flex items-center justify-center dark:text-white text-gray-600 transition-all delay-75 "
			>
				<LuSendHorizonal className=" text-lg  " />
			</div>
		</div>
	);
};

export default MessageUser;
