import React, { useRef, useEffect } from "react";
import { Network } from "vis-network";
import "./App.css";

function JSONVisualizer({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Convert JSON to nodes and edges for vis-network
    const createGraphData = (json) => {
      const nodes = [];
      const edges = [];

      let idCounter = 1;

      const traverse = (node, parentId = null, keyName = null) => {
        const nodeId = idCounter++;

        // Determine label: include key and value for primitives or key for objects
        let label;
        if (keyName !== null) {
          label = typeof node === "object" ? keyName : `${keyName}: ${node}`;
        } else {
          label = typeof node === "object" ? "root" : String(node);
        }

        nodes.push({ id: nodeId, label });

        if (parentId !== null) {
          edges.push({ from: parentId, to: nodeId });
        }

        if (typeof node === "object" && node !== null) {
          Object.entries(node).forEach(([key, value]) => {
            traverse(value, nodeId, key); // Pass the key to be used as the label
          });
        }
      };

      traverse(json); // Start traversal with the JSON object
      return { nodes, edges };
    };



    const graphData = createGraphData(data);

    const options = {
      nodes: {
        shape: "box",
        color: {
          background: "#D2E5FF",
          border: "#2B7CE9",
        },
        font: { color: "#343434" },
      },
      edges: {
        color: "#848484",
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
      },
      layout: {
        hierarchical: {
          direction: "LR",
          sortMethod: "directed",
        },
      },
      interaction: { dragNodes: true },
      physics: true,
    };

    const network = new Network(containerRef.current, graphData, options);

    return () => {
      network.destroy(); // Cleanup the network instance
    };
  }, [data]);

  return <div ref={containerRef} style={{ height: "600px", border: "1px solid #ccc" }}></div>;
}

function App() {
  const [jsonInput, setJsonInput] = React.useState("");
  const [jsonData, setJsonData] = React.useState(null);
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedJSON = JSON.parse(jsonInput);
      setJsonData(parsedJSON);
      setError("");
    } catch (err) {
      setError("Invalid JSON. Please fix and try again.");
      setJsonData(null);
    }
  };

  return (
    <div className="App">
      <h1>JSON Visualizer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={10}
          cols={50}
          style={{ marginBottom: "18px" }}
        />
        <br />
        <button type="submit">Visualize</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="visualizer-container">
        {jsonData && <JSONVisualizer data={jsonData} />}
      </div>
      <div class="navbar">
        <p>Created by- Akash Jaiswal And Priyamwada Sonnet</p>
        <a href="https://www.linkedin.com/in/akash-jaiswal-219421187/">Akash Jaiswal</a>
        <a href="https://www.linkedin.com/in/priyamwada-sonnet/">Priyamwada Sonnet</a>

      </div>

    </div>
  );
}

export default App;
