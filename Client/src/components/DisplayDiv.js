import React, { useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa';

function DisplayDiv(props) {
    useEffect(() => {
        // console.log("PROPSS", props.data);
    })

    const onGettingClicked = (parent) => {
        // console.log("GGGGGGG", JSON.stringify(parent, null, 2));
        props.onItemClick(parent)
    }
    
    return (
      <>
        {props.data &&
          props.data.map((item, index) => (
            <div
              className="flex items-center justify-between border border-yellow-500 p-1 rounded-md hover:shadow-sm mb-0.5 cursor-pointer transition-all"
              key={index}
              onClick={() => onGettingClicked(item)}
            >
              <div className="flex items-center space-x-1">
                {/* Displaying the name */}
                <p className="text-[10px] text-gray-600">{item.formula_id ? item.formula_id : item.id}</p>
                <p className="text-xs font-medium text-gray-800">{item.name}</p>
    
                {/* Displaying monthly_amount_hkd */}
                <p className="bg-green-600 text-white px-1 py-0.5 rounded-sm text-[10px]">
                  {item.monthly_amount_hkd}
                </p>
              </div>
    
              {/* Conditionally displaying account_id info */}
              <p
                className={`text-[10px] ${
                  item.account_id === "0" ? "text-blue-500 font-semibold" : "text-gray-600"
                }`}
              >
                {item.account_id === "0" ? (
                  <FaArrowRight className="w-3 h-3" />
                ) : (
                  "."
                )}
              </p>
            </div>
          ))}
      </>
    );
    
}

export default DisplayDiv
