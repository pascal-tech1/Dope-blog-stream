import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { confirmSentEmail, verifyEmail } from "../redux/user/userSlice";
import { NavBar, Spinner } from "../components";

const ComfirmEmailPage = () => {
	const { token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);

	const email = searchParams.get("email");
	console.log(token, email);
	useEffect(() => {
		dispatch(confirmSentEmail(token));
	}, []);

	const { confirmSentEmailStatus, user, verifyEmailStatus } = useSelector(
		(store) => store.userSlice
	);

	return (
		<div className=" font-inter">
			<div className=" flex items-center justify-center h-[80vh] w-screen">
				{confirmSentEmailStatus === "loading" && <Spinner />}
				{confirmSentEmailStatus === "failed" && (
					<div className="flex flex-col gap-4">
						<h1>
							Token is expired or invalid, click below to resend email
						</h1>
						<button
							className=" self-center bg-blue-400 rounded-md px-1 text-white hover:bg-blue-600 transition-all delay-75 my-3"
							onClick={() => dispatch(verifyEmail(email))}
						>
							Resend
						</button>
					</div>
				)}
				{confirmSentEmailStatus === "success" && (
					<div className="flex flex-col gap-4">
						<h1>
							your email address has been successfully verified. Welcome to
							BlogVana, where innovation meets excellence!
						</h1>
						<button
							className=" self-center bg-blue-400 rounded-md px-3 py-1 text-white hover:bg-blue-600 transition-all delay-75 my-3"
							onClick={() => navigate("/login")}
						>
							login
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ComfirmEmailPage;
