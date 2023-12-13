import React from "react";
import LazyLoadImg from "./LazyLoadImg";
import { Link } from "react-router-dom";

const MessagesComp = ({ msg, length }) => {
	return (
		<div className="flex gap-6 flex-col">
			{msg.map((message) => {
				return (
					<div className="flex gap-2">
						<Link to={`/profile/${message?.sender?._id}`}>
							<LazyLoadImg
								backgroundClassName={
									"self-start border w-10 h10 rounded-lg relative"
								}
								imgClassName={
									"absolute inset-0 w-full h-full  object-cover rounded-lg "
								}
								originalImgUrl={message.sender.profilePhoto}
								blurImageStr={message.sender.blurProfilePhoto}
								optimizationStr={"q_auto,f_auto,w_100"}
								paddingBottom={"100%"}
							/>
						</Link>
						<Link to={`/profile-message`}>
							<div className=" font-medium flex gap-1 flex-col">
								<h3 className="  text-pink-400">
									{`${message?.sender?.firstName} ${message?.sender?.lastName}`}
								</h3>
								{length ? (
									<h3 className="text-sm">{`${message?.message.slice(0, length)}...`}</h3>
								) : (
									<h3>{message?.message}</h3>
								)}
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default MessagesComp;
