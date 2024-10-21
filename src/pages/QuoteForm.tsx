import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const quoteSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.enum(['Queens', 'Nassau']),
  propertySize: z.number().min(1, 'Property size must be greater than 0'),
  cleaningType: z.enum(['basic', 'deep', 'specialized']),
  serviceFrequency: z.enum(['daily', 'weekly', 'monthly', 'one-time']),
  additionalServices: z.array(z.enum(['windows', 'carpet', 'disinfection'])).optional(),
});

type QuoteFormInputs = z.infer<typeof quoteSchema>;

interface QuoteResult {
  totalCost: number;
  breakdown: {
    baseCost: number;
    laborCost: number;
    suppliesCost: number;
    specializedCost: number;
    overheadCost: number;
    travelCost: number;
  };
}

const QuoteForm: React.FC = () => {
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormInputs>({
    resolver: zodResolver(quoteSchema),
  });

  const calculateQuote = (data: QuoteFormInputs): QuoteResult => {
    const baseCost = data.propertySize * 0.1;
    const laborCost = data.propertySize * 0.05;
    const suppliesCost = data.propertySize * 0.02;
    const specializedCost = data.cleaningType === 'specialized' ? data.propertySize * 0.03 : 0;
    const overheadCost = (baseCost + laborCost + suppliesCost + specializedCost) * 0.15;
    const travelCost = data.city === 'Queens' ? 50 : 30;

    const totalCost = baseCost + laborCost + suppliesCost + specializedCost + overheadCost + travelCost;

    return {
      totalCost,
      breakdown: {
        baseCost,
        laborCost,
        suppliesCost,
        specializedCost,
        overheadCost,
        travelCost,
      },
    };
  };

  const sendEmail = async (to: string, subject: string, text: string) => {
    try {
      const response = await axios.post('/.netlify/functions/send-email', { to, subject, text });
      console.log('Email sent successfully', response.data);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  };

  const sendAdminEmail = async (data: QuoteFormInputs, quote: QuoteResult) => {
    const subject = `New Cleaning Quote Request - ${data.clientName}`;
    const text = `
      New quote request details:
      
      Client Information:
      -------------------
      Client Name: ${data.clientName}
      Email: ${data.email}
      Address: ${data.address}
      City: ${data.city}
      
      Quote Details:
      --------------
      Property Size: ${data.propertySize} sq ft
      Cleaning Type: ${data.cleaningType}
      Service Frequency: ${data.serviceFrequency}
      Additional Services: ${data.additionalServices ? data.additionalServices.join(', ') : 'None'}

      Quote Result:
      -------------
      Total Cost: $${quote.totalCost.toFixed(2)}
      
      Breakdown:
        Base Cost: $${quote.breakdown.baseCost.toFixed(2)}
        Labor Cost: $${quote.breakdown.laborCost.toFixed(2)}
        Supplies Cost: $${quote.breakdown.suppliesCost.toFixed(2)}
        Specialized Cost: $${quote.breakdown.specializedCost.toFixed(2)}
        Overhead Cost: $${quote.breakdown.overheadCost.toFixed(2)}
        Travel Cost: $${quote.breakdown.travelCost.toFixed(2)}

      Please review this quote and follow up with the client as needed.
    `;

    await sendEmail('admin@cleanquote.com', subject, text);
  };

  const sendCustomerEmail = async (data: QuoteFormInputs, quote: QuoteResult) => {
    const subject = 'Your CleanQuote Cleaning Service Quote';
    const text = `
      Dear ${data.clientName},

      Thank you for requesting a quote from CleanQuote. We're pleased to provide you with the following summary:

      Quote Summary:
      --------------
      Total Cost: $${quote.totalCost.toFixed(2)}
      Property Size: ${data.propertySize} sq ft
      Cleaning Type: ${data.cleaningType}
      Service Frequency: ${data.serviceFrequency}

      We'd love the opportunity to discuss this quote with you in more detail and answer any questions you may have. Would you like to schedule a quick phone call to finalize your quote?

      To set up an appointment, please click the link below or reply to this email with your preferred date and time:

      [Schedule Appointment Link]

      If you have any immediate questions, please don't hesitate to reach out to us at info@cleanquote.com or call us at (555) 123-4567.

      We look forward to the possibility of serving you and keeping your space spotless!

      Best regards,
      The CleanQuote Team
    `;

    await sendEmail(data.email, subject, text);
  };

  const onSubmit: SubmitHandler<QuoteFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const quote = calculateQuote(data);
      setQuoteResult(quote);

      await Promise.all([
        sendAdminEmail(data, quote),
        sendCustomerEmail(data, quote)
      ]);

      console.log('Emails sent successfully');
    } catch (error) {
      console.error('Error processing quote:', error);
      setError('An error occurred while processing your quote. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Get a Cleaning Quote</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block mb-1 text-blue-300">Client Name</label>
          <input
            {...register('clientName')}
            id="clientName"
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-blue-300">Email</label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block mb-1 text-blue-300">Address</label>
          <input
            {...register('address')}
            id="address"
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block mb-1 text-blue-300">City</label>
          <select
            {...register('city')}
            id="city"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          >
            <option value="Queens">Queens</option>
            <option value="Nassau">Nassau</option>
          </select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="propertySize" className="block mb-1 text-blue-300">Property Size (sq ft)</label>
          <input
            {...register('propertySize', { valueAsNumber: true })}
            id="propertySize"
            type="number"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.propertySize && <p className="text-red-500 text-sm">{errors.propertySize.message}</p>}
        </div>

        <div>
          <label htmlFor="cleaningType" className="block mb-1 text-blue-300">Cleaning Type</label>
          <select
            {...register('cleaningType')}
            id="cleaningType"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          >
            <option value="basic">Basic</option>
            <option value="deep">Deep</option>
            <option value="specialized">Specialized</option>
          </select>
          {errors.cleaningType && <p className="text-red-500 text-sm">{errors.cleaningType.message}</p>}
        </div>

        <div>
          <label htmlFor="serviceFrequency" className="block mb-1 text-blue-300">Service Frequency</label>
          <select
            {...register('serviceFrequency')}
            id="serviceFrequency"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="one-time">One-time</option>
          </select>
          {errors.serviceFrequency && <p className="text-red-500 text-sm">{errors.serviceFrequency.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-blue-300">Additional Services</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                value="windows"
                {...register('additionalServices')}
                className="mr-2"
              />
              <span className="text-white">Window Cleaning</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="carpet"
                {...register('additionalServices')}
                className="mr-2"
              />
              <span className="text-white">Carpet Cleaning</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                value="disinfection"
                {...register('additionalServices')}
                className="mr-2"
              />
              <span className="text-white">Disinfection Service</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Generate Quote'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {quoteResult && (
        <div className="mt-8 p-4 bg-gray-700 rounded text-white">
          <h3 className="text-xl font-bold mb-2 text-blue-400">Quote Result</h3>
          <p className="text-lg">Total Cost: ${quoteResult.totalCost.toFixed(2)}</p>
          <h4 className="font-bold mt-4 mb-2 text-blue-300">Breakdown:</h4>
          <ul className="space-y-1">
            <li>Base Cost: ${quoteResult.breakdown.baseCost.toFixed(2)}</li>
            <li>Labor Cost: ${quoteResult.breakdown.laborCost.toFixed(2)}</li>
            <li>Supplies Cost: ${quoteResult.breakdown.suppliesCost.toFixed(2)}</li>
            <li>Specialized Cost: ${quoteResult.breakdown.specializedCost.toFixed(2)}</li>
            <li>Overhead Cost: ${quoteResult.breakdown.overheadCost.toFixed(2)}</li>
            <li>Travel Cost: ${quoteResult.breakdown.travelCost.toFixed(2)}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuoteForm;