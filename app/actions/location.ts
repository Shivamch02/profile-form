"use server";

// Mock data - In a real app, this would come from your database
const mockLocationData = {
  countries: [
    { id: "us", name: "United States" },
    { id: "ca", name: "Canada" },
    { id: "uk", name: "United Kingdom" },
    { id: "in", name: "India" },
  ],
  states: {
    us: [
      { id: "ca", name: "California" },
      { id: "ny", name: "New York" },
      { id: "tx", name: "Texas" },
    ],
    ca: [
      { id: "on", name: "Ontario" },
      { id: "bc", name: "British Columbia" },
      { id: "qc", name: "Quebec" },
    ],
    uk: [
      { id: "en", name: "England" },
      { id: "sc", name: "Scotland" },
      { id: "wa", name: "Wales" },
    ],
    in: [
      { id: "mh", name: "Maharashtra" },
      { id: "ka", name: "Karnataka" },
      { id: "dl", name: "Delhi" },
    ],
  },
  cities: {
    ca: [
      { id: "la", name: "Los Angeles" },
      { id: "sf", name: "San Francisco" },
      { id: "sd", name: "San Diego" },
    ],
    ny: [
      { id: "nyc", name: "New York City" },
      { id: "buf", name: "Buffalo" },
      { id: "roc", name: "Rochester" },
    ],
    on: [
      { id: "tor", name: "Toronto" },
      { id: "ott", name: "Ottawa" },
      { id: "ham", name: "Hamilton" },
    ],
    mh: [
      { id: "mum", name: "Mumbai" },
      { id: "pun", name: "Pune" },
      { id: "nag", name: "Nagpur" },
    ],
    ka: [
      { id: "ban", name: "Bangalore" },
      { id: "mys", name: "Mysore" },
      { id: "hub", name: "Hubli" },
    ],
    dl: [
      { id: "del", name: "Delhi" },
      { id: "gur", name: "Gurgaon" },
      { id: "noi", name: "Noida" },
    ],
  },
};

export async function getCountries() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockLocationData.countries;
}

export async function getStates(countryId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return (
    mockLocationData.states[
      countryId as keyof typeof mockLocationData.states
    ] || []
  );
}

export async function getCities(stateId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return (
    mockLocationData.cities[stateId as keyof typeof mockLocationData.cities] ||
    []
  );
}
