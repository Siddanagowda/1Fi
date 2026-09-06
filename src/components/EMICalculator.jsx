import React, { useState, useEffect } from 'react';
import './EMICalculator.css';

const EMICalculator = ({ productPrice, emiPlans = [], onSelectPlan, isLoading = false }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const calculateDetails = (plan) => {
    if (!plan) return null;
    const totalAmount = productPrice;
    const totalCost = plan.emi_amount * plan.tenure_months + (plan.processing_fee || 0);
    const totalInterest = totalCost - totalAmount;

    return {
      totalAmount,
      monthlyEMI: plan.emi_amount,
      tenure: plan.tenure_months,
      processingFee: plan.processing_fee || 0,
      totalCost,
      totalInterest,
    };
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    onSelectPlan(plan);
  };

  return (
    <div className="emi-calculator">
      <h2 className="emi-title">EMI Options</h2>

      {isLoading ? (
        <div className="loading">Loading EMI plans...</div>
      ) : emiPlans && emiPlans.length > 0 ? (
        <div className="emi-plans-container">
          {emiPlans.map((plan) => {
            const details = calculateDetails(plan);
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <div
                key={plan.id}
                className={`emi-plan ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectPlan(plan)}
              >
                <div className="plan-header">
                  <div className="plan-tenure">
                    <span className="tenure-value">{plan.tenure_months}</span>
                    <span className="tenure-label">Months</span>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="emi-plan"
                      value={plan.id}
                      checked={isSelected}
                      onChange={() => handleSelectPlan(plan)}
                    />
                  </div>
                </div>

                <div className="plan-details">
                  <div className="detail-row">
                    <span className="label">Monthly EMI:</span>
                    <span className="value">₹{details.monthlyEMI.toLocaleString()}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Processing Fee:</span>
                    <span className="value">₹{details.processingFee.toLocaleString()}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Interest Rate:</span>
                    <span className="value">{plan.interest_rate}% p.a.</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Total Interest:</span>
                    <span className="value">₹{details.totalInterest.toLocaleString()}</span>
                  </div>

                  <div className="detail-row total">
                    <span className="label">Total Cost:</span>
                    <span className="value">₹{details.totalCost.toLocaleString()}</span>
                  </div>
                </div>

                {plan.plan_name && (
                  <div className="plan-name">{plan.plan_name}</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-emi">
          <p>No EMI plans available for this product</p>
          <p className="sub-text">Pay full amount upfront</p>
        </div>
      )}

      {selectedPlan && (
        <div className="emi-summary">
          <h3>Selected Plan Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span>Product Price:</span>
              <span>₹{productPrice.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Monthly EMI:</span>
              <span className="highlight">₹{selectedPlan.emi_amount.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Duration:</span>
              <span>{selectedPlan.tenure_months} months</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
