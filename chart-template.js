exports.render = dependencyTree => {
  const nodes = [{ id: "root", label: "root" }];
  const edges = [];

  Object.entries(dependencyTree).forEach(([key, dep]) => {
    const isRoot = key.startsWith("root");
    nodes.push({
      id: key,
      label: key.replace(/\//g, "/\n"),
      color: isRoot ? "#FFAA44" : undefined
    });
    dep.parents.forEach(parent => {
      edges.push({ from: key, to: parent });
    });
    if (isRoot) edges.push({ from: key, to: "root" });
  });

  return `
<html>

<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css">

  <style type="text/css">
    #mynetwork {
      width: 960px;
      height: 600px;
      border: 1px solid lightgray;
    }
  </style>

</head>

<body>
  <div id="mynetwork"></div>

  <script type="text/javascript">
    var layoutMethod = "directed";

    // create an array with nodes
    var nodes = new vis.DataSet(
      ${JSON.stringify(nodes)}
    );

    // create an array with edges
    var edges = new vis.DataSet(
      ${JSON.stringify(edges)}
    );

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {
        hierarchical: {
          sortMethod: layoutMethod
        }
      },
      edges: {
        smooth: true,
        arrows: { to: true }
      }
    };
    var network = new vis.Network(container, data, options);
  </script>

</body>

</html>
  `;
};
