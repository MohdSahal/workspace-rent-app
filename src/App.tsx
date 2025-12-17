import { useState, useEffect } from 'react';
import './App.css';

// Utility functions--
const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function App() {
  // State
  const [chairs, setChairs] = useState<string>('');
  const [rentPerChair, setRentPerChair] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');

  // Results State
  const [results, setResults] = useState<{
    daysInMonth: number;
    remainingDays: number;
    dailyRent: number;
    baseRent: number;
    gstAmount: number;
    totalRent: number;
  } | null>(null);

  // Calculation Effect
  useEffect(() => {
    if (!chairs || !rentPerChair || !joiningDate) {
      setResults(null);
      return;
    }

    const numChairs = parseInt(chairs);
    const monthlyRent = parseFloat(rentPerChair);
    const date = new Date(joiningDate);

    // Basic Validation
    if (isNaN(numChairs) || numChairs <= 0 || isNaN(monthlyRent) || monthlyRent <= 0 || isNaN(date.getTime())) {
      setResults(null);
      return;
    }

    const totalDaysInMonth = getDaysInMonth(date);
    const dayOfMonth = date.getDate();

    // Calculate remaining days (Inclusive of joining date)
    // Example: Joining 15th of 30-day month. Days = 30 - 15 + 1 = 16 days.
    const remainingDays = totalDaysInMonth - dayOfMonth + 1;

    // Daily rent per chair
    const dailyRentPerChair = monthlyRent / totalDaysInMonth;

    // Total Base Rent (No GST)
    // Formula: Chairs * (MonthlyRent / TotalDays) * RemainingDays
    const calculatedBaseRent = numChairs * dailyRentPerChair * remainingDays;

    // GST Calculation (18%)
    const gst = calculatedBaseRent * 0.18;

    // Total
    const total = calculatedBaseRent + gst;

    setResults({
      daysInMonth: totalDaysInMonth,
      remainingDays: remainingDays,
      dailyRent: dailyRentPerChair,
      baseRent: calculatedBaseRent,
      gstAmount: gst,
      totalRent: total
    });

  }, [chairs, rentPerChair, joiningDate]);

  return (
    <div className="app-container">
      <div className="calculator-card">
        <header className="header">
          <h1>Rent Calculator</h1>
          <p>Pro-rata rent calculation made simple</p>
        </header>

        <div className="input-group">
          <label htmlFor="chairs">Number of Chairs</label>
          <input
            type="number"
            id="chairs"
            value={chairs}
            onChange={(e) => setChairs(e.target.value)}
            placeholder="e.g. 5"
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="rent">Monthly Rent per Chair (₹)</label>
          <input
            type="number"
            id="rent"
            value={rentPerChair}
            onChange={(e) => setRentPerChair(e.target.value)}
            placeholder="e.g. 5000"
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="date">Joining Date</label>
          <input
            type="date"
            id="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
          />
        </div>

        {results && (
          <div className="result-section">
            <div className="result-row">
              <span>Days in Month</span>
              <strong>{results.daysInMonth}</strong>
            </div>
            <div className="result-row">
              <span>Billable Days</span>
              <strong>{results.remainingDays}</strong>
            </div>
            <div className="divider"></div>
            <div className="result-row">
              <span>Base Rent</span>
              <strong>{formatCurrency(results.baseRent)}</strong>
            </div>
            <div className="result-row">
              <span>GST (18%)</span>
              <strong>{formatCurrency(results.gstAmount)}</strong>
            </div>
            <div className="total-row">
              <span>Total Payable</span>
              <span>{formatCurrency(results.totalRent)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
