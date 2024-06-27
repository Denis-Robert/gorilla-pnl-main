import { useState } from "react";
import formSchema1 from "./formschemamisc";

function Misc({ miscData, setMiscData, formData }) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleDateClick = () => {
    setShowPlaceholder(true);
  };

  const handleCheckboxChange = (event, fieldId) => {
    const { value, checked } = event.target;
    setMiscData({
      ...miscData,
      [fieldId]: {
        ...miscData[fieldId],
        [value]: checked,
      },
    });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setMiscData({ ...miscData, [id]: value });

    if (id === "start_date" || id === "end_date") {
      updateTotalContractPeriod(id, value);
    }
  };

  const updateTotalContractPeriod = (fieldId, value) => {
    const newFormData = { ...miscData, [fieldId]: value };
    const startDate = newFormData["start_date"];
    const endDate = newFormData["end_date"];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth();
      const totalContractPeriod = months >= 0 ? months : 0;
      setMiscData({
        ...newFormData,
        totalContractPeriod: totalContractPeriod.toString(),
      });
    }
  };

  const handleSubmit = () => {
    const requiredFieldsFilled = formSchema1.every(
      (field) => !field.required || miscData[field.id] !== ""
    );

    if (!requiredFieldsFilled) {
      setShowPopup(true);
      return;
    }

    const sessionFormData =
      JSON.parse(sessionStorage.getItem("miscData")) || {};
    const updatedFormData = {
      ...sessionFormData,
      ...miscData,
    };

    sessionStorage.setItem("miscData", JSON.stringify(updatedFormData));
  };

  const filteredFormSchema = formSchema1.filter(
    (field) => formData[field.id] === "Yes"//"Yes" || "true" || true
);
  // for(let obj of filteredFormSchema){
  //   console.log(formSchema1.id)
  //   if(obj.id === "third_party"){
  //     filteredFormSchema.push({
  //       id:"third_party_desc",
  //       label: "3rd Party Description",
  //       type: "text",
  //       defaultValue: "NA",
  //   })
  //   }
  // }
  console.log(filteredFormSchema);
  console.log("misc page: ",miscData)

  return (
    <div className="bg-white bg-cover m-0 p-1 box-border overflow-hidden h-screen">

      <div className="bg-white w-11/12 mx-auto my-10 rounded-3xl border-4 border-indigo-700 p-10 overflow-hidden h-4/5">
        <div className="grid grid-cols-3 gap-4">
          {filteredFormSchema.map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className="text-black mb-3">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  value={miscData[field.id]}
                  defaultValue={field.defaultValue}
                  onChange={handleChange}
                  className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "date" ? (
                <input
                  id={field.id}
                  type="date"
                  defaultValue={field.defaultValue}
                  onClick={handleDateClick}
                  value={miscData[field.id]}
                  onChange={handleChange}
                  placeholder={showPlaceholder ? "dd-mm-yyyy" : ""}
                  className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                />
              ) : field.type === "checkbox" ? (
                <div className="flex">
                  {field.options.map((option) => (
                    <div key={option} className="flex items-center mb-2 m-3">
                      <input
                        type="checkbox"
                        id={`${field.id}-${option}`}
                        value={option}
                        checked={miscData[field.id][option]}
                        onChange={(event) =>
                          handleCheckboxChange(event, field.id)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`${field.id}-${option}`}
                        className="text-black"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : field.type === "integer" ? (
                <input
                  id={field.id}
                  type="number"
                  value={miscData[field.id]}
                  defaultValue={field.defaultValue}
                  onChange={handleChange}
                  className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                />
              ) : (
                <input
                  id={field.id}
                  type="text"
                  value={miscData[field.id]}
                  defaultValue={field.defaultValue}
                  onChange={handleChange}
                  className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-md text-black border-3 border-red-500 flex flex-col items-center">
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
  );
}

export default Misc;
