const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = "./image"
  return (
     ` <div ><button >increment</button> <img src=${src} alt="random image"/> <p >Count is <span>${counter()}</span></p> <p ><span>${counter()}</span> * 2 = <span>${counter()*2}</span></p> <button >decrement</button></div> `
  );
};

export default app
