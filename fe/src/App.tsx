import React, { useEffect, useState } from "react";
import "./App.css";
import cat from "./cat.png";
import dog from "./dog.jpeg";
import { getData, postData } from "./utils";

function App() {
  const [selection, setSelection] = useState<"cat" | "dog" | "">();
  const [data, setData] = useState();

  useEffect(() => {
    getData("http://localhost:1111/prefs").then((data) => {
      console.log(data.body)
    });
  }, []);

  const submitSelection = () => {
    postData("http://localhost:1111/prefs", selection).then((data) => {
      console.log(data);
    });
  };
  return (
    <div>
      <div className="App">
        <div>
          <img src={dog} alt="dog" className="img" />
          <input
            type="radio"
            id="dog"
            name="pref"
            value="dog"
            checked={selection === "dog"}
            onClick={() => setSelection("dog")}
          />
          <label htmlFor="dog">Dog</label>
        </div>

        <div>
          <img src={cat} alt="cat" className="img" />
          <input
            type="radio"
            id="cat"
            name="pref"
            value="cat"
            checked={selection === "cat"}
            onClick={() => setSelection("cat")}
          />
          <label htmlFor="cat">Cat</label>
        </div>
      </div>

      <button onClick={submitSelection} disabled={selection === ""}>
        I made my mind
      </button>
    </div>
  );
}

export default App;
