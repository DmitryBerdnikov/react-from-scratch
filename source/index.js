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

    this.changeTitle = this.changeTitle.bind(this);
  }

  changeTitle() {
    this.setState({ title: new Date().toString() })
  }

  render() {
    return (
      <div className="container">
        <h1>{this.state.title}</h1>
        <button onClick={this.changeTitle}>change title</button>
        <button onClick={() => console.log('test')}>Show console text</button>
      </div>
    )
  }
}

FakeReact.render(<Alert />, root);