/** @jsx FakeReact.createElement */

const root = document.getElementById('root');

const App = (
  <div id="test" onClick={() => console.log('test')}>
    <p className="text"><span>One</span><span>Two</span></p>
    {2 === 1 && <div>False</div>}
    simple text
  </div>
);

console.log(App)

FakeReact.render(App, root);