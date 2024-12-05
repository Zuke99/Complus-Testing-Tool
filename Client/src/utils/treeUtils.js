export function buildTree(data) {
    const tree = [];
    const lookup = {};
  
    // Create a lookup object for quick access
    data.forEach((item) => {
      lookup[item.formula_id] = { ...item, children: [] };
    });
  
    // Build the tree structure
    data.forEach((item) => {
      if (item.parent_id === null) {
        tree.push(lookup[item.formula_id]);
      } else {
        lookup[item.parent_id]?.children.push(lookup[item.formula_id]);
      }
    });
  
    return tree;
  }
  