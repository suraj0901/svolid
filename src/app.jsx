const app = () => {
  let counter = 0;
  const increment = () => counter++;
  const decrement = () => counter--;
  return (
    <div>
      <button on:click={increment}>increment</button>
      <p>Count is {counter}</p>
      <button on:click={decrement}>decrement</button>
    </div>
  );
};
