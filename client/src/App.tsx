import React, { useEffect, useState } from "react";
import axios from "axios";
import { postData } from "./utils";
import "./App.css";
import cat from "./cat.png";
import dog from "./dog.jpeg";

function App() {
  const [selection, setSelection] = useState<"cat" | "dog" | "">();
  const [data, setData] = useState<Array<{ id: number; selection: string }>>();

  useEffect(() => {
    axios.get("http://localhost:1111/prefs").then((res) => {
      setData(res.data);
    });
  }, [data]);

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
            onChange={() => setSelection("dog")}
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
            onChange={() => setSelection("cat")}
          />
          <label htmlFor="cat">Cat</label>
        </div>
      </div>

      <button onClick={submitSelection} disabled={selection === ""}>
        I made my mind
      </button>
      <div>
        {data?.map((i) => (
          <div key={i.id}>
            <span> {i.id}</span>
            <span> {i.selection}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
