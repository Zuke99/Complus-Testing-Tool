import React, { useState } from 'react';

// TreeNode Component
const TreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        {node.name} {node.children.length > 0 && (isExpanded ? '-' : '+')}
      </div>
      {isExpanded &&
        node.children.map((child) => <TreeNode key={child.formula_id + `${Date.now()}`} node={child} />)}
    </div>
  );
};

export default TreeNode;
