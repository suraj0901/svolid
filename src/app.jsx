const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = "./image"
  return (
    <>
      <button on:click={increment}>increment</button>
      <img {src} alt="random image"/>
      <p>Count is {counter()}</p>
      <p>{counter()} * 2 = {counter()*2}</p>
      <button on:click={decrement}>decrement</button>
    </>
  );
};

export default app
