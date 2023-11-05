import React, { useState, useEffect } from "react";

function Modal({ isOpen, onClose, onContinue, children }) {
	console.log(isOpen);
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (isOpen && e.key === "Escape") {
				onClose();
			}
			if (isOpen && e.key === "Enter") {
				onContinue();
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isOpen, onClose, onContinue]);

	
	const closeModal = () => {
		onClose();
	};

	const continueAction = () => {
		onContinue();
	};
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && isOpen) {
			onClose();
		}
	};

	return (
		<div
			className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50  ${
				isOpen ? "" : "hidden"
			}`}
			onClick={(e) => handleBackdropClick(e)}
		>
			<div
				className=" bg-white  text-black p-4 w-[90%] rounded-lg md:w-1/2 flex flex-col items-center gap-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-4">{children}</div>
				<div className=" flex flex-col items-center gap-2">
					<div className="flex gap-4 items-center">
						<div className="">
							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-700 rounded-md py-1 text-white px-2"
								onClick={continueAction}
							>
								Continue
							</button>
						</div>
						<div className="">
							<button
								className="text-red-500 hover:text-red-700"
								onClick={closeModal}
							>
								Close
							</button>
						</div>
					</div>
					<div className=" text-xs">
						<h4>
							pres ESC key on your keyboard or click on the overlay to
							close
						</h4>
						<h4>pres Enter key to continue</h4>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;
