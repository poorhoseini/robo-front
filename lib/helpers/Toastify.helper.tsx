import { ToastContainer } from "react-toastify";

export function ToastifyContainer() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      draggableDirection="y"
      pauseOnHover
      theme="light"
      toastClassName="w-full"
    />
  );
}
