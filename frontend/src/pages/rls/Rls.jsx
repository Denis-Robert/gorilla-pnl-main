import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rls = ({ rlsCart,setRlsCart,formData
   }) => {



    const [resourceData, setResourceData] = useState([]);
    const [manDays, setManDays] = useState({});
    const [quantities, setQuantities] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [enabledResources, setEnabledResources] = useState({});
    

    console.log("sc"+JSON.stringify(selectedCountry)+"\nq"+JSON.stringify(quantities)+"\ntc"+totalCost+"\nma"+JSON.stringify(manDays))

  const handleSwitchChange = (resourceKey, isEnabled) => {
    setEnabledResources((prev) => ({
      ...prev,
      [resourceKey]: isEnabled,
    }));
  };

  console.log("rls_page: ",rlsCart)

 

  const handleInputChange = (e, resource, month, type) => {
    const value = parseFloat(e.target.value) || 0;
    const key = `${resource.level}-${resource.region}-${month}`;

    if (type === 'manDays') {
      setManDays((prev) => ({ ...prev, [key]: value }));
    } else if (type === 'quantity') {
      setQuantities((prev) => ({ ...prev, [key]: value }));
    }

    calculateTotal();
  };

  const calculateTotal = () => {
    let total = 0;

    resourceData.forEach((res) => {
      for (let month = 1; month <= formData.totalContractPeriod; month++) {
        const key = `${res.level}-${res.region}-${month}`;
        const manDay = manDays[key] || 0;
        const quantity = quantities[key] || 0;
        const cost = res.daily_rate || 0;

        total += manDay * quantity * cost;
      }
    });

    setTotalCost(total);
  };

  const uniqueCountries = [...new Set(resourceData.map((res) => res.region))];

  const filteredResourceData = selectedCountry
    ? resourceData.filter((res) => res.region === selectedCountry)
    : resourceData;

    useEffect(() => {
      console.log("useeeeeeeeeeeee\n"+"sc"+JSON.stringify(selectedCountry)+"\nq"+JSON.stringify(quantities)+"\ntc"+totalCost+"\nma"+JSON.stringify(manDays))      
      const updatedCart = filteredResourceData
        .filter((res) => enabledResources[`${res.level}-${res.region}`])
        .map((res) => {
        const level = res.level;
        const region = res.region;
        const manDayQuantities = Array.from({ length: formData.totalContractPeriod }, (_, i) => ({
          month: i + 1,
          manDays: manDays[`${level}-${region}-${i + 1}`] || 0,
          quantities: quantities[`${level}-${region}-${i + 1}`] || 0,
        }));
        return {
          key: `${level}-${region}`,
          resource: res,
          manDayQuantities,
          totalCost,
        };
      });
      setRlsCart(updatedCart);
}, [selectedCountry, manDays, quantities, totalCost]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/read-rls');
      setResourceData(response.data);
      console.log("resssssssssssssssss"+JSON.stringify(resourceData))
    } catch (error) {
      console.error('Error fetching resource costs', error);
    }
  };
  fetchData();
}, []);
    

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resource Load Schedule</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Country:</label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">All</option>
          {uniqueCountries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300">Level</th>
            <th className="py-2 px-4 border-b border-gray-300">Country</th>
            {Array.from({ length: formData.totalContractPeriod }, (_, i) => (
              <th key={i + 1} className="py-2 px-4 border-b border-gray-300">M{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredResourceData.map((res) => (
            <tr key={`${res.level}-${res.region}`}>
              <td key={`switch-${res.level}-${res.region}`}>
                <input
                  type="checkbox"
                  checked={enabledResources[`${res.level}-${res.region}`]}
                  onChange={(e) => handleSwitchChange(`${res.level}-${res.region}`, e.target.checked)}
                />
              </td>              
              <td className="py-2 px-4 border-b border-gray-300">{res.level}</td>
              <td className="py-2 px-4 border-b border-gray-300">{res.region}</td>
              {Array.from({ length:  formData.totalContractPeriod  }, (_, i) => (
                <td key={i + 1} className="py-2 px-4 border-b border-gray-300">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="Man-days"
                    value={manDays[`${res.level}-${res.region}-${i + 1}`] || ''}
                    onChange={(e) => handleInputChange(e, res, i + 1, 'manDays')}
                  />
                  <input
                    type="number"
                    className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="Quantity"
                    value={quantities[`${res.level}-${res.region}-${i + 1}`] || ''}
                    onChange={(e) => handleInputChange(e, res, i + 1, 'quantity')}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4">
        <h2 className="text-xl font-bold">Total Cost: {totalCost}</h2>
      </div>
    </div>
  );
};

export default Rls;







