import { useLoading } from "../context/loadingContext";

const SomeButton = () => {
  const { setIsLoading } = useLoading();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Do something async
      await new Promise((res) => setTimeout(res, 900)); // simulate request
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={() => handleClick()}  className="btn">
      Click Me
    </button>
  );
};
export default SomeButton