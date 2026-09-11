function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center h-64 text-white">
      <p className="text-red-400 text-xl">{message}</p>
    </div>
  );
}
export default ErrorMessage;