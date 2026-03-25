import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:5000/status")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>
      <h1>Vigilant Driver AI</h1>
    </div>
  );
}

export default App;