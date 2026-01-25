
import Frame2 from "./Frame2";

const Single = () => {
 
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <header className="w-[800px]">
          <h1 className="text-4xl font-bold border-6 border-solid border-white bg-red-800  px-4 py-2 mb-2 ">
            Guess.It
          </h1>
        </header>
        <Frame2 />
        <footer>
          <p>&copy; 2025 Guess.IT. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Single;
