import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, DollarSign, MapPin } from 'lucide-react';

interface Quote {
  id: string;
  clientName: string;
  propertySize: number;
  cleaningType: string;
  serviceFrequency: string;
  totalCost: number;
  createdAt: string;
  address: string;
}

const fetchQuotes = async (): Promise<Quote[]> => {
  // This is a mock API call. In a real application, you would fetch from your backend.
  // const response = await axios.get('/api/quotes');
  // return response.data;
  
  // For demonstration, we'll return mock data
  return [
    {
      id: '1',
      clientName: 'Acme Corp',
      propertySize: 5000,
      cleaningType: 'deep',
      serviceFrequency: 'weekly',
      totalCost: 1500,
      createdAt: '2024-03-15T10:30:00Z',
      address: '123 Main St, Queens, NY'
    },
    {
      id: '2',
      clientName: 'TechStart Inc',
      propertySize: 3000,
      cleaningType: 'basic',
      serviceFrequency: 'monthly',
      totalCost: 800,
      createdAt: '2024-03-10T14:45:00Z',
      address: '456 Tech Ave, Nassau, NY'
    },
    {
      id: '3',
      clientName: 'Green Leaf Cafe',
      propertySize: 1500,
      cleaningType: 'specialized',
      serviceFrequency: 'daily',
      totalCost: 2000,
      createdAt: '2024-03-20T09:15:00Z',
      address: '789 Park Rd, Queens, NY'
    },
  ];
};

const QuoteHistory: React.FC = () => {
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">An error occurred: {(error as Error).message}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Quote History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  );
};

const QuoteCard: React.FC<{ quote: Quote }> = ({ quote }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-blue-400">{quote.clientName}</h3>
        <div className="flex items-center mb-2 text-gray-300">
          <MapPin size={16} className="mr-2" />
          <span>{quote.address}</span>
        </div>
        <div className="flex items-center mb-2 text-gray-300">
          <Calendar size={16} className="mr-2" />
          <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center mb-4 text-green-400">
          <DollarSign size={16} className="mr-2" />
          <span className="text-lg font-bold">${quote.totalCost.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-700 rounded p-2">
            <span className="block text-gray-400">Size</span>
            <span className="font-semibold text-white">{quote.propertySize} sq ft</span>
          </div>
          <div className="bg-gray-700 rounded p-2">
            <span className="block text-gray-400">Type</span>
            <span className="font-semibold text-white capitalize">{quote.cleaningType}</span>
          </div>
          <div className="bg-gray-700 rounded p-2">
            <span className="block text-gray-400">Frequency</span>
            <span className="font-semibold text-white capitalize">{quote.serviceFrequency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteHistory;