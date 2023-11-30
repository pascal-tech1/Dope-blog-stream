import React, { useState } from "react";
import Modal from "./Modal";
import { blockOrUnblockUser } from "../redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { BiBlock } from "react-icons/bi";
import { BsUnlock } from "react-icons/bs";

const BlockOrUnblockUser = ({ user }) => {
	console.log(user.isBlocked);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		dispatch(
			blockOrUnblockUser({
				userId: user?._id,
				action: user?.isBlocked ? "unblock" : "block",
			})
		);
	};

	return (
		<div>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<h1>
						Do you want to continue to{" "}
						{user?.isBlocked ? "unblock " : "block "} {user?.firstName}{" "}
						{user?.lastName}
					</h1>
				</div>
			</Modal>
			<button
				onClick={() => openModal()}
				className=" px-2 py-1 text-sm  drop-shadow-sm rounded-xl text-red-400 hover:drop-shadow-none hover:bg-red-300 transition-all delay-75"
			>
				{user.isBlocked ? <BiBlock /> : <BsUnlock />}
			</button>
		</div>
	);
};

export default BlockOrUnblockUser;
