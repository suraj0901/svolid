const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = "./image"
  return (
     ` <div ><button >increment</button>s<img src=${src} alt="random image"/>s<p >Count iss<span>${counter()}</span></p>s<p ><span>${counter()}</span>s* 2 =s<span>${counter()*2}</span></p>s<button >decrement</button></div> `
  );
};

export default app
