import React from 'react';
import TreeNode from './TreeNode.js';
// Import TreeNode component

const TreeView = ({ data }) => {
  return (
    <div>
      {data.map((node) => (
        <TreeNode key={node.formula_id} node={node} />
      ))}
    </div>
  );
};

export default TreeView;
