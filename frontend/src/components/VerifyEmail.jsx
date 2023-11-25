import React from "react";
import { NavBar, Spinner } from ".";
import { verifyEmail } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";

function VerifyEmail({ setIsRegistered }) {
	const { user, verifyEmailStatus } = useSelector(
		(store) => store.userSlice
	);
	const dispatch = useDispatch();

	return (
		<div className="">
		
			<div className=" py-4 relative text-sm  font-inter h-[90vh] lg:h-[80vh] w-[90vw] lg:w-[60vw] bg-white grid place-content-center z-[500] rounded-md   ">
				<div
					onClick={() => setIsRegistered(false)}
					className=" absolute top-1 right-2"
				>
					<MdCancel className=" text-3xl text-red-400 drop-shadow-md hover:drop-shadow-none transition-all delay-75" />
				</div>
				{user?.isAccountVerified === true ? (
					<div className="flex justify-center items-center h-[80vh] w-screen  mx-auto  ">
						<h1> your Account is Already Verified</h1>
					</div>
				) : (
					<div className=" overflow-auto px-6 flex justify-start items-center  gap-4 flex-col ">
						<h1 className=" text-xl bg-blue-400 p-4 py-1 rounded-md text-white ">
							Welcome to blogVana!
						</h1>
						<p>
							We're thrilled to have you join our community of innovators
							and creators. But before we embark on this exciting journey
							together, we need to verify your email address.{" "}
						</p>
						<p>
							<span className=" text-blue-400 drop-shadow-md pr-1">
								Check Your Inbox:
							</span>
							We've just sent a magical email to your inbox. Click on the
							verification link inside to unlock a world of possibilities!
						</p>
						<p className=" self-start">
							<span className=" text-blue-400 drop-shadow-md pr-1">
								Pro Tip:
							</span>
							Can't find our email? Check your spam or junk folder.
							Sometimes, the internet likes to play hide and seek.
						</p>
						<p>
							Hurry, Time Waits For No One: This link will expire in 30
							minutes. Don't worry, though; if you miss it, simply request
							another one. We're flexible like that!
						</p>

						<button
							onClick={() => dispatch(verifyEmail())}
							className=" bg-blue-400 drop-shadow-sm px-1 rounded-sm hover:bg-blue-500 transition-all delay-75 text-white mt-4"
						>
							{verifyEmailStatus === "loading" ? <Spinner /> : "Resend"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default VerifyEmail;
