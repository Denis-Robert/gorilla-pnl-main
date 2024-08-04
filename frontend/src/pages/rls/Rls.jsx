import React from "react";
import PropTypes from "prop-types";

const Rls = ({
  resourceData,
  totalMonths,
  selectedCountry,
  enabledResources,
  manDays,
  quantities,
  totalCost,
  onCountryChange,
  onSwitchChange,
  onInputChange
}) => {
  console.log("Rls received props:", {
    resourceData, 
    totalMonths, 
    selectedCountry, 
    enabledResources, 
    manDays, 
    quantities, 
    totalCost
  });

  const uniqueCountries = [...new Set(resourceData.map(res => res.region))];

  const filteredResourceData = selectedCountry
    ? resourceData.filter(res => res.region === selectedCountry)
    : resourceData;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resource Load Schedule</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Country:</label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedCountry}
          onChange={e => onCountryChange(e.target.value)}
        >
          <option value="">All</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">Enable</th>
              <th className="py-2 px-4 border-b border-gray-300">Level</th>
              <th className="py-2 px-4 border-b border-gray-300">Country</th>
              <th className="py-2 px-4 border-b border-gray-300">Monthly Cost</th>
              {Array.from({ length: totalMonths }, (_, i) => (
                <th key={i} className="py-2 px-4 border-b border-gray-300 min-w-[100px]">M{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredResourceData.map(res => (
              <tr key={`${res.level}-${res.region}`}>
                <td className="py-2 px-4 border-b border-gray-300">
                  <input
                    type="checkbox"
                    checked={enabledResources[`${res.level}-${res.region}`] || false}
                    onChange={e => onSwitchChange(`${res.level}-${res.region}`, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-300">{res.level}</td>
                <td className="py-2 px-4 border-b border-gray-300">{res.region}</td>
                <td className="py-2 px-4 border-b border-gray-300">{res.cost}</td>
                {Array.from({ length: totalMonths }, (_, i) => (
                  <td key={i} className="py-2 px-4 border-b border-gray-300">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="Man-days"
                      value={manDays[`${res.level}-${res.region}-${i + 1}`] || ''}
                      onChange={e => onInputChange(e, res, i + 1, 'manDays')}
                    />
                    <input
                      type="number"
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="Quantity"
                      value={quantities[`${res.level}-${res.region}-${i + 1}`] || ''}
                      onChange={e => onInputChange(e, res, i + 1, 'quantity')}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Total Cost: {totalCost.toFixed(2)}</h2>
      </div>
    </div>
  );
};

Rls.propTypes = {
  resourceData: PropTypes.array.isRequired,
  totalMonths: PropTypes.number.isRequired,
  selectedCountry: PropTypes.string.isRequired,
  enabledResources: PropTypes.object.isRequired,
  manDays: PropTypes.object.isRequired,
  quantities: PropTypes.object.isRequired,
  totalCost: PropTypes.number.isRequired,
  onCountryChange: PropTypes.func.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default Rls;