import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaArrowRight } from 'react-icons/fa';
import DisplayDiv from './DisplayDiv';

function DependancyTree(props) {
  const dispatch = useDispatch();
  const [currentFormula, setCurrentFormula] = useState([]);
  const [level, setLevel] = useState(1);
  const [formulaId, setFormulaId] = useState('');
  const [tree, setTree] = useState([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Fetch formula by ID
  const getFormulaByFormulaId = () => {
    const formula = props.formulaeData.filter((formula) => formula.id === parseInt(formulaId));
    setCurrentFormula(formula);
    setTree([]); // Clear the tree for new dependency
    setLevel(1);
  };

  // Expand formula to show its dependencies
  const expand = (formula) => {
    if (!formula.formula) return;
    const formulaToJson = JSON.parse(formula.formula);
    if (formulaToJson.dependencies) {
      const dependencyIds = formulaToJson.dependencies.map((item) => item.id);
      const nextImmediateChildren = props.formulaeData.filter((item) => dependencyIds.includes(item.id));

      const newTree = [...tree];
      newTree[level] = nextImmediateChildren;
      setTree(newTree);
      setLevel(level + 1);
    }
  };

  // Set consecutive children when a dependency is clicked
  const setConsecutiveChildren = (parent, index) => {
    const formulaToJson = JSON.parse(parent.formula);
    if (formulaToJson.dependencies) {
      const dependencyIds = formulaToJson.dependencies.map((item) => item.id);
      const nextImmediateChildren = props.formulaeData.filter((item) => dependencyIds.includes(item.id));

      const newTree = tree.slice(0, index + 1);
      newTree[index + 1] = nextImmediateChildren;
      setTree(newTree);
      setRenderTrigger((prev) => prev + 1);
    }
  };

  return (
    <div>
      <input
        placeholder="Formula Id"
        onChange={(e) => setFormulaId(e.target.value)}
        value={formulaId}
        className="border px-2 py-1 rounded-md mb-2"
      />
      <button
        onClick={getFormulaByFormulaId}
        className="border rounded-lg px-3 py-1 text-xs bg-green-400 text-white"
      >
        Show Dependency
      </button>

      <div className="flex gap-2 mt-2">
        {/* Parent List */}
        <div className="flex flex-col rounded-md min-h-10 w-64 bg-gray-100 p-1">
          {currentFormula.map((formula) => (
            <div
              className="flex items-center justify-between p-1 mb-1 rounded-md hover:bg-gray-200 cursor-pointer transition-all"
              key={formula.id}
              onClick={() => expand(formula)}
            >
              <div className="flex">
                <p className="text-[10px] text-gray-600">[{formula.id}] - ({formula.data_source_id}) [{formula.report_type}]</p>
                <p className="text-xs font-medium text-gray-800 ml-1">{formula.name}</p>
              </div>
              <p className="bg-green-600 text-white px-1 py-0.5 rounded-sm text-[10px]">
                {props.monthlySummaryData.find((data) => data.formula_id === formula.id)?.monthly_amount_hkd || 'N/A'}
                {/* {props.monthlySummaryData.find((data) => data.formula_id === formula.id)?.closing_balance || 'N/A'} */}
              </p>
              <p
                className={`text-[10px] ${
                  formula.account_id === '0' ? 'text-blue-500 font-semibold' : 'text-gray-600'
                }`}
              >
                {formula.account_id === '0' ? <FaArrowRight className="w-3 h-3" /> : '.'}
              </p>
            </div>
          ))}
        </div>

        {/* Dependency Tree Section */}
        <div className="flex w-auto min-h-16 gap-2">
          {tree.length > 0 &&
            tree.map((treeLevel, index) => (
              <div className="p-1 h-auto rounded-md bg-gray-50 shadow-md" key={index}>
                <DisplayDiv
                  data={treeLevel}
                  onItemClick={(item) => setConsecutiveChildren(item, index)}
                  monthlySummaryData={props.monthlySummaryData}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DependancyTree;
