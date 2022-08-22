import './App.css';
import MintToken from './MintToken';
import MintNFT from './MintNFT';
import SendSol from './SendSol';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <MintToken />
        <MintNFT />
        {/* <SendSol /> */}
      </header>
    </div>
  );
}

export default App;
