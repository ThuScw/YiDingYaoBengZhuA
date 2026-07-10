import ClickSpark from './components/effects/ClickSpark';
import GameContainer from './components/GameContainer/GameContainer';

export default function App() {
  return (
    <ClickSpark sparkCount={8} sparkSize={6}>
      <GameContainer />
    </ClickSpark>
  );
}
