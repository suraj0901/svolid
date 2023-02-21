const app = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev++);
  const decrement = () => setCounter((prev) => prev--);
  const src = './image';
  return (() => {
    const _temp$ = _runtime$.template(
      '<button >increment</button> <img  alt="random image"/> <p >Count is <!></p> <p ><!> * 2 = <!></p> <button >decrement</button>'
    );

    return () => {
      let _el$ = _temp$.cloneNode(true);
      _el$.firstChild.$$click = increment;
      _runtime$.bind(() =>
        _el$.firstChild.nextSibling.setAttribute('src', src)
      );
      _runtime$.replace(
        _el$.firstChild.nextSibling.nextSibling.firstChild.nextSibling,
        () => counter()
      );
      _runtime$.replace(
        _el$.firstChild.nextSibling.nextSibling.nextSibling.firstChild,
        () => counter()
      );
      _runtime$.replace(
        _el$.firstChild.nextSibling.nextSibling.nextSibling.firstChild
          .nextSibling.nextSibling,
        () => counter() * 2
      );
      _el$.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.$$click =
        decrement;
      return _el$;
    };
  })();
};
