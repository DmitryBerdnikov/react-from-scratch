/** @jsx FakeReact.createElement */

const root = document.getElementById('root');

const App = (
  <div id="test">
    <p><span>One</span><span>Two</span></p>
    {2 === 1 && <div>False</div>}
    simple text
  </div>
);

FakeReact.render(App, root);