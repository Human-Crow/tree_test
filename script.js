const ALT_ITEMS = [
  "Copper_Wire",
  "Iron_Gear",
  "Steel",
  "Concrete",
  "Electromagnet",
  "Logic_Circuit",
  "Electric_Motor",
  "Industrial_Frame",
  "Turbocharger",
  "Super_Computer",
  "Tungsten_Carbide",
  "Rotor"
];

const RAW_RESOURCES = new Set([
  "Wood_Log",
  "Stone",
  "Iron_Ore",
  "Copper_Ore",
  "Coal",
  "Wolframite",
  "Uranium_Ore"
]);

const ITEM_RECIPES = [
  [[1,"Atomic_Locator"], [2,"Super_Computer"], [2,"Electron_Microscope"], [24,"Concrete"], [50,"Copper_Wire"]],
  [[1,"Battery"], [8,"Electromagnet"], [8,"Graphite"]],
  [[1,"Carbon_Fiber"], [4,"Graphite"]],
  [[1,"Computer"], [1,"Metal_Frame"], [3,"Heat_Sink"], [3,"Logic_Circuit"]],
  [[1,"Concrete_STD"], [10,"Sand"], [1,"Steel_Rod"]],
  [[1,"Concrete_ALT"], [20,"Stone"], [4,"Wood_Frame"]],
  [[1,"Condenser_Lens"], [3,"Glass"]],
  [[1,"Copper_Ingot"], [1,"Copper_Ore"]],
  [[2,"Copper_Wire_STD"], [3,"Copper_Ingot"]],
  [[8,"Copper_Wire_ALT"], [1,"Carbon_Fiber"]],
  [[1,"Coupler"], [1,"Tungsten_Carbide"]],
  [[1,"Earth_Token"], [1,"Matter_Duplicator"]],
  [[1,"Electric_Motor_STD"], [1,"Battery"], [4,"Iron_Gear"], [2,"Rotor"]],
  [[1,"Electric_Motor_ALT"], [6,"Electromagnet"], [6,"Steel"], [1,"Empty_Fuel_Cell"]],
  [[1,"Electromagnet_STD"], [6,"Copper_Wire"], [2,"Iron_Ingot"]],
  [[12,"Electromagnet_ALT"], [1,"Nano_Wire"], [1,"Steel_Rod"]],
  [[1,"Electron_Microscope"], [2,"Nano_Wire"], [8,"Electromagnet"], [4,"Condenser_Lens"], [2,"Metal_Frame"]],
  [[1,"Empty_Fuel_Cell"], [3,"Tungsten_Carbide"], [5,"Glass"]],
  [[1,"Energy_Cube"], [2,"Battery"], [1,"Industrial_Frame"]],
  [[1,"Enriched_Uranium"], [30,"Uranium_Ore"]],
  [[1,"Glass"], [4,"Sand"]],
  [[1,"Graphite"], [3,"Coal"], [3,"Wood_Log"]],
  [[1,"Gyroscope"], [12,"Copper_Wire"], [2,"Rotor"]],
  [[1,"Heat_Sink"], [5,"Copper_Ingot"]],
  [[1,"Industrial_Frame_STD"], [6,"Concrete"], [2,"Metal_Frame"], [8,"Tungsten_Carbide"]],
  [[1,"Industrial_Frame_ALT"], [18,"Steel"], [10,"Iron_Plating"], [4,"Carbon_Fiber"]],
  [[1,"Iron_Gear_STD"], [2,"Iron_Ingot"]],
  [[8,"Iron_Gear_ALT"], [1,"Steel"]],
  [[1,"Iron_Ingot"], [1,"Iron_Ore"]],
  [[2,"Iron_Plating"], [4,"Iron_Ingot"]],
  [[1,"Logic_Circuit_STD"], [3,"Copper_Wire"], [2,"Silicon"]],
  [[1,"Logic_Circuit_ALT"], [1,"Iron_Plating"], [1,"Heat_Sink"]],
  [[1,"Magnetic_Field_Generator"], [1,"Stabilizer"], [1,"Industrial_Frame"], [10,"Electromagnet"], [10,"Nano_Wire"]],
  [[1,"Matter_Compressor"], [1,"Industrial_Frame"], [2,"Turbocharger"], [2,"Electric_Motor"], [1,"Tank"]],
  [[1,"Matter_Duplicator"], [4,"Atomic_Locator"], [2,"Quantum_Entangler"], [5,"Energy_Cube"], [100,"Particle_Glue"]],
  [[1,"Metal_Frame"], [1,"Wood_Frame"], [4,"Iron_Plating"]],
  [[1,"Nano_Wire"], [2,"Carbon_Fiber"], [4,"Glass"]],
  [[1,"Nuclear_Fuel_Cell"], [1,"Empty_Fuel_Cell"], [1,"Steel_Rod"], [1,"Enriched_Uranium"]],
  [[10,"Particle_Glue"], [1,"Matter_Compressor"]],
  [[1,"Quantum_Entangler"], [1,"Magnetic_Field_Generator"], [2,"Stabilizer"]],
  [[1,"Rotor_STD"], [1,"Steel_Rod"], [2,"Iron_Plating"]],
  [[1,"Rotor_ALT"], [18,"Copper_Ingot"], [18,"Iron_Plating"]],
  [[1,"Sand"], [1,"Stone"]],
  [[1,"Silicon"], [2,"Sand"]],
  [[1,"Stabilizer"], [1,"Computer"], [1,"Electric_Motor"], [2,"Gyroscope"]],
  [[1,"Steel_STD"], [1,"Graphite"], [6,"Iron_Ore"]],
  [[1,"Steel_ALT"], [4,"Iron_Ore"], [4,"Coal"]],
  [[1,"Steel_Rod"], [3,"Steel"]],
  [[1,"Super_Computer_STD"], [2,"Computer"], [8,"Heat_Sink"], [1,"Turbocharger"], [8,"Coupler"]],
  [[2,"Super_Computer_ALT"], [2,"Computer"], [40,"Silicon"], [2,"Gyroscope"], [1,"Industrial_Frame"]],
  [[1,"Tank"], [2,"Glass"], [4,"Concrete"], [4,"Tungsten_Carbide"]],
  [[1,"Tungsten_Carbide_STD"], [2,"Tungsten_Ore"], [1,"Graphite"]],
  [[2,"Tungsten_Carbide_ALT"], [1,"Tungsten_Ore"], [1,"Steel"]],
  [[1,"Tungsten_Ore"], [5,"Wolframite"]],
  [[1,"Turbocharger_STD"], [8,"Iron_Gear"], [4,"Logic_Circuit"], [2,"Nano_Wire"], [4,"Coupler"]],
  [[1,"Turbocharger_ALT"], [4,"Heat_Sink"], [1,"Computer"], [1,"Gyroscope"], [1,"Tungsten_Carbide"]],
  [[1,"Wood_Frame"], [4,"Wood_Plank"]],
  [[1,"Wood_Plank"], [1,"Wood_Log"]]
];

const recipesByItem = {};
for (const recipe of ITEM_RECIPES) {
  const [outputAmount, recipeName] = recipe[0];
  const itemName = recipeName.replace("_STD", "").replace("_ALT", "");
  const variant = recipeName.includes("_ALT") ? "ALT" : "STD";

  if (!recipesByItem[itemName]) recipesByItem[itemName] = {};
  recipesByItem[itemName][variant] = {
    recipeName,
    outputAmount,
    ingredients: recipe.slice(1)
  };
}

function buildTree(amount, item, altRatios, splitNodes) {
  if (RAW_RESOURCES.has(item) || !recipesByItem[item]) {
    return [amount, item.replaceAll("_", " "), []];
  }

  const variants = recipesByItem[item];

  if (!variants.ALT) {
    const recipe = variants.STD;
    return [
      amount,
      recipe.recipeName.replaceAll("_", " "),
      recipe.ingredients.map(([needed, ing]) =>
        buildTree(amount * needed / recipe.outputAmount, ing, altRatios, splitNodes)
      )
    ];
  }

  const altRatio = altRatios[item] || 0;

  if (altRatio > 0 && altRatio < 1) {
    splitNodes[item] = (splitNodes[item] || 0) + amount;
    return [amount, `${item.replaceAll("_", " ")} (STD/ALT)`, []];
  }

  const recipe = altRatio === 1 ? variants.ALT : variants.STD;

  return [
    amount,
    recipe.recipeName.replaceAll("_", " "),
    recipe.ingredients.map(([needed, ing]) =>
      buildTree(amount * needed / recipe.outputAmount, ing, altRatios, splitNodes)
    )
  ];
}

function buildSplitBranches(splitNodes, altRatios) {
  const branches = [];

  for (const item in splitNodes) {
    const total = splitNodes[item];
    const ratio = altRatios[item] || 0;
    const variants = recipesByItem[item];

    const stdAmount = total * (1 - ratio);
    const altAmount = total * ratio;

    [["STD", stdAmount], ["ALT", altAmount]].forEach(([label, amt]) => {
      const recipe = variants[label];
      branches.push([
        amt,
        recipe.recipeName.replaceAll("_", " "),
        recipe.ingredients.map(([needed, ing]) =>
          buildTree(amt * needed / recipe.outputAmount, ing, altRatios, {})
        )
      ]);
    });
  }

  return branches;
}

function buildFullTree(amount, item, altRatios) {
  const splitNodes = {};
  const mainTree = buildTree(amount, item, altRatios, splitNodes);
  return [mainTree, ...buildSplitBranches(splitNodes, altRatios)];
}

function treeToTopologicalBranches(tree) {
  const branches = {};
  const orderSeen = [];

  function walk(node) {
    const [amount, name, children] = node;

    if (!branches[name]) {
      branches[name] = { amount: 0, children: {} };
      orderSeen.push(name);
    }

    branches[name].amount += amount;

    for (const [childAmount, childName] of children) {
      branches[name].children[childName] =
        (branches[name].children[childName] || 0) + childAmount;
    }

    for (const child of children) {
      walk(child);
    }
  }

  tree.forEach(walk);

  const rawFormatted = new Set([...RAW_RESOURCES].map(x => x.replaceAll("_", " ")));

  const sortedNames = Object.keys(branches).sort((a, b) => {
    if (a === orderSeen[0]) return -1;
    if (b === orderSeen[0]) return 1;
    if (rawFormatted.has(a)) return 1;
    if (rawFormatted.has(b)) return -1;
    return a.localeCompare(b);
  });

  return sortedNames.map(name => [
    branches[name].amount,
    name,
    Object.entries(branches[name].children)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([childName, childAmount]) => [childAmount, childName, []])
  ]);
}

function treeToString(node, prefix = "", isLast = true, root = true) {
  const [amount, name, children] = node;
  let out = "";

  out += root
    ? `${amount} ${name}\n`
    : `${prefix}${isLast ? "└─ " : "├─ "}${amount} ${name}\n`;

  const childPrefix = prefix + (isLast ? "   " : "│  ");

  children.forEach((child, i) => {
    out += treeToString(child, childPrefix, i === children.length - 1, false);
  });

  return out;
}

function printTreeLines(tree) {
  return tree.map(branch => treeToString(branch)).join("\n");
}

function printTopoTreeLines(tree) {
  return printTreeLines(treeToTopologicalBranches(tree));
}

function getRatios() {
  const ratios = {};
  ALT_ITEMS.forEach(item => {
    ratios[item] = parseFloat(document.getElementById(item).value) || 0;
  });
  return ratios;
}

function runTree() {
  const item = document.getElementById("itemSelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);
  const tree = buildFullTree(amount, item, getRatios());
  document.getElementById("output").textContent = printTreeLines(tree);
}

function runTopoTree() {
  const item = document.getElementById("itemSelect").value;
  const amount = parseFloat(document.getElementById("amountInput").value);
  const tree = buildFullTree(amount, item, getRatios());
  document.getElementById("output").textContent = printTopoTreeLines(tree);
}

window.onload = () => {
  const itemSelect = document.getElementById("itemSelect");

  Object.keys(recipesByItem).sort().forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item.replaceAll("_", " ");
    itemSelect.appendChild(option);
  });

  const altContainer = document.getElementById("altInputs");

  ALT_ITEMS.forEach(item => {
    const div = document.createElement("div");
    div.className = "alt-row";
    div.innerHTML = `
      <label>${item}</label>
      <input id="${item}" type="number" min="0" max="1" step="0.1" value="0" />
    `;
    altContainer.appendChild(div);
  });
};