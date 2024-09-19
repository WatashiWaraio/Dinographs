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
    }
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

function updateAris() {
    const selectedAris = parseInt(document.getElementById('selectedAris').value);
    const aris = edges.get(selectedAris);
    const dir = document.getElementById('dirigido').checked;

    const fromNode = document.getElementById('fromNode').value;
    const toNode = document.getElementById('toNode').value;
    const fromId = nodes.get({
        filter: (item) => item.label === fromNode
    })[0]?.id;

    const toId = nodes.get({
        filter: (item) => item.label === toNode
    })[0]?.id;
    if (aris) {
        aris.label = document.getElementById('newNodeCost').value || aris.label;
        aris.from = fromId || aris.from;
        aris.to = toId || aris.to;
        aris.arrows = dir? "to":null;
        edges.update(aris);
        updateArisSelect();
        clearEdgeForm();
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

// Inicializar el select de nodos
updateNodeSelect();
updateArisSelect();