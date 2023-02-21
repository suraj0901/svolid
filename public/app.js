export const _temp$ = _runtime$.template(
  '<button >increment</button> <img  alt="random image"/> <p >Count is <!></p> <p ><!> * 2 = <!></p> <button >decrement</button>'
);
const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = './image';
  return (() => {
    let _el$ = _temp$.cloneNode(true);
    _el$[0].$$click = increment;
    _runtime$.bind(() => _el$[1].setAttribute('src', src));
    _el$[4].$$click = decrement;
    _runtime$.replace([
      _el$[2][1],
      () => counter(),
      _el$[3][0],
      () => counter(),
      _el$[3][2],
      () => counter() * 2,
    ]);
    return _el$;
  })();
};

export default app;
