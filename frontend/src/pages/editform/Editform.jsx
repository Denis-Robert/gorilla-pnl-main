import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Kif from "../kif/kif.jsx";
import Comp from "../components/components";
import Rls from "../rls/Rls";
import Summary from "../summary/Summary";
import logo from "../../assets/logo1.png";
import formSchema1 from "../misc/formschemamisc";
import formSchema from "../kif/formschema";

const steps = [
  { id: "Step 1", name: "KIF" },
  { id: "Step 2", name: "Components" },
  { id: "Step 3", name: "RLS" },
  { id: "Step 4", name: "MISC" },
  { id: "Step 5", name: "Summary" },
];

const Editform = () => {
  const { deal_id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [shoppingCart, setShoppingCart] = useState({});
  const [rlsCart, setRlsCart] = useState([]);
  const [formData, setFormData] = useState(
    formSchema.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.id] = field.options.reduce((checkboxAcc, option) => {
          checkboxAcc[option] = false;
          return checkboxAcc;
        }, {});
      } else if (field.type === "integer") {
        acc[field.id] = 0;
      } else if (field.type === "select") {
        acc[field.id] = field.defaultValue || field.options[0];
      } else {
        acc[field.id] = "";
      }
      return acc;
    }, {})
  );
  const [miscData, setMiscData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [resourceData, setResourceData] = useState([]);
  const [manDays, setManDays] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [enabledResources, setEnabledResources] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const fetchData = useCallback(async () => {
    if (deal_id) {
      try {
        setIsLoading(true);
        console.log("Fetching data for deal_id:", deal_id);
        
        const dealResponse = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
        const dealData = dealResponse.data;
        console.log("API response:", dealData);

        // Convert boolean values to "Yes" or "No" for select fields
        const convertedFormData = Object.keys(dealData.formData).reduce((acc, key) => {
          const field = formSchema.find(f => f.id === key);
          if (field && field.type === "select" && typeof dealData.formData[key] === "boolean") {
            acc[key] = dealData.formData[key] ? "Yes" : "No";
          } else {
            acc[key] = dealData.formData[key];
          }
          return acc;
        }, {});

        // Ensure at least one workNature option is true
        if (convertedFormData.workNature && !Object.values(convertedFormData.workNature).some(v => v)) {
          convertedFormData.workNature[Object.keys(convertedFormData.workNature)[0]] = true;
        }

        setFormData(prevData => ({...prevData, ...convertedFormData}));
        setMiscData(dealData.misc_data || {});
        setShoppingCart(dealData.shopping_cart || {});
        setRlsCart(dealData.rls_cart || []);
        
        const resourceResponse = await axios.get("http://127.0.0.1:5000/api/read-rls");
        const resourceData = resourceResponse.data;
        setResourceData(resourceData);

        if (dealData.rls_cart && dealData.rls_cart.length > 0) {
          const newManDays = {};
          const newQuantities = {};
          const newEnabledResources = {};
          let newSelectedCountry = "";
          let newTotalCost = 0;

          dealData.rls_cart.forEach((item) => {
            newEnabledResources[item.key] = true;
            newTotalCost = item.totalCost;

            if (!newSelectedCountry) {
              newSelectedCountry = item.resource.region;
            }

            item.manDayQuantities.forEach((mdq, index) => {
              const key = `${item.resource.level}-${item.resource.region}-${index + 1}`;
              newManDays[key] = mdq.manDays;
              newQuantities[key] = mdq.quantities;
            });
          });

          setManDays(newManDays);
          setQuantities(newQuantities);
          setEnabledResources(newEnabledResources);
          setSelectedCountry(newSelectedCountry);
          setTotalCost(newTotalCost);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setError(`Failed to fetch deal data: ${error.message}`);
        setIsLoading(false);
      }
    } else {
      setFormData({});
      setMiscData({});
      setShoppingCart({});
      setRlsCart([]);
      setIsLoading(false);
    }
  }, [deal_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      const workingDaysPerMonth = 22;

      resourceData.forEach((res) => {
        if (enabledResources[`${res.level}-${res.region}`]) {
          for (
            let month = 1;
            month <= parseInt(formData.total_contract) || 0;
            month++
          ) {
            const key = `${res.level}-${res.region}-${month}`;
            const manDay = parseFloat(manDays[key]) || 0;
            const quantity = parseFloat(quantities[key]) || 0;
            const dailyRate = res.cost / workingDaysPerMonth;

            total += manDay * quantity * dailyRate;
          }
        }
      });

      return total;
    };

    const newTotalCost = calculateTotal();
    setTotalCost(newTotalCost);

    const updatedCart = resourceData
      .filter((res) => enabledResources[`${res.level}-${res.region}`])
      .map((res) => {
        const level = res.level;
        const region = res.region;
        const manDayQuantities = Array.from(
          { length: parseInt(formData.total_contract) || 0 },
          (_, i) => ({
            month: `M${i + 1}`,
            manDays: parseFloat(manDays[`${level}-${region}-${i + 1}`]) || 0,
            quantities:
              parseFloat(quantities[`${level}-${region}-${i + 1}`]) || 0,
          })
        );
        return {
          key: `${level}-${region}`,
          resource: res,
          manDayQuantities,
          totalCost: newTotalCost,
        };
      });

    setRlsCart(updatedCart);
  }, [
    resourceData,
    enabledResources,
    manDays,
    quantities,
    formData.total_contract,
  ]);

  const validateRequiredFields = () => {
    const requiredFields = formSchema.filter(field => field.required);
    for (let field of requiredFields) {
      if (field.type === 'checkbox') {
        if (!Object.values(formData[field.id]).some(value => value)) {
          setShowPopup(true);
          return false;
        }
      } else if (field.type === 'select') {
        if (!formData[field.id] || formData[field.id] === "") {
          setShowPopup(true);
          return false;
        }
      } else if (!formData[field.id]) {
        setShowPopup(true);
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };


  const next = () => {
    switch (currentStep) {
      case 0:
        if (!validateRequiredFields()) return;
        break;
      case 1:
        setShoppingCart({...shoppingCart});
        break;
      case 2:
        setRlsCart([...rlsCart]);
        break;
      case 3:
        setMiscData({...miscData});
        break;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert "Yes"/"No" back to boolean for submission
    const submissionFormData = Object.keys(formData).reduce((acc, key) => {
      const field = formSchema.find(f => f.id === key);
      if (field && field.type === "select" && (formData[key] === "Yes" || formData[key] === "No")) {
        acc[key] = formData[key] === "Yes";
      } else {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    const final = {
      deal: { deal_id },
      formData: submissionFormData,
      miscData,
      shoppingCart,
      rlsCart,
      resourceData,
      manDays,
      quantities,
      totalCost,
      selectedCountry,
      enabledResources,
    };

    try {
      await axios.post("http://localhost:5000/api/writemongo", final, {
        headers: { "Content-Type": "application/json" },
      });
      
      await axios.post("http://localhost:5000/api/submit", submissionFormData, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting form", error);
      setError("Failed to submit the form. Please try again.");
    }
  };

  const handleRlsCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handleRlsSwitchChange = (resourceKey, isEnabled) => {
    setEnabledResources((prev) => ({
      ...prev,
      [resourceKey]: isEnabled,
    }));
  };

  const handleRlsInputChange = (e, resource, month, type) => {
    const value = parseFloat(e.target.value) || 0;
    const key = `${resource.level}-${resource.region}-${month}`;

    if (type === "manDays") {
      setManDays((prev) => ({ ...prev, [key]: value }));
    } else if (type === "quantity") {
      setQuantities((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleMiscUpdate = (id, value) => {
    setMiscData((prev) => ({ ...prev, [id]: value }));
  };

  const filteredFormSchema = formSchema1.filter((field) => {
    return formData[field.id] === "Yes" || formData[field.id] === true;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Kif 
            formData={formData} 
            setFormData={setFormData}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        );
      case 1:
        return (
          <Comp
            shoppingCart={shoppingCart}
            setShoppingCart={setShoppingCart}
          />
        );
      case 2:
        return (
          <Rls
            resourceData={resourceData}
            totalMonths={parseInt(formData.total_contract) || 0}
            selectedCountry={selectedCountry}
            enabledResources={enabledResources}
            manDays={manDays}
            quantities={quantities}
            totalCost={totalCost}
            onCountryChange={handleRlsCountryChange}
            onSwitchChange={handleRlsSwitchChange}
            onInputChange={handleRlsInputChange}
          />
        );
      case 3:
        return (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">MISC</h2>
            {filteredFormSchema.map((field) => (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={miscData[field.id] || ''}
                  onChange={(e) => handleMiscUpdate(field.id, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <Summary
            key={JSON.stringify({formData, shoppingCart, rlsCart, miscData})}
            formData={formData}
            shoppingCart={shoppingCart}
            rlsCart={rlsCart}
            miscData={miscData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="content">
      <header className="navbar h-20 py-5 px-10 flex items-center justify-between border-b-2">
        <img src={logo} alt="gorilla tech grp" className="w-44" />
        <h1 className="text-white text-2xl">{deal_id ? "Edit Deal" : "Create A Deal"}</h1>
      </header>
      <section className="absolute inset-0 flex flex-col justify-between p-24 mt-20">
        <nav aria-label="Progress">
          <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                <div className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  currentStep > index ? "border-indigo-700" : 
                  currentStep === index ? "border-indigo-700" : "border-gray-200"
                }`}>
                  <span className={`text-sm font-medium ${
                    currentStep === index ? "text-indigo-700" : "text-gray-500"
                  } transition-colors`}>
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <form className="mt-12 py-12" onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            {currentStep > 0 && (
              <button
                type="button"
                className="rounded-md bg-white py-2 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={prev}
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
                onClick={next}
              >
                Next
              </button>
            ) : (
              <button
              type="submit"
              className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </section>
    {showPopup && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Please fill all required fields</h2>
          <button
            onClick={() => setShowPopup(false)}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default Editform;



// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import logo from "../../assets/logo1.png";
// import formSchema from "../kif/formschema";

// const Editform = () => {
//   const { deal_id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     if (deal_id) {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
//         const dealData = response.data;
//         setFormData(dealData.formData);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setError(`Failed to fetch deal data: ${error.message}`);
//         setIsLoading(false);
//       }
//     } else {
//       setFormData({});
//       setIsLoading(false);
//     }
//   }, [deal_id]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleChange = (e) => {
//     const { id, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setFormData(prev => ({
//         ...prev,
//         [id]: {
//           ...prev[id],
//           [value]: checked
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/writemongo", { deal: { deal_id }, formData }, {
//         headers: { "Content-Type": "application/json" },
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Error submitting form", error);
//       setError("Failed to submit the form. Please try again.");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="content">
//       <header className="navbar h-20 py-5 px-10 flex items-center justify-between border-b-2">
//         <img src={logo} alt="gorilla tech grp" className="w-44" />
//         <h1 className="text-white text-2xl">{deal_id ? "Edit Deal" : "Create A Deal"}</h1>
//       </header>
//       <section className="p-8">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {formSchema.map((field) => (
//             <div key={field.id} className="flex flex-col">
//               <label htmlFor={field.id} className="text-sm font-medium text-gray-700 mb-1">
//                 {field.label}
//               </label>
//               {field.type === "select" ? (
//                 <select
//                   id={field.id}
//                   value={formData[field.id] || ""}
//                   onChange={handleChange}
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 >
//                   {field.options.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : field.type === "checkbox" ? (
//                 <div className="mt-1 space-y-2">
//                   {field.options.map((option) => (
//                     <div key={option} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id={`${field.id}-${option}`}
//                         name={field.id}
//                         value={option}
//                         checked={formData[field.id]?.[option] || false}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       />
//                       <label htmlFor={`${field.id}-${option}`} className="ml-2 block text-sm text-gray-900">
//                         {option}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <input
//                   type={field.type}
//                   id={field.id}
//                   value={formData[field.id] || ""}
//                   onChange={handleChange}
//                   className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 />
//               )}
//             </div>
//           ))}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default Editform;