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

  const updateDomElement = (domElement, newVirtualElement, oldVirtualElement = {}) => {
    const newProps = newVirtualElement.props || {};
    const oldProps = oldVirtualElement.props || {};
    Object.keys(newProps).forEach(propName => {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];
        if (newProp !== oldProp) {
            if (propName.slice(0, 2) === "on") {
                // prop is an event handler
                const eventName = propName.toLowerCase().slice(2);
                domElement.addEventListener(eventName, newProp, false);
                if (oldProp) {
                    domElement.removeEventListener(eventName, oldProp, false);
                }
            } else if (propName === "value" || propName === "checked") {
                // this are special attributes that cannot be set
                // using setAttribute
                domElement[propName] = newProp;
            } else if (propName !== "children") {
                // ignore the 'children' prop
                if (propName === "className") {
                    domElement.setAttribute("class", newProps[propName]);
                } else {
                    domElement.setAttribute(propName, newProps[propName]);
                }
            }
        }
    });

    // remove oldProps
    Object.keys(oldProps).forEach(propName => {
        const newProp = newProps[propName];
        const oldProp = oldProps[propName];
        if (!newProp) {
            if (propName.slice(0, 2) === "on") {
                // prop is an event handler
                domElement.removeEventListener(propName, oldProp, false);
            } else if (propName !== "children") {
                // ignore the 'children' prop
                domElement.removeAttribute(propName);
            }
        }
    });
  }

  const mountSimpleNode = (vdom, container, oldDomElement, parentComponent) => {
    let newDomElement = null;
    const nextSibling = oldDomElement?.nextSibling;

    if (vdom.type === 'text') {
      newDomElement = document.createTextNode(vdom.props.textContent);
    } else {
      newDomElement = document.createElement(vdom.type);
      updateDomElement(newDomElement, vdom);
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
