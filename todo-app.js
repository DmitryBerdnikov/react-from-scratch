/** @jsx FakeReact.createElement */

const root = document.getElementById('root');

const App = (
  <div id="test">
    <p><span>Boo</span></p>
    {2 === 1 && <div>False</div>}
    simple text
  </div>
);

console.log(App);