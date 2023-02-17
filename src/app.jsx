const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = "./image"
  return (
    <div>
      <button on:click={increment}>increment</button>
      <img {src} alt="random image"/>
      <p>Count is {counter()}</p>
      <button on:click={decrement}>decrement</button>
    </div>
  );
};
