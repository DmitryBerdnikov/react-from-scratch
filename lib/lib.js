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

  const mountSimpleNode = (vdom, container, oldDomElement, parentComponent) => {
    let newDomElement = null;
    const nextSibling = oldDomElement?.nextSibling;

    if (vdom.type === 'text') {
      newDomElement = document.createTextNode(vdom.props.textContent);
    } else {
      newDomElement = document.createElement(vdom.type);
    }

    newDomElement._virtualElement = vdom;
    if (nextSibling) {
      container.insertBefore(newDomElement, nextSibling);
    } else {
      container.appendChild(newDomElement);
    }

    vdom.children.forEach((child) => {
      mountElement(child, newDomElement);
    });
  }

  const mountElement = (vdom, container, oldDom) => {
    return mountSimpleNode(vdom, container, oldDom);
  };

  const render = (vdom, container, oldDom) => {
    if (!oldDom) {
      mountElement(vdom, container, oldDom);
    }
  };

  return {
    createElement,
    render,
  };
})();
