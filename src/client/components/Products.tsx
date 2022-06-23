import { useState } from "react";
import Modal from "./Modal";

export default function Products() {

  const [showModal, setShowModal] = useState(false);
  const [showPaid, setPaid] = useState(false);

  return (
    <form>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold">Cookies Box</h3>
          <p className="text-sm text-gray-800">Cookies box for 0.1SOL</p>
          <p className="my-4">
            <span className="mt-4 text-xl font-bold">0.1 SOL</span>
          </p>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className="max-w-fit items-center self-center rounded-md bg-gray-900 px-20 py-2 text-white hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50">
          Checkout
        </button>
        <Modal show={showModal} onClose={() => setShowModal(false)} >
        </Modal>
      </div>
    </form>
  )
}
