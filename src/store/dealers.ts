import { useState, useEffect } from "react";

export type Dealer = {
  id: number;
  dealerName: string;
  dealershipName: string;
  address: string;
  contact: string;
  email: string;
  company: string;
  status: string;
  constitution: string;
  gstNo: string;
  establishedYear: string;
  active: boolean;
};

// Initial mock data - will be replaced with API calls
const initialDealers: Dealer[] = [
  {
    id: 1,
    dealerName: "Rajesh Kumar",
    dealershipName: "Kumar Petroleum Services",
    address: "123 Main Road, Dindigul - 624001",
    contact: "9876543210",
    email: "rajesh@example.com",
    company: "IOC",
    status: "Sale",
    constitution: "Proprietor",
    gstNo: "33AAAAA1234A1Z5",
    establishedYear: "2015",
    active: true,
  },
  {
    id: 2,
    dealerName: "Priya Sharma",
    dealershipName: "Sharma Fuel Station",
    address: "456 Market Street, Dindigul - 624002",
    contact: "9876543211",
    email: "priya@example.com",
    company: "BPC",
    status: "Dist",
    constitution: "Partnership",
    gstNo: "33BBBBB5678B1Z5",
    establishedYear: "2018",
    active: true,
  },
  {
    id: 3,
    dealerName: "Mohammed Ali",
    dealershipName: "Ali Petro Center",
    address: "789 Highway Road, Dindigul - 624003",
    contact: "9876543212",
    email: "ali@example.com",
    company: "HPC",
    status: "CRE",
    constitution: "Limited",
    gstNo: "33CCCCC9012C1Z5",
    establishedYear: "2020",
    active: false,
  },
  {
    id: 4,
    dealerName: "Lakshmi Devi",
    dealershipName: "Devi Fuel Solutions",
    address: "321 Temple Road, Dindigul - 624004",
    contact: "9876543213",
    email: "lakshmi@example.com",
    company: "IOC",
    status: "Sale",
    constitution: "Proprietor",
    gstNo: "33DDDDD3456D1Z5",
    establishedYear: "2012",
    active: true,
  },
];

// API functions - currently using mock data, will be replaced with actual API calls
export const dealersAPI = {
  getAll: async (): Promise<Dealer[]> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/dealers').then(res => res.json());
    return Promise.resolve(initialDealers);
  },

  getById: async (id: number): Promise<Dealer | undefined> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/dealers/${id}`).then(res => res.json());
    return Promise.resolve(initialDealers.find((d) => d.id === id));
  },

  create: async (dealer: Omit<Dealer, "id">): Promise<Dealer> => {
    // TODO: Replace with actual API call
    // return await fetch('/api/dealers', { method: 'POST', body: JSON.stringify(dealer) }).then(res => res.json());
    const newDealer = { ...dealer, id: Date.now() };
    return Promise.resolve(newDealer);
  },

  update: async (id: number, dealer: Partial<Dealer>): Promise<Dealer> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/dealers/${id}`, { method: 'PUT', body: JSON.stringify(dealer) }).then(res => res.json());
    const existing = initialDealers.find((d) => d.id === id);
    return Promise.resolve({ ...existing!, ...dealer });
  },

  delete: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    // return await fetch(`/api/dealers/${id}`, { method: 'DELETE' });
    return Promise.resolve();
  },
};

// Custom hook for managing dealers state
export function useDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const data = await dealersAPI.getAll();
      setDealers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch dealers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addDealer = async (dealer: Omit<Dealer, "id">) => {
    try {
      const newDealer = await dealersAPI.create(dealer);
      setDealers((prev) => [...prev, newDealer]);
      return newDealer;
    } catch (err) {
      setError("Failed to add dealer");
      throw err;
    }
  };

  const updateDealer = async (id: number, dealer: Partial<Dealer>) => {
    try {
      const updated = await dealersAPI.update(id, dealer);
      setDealers((prev) => prev.map((d) => (d.id === id ? updated : d)));
      return updated;
    } catch (err) {
      setError("Failed to update dealer");
      throw err;
    }
  };

  const deleteDealer = async (id: number) => {
    try {
      await dealersAPI.delete(id);
      setDealers((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError("Failed to delete dealer");
      throw err;
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  return {
    dealers,
    loading,
    error,
    addDealer,
    updateDealer,
    deleteDealer,
    refetch: fetchDealers,
  };
}
