const nodes = new vis.DataSet([]);
const edges = new vis.DataSet([]);
 
const container = document.getElementById('mynetwork'); 
const data = {
    nodes: nodes,
    edges: edges
};

const options = {};
const network = new vis.Network(container, data, options);

function addNode() {
    const verificacion=document.getElementById('newNodeName').value;
    const prueba = nodes.get({
        filter: (item) => item.label === verificacion
    })[0]?.id;
    if(verificacion!="" && prueba===undefined){
        const nodeName = document.getElementById('newNodeName').value;

        var newId = nodes.length + 1;
        while(nodes.get(newId)){newId++;}
            nodes.add({
                id: newId,
                label: nodeName
            });
            
                updateNodeSelect();
                clearNodeForm();
    }else{alert("compruebe el nombre del nodo")}
}

function updateNode() {
    const selectedNodeId = parseInt(document.getElementById('selectedNode').value);
    const node = nodes.get(selectedNodeId);

    if (node) {
        node.label = document.getElementById('newNodeName').value || node.label;

        nodes.update(node);
        updateNodeSelect();
        updateArisSelect();
        clearNodeForm();
    }else{alert("compruebe el nombre del nodo")}
}

function deleteNode() {
    const selectedNodeId = parseInt(document.getElementById('selectedNode').value);
    nodes.remove(selectedNodeId);
    edges.remove(edges.get().filter(edge => edge.from === selectedNodeId || edge.to === selectedNodeId));

    updateNodeSelect();
}

function updateNodeSelect() {
    const select = document.getElementById('selectedNode');
    select.innerHTML = '<option disabled value="">Selecciona un nodo para editar o eliminar</option>';
    nodes.get().forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.label;
        select.appendChild(option);
    });
}

function clearNodeForm() {
    document.getElementById('newNodeName').value = '';
}



function addEdge() {
    const fromNode = document.getElementById('fromNode').value;
    const toNode = document.getElementById('toNode').value;
    const nodeCost = document.getElementById('newNodeCost').value;
    const dir = document.getElementById('dirigido').checked;
    const fromId = nodes.get({
        filter: (item) => item.label === fromNode
    })[0]?.id;

    const toId = nodes.get({
        filter: (item) => item.label === toNode
    })[0]?.id;
 
    if (nodeCost==="0"|| isNaN(nodeCost)){ alert("costo de arista no permitido");}
    else{
        var newId = edges.length + 1;
        while(edges.get(newId)){newId++;}
    
        if (fromId && toId) {
            edges.add({
                id:newId,
                from: fromId,
                to: toId,
                label: nodeCost,
                arrows: dir? "to":null,
            });
            updateArisSelect();
            clearEdgeForm();
        }
    }
}

function updateAris() {
    const selectedAris = parseInt(document.getElementById('selectedAris').value);
    const aris = edges.get(selectedAris);
    const dir = document.getElementById('dirigido').checked;
    const name =document.getElementById('newNodeCost').value;
    const fromNode = document.getElementById('fromNode').value;
    const toNode = document.getElementById('toNode').value;
    const fromId = nodes.get({
        filter: (item) => item.label === fromNode
    })[0]?.id;

    const toId = nodes.get({
        filter: (item) => item.label === toNode
    })[0]?.id;
    if (aris && !(name =="0"|| isNaN(name))) {
        aris.label = name || aris.label;
        aris.from = fromId || aris.from;
        aris.to = toId || aris.to;
        aris.arrows = dir? "to":null;
        edges.update(aris);
        updateArisSelect();
        clearEdgeForm();
    }else{
        alert("costo de arista no permitido");
    }

}

function deleteAris() {
    const selectedArisId = parseInt(document.getElementById('selectedAris').value);
    edges.remove(selectedArisId);
    
    updateArisSelect();
}

function updateArisSelect() {
    const select = document.getElementById('selectedAris');
    select.innerHTML = '<option disabled value="">Selecciona un arco para editar o eliminar</option>';
    edges.get().forEach(edge => {
        const option = document.createElement('option');
        option.value = edge.id;
        option.textContent = nodes.get(edge.from).label+"-"+nodes.get(edge.to).label;
        select.appendChild(option);
    });
}

function clearEdgeForm() {
    document.getElementById('fromNode').value = '';
    document.getElementById('toNode').value = '';
    document.getElementById('newNodeCost').value = '';
}


function dijkstra(startNodeId, endNodeId, isMax = false) {
    const nodesList = nodes.get();
    const edgesList = edges.get();
    const distances = {};
    const previousNodes = {};
    const unvisitedNodes = new Set(nodesList.map(node => node.id));

   
    nodesList.forEach(node => {
        distances[node.id] = isMax ? -Infinity : Infinity;
        previousNodes[node.id] = null;
    });
    distances[startNodeId] = 0;

    while (unvisitedNodes.size > 0) {
        let currentNodeId = Array.from(unvisitedNodes).reduce((bestNode, nodeId) => {
            if (bestNode === null) return nodeId; 
            return isMax ? 
                (distances[nodeId] > distances[bestNode] ? nodeId : bestNode) :
                (distances[nodeId] < distances[bestNode] ? nodeId : bestNode);
        }, null);

        if (currentNodeId === null || distances[currentNodeId] === (isMax ? -Infinity : Infinity)) {
            break;
        }

        unvisitedNodes.delete(currentNodeId);

       
        if (currentNodeId === endNodeId) break;

        edgesList.forEach(edge => {
            const neighborId = (edge.from === currentNodeId) ? edge.to : (edge.to === currentNodeId) ? edge.from : null;
            const weight = parseInt(edge.label); 

            if (neighborId !== null) {
                const newDistance = distances[currentNodeId] + weight;

                if ((isMax && newDistance > distances[neighborId]) || (!isMax && newDistance < distances[neighborId])) {
                    distances[neighborId] = newDistance;
                    previousNodes[neighborId] = currentNodeId;
                }
            }
        });
    }

 
    const path = reconstructPath(previousNodes, startNodeId, endNodeId);
    if (path.length > 0) {
        showRouteInTable(path, distances);
        animatePath(path);
    } else {
        alert(isMax ? "No hay ruta máxima disponible" : "No hay ruta mínima disponible");
    }

    return path;
}


function reconstructPath(previousNodes, startNodeId, endNodeId) {
    const path = [];
    let currentNodeId = endNodeId;

    while (currentNodeId) {
        path.unshift(currentNodeId);
        currentNodeId = previousNodes[currentNodeId];
    }

    return path[0] === startNodeId ? path : [];
}


function animatePath(path) {
    let currentNodeIndex = 0;

    const animateNextNode = () => {
        if (currentNodeIndex < path.length - 1) {
            const fromNodeId = path[currentNodeIndex];
            const toNodeId = path[currentNodeIndex + 1];
            const edgeId = edges.get().find(edge => 
                (edge.from === fromNodeId && edge.to === toNodeId) || 
                (edge.from === toNodeId && edge.to === fromNodeId)
            )?.id;

           
            if (edgeId) {
                edges.update({
                    id: edgeId,
                    color: { color: '#ff0000', highlight: '#ff0000' },
                    width: 3
                });
            }

           
            nodes.update({
                id: fromNodeId,
                color: { background: '#ff0000', border: '#ff0000' }
            });

            nodes.update({
                id: toNodeId,
                color: { background: '#ff0000', border: '#ff0000' }
            });

            currentNodeIndex++;
            setTimeout(animateNextNode, 1500);
        }
    };

    animateNextNode();
}


function showRouteInTable(path, distances) {
    const rutaDiv = document.getElementById("ruta");
    rutaDiv.innerHTML = path.map(nodeId => `[${nodes.get(nodeId).label}, ${distances[nodeId]}]`).join(', ');
}


function rtamin() {
    const startNodeId = document.getElementById("fromNode").value;
    const endNodeId = document.getElementById("toNode").value;
    dijkstra(startNodeId, endNodeId, false);
}

function rtamax() {
    const startNodeId = document.getElementById("fromNode").value;
    const endNodeId = document.getElementById("toNode").value;
    dijkstra(startNodeId, endNodeId, true);
}


function showM1() {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    const nodesList = nodes.get();

    let headerRow = tabla.insertRow(-1);
    let headerCell = document.createElement("th");
    headerCell.innerHTML = "Nodos"; 
    headerCell.style.fontWeight = 'bold'; 
    headerCell.style.backgroundColor = '#e0e0e0';
    headerRow.appendChild(headerCell);

    nodesList.forEach(node => {
        let cell = document.createElement("th");
        cell.innerHTML = node.label; 
        cell.style.fontWeight = 'bold'; 
        cell.style.backgroundColor = '#e0e0e0';
        headerRow.appendChild(cell);
    });

    nodesList.forEach(fromNode => {
        let fila = tabla.insertRow(-1);
        let cell = fila.insertCell(-1);
        cell.innerHTML = fromNode.label;
        cell.style.fontWeight = 'bold'; 
        cell.style.backgroundColor = '#e0e0e0';

        nodesList.forEach(toNode => {
            let celda = fila.insertCell(-1);
            const edgeval = edges.get({
                filter: (item) =>
                    (item.from === fromNode.id && item.to === toNode.id) ||
                    (item.from === toNode.id && item.to === fromNode.id && item.arrows !== "to")
            })[0];
            celda.innerHTML = edgeval ? edgeval.label : 0;
        });
    });

    tabla.style.display = "table";
}


function showM2() {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    
    const edgesList = edges.get(); 
    const nodesList = nodes.get(); 

    const headerRow = tabla.insertRow(-1);

    let headerCell = document.createElement("th");
    headerCell.innerHTML = "Nodos/Aristas"; 
    headerCell.style.fontWeight = 'bold'; 
    headerCell.style.backgroundColor = '#e0e0e0';
    headerRow.appendChild(headerCell);

    for (let edge of edgesList) {
        const headerCell = headerRow.insertCell(-1);
        const sourceNode = nodes.get(edge.from);
        const targetNode = nodes.get(edge.to);
        headerCell.innerHTML = `${sourceNode.label}-${targetNode.label}`;
        headerCell.style.fontWeight = 'bold'; 
        headerCell.style.backgroundColor = '#e0e0e0'; 
    }

    for (let node of nodesList) {
        const row = tabla.insertRow(-1);
        const nodeCell = row.insertCell(-1);
        nodeCell.innerHTML = node.label;
        nodeCell.style.fontWeight = 'bold'; 
        nodeCell.style.backgroundColor = '#e0e0e0'; 

        for (let edge of edgesList) {
            const cell = row.insertCell(-1);
            if (edge.from === node.id || edge.to === node.id) {
                cell.innerHTML = "1"; 
            } else {
                cell.innerHTML = "0"; 
            }
        }
    }
}


// Inicializar el select de nodos
updateNodeSelect();
updateArisSelect();
