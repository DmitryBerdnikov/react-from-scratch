const Fakeact = (() => {
  const createElement = (type, attributes = {}, ...children) => {
    const childElements = [].concat(...children).map((child) => {
        console.log(child);
    });

    return {
      type,
      children,
      props: attributes,
    }
  };

  return {
    createElement,
  };
})();