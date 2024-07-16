// // import React, { useState, useEffect, useCallback } from "react";
// // import axios from "axios";
// // import { useParams, useNavigate } from "react-router-dom";
// // import Kif from "../kif/kif.jsx";
// // import Comp from "../components/components";
// // import Rls from "../rls/Rls";
// // import Misc from "../misc/Misc";
// // import Summary from "../summary/Summary";
// // import logo from "../../assets/logo1.png";


// // const steps = [
// //   { id: "Step 1", name: "KIF" },
// //   { id: "Step 2", name: "Components" },
// //   { id: "Step 3", name: "RLS" },
// //   { id: "Step 4", name: "MISC" },
// //   { id: "Step 5", name: "Summary" },
// // ];

// // const Editform = () => {
// //   const { deal_id } = useParams();
// //   const navigate = useNavigate();
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [shoppingCart, setShoppingCart] = useState({});
// //   const [rlsCart, setRlsCart] = useState([]);
// //   const [formData, setFormData] = useState({});
// //   const [miscData, setMiscData] = useState({});
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchData = useCallback(async () => {
// //     if (deal_id) {
// //       try {
// //         setIsLoading(true);
// //         const response = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
// //         const data = response.data;
        
// //         setFormData(data.formData || {});
// //         setMiscData(data.misc_data || {});
// //         setShoppingCart(data.shopping_cart || {});
// //         setRlsCart(data.rls_cart || []);
        
// //         setIsLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data", error);
// //         setError("Failed to fetch deal data. Please try again.");
// //         setIsLoading(false);
// //       }
// //     } else {
// //       setFormData({});
// //       setMiscData({});
// //       setShoppingCart({});
// //       setRlsCart([]);
// //       setIsLoading(false);
// //     }
// //   }, [deal_id]);

// //   useEffect(() => {
// //     fetchData();
// //   }, [fetchData]);

// //   const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
// //   const prev = () => setCurrentStep((step) => Math.max(step - 1, 0));

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const final = {
// //       deal: { deal_id },
// //       miscData,
// //       shoppingCart,
// //       rlsCart,
// //       formData,
// //     };

// //     try {
// //       await axios.post("http://localhost:5000/api/writemongo", final, {
// //         headers: { "Content-Type": "application/json" },
// //       });
// //       navigate("/");
// //     } catch (error) {
// //       console.error("Error submitting form", error);
// //       setError("Failed to submit the form. Please try again.");
// //     }
// //   };

// //   if (isLoading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;

// //   const renderStep = () => {
// //     switch (currentStep) {
// //       case 0: return <Kif formData={formData} setFormData={setFormData} />;
// //       case 1: return <Comp shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />;
// //       case 2: return <Rls rlsCart={rlsCart} setRlsCart={setRlsCart} formData={formData} />;
// //       case 3: return <Misc miscData={miscData} setMiscData={setMiscData} formData={formData} />;
// //       case 4: return <Summary formData={formData} shoppingCart={shoppingCart} rlsCart={rlsCart} miscData={miscData} />;
// //       default: return null;
// //     }
// //   };

// //   return (
// //     <div className="content">
// //       <header className="navbar h-20 py-5 px-10 flex items-center justify-between border-b-2">
// //         <img src={logo} alt="gorilla tech grp" className="w-44" />
// //         <h1 className="text-white text-2xl">{deal_id ? "Edit Deal" : "Create A Deal"}</h1>
// //       </header>
// //       <section className="absolute inset-0 flex flex-col justify-between p-24 mt-20">
// //         <nav aria-label="Progress">
// //           <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
// //             {steps.map((step, index) => (
// //               <li key={step.name} className="md:flex-1">
// //                 <div className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
// //                   currentStep > index ? "border-indigo-700" : 
// //                   currentStep === index ? "border-indigo-700" : "border-gray-200"
// //                 }`}>
// //                   <span className={`text-sm font-medium ${
// //                     currentStep === index ? "text-indigo-700" : "text-gray-500"
// //                   } transition-colors`}>
// //                     {step.id}
// //                   </span>
// //                   <span className="text-sm font-medium">{step.name}</span>
// //                 </div>
// //               </li>
// //             ))}
// //           </ol>
// //         </nav>

// //         <form className="mt-12 py-12" onSubmit={handleSubmit}>
// //           {renderStep()}
// //           <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
// //             {currentStep > 0 && (
// //               <button
// //                 type="button"
// //                 className="rounded-md bg-white py-2 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
// //                 onClick={prev}
// //               >
// //                 Previous
// //               </button>
// //             )}
// //             {currentStep < steps.length - 1 ? (
// //               <button
// //                 type="button"
// //                 className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
// //                 onClick={next}
// //               >
// //                 Next
// //               </button>
// //             ) : (
// //               <button
// //                 type="submit"
// //                 className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
// //               >
// //                 Submit
// //               </button>
// //             )}
// //           </div>
// //         </form>
// //       </section>
// //     </div>
// //   );
// // };

// // export default Editform;


// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import Kif from "../kif/kif.jsx";
// import Comp from "../components/components";
// import Rls from "../rls/Rls";
// import Misc from "../misc/Misc";
// import Summary from "../summary/Summary";
// import logo from "../../assets/logo1.png";
// import formSchema1 from "../misc/formschemamisc";

// const steps = [
//   { id: "Step 1", name: "KIF" },
//   { id: "Step 2", name: "Components" },
//   { id: "Step 3", name: "RLS" },
//   { id: "Step 4", name: "MISC" },
//   { id: "Step 5", name: "Summary" },
// ];

// const Editform = () => {
//   const { deal_id } = useParams();
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [shoppingCart, setShoppingCart] = useState({});
//   const [rlsCart, setRlsCart] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [miscData, setMiscData] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // New state for RLS
//   const [resourceData, setResourceData] = useState([]);
//   const [manDays, setManDays] = useState({});
//   const [quantities, setQuantities] = useState({});
//   const [totalCost, setTotalCost] = useState(0);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [enabledResources, setEnabledResources] = useState({});

//   const fetchData = useCallback(async () => {
//     if (deal_id) {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
//         const data = response.data;
        
//         setFormData(data.formData || {});
//         setMiscData(data.misc_data || {});
//         setShoppingCart(data.shopping_cart || {});
//         setRlsCart(data.rls_cart || []);
        
//         // Set RLS data
//         setResourceData(data.resource_data || []);
//         setManDays(data.man_days || {});
//         setQuantities(data.quantities || {});
//         setTotalCost(data.total_cost || 0);
//         setSelectedCountry(data.selected_country || '');
//         setEnabledResources(data.enabled_resources || {});

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data", error);
//         setError("Failed to fetch deal data. Please try again.");
//         setIsLoading(false);
//       }
//     } else {
//       setFormData({});
//       setMiscData({});
//       setShoppingCart({});
//       setRlsCart([]);
//       setIsLoading(false);
//     }
//   }, [deal_id]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     const calculateTotal = () => {
//       let total = 0;
//       const workingDaysPerMonth = 22;

//       resourceData.forEach(res => {
//         if (enabledResources[`${res.level}-${res.region}`]) {
//           for (let month = 1; month <= parseInt(formData.total_contract) || 0; month++) {
//             const key = `${res.level}-${res.region}-${month}`;
//             const manDay = parseFloat(manDays[key]) || 0;
//             const quantity = parseFloat(quantities[key]) || 0;
//             const dailyRate = res.cost / workingDaysPerMonth;

//             total += manDay * quantity * dailyRate;
//           }
//         }
//       });

//       return total;
//     };

//     const newTotalCost = calculateTotal();
//     setTotalCost(newTotalCost);

//     const updatedCart = resourceData
//       .filter(res => enabledResources[`${res.level}-${res.region}`])
//       .map(res => {
//         const level = res.level;
//         const region = res.region;
//         const manDayQuantities = Array.from({ length: parseInt(formData.total_contract) || 0 }, (_, i) => ({
//           month: `M${i + 1}`,
//           manDays: parseFloat(manDays[`${level}-${region}-${i + 1}`]) || 0,
//           quantities: parseFloat(quantities[`${level}-${region}-${i + 1}`]) || 0,
//         }));
//         return {
//           key: `${level}-${region}`,
//           resource: res,
//           manDayQuantities,
//           totalCost: newTotalCost,
//         };
//       });

//     setRlsCart(updatedCart);
//   }, [resourceData, enabledResources, manDays, quantities, formData.total_contract]);

//   const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
//   const prev = () => setCurrentStep((step) => Math.max(step - 1, 0));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const final = {
//       deal: { deal_id },
//       miscData,
//       shoppingCart,
//       rlsCart,
//       formData,
//       resourceData,
//       manDays,
//       quantities,
//       totalCost,
//       selectedCountry,
//       enabledResources,
//     };

//     try {
//       await axios.post("http://localhost:5000/api/writemongo", final, {
//         headers: { "Content-Type": "application/json" },
//       });
//       navigate("/");
//     } catch (error) {
//       console.error("Error submitting form", error);
//       setError("Failed to submit the form. Please try again.");
//     }
//   };

//   const handleRlsCountryChange = (country) => {
//     setSelectedCountry(country);
//   };

//   const handleRlsSwitchChange = (resourceKey, isEnabled) => {
//     setEnabledResources(prev => ({
//       ...prev,
//       [resourceKey]: isEnabled,
//     }));
//   };

//   const handleRlsInputChange = (e, resource, month, type) => {
//     const value = parseFloat(e.target.value) || 0;
//     const key = `${resource.level}-${resource.region}-${month}`;

//     if (type === 'manDays') {
//       setManDays(prev => ({ ...prev, [key]: value }));
//     } else if (type === 'quantity') {
//       setQuantities(prev => ({ ...prev, [key]: value }));
//     }
//   };

//   const handleMiscUpdate = (id, value) => {
//     setMiscData(prev => ({ ...prev, [id]: value }));
//   };

//   const filteredFormSchema = formSchema1.filter(
//     (field) => formData[field.id] === "Yes"
//   );

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0: return <Kif formData={formData} setFormData={setFormData} />;
//       case 1: return <Comp shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />;
//       case 2: return (
//         <Rls
//           resourceData={resourceData}
//           totalMonths={parseInt(formData.total_contract) || 0}
//           selectedCountry={selectedCountry}
//           enabledResources={enabledResources}
//           manDays={manDays}
//           quantities={quantities}
//           totalCost={totalCost}
//           onCountryChange={handleRlsCountryChange}
//           onSwitchChange={handleRlsSwitchChange}
//           onInputChange={handleRlsInputChange}
//         />
//       );
//       case 3: return (
//         <Misc
//           miscData={miscData}
//           formData={formData}
//           onUpdate={handleMiscUpdate}
//           filteredFormSchema={filteredFormSchema}
//         />
//       );
//       case 4: return <Summary formData={formData} shoppingCart={shoppingCart} rlsCart={rlsCart} miscData={miscData} />;
//       default: return null;
//     }
//   };

//   return (
//     <div className="content">
//       <header className="navbar h-20 py-5 px-10 flex items-center justify-between border-b-2">
//         <img src={logo} alt="gorilla tech grp" className="w-44" />
//         <h1 className="text-white text-2xl">{deal_id ? "Edit Deal" : "Create A Deal"}</h1>
//       </header>
//       <section className="absolute inset-0 flex flex-col justify-between p-24 mt-20">
//         <nav aria-label="Progress">
//           <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
//             {steps.map((step, index) => (
//               <li key={step.name} className="md:flex-1">
//                 <div className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
//                   currentStep > index ? "border-indigo-700" : 
//                   currentStep === index ? "border-indigo-700" : "border-gray-200"
//                 }`}>
//                   <span className={`text-sm font-medium ${
//                     currentStep === index ? "text-indigo-700" : "text-gray-500"
//                   } transition-colors`}>
//                     {step.id}
//                   </span>
//                   <span className="text-sm font-medium">{step.name}</span>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </nav>

//         <form className="mt-12 py-12" onSubmit={handleSubmit}>
//           {renderStep()}
//           <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
//             {currentStep > 0 && (
//               <button
//                 type="button"
//                 className="rounded-md bg-white py-2 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 onClick={prev}
//               >
//                 Previous
//               </button>
//             )}
//             {currentStep < steps.length - 1 ? (
//               <button
//                 type="button"
//                 className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
//                 onClick={next}
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </form>
//       </section>
//     </div>
//   );
// };

// export default Editform;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Kif from "../kif/kif.jsx";
import Comp from "../components/components";
import Rls from "../rls/Rls";
import Misc from "../misc/Misc";
import Summary from "../summary/Summary";
import logo from "../../assets/logo1.png";
import formSchema1 from "../misc/formschemamisc";

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
  const [formData, setFormData] = useState({});
  const [miscData, setMiscData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for RLS
  const [resourceData, setResourceData] = useState([]);
  const [manDays, setManDays] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [enabledResources, setEnabledResources] = useState({});

  const fetchData = useCallback(async () => {
    if (deal_id) {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
        const data = response.data;
        
        console.log("API response:", data);  // Log the entire API response

        setFormData(data.formData || {});
        setMiscData(data.misc_data || {});
        setShoppingCart(data.shopping_cart || {});
        setRlsCart(data.rls_cart || []);
        
        // Set RLS data
        setResourceData(data.resource_data || []);
        setManDays(data.man_days || {});
        setQuantities(data.quantities || {});
        setTotalCost(data.total_cost || 0);
        setSelectedCountry(data.selected_country || '');
        setEnabledResources(data.enabled_resources || {});

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

      resourceData.forEach(res => {
        if (enabledResources[`${res.level}-${res.region}`]) {
          for (let month = 1; month <= parseInt(formData.total_contract) || 0; month++) {
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
      .filter(res => enabledResources[`${res.level}-${res.region}`])
      .map(res => {
        const level = res.level;
        const region = res.region;
        const manDayQuantities = Array.from({ length: parseInt(formData.total_contract) || 0 }, (_, i) => ({
          month: `M${i + 1}`,
          manDays: parseFloat(manDays[`${level}-${region}-${i + 1}`]) || 0,
          quantities: parseFloat(quantities[`${level}-${region}-${i + 1}`]) || 0,
        }));
        return {
          key: `${level}-${region}`,
          resource: res,
          manDayQuantities,
          totalCost: newTotalCost,
        };
      });

    setRlsCart(updatedCart);
  }, [resourceData, enabledResources, manDays, quantities, formData.total_contract]);

  const next = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const prev = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const final = {
      deal: { deal_id },
      miscData,
      shoppingCart,
      rlsCart,
      formData,
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
    setEnabledResources(prev => ({
      ...prev,
      [resourceKey]: isEnabled,
    }));
  };

  const handleRlsInputChange = (e, resource, month, type) => {
    const value = parseFloat(e.target.value) || 0;
    const key = `${resource.level}-${resource.region}-${month}`;

    if (type === 'manDays') {
      setManDays(prev => ({ ...prev, [key]: value }));
    } else if (type === 'quantity') {
      setQuantities(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleMiscUpdate = (id, value) => {
    setMiscData(prev => ({ ...prev, [id]: value }));
  };

  const filteredFormSchema = formSchema1.filter(
    (field) => formData[field.id] === "Yes"
  );

  console.log("Filtered Form Schema:", filteredFormSchema);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Kif formData={formData} setFormData={setFormData} />;
      case 1: return <Comp shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />;
      case 2: 
        console.log("RLS props:", {
          resourceData,
          totalMonths: parseInt(formData.total_contract) || 0,
          selectedCountry,
          enabledResources,
          manDays,
          quantities,
          totalCost
        });
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
        console.log("Misc props:", {
          miscData,
          formData,
          filteredFormSchema
        });
        return (
          <Misc
            miscData={miscData}
            formData={formData}
            onUpdate={handleMiscUpdate}
            filteredFormSchema={filteredFormSchema}
          />
        );
      case 4: return <Summary formData={formData} shoppingCart={shoppingCart} rlsCart={rlsCart} miscData={miscData} />;
      default: return null;
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
    </div>
  );
};

export default Editform;