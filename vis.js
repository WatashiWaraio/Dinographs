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
        const nodeDuration = document.getElementById('newNodeDuration').value;
        const nodePrerequisites = document.getElementById('newNodePrerequisites').value;
        const nodePostrequisites = document.getElementById('newNodePostrequisites').value;

        var newId = nodes.length + 1;
        while(nodes.get(newId)){newId++;}
            nodes.add({
                id: newId,
                label: nodeName,
                duration: nodeDuration,
                prerequisites: nodePrerequisites.split(',').map(item => item.trim()),
                postrequisites: nodePostrequisites.split(',').map(item => item.trim())
            });
            
                updateNodeSelect();
                clearNodeForm();
    }
}

function addEdge() {
    const fromNode = document.getElementById('fromNode').value;
    const toNode = document.getElementById('toNode').value;
    const nodeCost = document.getElementById('newNodeCost').value;
    const dir = document.getElementById('dirigido').checked;
    console.log(dir);
    const fromId = nodes.get({
        filter: (item) => item.label === fromNode
    })[0]?.id;

    const toId = nodes.get({
        filter: (item) => item.label === toNode
    })[0]?.id;

    if (fromId && toId) {
        edges.add({
            from: fromId,
            to: toId,
            label: nodeCost,
            arrows: dir? "to":null
        });
        clearEdgeForm();
    }
}

function updateNode() {
    const selectedNodeId = parseInt(document.getElementById('selectedNode').value);
    const node = nodes.get(selectedNodeId);

    if (node) {
        node.label = document.getElementById('newNodeName').value || node.label;
        node.duration = document.getElementById('newNodeDuration').value || node.duration;
        node.cost = document.getElementById('newNodeCost').value || node.cost;
        node.prerequisites = document.getElementById('newNodePrerequisites').value ? document.getElementById('newNodePrerequisites').value.split(',').map(item => item.trim()) : node.prerequisites;
        node.postrequisites = document.getElementById('newNodePostrequisites').value ? document.getElementById('newNodePostrequisites').value.split(',').map(item => item.trim()) : node.postrequisites;

        nodes.update(node);
        updateNodeSelect();
        clearNodeForm();
    }
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
    document.getElementById('newNodeDuration').value = '';
    document.getElementById('newNodeCost').value = '';
    document.getElementById('newNodePrerequisites').value = '';
    document.getElementById('newNodePostrequisites').value = '';
}

function clearEdgeForm() {
    document.getElementById('fromNode').value = '';
    document.getElementById('toNode').value = '';
}

// Inicializar el select de nodos
updateNodeSelect();