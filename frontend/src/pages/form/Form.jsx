import React, { useState, useEffect } from "react";
import axios from "axios";
import Kif from "../kif/kif";
import formSchema from "../kif/formschema";
import Comp from "../components/components";
import Rls from "../rls/Rls";
import Misc from "../misc/Misc";
import formSchema1 from "../misc/formschemamisc";
import Summary from "../summary/Summary";
import logo from "../../assets/logo1.png";
import { Link } from "react-router-dom";

const steps = [
  { id: "Step 1", name: "KIF" },
  { id: "Step 2", name: "Components" },
  { id: "Step 3", name: "RLS" },
  { id: "Step 4", name: "MISC" },
  { id: "Step 5", name: "Summary" },
];

const Form = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shoppingCart, setShoppingCart] = useState({});
  const [rlsCart, setRlsCart] = useState([]);
  const [formData, setFormData] = useState(
    formSchema.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.id] = field.options.reduce((optionAcc, option) => {
          optionAcc[option] = false;
          return optionAcc;
        }, {});
      } else if (field.type === "integer") {
        acc[field.id] = field.defaultValue || 0;
      } else {
        acc[field.id] = field.defaultValue || "";
      }
      return acc;
    }, {})
  );

  const [resourceData, setResourceData] = useState([]);
  const [manDays, setManDays] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [enabledResources, setEnabledResources] = useState({});
  const [showPopup, setShowPopup] = useState(false);


  const [miscData, setMiscData] = useState(
    formSchema1.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.id] = field.options.reduce((optionAcc, option) => {
          optionAcc[option] = false;
          return optionAcc;
        }, {});
      } else if (field.type === "integer") {
        acc[field.id] = field.defaultValue || 0;
      } else {
        acc[field.id] = field.defaultValue || "";
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/read-rls');
        setResourceData(response.data);
      } catch (error) {
        console.error('Error fetching resource costs', error);
      }
    };
    fetchData();
  }, []);

  const validateRequiredFields = () => {
    const requiredFields = formSchema.filter(field => field.required);
    for (let field of requiredFields) {
      if (!formData[field.id]) {
        setShowPopup(true);
        return false;
      }
    }
    return true;
  };
  

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

  const handleAddToCart = (add_part) => {
    const { part_no, ...partWithoutNo } = add_part;
    if (shoppingCart[part_no]) {
      setShoppingCart((prevShoppingCart) => ({
        ...prevShoppingCart,
        [part_no]: {
          ...prevShoppingCart[part_no],
          qty: prevShoppingCart[part_no].qty + 1,
        },
      }));
    } else {
      setShoppingCart((prevShoppingCart) => ({
        ...prevShoppingCart,
        [part_no]: { ...partWithoutNo, qty: 1 },
      }));
    }
  };

  const next = () => {
    if (currentStep === 0 && !validateRequiredFields()) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };
  

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let deal;
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/submit", formData);
      console.log(res.data);
      deal = { deal_id: res.data };
    } catch (error) {
      console.log(error);
    }

    console.log(deal);
    const final = {
      deal,
      miscData,
      shoppingCart,
      rlsCart,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/writemongo",
        final,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form", error);
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

  return (
    <div className="content">
      <header className="navbar h-20 py-5 px-10 flex items-center justify-between border-b-2">
        <Link to="/"><img src={logo} alt="gorilla tech grp" className="h-10" /></Link>
        <h1 className="textwhite text-2xl">Create A Deal</h1>
      </header>
      <section className="absolute inset-0 flex flex-col justify-between p-24 mt-20">
        <nav aria-label="Progress">
          <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-indigo-700 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-indigo-700 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-indigo-700">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <form className="mt-12 py-12" onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <Kif 
            formData={formData} 
            setFormData={setFormData}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            />
          )}
          {currentStep === 1 && (
            <Comp
              shoppingCart={shoppingCart}
              setShoppingCart={setShoppingCart}
            />
          )}
          {currentStep === 2 && (
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
          )}
          {currentStep === 3 && (
            <Misc
              miscData={miscData}
              formData={formData}
              onUpdate={handleMiscUpdate}
              filteredFormSchema={filteredFormSchema}
            />
          )}
          {currentStep === 4 && (
            <Summary
              formData={formData}
              shoppingCart={shoppingCart}
              rlsCart={rlsCart}
              miscData={miscData}
            />
          )}

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
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
                onClick={next}
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <Link to="/"><button
                type="submit"
                className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
              >
                Submit
              </button></Link>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default Form;
