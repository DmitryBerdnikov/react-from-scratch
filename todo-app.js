/** @jsx FakeReact.createElement */

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

const Heart = (props) => <span style={props.style}>test</span>;

FakeReact.render(<Heart style="color: red;" />, root);