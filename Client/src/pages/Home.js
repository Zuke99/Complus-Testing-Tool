import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFormulae, fetchMonthlySummary, fetchMonthlySummaryByParams, fetchTopLevelParents } from '../features/dbSlice';
import { buildTree } from '../utils/treeUtils';
import TreeView from '../components/TreeView';
import DisplayDiv from '../components/DisplayDiv';
import { FaArrowRight } from 'react-icons/fa';
import DependancyTree from '../components/DependancyTree';

const Home = () => {
  const dispatch = useDispatch();
  const { formulae, monthlySummary, loading, error } = useSelector((state) => state.dbData);
  const [treeData, setTreeData] = useState([]);
  const [topLevelParents, setTopLevelParents] = useState([]);
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2023);
  const [reportType, setReportType] = useState('Mgt P&L');
  const [selectedOption, setSelectedOption] = useState("");
  const [level, setLevel] = useState(1);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [currentData, setCurrentData] = useState([])
  const [formulaeData, setFormulaeData] = useState();
  const [formulaId, setFormulaId] = useState();
  const [selectedTable, setSelectedTable] = useState("Monthly_summary");
  const [name, setName] = useState('');
  const [toggleFormulaHie, setToggleFormulaHie] = useState(false);
  const options = [
    "",
    "Mgt P&L",
    "Trading Cost CAML",
    "Non PM P&L",
    "Macro PM P&L",
    "PE P&L",
    "GOP P&L",
    "Staff Ins CAML CAMS",
    "Oth Employee CAML CAMS",
    "Tele & Comm CMSL",
    "Printing & Stat. CMSL",
    "Miscell CAML",
    "Cleaning CMSL",
    "Miscell CMSL",
    "Trading Cost CAML",
    "Computer & IT CAML CAMS",
    "Computer & IT CMSL",
    "Fin Subscription CAML",
    "Legal & Pro CAMS",
    "Legal & Pro CAMUK",
    "Accting & Payroll CAMS",
    "Legal & Pro CAML",
    "Licensing CAML CAMS",
    "Rent CAMS",
    "Travelling CAML",
    "Meal & Entertainment CAML",
    "Exchange Gain or Loss CAML",
    "Exchange Gain or Loss CAMS",
    "Mgt BS"
  ];

  const tables = [
    "Monthly_summary",
    "formulae"
  ]


  const [tree, setTree] = useState([]);

  useEffect(() => {
      const data = {
      month: month,
      year: year,
      reportType: reportType
    }
    dispatch(fetchFormulae())
    .then((response) => {
      setFormulaeData(response.payload)
      // console.log("formulae",formulaeData)
    })
    // dispatch(fetchTopLevelParents(data))
    // .then((response) => {
    //   setTopLevelParents(response.payload);
    //   const tree = {
    //     level : topLevelParents
    //   }
    //   setTree(tree);
    // })

    dispatch(fetchMonthlySummary(data))
    .then((response) => {
      setCurrentData(response.payload);
      // console.log("Got ALl data", currentData)
      
    })
    console.log("tree length", tree.length);
    }, [dispatch, tree]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getTopLevelParents = () => {
    const data = {
      month: month,
      year: year,
      reportType: reportType
    }
    dispatch(fetchTopLevelParents(data))
    .then((response) => {
      setTopLevelParents(response.payload);
      const tree = {
        level : topLevelParents
      }
      setTree(tree);
    })

    dispatch(fetchMonthlySummary(data))
    .then((response) => {
      setCurrentData(response.payload);
      // console.log("Got ALl data", currentData)
      
    })

  }



  const getData = async () => {
    const data = {
        month: month,
        year: year,
        reportType: reportType,
        formulaId: formulaId,
        selectedTable: selectedTable,
        name: name
      }
    if(selectedTable === "Monthly_summary"){
      dispatch(fetchMonthlySummaryByParams(data)).then((response) =>{
        setTopLevelParents(response.payload);
      })
    }
  }

  const handleChange = (event) => {
    setReportType(event.target.value);
  };

  const handletableChange = (event) => {
    setSelectedTable(event.target.value);
  }

  const expand = (parent) => {
    console.log("Clicked On",parent);
    setLevel(0);
    console.log("currentData",currentData)
    const nextImmediateChildren = currentData.filter((item) => item.parent_id === parent.formula_id)
    console.log(`Next Immediate CHildren ${JSON.stringify(nextImmediateChildren, null, 2)}`)
    const tree = [];
    tree[level] = nextImmediateChildren;
    setTree(tree);
    

  }



  const setCOnsecutiveChildren = (parent, index) => {
  
    // const nextImmediateChildren = currentData.filter((item) => item.parent_id === parent.formula_id)
    // const tree = [...tree];

    let parentFromFormulae = formulaeData.filter((item) => item.id === parent.formula_id);
    console.log("parentFromFormulae", parentFromFormulae)

    let ChildFromFormulae;

// Step 1: Get ChildFromFormulae based on similar_formula_id
if (parentFromFormulae[0].similar_formula_id === null) {
    // If similar_formula_id is null, filter based on parent.formula_id
    ChildFromFormulae = formulaeData.filter((item) => item.parent_id === parent.formula_id);
} else {
    // If similar_formula_id is not null, filter based on similar_formula_id
    alert("using Similar Id");
    ChildFromFormulae = formulaeData.filter((item) => item.parent_id === parentFromFormulae[0].similar_formula_id);
}
console.log("ChildFromFormulae", ChildFromFormulae);

// Step 2: Get ChildFromMonthly_summary by matching formula_id with ChildFromFormulae
const ChildFromMonthly_summary = currentData.filter((item) =>
    ChildFromFormulae.filter((child) => child.id === item.formula_id)
);

let results = [];
for(let i = 0;i<ChildFromFormulae.length;i++){
  for(let j = 0; j<currentData.length;j++){
    if(currentData[j].formula_id === ChildFromFormulae[i].id){
      results.push(currentData[j]);
    }
  }
}

// Step 3: Assign the filtered results to nextImmediateChildren
// const nextImmediateChildren = ChildFromMonthly_summary;

const nextImmediateChildren = results;

console.log(nextImmediateChildren);
    tree.length = index + 1;
    tree[index + 1] = nextImmediateChildren;
    console.log(`Next Immediate CHildren ${nextImmediateChildren}`)
    // setTree(tree);
    console.log("Tree  ----->" ,tree, null, 2);


    console.log("index", index);
    // console.log("curr data len",currentData)

    setRenderTrigger((prev) => prev + 1);
  }

  const handleToggleFormula = () => {
    setToggleFormulaHie(!toggleFormulaHie);
    setTree([]);
    // setCurrentData([]);
    setTopLevelParents([]);
  }

  return (
    <>
      <div>
        {/* Form Section */}
        <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg shadow-md">
          <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Month</label>
            <input
              className="border border-gray-300 rounded-md p-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Month"
              onChange={(e) => setMonth(e.target.value)}
              value={month}
            />
          </div>
  
          <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Year</label>
            <input
              className="border border-gray-300 rounded-md p-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Year"
              onChange={(e) => setYear(e.target.value)}
              value={year}
            />
          </div>
  
          <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Report</label>
            <select
              id="dropdown"
              value={reportType}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1 text-xs w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="" disabled>Select</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Formula ID</label>
            <input
              className="border border-gray-300 rounded-md p-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Formula ID"
              onChange={(e) => setFormulaId(e.target.value)}
              value={formulaId}
            />
          </div>
  
          {/* <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Table</label>
            <select
              id="dropdown"
              value={selectedTable}
              onChange={handletableChange}
              className="border border-gray-300 rounded-md p-1 text-xs w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="" disabled>Select</option>
              {tables.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div> */}
  
          <div className="flex flex-col w-auto">
            <label className="text-xs font-medium text-gray-600">Name</label>
            <input
              className="border border-gray-300 rounded-md p-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
  
        {/* Buttons Section */}
        <div className="flex w-full justify-around mt-2">
          <button className="border rounded-lg px-3 py-1 text-xs bg-green-400 text-white" onClick={getData}>
            Get Data
          </button>
          <button className="border rounded-lg px-3 py-1 text-xs bg-green-400 text-white" onClick={getTopLevelParents}>
            Show Top-Level Parents
          </button>
          <button className="border rounded-lg px-3 py-1 text-xs bg-green-400 text-white" onClick={handleToggleFormula}>
            Show Formula Dependancy hierarichy
          </button>
        </div>
  
        {/* Parent List and Tree */}
        <div className="flex gap-1 mt-1">
  {/* Parent List */}
  <div className="flex flex-col  rounded-md min-h-10 w-64 bg-gray-100 p-1">
    {topLevelParents &&
      topLevelParents.map((parent) => (
        <div
          className="flex items-center justify-between -b p-1 mb-0.5 rounded-md hover:bg-gray-200 cursor-pointer transition-all"
          key={parent.id}
          onClick={() => expand(parent)}
        >
          <div className="flex">
            <p className="text-[10px] text-gray-600">[{parent.formula_id}] -</p>
            <p className="text-xs font-medium text-gray-800 ml-1">{parent.name}</p>
          </div>
          <p className="bg-green-600 text-white px-1 py-0.5 rounded-sm text-[10px]">
            {parent.monthly_amount_hkd}
          </p>
          <p
            className={`text-[10px] ${
              parent.account_id === "0" ? "text-blue-500 font-semibold" : "text-gray-600"
            }`}
          >
            {parent.account_id === "0" ? <FaArrowRight className="w-3 h-3" /> : "."}
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


      {/* DEPENDANCY TREE */}

    { toggleFormulaHie && <div className='border-t-8 border-red-600 h-20 '>
        <label>Formulae Dependancy Tree</label>
          <DependancyTree formulaId = {formulaId} formulaeData={formulaeData} />
      </div>}
    </>
  );
  
};

export default Home;
