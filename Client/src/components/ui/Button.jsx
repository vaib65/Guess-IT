const Button = ({ onClick, disabled, children }) => (
  <button
    className="w-full h-10 rounded-[19px] text-white bg-[#2bab2b] hover:bg-[#1d851d] mt-3 cursor-pointer outline-none"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
export default Button