import React, { useState } from "react";
import Modal from "./Modal";
import { blockOrUnblockUser } from "../redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { BiBlock } from "react-icons/bi";
import { BsUnlock } from "react-icons/bs";
import { MdLockOpen, MdLockPerson, MdLockReset } from "react-icons/md";
import { IoMdUnlock } from "react-icons/io";

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
				className="  p-2 text-lg  drop-shadow-sm rounded-xl hover:drop-shadow-none "
			>
				{user.isBlocked ? (
					<div className="text-red-400 hover:bg-red-100 rounded-full p-2 transition-all delay-75">
						<MdLockPerson className=" text-lg " />
					</div>
				) : (
					<div className="text-green-400 hover:bg-green-100 p-2 rounded-full  transition-all delay-75">
						<MdLockOpen className=" text-lg" />
					</div>
				)}
			</button>
		</div>
	);
};

export default BlockOrUnblockUser;
