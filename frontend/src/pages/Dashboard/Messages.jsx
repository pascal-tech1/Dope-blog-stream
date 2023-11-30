import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMsg } from "../../redux/message/messageSlice";
import { Spinner } from "../../components";
import { Link } from "react-router-dom";

const Messages = () => {
	const dispatch = useDispatch();
	const { msg, fetchMessageStatus, receivedMessageCount } = useSelector(
		(store) => store?.messageSlice
	);
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(() => {
		if (pageNumber === 1 && msg.length > 0) return;
		dispatch(fetchMsg({ page: pageNumber, limit: 1 }));
	}, [pageNumber]);
	return (
		<div>
			<div className="flex gap-6 flex-col">
				{msg.map((message) => {
					return (
						<div className="flex gap-2">
							<Link to={`/profile/${message?.sender?._id}`}>
								<img
									src={message?.sender?.profilePhoto}
									alt=""
									className=" self-start border bg-blue-400 w-10 h10 rounded-lg"
								/>
							</Link>
							<div className=" text-xs font-medium flex gap-1 flex-col">
								<h3 className="  text-pink-400">
									{`${message?.sender?.firstName} ${message?.sender?.lastName}`}
								</h3>
								<h3>{message?.message}</h3>
							</div>
						</div>
					);
				})}
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
