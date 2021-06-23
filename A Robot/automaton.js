var LogOutput = {
  logOutput: ""
};

//define Meadowfield village's connected locations per the road system 
const roads = [
  "Alice's House-Bob's House", "Alice's House-Cabin",
  "Alice's House-Post Office", "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop", "Marketplace-Farm",
  "Marketplace-Post Office", "Marketplace-Shop",
  "Marketplace-Town Hall", "Shop-Town Hall"
];

const roadGraph = buildGraph(roads); //calls the graphing function to build the village graph.

//a function that builds a graph of connected points (input edges=roads) and the names of destinations can be traveled from each each point.
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) { //uses split method to parse the roads strings into point a, point b
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

//this class provides a VillageState object with properties place and parcels and a method to move along the village graph when given a destination to travel to.
class VillageState {
  //define the objects properties 
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return { place: destination, address: p.address };
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}//end class

//this function seeds parcels into the Village per the defined Village Graph/locations.
VillageState.random = function (parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

//this function returns an array index based on a random calc per size of the array to support seeding random parcels in the Village graph.
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

//this function is passed into the RunRobot function to return a random destination for the robot to go to from the village map.
function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

//this function tells the Robot to 'go' and iterate thru the village until no parcels remain outputting where it has gone and how many turns it took to finish.
function runRobot(state, robot, memory) {
  LogOutput.logOutput += "<ol>";
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      LogOutput.logOutput += "</ol>" + `Done in ${turn} turns`;
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    LogOutput.logOutput += "<li>" + `Moved to ${action.direction}` + "</li>";
  }
}






