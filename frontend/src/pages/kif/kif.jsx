import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import formSchema from "./formschema";

function Kif({ formData, setFormData }) {
  const navigate = useNavigate();
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // useEffect(() => {
  //   const dealID = sessionStorage.getItem("dealID");
  //   console.log(dealID);
  // }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleDateClick = () => {
    setShowPlaceholder(true);
  };

  const handleCheckboxChange = (event, fieldId) => {
    const { value, checked } = event.target;
    setFormData({
      ...formData,
      [fieldId]: {
        ...formData[fieldId],
        [value]: checked,
      },
    });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });

    if (id === "start_date" || id === "end_date") {
      updateTotalContractPeriod(id, value);
    }
  };

  const updateTotalContractPeriod = (fieldId, value) => {
    const newFormData = { ...formData, [fieldId]: value };
    const startDate = newFormData["start_date"];
    const endDate = newFormData["end_date"];
  
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Calculate the difference in months
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      
      // Add 1 to include partial months, if the end date is later in the month than the start date
      const totalMonths = end.getDate() >= start.getDate() ? months + 1 : months;
      
      // Ensure the result is not negative
      const totalContractPeriod = Math.max(0, totalMonths);
  
      setFormData({
        ...newFormData,
        total_contract: totalContractPeriod.toString(),
      });
    }
  };

  console.log("KIF page: ",formData)
  return (
    <>
      <div className="bg-white bg-cover m-0 p-0 box-border overflow-hidden text-black">


        <div className="bg-white text-black w-11/12 mx-auto my-10 rounded-3xl border-4 border-indigo-700 p-10 overflow-hidden">
          <div className="grid grid-cols-3 gap-4">
            {formSchema.map((field) => (
              <div key={field?.id} className="flex flex-col">
                <label htmlFor={field?.id} className="text-black mb-3">
                  {field?.label}
                </label>
                {field?.type === "select" ? (
                  <select
                    id={field?.id}
                    value={formData[field?.id]}
                    onChange={handleChange}
                    className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field?.type === "date" ? (
                  <input
                    id={field.id}
                    type="date"
                    value={formData[field?.id]}
                    onClick={handleDateClick}
                    onChange={handleChange}
                    placeholder={showPlaceholder ? "dd-mm-yyyy" : ""}
                    className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                  />
                ) :

                field?.type === "checkbox" ? (
                  <div className="">
                    {formData && field?.options.map((option) => (
                      <div key={option} className="flex items-center mb-2 m-3">
                        <input
                          type="checkbox"
                          id={`${field?.id}-${option}`}
                          value={option}
                          checked={formData[field?.id][option]}
                          onChange={(event) =>
                            handleCheckboxChange(event, field.id)
                          }
                          className="mr-2"
                        />
                      
                        <label
                          htmlFor={`${field?.id}-${option}`}
                          className="text-black"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>  
                ) : 
                field?.type === "integer" ? (
                  <input
                    id={field.id}
                    type="number"
                    value={formData[field?.id]}
                    onChange={handleChange}
                    className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                  />
                ) : field.type === "text" ?
                  (<input
                    id={field.id}
                    type="text"
                    value={formData[field?.id]}
                    onChange={handleChange}
                    className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                  />): null
                }
              </div>
            ))}
          </div>
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center ">
            <div className="bg-white p-5 rounded-lg shadow-md text-black  border-red-500 flex flex-col items-center border-2 ">
              <h2 className="mb-5">Please, Fill all required Fields</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="px-10 py-4 bg-blue-700 rounded text-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Kif;



