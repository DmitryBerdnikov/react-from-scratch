const FakeReact = (() => {
  const createElement = (type, props = {}, ...children) => {
    const childElements = [...children].map((child) => {
      if (child instanceof Object) {
        return child;
      }

      if (child === null || typeof child === 'boolean') {
        return;
      }

      return createElement('text', { textContent: child });
    }).filter(n => n !== undefined)

    return {
      type,
      children: childElements,
      props,
    }
  };

  return {
    createElement,
  };
})();
