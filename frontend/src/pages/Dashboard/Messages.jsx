import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMsg } from "../../redux/message/messageSlice";
import { LoadingSpinner, MessagesComp, Spinner } from "../../components";

import { setIsSearchBArNeeded } from "../../redux/user/userSlice";

const Messages = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);
	const dispatch = useDispatch();
	const { msg, fetchMessageStatus, receivedMessageCount } = useSelector(
		(store) => store?.messageSlice
	);
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		if (
			(pageNumber === 1 && msg.length > 0) ||
			fetchMessageStatus === "loading" ||
			fetchMessageStatus === "undefine"
		)
			return;
		dispatch(fetchMsg({ page: pageNumber, limit: 2 }));
	}, [pageNumber]);

	return (
		<div>
			<div className="flex gap-6 font-inter flex-col dark:bg-[#171717] p-4 drop-shadow-sm">
				{fetchMessageStatus === "loading" && pageNumber === 1 ? (
					<LoadingSpinner />
				) : (
					<div>
						<h1 className="font-semibold place-self-center text-blue-400   max-w-max pb-1 ">
							messages
						</h1>

						<h3 className=" font-medium text-gray-900 drop-shadow-md dark:text-slate-200">
							All message count: <span>{receivedMessageCount} </span>{" "}
						</h3>
						<MessagesComp msg={msg} IsMessage={true} />
						{msg.length === 0 && <h1>you have no messages</h1>}
					</div>
				)}

				{receivedMessageCount > msg.length && (
					<div>
						{fetchMessageStatus === "loading" ? (
							<Spinner />
						) : (
							<button
								onClick={() => setPageNumber((prev) => prev + 1)}
								className=" text-white self-start bg-blue-400 px-2 hover:bg-blue-600 transition-all delay-75 drop-shadow-lg rounded-lg "
							>
								load more
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Messages;
