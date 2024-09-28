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
                arrows: dir? "to":"",
                color: { color: '#848484', highlight: '#848484' }
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
        aris.arrows = dir? "to":"";
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
    tabla.style.display = "table";
}

function dijkstra(startNodeName, endNodeName) {
    const startNodeId = nodes.get({
        filter: (item) => item.label === startNodeName
    })[0]?.id;

    const endNodeId = nodes.get({
        filter: (item) => item.label === endNodeName
    })[0]?.id;

    if (!startNodeId || !endNodeId) {
        alert(`El nodo de inicio "${startNodeName}" o el nodo de destino "${endNodeName}" no existe.`);
        return;
    }

    let distances = {};
    let previousNodes = {};
    let unvisitedNodes = new Set();

    const nodesList = nodes.get();
    const edgesList = edges.get();
    nodesList.forEach(node => {
        distances[node.id] = Infinity;
        previousNodes[node.id] = null;
        unvisitedNodes.add(node.id);
    });

    distances[startNodeId] = 0;

    while (unvisitedNodes.size > 0) {
        let currentNodeId = Array.from(unvisitedNodes).reduce((closestNode, nodeId) => {
            if (closestNode === null) return nodeId;
            return distances[nodeId] < distances[closestNode] ? nodeId : closestNode;
        }, null);

        if (distances[currentNodeId] === Infinity) break;

        unvisitedNodes.delete(currentNodeId);

        if (currentNodeId === endNodeId) break;

        edgesList.forEach(edge => {
            // Obtener el peso de la arista
            const weight = parseInt(edge.label);

            // Validar si se puede seguir la arista en la dirección normal
            if (edge.from === currentNodeId) {
                const neighborId = edge.to;

                if (unvisitedNodes.has(neighborId)) {
                    const newDistance = distances[currentNodeId] + weight;

                    if (newDistance < distances[neighborId]) {
                        distances[neighborId] = newDistance;
                        previousNodes[neighborId] = currentNodeId;
                    }
                }
            }
            
            // Validar si se puede seguir la arista en la dirección inversa
            if (edge.to === currentNodeId && edge.arrows !== 'to') { // Asegurarte de que la arista tenga la propiedad 'arrows'
                const neighborId = edge.from;

                if (unvisitedNodes.has(neighborId)) {
                    const newDistance = distances[currentNodeId] + weight;

                    if (newDistance < distances[neighborId]) {
                        distances[neighborId] = newDistance;
                        previousNodes[neighborId] = currentNodeId;
                    }
                }
            }
        });
    }

    const path = reconstructPath(previousNodes, startNodeId, endNodeId);

    if (path.length > 0) {
        showRouteInTable(path, distances);
        animatePath(path);
    } else {
        alert("No hay ruta mínima disponible");
    }

    return path;
}


function reconstructPath(previousNodes, startNodeId, endNodeId) {
    const path = [];
    let currentNodeId = endNodeId;

    while (currentNodeId !== null) {
        path.unshift(currentNodeId);
        currentNodeId = previousNodes[currentNodeId];
    }

    return path[0] === startNodeId ? path : [];
}

function dijkstraMax(startNodeName, endNodeName) {
    const startNodeId = nodes.get({
        filter: (item) => item.label === startNodeName
    })[0]?.id;

    const endNodeId = nodes.get({
        filter: (item) => item.label === endNodeName
    })[0]?.id;

    if (!startNodeId || !endNodeId) {
        alert(`El nodo de inicio "${startNodeName}" o el nodo de destino "${endNodeName}" no existe.`);
        return;
    }

    let distances = {};
    let previousNodes = {};
    let unvisitedNodes = new Set();

    const nodesList = nodes.get();
    const edgesList = edges.get();
    nodesList.forEach(node => {
        distances[node.id] = -Infinity; 
        previousNodes[node.id] = null;
        unvisitedNodes.add(node.id);
    });

    distances[startNodeId] = 0;

    while (unvisitedNodes.size > 0) {
        let currentNodeId = Array.from(unvisitedNodes).reduce((farthestNode, nodeId) => {
            if (farthestNode === null) return nodeId;
            return distances[nodeId] > distances[farthestNode] ? nodeId : farthestNode;
        }, null);

        if (distances[currentNodeId] === -Infinity) break;

        unvisitedNodes.delete(currentNodeId);

        if (currentNodeId === endNodeId) break;

        edgesList.forEach(edge => {
            const weight = parseInt(edge.label);
            
            
            if (edge.from === currentNodeId) {
                const neighborId = edge.to;

                if (unvisitedNodes.has(neighborId)) {
                    const newDistance = distances[currentNodeId] + weight;

                    if (newDistance > distances[neighborId]) { 
                        distances[neighborId] = newDistance;
                        previousNodes[neighborId] = currentNodeId;
                    }
                }
            }

         
            if (edge.to === currentNodeId && edge.arrows !== 'to') {
                const neighborId = edge.from;

                if (unvisitedNodes.has(neighborId)) {
                    const newDistance = distances[currentNodeId] + weight;

                    if (newDistance > distances[neighborId]) {
                        distances[neighborId] = newDistance;
                        previousNodes[neighborId] = currentNodeId;
                    }
                }
            }
        });
    }

    const path = reconstructPath(previousNodes, startNodeId, endNodeId);

    if (path.length > 0) {
        showRouteInTable(path, distances);
        animatePath(path);
    } else {
        alert("No hay ruta máxima disponible");
    }

    return path;
}



function animatePath(path) {

    nodes.get().forEach(node => {
        nodes.update({ id: node.id, color: { background: '#97C2FC', border: '#2B7CE9' } });
    });

    edges.get().forEach(edge => {
        edges.update({ id: edge.id, color: { color: '#848484', highlight: '#848484' }, width: 1 });
    });

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
    rutaDiv.style.display = "block";
}

function rtamin() {
    const startNodeId = document.getElementById("fromNodeRta").value;
    const endNodeId = document.getElementById("toNodeRta").value;
    dijkstra(startNodeId, endNodeId);
}

function rtamax() {
    const startNodeId = document.getElementById("fromNodeRta").value;
    const endNodeId = document.getElementById("toNodeRta").value;
    dijkstraMax(startNodeId, endNodeId);
}
function downloadFile(){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([nodes.get(),edges.get()]));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "datos.json");
    dlAnchorElem.click();
}
function handleFiles(input){
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        const dataThing=JSON.parse(reader.result);
        console.log(dataThing);
        nodes.clear();
        nodes.add(dataThing["0"]);
        edges.add(dataThing["1"]);
        updateNodeSelect();
        updateArisSelect();
    };
    
}

// Inicializar el select de nodos
updateNodeSelect();
updateArisSelect();
