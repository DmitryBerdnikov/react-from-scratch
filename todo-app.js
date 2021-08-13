/** @jsx Fakeact.createElement */

const root = document.getElementById('root');

const App = (
  <div>
    <p><span>Boo</span></p>
    {2 === 1 && <div>False</div>}
  </div>
);

console.log(App);