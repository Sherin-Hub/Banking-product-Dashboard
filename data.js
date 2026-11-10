// Mock data. In a real app this would come from an API.
const PRODUCTS = [
  {
    id: 1,
    name: "Premier Savings Account",
    category: "Savings",
    status: "Active",
    metrics: [
      { label: "Interest Rate", value: "4.25% p.a." },
      { label: "Balance", value: "$12,450.00" },
    ],
  },
  {
    id: 2,
    name: "Salary Plus Account",
    category: "Savings",
    status: "Active",
    metrics: [
      { label: "Interest Rate", value: "3.10% p.a." },
      { label: "Balance", value: "$3,280.50" },
    ],
  },
  {
    id: 3,
    name: "Platinum Rewards Card",
    category: "Credit Card",
    status: "Active",
    metrics: [
      { label: "Available Limit", value: "$7,500" },
      { label: "Next Due Date", value: "15 Nov 2026" },
    ],
  },
  {
    id: 4,
    name: "Travel Miles Card",
    category: "Credit Card",
    status: "Eligible",
    metrics: [
      { label: "Pre-approved Limit", value: "$10,000" },
      { label: "Annual Fee", value: "$99" },
    ],
  },
  {
    id: 5,
    name: "Home Loan",
    category: "Loan",
    status: "Active",
    metrics: [
      { label: "Interest Rate", value: "7.40% p.a." },
      { label: "Next EMI Due", value: "05 Dec 2026" },
    ],
  },
  {
    id: 6,
    name: "Personal Loan",
    category: "Loan",
    status: "Pending",
    metrics: [
      { label: "Requested Amount", value: "$15,000" },
      { label: "Interest Rate", value: "10.5% p.a." },
    ],
  },
  {
    id: 7,
    name: "Growth Mutual Fund",
    category: "Wealth",
    status: "Active",
    metrics: [
      { label: "Current Value", value: "$25,900" },
      { label: "1Y Return", value: "+12.8%" },
    ],
  },
  {
    id: 8,
    name: "Fixed Deposit",
    category: "Wealth",
    status: "Eligible",
    metrics: [
      { label: "Interest Rate", value: "6.75% p.a." },
      { label: "Tenure", value: "12 months" },
    ],
  },
];