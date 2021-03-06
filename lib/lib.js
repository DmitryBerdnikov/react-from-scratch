const createElement = (type, props = {}, ...children) => {
  // TODO: investigate why sometimes children is simple array []
  // and sometimes it's array of arrays [[]]
  // it's because we have props.children that is array
  // console.log(type, props, children)
  const childElements = [].concat(...children).map((child) => {
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
    props: { ...props, children: childElements },
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

const updateTextNode = (domElement, newVirtualElement, oldVirtualElement) => {
  if (newVirtualElement.props.textContent !== oldVirtualElement.props.textContent) {
      domElement.textContent = newVirtualElement.props.textContent;
  }
  // Set a reference to the newvddom in oldDom
  domElement._virtualElement = newVirtualElement;
}

const isFunction = (obj) => typeof obj?.type === 'function';

const isFunctionalComponent = (vnode) => {
  const nodeType = vnode?.type;
  return nodeType && isFunction(vnode) && !nodeType.prototype?.render;
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

  // TODO: remove old nodes
  if (oldDomElement) {
    unmountNode(oldDomElement, parentComponent)
  }

  if (nextSibling) {
    container.insertBefore(newDomElement, nextSibling);
  } else {
    container.appendChild(newDomElement);
  }

  const component = vdom.component;
  
  if (component) {
    component.setDomElement(newDomElement)
  }

  vdom.children.forEach((child) => {
    mountElement(child, newDomElement);
  });
}

const buildFunctionalComponent = (vnode) => vnode.type(vnode.props || {});

const buildStatefulComponent = (virtualElement) => {
  const component = new virtualElement.type(virtualElement.props);
  const nextElement = component.render();
  nextElement.component = component;

  return nextElement;
}

const mountComponent = (vdom, container, oldDomElement) => {
  let nextvDom = null;
  let newDomElement = null;

  if (isFunctionalComponent(vdom)) {
    nextvDom = buildFunctionalComponent(vdom);
  } else {
    nextvDom = buildStatefulComponent(vdom);
  }


  if (isFunction(nextvDom)) {
    return mountComponent(nextvDom, container, oldDomElement);
  } else {
    newDomElement = mountElement(nextvDom, container, oldDomElement);
  }
  
  return newDomElement;
}

const mountElement = (vdom, container, oldDom) => {
  if (isFunction(vdom)) {
    return mountComponent(vdom, container, oldDom);
  }

  return mountSimpleNode(vdom, container, oldDom)
};

const render = (vdom, container) => {
  const oldDom = container.firstChild;
  diff(vdom, container, oldDom);
};

const unmountNode = (domElement, parentComponent) => {
  domElement.remove();
}

const diffComponent = (newVirtualElement, oldComponent, container, domElement) => {
  if (isSameComponentType(oldComponent, newVirtualElement)) {
    updateComponent(newVirtualElement, oldComponent, container, domElement);
  } else {
      mountElement(newVirtualElement, container, domElement);
  }
}

const isSameComponentType = (oldComponent, newVirtualElement) => {
  return oldComponent && newVirtualElement.type === oldComponent.constructor;
}

const updateComponent = (newVirtualElement, oldComponent, container, domElement) => {
  oldComponent.componentWillReceiveProps(newVirtualElement.props);
  if (oldComponent.shouldComponentUpdate(newVirtualElement.props)) {
    const prevProps = oldComponent.props;

    oldComponent.componentWillUpdate(
      newVirtualElement.props,
      oldComponent.state
    );

    oldComponent.updateProps(newVirtualElement.props);

    const nextElement = oldComponent.render();
    nextElement.component = oldComponent;

    diff(nextElement, container, domElement, oldComponent);

    oldComponent.componentDidUpdate(prevProps);
  }
}

// TODO: bug it doesn't update new props if element change position
// TODO: bug it doesn't remove old props
const diff = (vdom, container, oldDom) => {
  let oldvdom = oldDom?._virtualElement;
  const oldComponent = oldDom && oldvdom.component;
  if (!oldDom) {
    mountElement(vdom, container, oldDom);
  } else if (typeof vdom.type === 'function') {
    diffComponent(vdom, oldComponent, container, oldDom);
  }
  else if (oldvdom && oldvdom.type === vdom.type) {
    if (oldvdom.type === 'text') {
      updateTextNode(oldDom, vdom, oldvdom);
    } else {
      updateDomElement(oldDom, vdom, oldvdom);
    }

    oldDom._virtualElement = vdom;

    vdom.children.forEach((child, i) => {
      diff(child, oldDom, oldDom.childNodes[i]);
    })

    // remove old dom nodes
    // TODO: bug, it always removes last elements
    let oldNodes = oldDom.childNodes;
    if (oldNodes.length > vdom.children.length) {
      for (let i = oldNodes.length - 1; i >= vdom.children.length; i -= 1) {
        const nodeToBeRemoved = oldNodes[i];
        unmountNode(nodeToBeRemoved, oldDom);
      }
    }
  }
}

class Component {
  constructor(props) {
    this.props = props
    this.state = {};
    this.prevState = {};
  }

  setState = (nextState) => {
    if (!this.prevState) {
      this.prevState = this.state
    }

    this.state = Object.assign({}, this.state, nextState)
    const dom = this.getDomElement();
    const container = dom.parentNode;
    const newvdom = this.render();

    diff(newvdom, container, dom)
  }

  setDomElement(dom) {
    this._dom = dom;
  }

  getDomElement() {
    return this._dom;
  }

  updateProps(props) {
    this.props = props;
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}

  // TODO: add nextState
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
}

export default {
  createElement,
  render,
  Component,
}
