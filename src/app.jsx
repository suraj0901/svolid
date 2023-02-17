const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  return (
    <div>
      <button on:click={increment}>increment</button>
      <p>Count is {counter()}</p>
      <button on:click={decrement}>decrement</button>
    </div>
  );
};
