import React from "react";
import PropTypes from "prop-types";

function Misc({ miscData, formData, onUpdate, filteredFormSchema }) {
<<<<<<< Updated upstream
  console.log("Misc received props:", { miscData, formData, filteredFormSchema });
=======

>>>>>>> Stashed changes

  const handleCheckboxChange = (event, fieldId) => {
    const { value, checked } = event.target;
    onUpdate(fieldId, { ...miscData[fieldId], [value]: checked });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    onUpdate(id, value);
  };

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
                  value={miscData[field.id] || ""}
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
                  value={miscData[field.id] || ""}
                  onChange={handleChange}
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
                        checked={miscData[field.id]?.[option] || false}
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
              ) : (
                <input
                  id={field.id}
                  type={field.type === "integer" ? "number" : "text"}
                  value={miscData[field.id] || ""}
                  onChange={handleChange}
                  className="py-2 px-3 rounded bg-white text-black border-2 border-indigo-700"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Misc.propTypes = {
  miscData: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  filteredFormSchema: PropTypes.array.isRequired,
};

export default Misc;