import React from "react";
import { AiOutlineClose } from "react-icons/ai";

function DashboardModal({ setShowDashboardModal, SetItemId, title, customStyle, children }) {

	function handleModalClose() {
		setShowDashboardModal(false);

		if(SetItemId) {
			SetItemId(null)
		}
	}

	return (
		<>
			<div className="overlay" onClick={handleModalClose} />
			<div className="modal" style={customStyle}>
				<span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={handleModalClose} />
				</span>

				<div className="modal__content">{children}</div>
			</div>
		</>
	);
}

export default DashboardModal;
