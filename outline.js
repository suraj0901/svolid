export const _temp$ = window._runtime$.template(
  ''
);
// for server
const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = './image';
  return `
  <!-- app -->
  <div >
    <button >increment</button> 
    <img src="${src}" alt="random image"/> 
    <p >Count is <span>${counter()}</span></p> 
    <p ><span>${counter()}</span> * 2 = <span>${counter() * 2}</span></p> 
    <button >decrement</button>
  </div>
  `
  // return (() => {
  //   let _el$ = _temp$.cloneNode(true);
  //   _el$[1].setAttribute('src', src)
  //   window._runtime$.replace([
  //     _el$[2][1],
  //     () => counter(),
  //     _el$[3][0],
  //     () => counter(),
  //     _el$[3][2],
  //     () => counter() * 2,
  //   ]);
  //   return _el$;
  // })();
};

// for client
export const $client = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = './image';
  const _el$ = document.getElementById("dsadfd")
  _el$[0].onclick = increment;
  _el$[4].onclick = decrement;
  window._runtime$.bindAttr(() => src, _el$[1],'src');
  window._runtime$.bindText(() => counter(), _el$[2][1]);
  window._runtime$.bindText(() => counter(), _el$[3][0]);
  window._runtime$.bindText(() => counter() * 2, _el$[3][2]);
}
export default app;

