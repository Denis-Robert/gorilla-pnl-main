import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Kif from "../kif/kif";
import Comp from "../components/components";
import Rls from "../rls/Rls";
import Misc from "../misc/Misc";
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
const Editform = () => {
    const { deal_id } = useParams();
    const navigate = useNavigate();
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [shoppingCart, setShoppingCart] = useState({});
    const [rlsCart, setRlsCart] = useState([]);
    const [formData, setFormData] = useState({});
    const [miscData, setMiscData] = useState({});

  
    useEffect(() => {
      const fetchData = async () => {
        console.log("angaa")
        if (deal_id) {
          try {
            console.log("hiiiiiiiiiiiiii")
            const response = await axios.get(`http://127.0.0.1:5000/api/edit/${deal_id}`);
            const data = response.data;
            console.log(JSON.stringify(data));
  
            setFormData(data.formData || {});
            setMiscData(data.misc_data || {});
            setShoppingCart(data.shopping_cart || {});
            setRlsCart(data.rls_cart || []);
            console.log("data - rls: ",data.rls_cart)
          } catch (error) {
            console.error("Error fetching data", error);
          }
        } else {
          setFormData({});
          setMiscData({});
          setShoppingCart({});
          setRlsCart([]);
        }
      };
  
      fetchData();
    }, []);

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
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const final = {
      deal: { deal_id },
      miscData,
      shoppingCart,
      rlsCart,
      formData,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/writemongo", final, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting form", error);
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
                    <span className="text-sm font-medium text-indigo-700">{step.id}</span>
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
          {Object.keys(formData).length > 0  && currentStep === 0 && <Kif formData={formData} setFormData={setFormData} />}
          {currentStep === 1 && (
            <Comp shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
          )}
          
          { currentStep === 2 && <Rls rlsCart={rlsCart} setRlsCart={setRlsCart} formData={formData} />}
          {currentStep === 3 && <Misc miscData={miscData} setMiscData={setMiscData} formData={formData} />}
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
              <button
                type="submit"
                className="ml-auto rounded-md bg-indigo-700 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}



export default Editform;