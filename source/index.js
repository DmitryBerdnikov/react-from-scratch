/** @jsx FakeReact.createElement */
import FakeReact from '../lib/lib';

const root = document.getElementById('root');

// const App1 = (
//   <div id="test" onClick={() => console.log('test')}>
//     <p className="text"><span>One</span><span>Two</span></p>
//     {2 === 1 && <div>False</div>}
//     simple text
//   </div>
// );

// FakeReact.render(App1, root);

// setTimeout(() => {
//   console.log('re-rendering');

//   const App2 = (
//     <div id="test" onClick={() => console.log('test')}>
//       <p style="background: red;" className="bar"><span>One</span><span>Two</span></p>
//       {2 === 1 && <div>False</div>}
//       new simple text
//     </div>
//   );
  
//   FakeReact.render(App2, root);
// }, 1000);

// const Heart = (props) => <span style={props.style}>test</span>;

// const Button = (props) => {
//   return <button onClick={props.onClick}>{props.children}</button>
// }

// const Greeting = (props) =>
//   <Button onClick={() => console.log(props.message)}>another text</Button>

// FakeReact.render(<Greeting message="Good day" />, root);

// stateful component

class Alert extends FakeReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Default title'
    };
  }

  updateTitle() {
    this.setState({ title: 'new Title' })
  }

  changeTitle() {
    this.setState({ title: new Date().toString() })
  }

  render() {
    return <h1 onClick={this.updateTitle.bind(this)}>{this.state.title}</h1>
  }
}

FakeReact.render(<Alert title="bar" />, root);
