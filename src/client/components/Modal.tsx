import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from "styled-components";

const Modal = ({ show, onClose }) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };


  const modalcontent = show ? (
    <StyledModalOverlay>
      <div className="modal-overlay" />
      <StyledModal>
        <StyledModalHeader>
          {/* <div
        className="modal-wrapper"
        aria-modal
        aria-hidden
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal"> */}
          <div className="modal-header">
            <button
              type="button"
              className="modal-close-button"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseClick}
            >
              <span aria-hidden="true">&times;</span>
            </button>

          </div>
        </StyledModalHeader>
        <h4>Pay using QR CODE</h4>
        <p>OR</p>
        <h4>Pay using WALLET EXTENSION</h4>
        {/* </div>
      </div> */}
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalcontent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

const StyledModalBody = styled.div`
  padding-top: 10px;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`;

const StyledModal = styled.div`
  background: white;
  width: 500px;
  height: auto;
  border-radius: 15px;
  padding: 15px;
`;
const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default Modal;