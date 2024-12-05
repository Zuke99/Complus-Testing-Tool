import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaArrowRight } from 'react-icons/fa';
import DisplayDiv from './DisplayDiv';

function DependancyTree(props) {

    const dispatch = useDispatch();
    const [currentFormula, setCurrentFormula] = useState();
    const [level, setLevel] = useState(1);
    const [formulaId, setFormulaId] = useState();
    
    
  const [tree, setTree] = useState([]);
  const [renderTrigger, setRenderTrigger] = useState(0);


    useEffect(() => {
       console.log(props.formulaId);
       console.log("formulaeData",props.formulaeData);
    //    getFormulaByFormulaId();
    })

    const getFormulaByFormulaId = async () => {
        console.log("for-----",formulaId)
        setLevel(0);
        setTree([])
        let formula = props.formulaeData.filter((formula) => formula.id == props.formulaId)
        if(formulaId){
         formula = await props.formulaeData.filter((formula) => formula.id == formulaId)
        }
        setCurrentFormula(formula);
        // console.log("currentFormula",formula[0].formula);
       
        }




    const expand = (formula) => {
        
        const formulaToJson = JSON.parse(formula.formula)
        if(formulaToJson.dependencies ){
        // console.log("currentFormulaJSON",formulaToJson);
        const dependancyArray = formulaToJson.dependencies.map((item) => item.id);
        console.log("dArr", dependancyArray)
         const nextImmediateChildren = props.formulaeData.filter(item => 
            dependancyArray.includes(item.id)
          );
        console.log("nextImmediateChildren", nextImmediateChildren)

        const tree = [];
        tree[level] = nextImmediateChildren;
        setTree(tree);
        }
    }

    const setCOnsecutiveChildren = (parent, index) => {
        console.log(index)
        tree.length = index + 1;
        const formulaToJson = JSON.parse(parent.formula)
        console.log("newForm", formulaToJson)
        if(formulaToJson.dependencies){
        const dependancyArray = formulaToJson.dependencies.map((item) => item.id);
        const results = props.formulaeData.filter(item => 
            dependancyArray.includes(item.id)
          );
    const nextImmediateChildren = results;
    
    // console.log(nextImmediateChildren);
       
        tree[index + 1] = nextImmediateChildren;
    //     console.log(`Next Immediate CHildren ${nextImmediateChildren}`)
        setTree(tree);
    //     console.log("Tree  ----->" ,tree, null, 2);
    
    
    //     console.log("index", index);
    //     // console.log("curr data len",currentData)
    
        setRenderTrigger((prev) => prev + 1);
        }
      }

      const handleSetFormula = () => {
       
      }



  return (
    <>
    <div>
        <input placeholder='Formula Id'  onChange={(e) => setFormulaId(e.target.value)}
              value={formulaId} ></input>
    <button onClick={() => getFormulaByFormulaId()} className="border rounded-lg px-3 py-1 text-xs bg-green-400 text-white"> Show Dependancy </button>
              <div className="flex gap-1 mt-1">
                
  {/* Parent List */}
  <div className="flex flex-col  rounded-md min-h-10 w-64 bg-gray-100 p-1">
    {currentFormula &&
      currentFormula.map((formula) => (
        <div
          className="flex items-center justify-between -b p-1 mb-0.5 rounded-md hover:bg-gray-200 cursor-pointer transition-all"
          key={formula.id}
          onClick={() => expand(formula)}
        >
          <div className="flex">
            <p className="text-[10px] text-gray-600">[{formula.id}] -</p>
            <p className="text-xs font-medium text-gray-800 ml-1">{formula.name}</p>
          </div>
          <p className="bg-green-600 text-white px-1 py-0.5 rounded-sm text-[10px]">
            {formula.monthly_amount_hkd}
          </p>
          <p
            className={`text-[10px] ${
                formula.account_id === "0" ? "text-blue-500 font-semibold" : "text-gray-600"
            }`}
          >
            {formula.account_id === "0" ? <FaArrowRight className="w-3 h-3" /> : "."}
          </p>
        </div>
      ))}
  </div>

  {/* Tree Section */}
  <div className="flex w-auto min-h-16">
    {tree.length > 0 &&
      tree.map((treeItem, index) => (
        <div className="p-1 h-auto rounded-md" key={index}>
          <DisplayDiv
            data={treeItem}
            onItemClick={(item) => setCOnsecutiveChildren(item, index)}
          />
        </div>
      ))}
  </div>
</div>

    </div>
    </>
  )
}

export default DependancyTree
