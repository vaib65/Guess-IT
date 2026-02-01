const InputField = ({ value, onChange, placeholder }) => (
  <input
    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);
export default InputField;