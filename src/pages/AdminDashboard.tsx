import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const pricingSchema = z.object({
  basicRate: z.number().min(0, 'Rate must be non-negative'),
  deepRate: z.number().min(0, 'Rate must be non-negative'),
  specializedRate: z.number().min(0, 'Rate must be non-negative'),
  dailyDiscount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
  weeklyDiscount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
  monthlyDiscount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
});

type PricingInputs = z.infer<typeof pricingSchema>;

const AdminDashboard: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PricingInputs>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      basicRate: 0.1,
      deepRate: 0.15,
      specializedRate: 0.2,
      dailyDiscount: 10,
      weeklyDiscount: 5,
      monthlyDiscount: 2,
    },
  });

  const onSubmit: SubmitHandler<PricingInputs> = (data) => {
    console.log(data);
    // Here you would typically send the updated pricing data to your backend API
    setMessage('Pricing updated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pricing Rates (per sq ft)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="basicRate" className="block mb-1">Basic Cleaning</label>
              <input
                {...register('basicRate', { valueAsNumber: true })}
                id="basicRate"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.basicRate && <p className="text-red-500 text-sm">{errors.basicRate.message}</p>}
            </div>
            <div>
              <label htmlFor="deepRate" className="block mb-1">Deep Cleaning</label>
              <input
                {...register('deepRate', { valueAsNumber: true })}
                id="deepRate"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.deepRate && <p className="text-red-500 text-sm">{errors.deepRate.message}</p>}
            </div>
            <div>
              <label htmlFor="specializedRate" className="block mb-1">Specialized Cleaning</label>
              <input
                {...register('specializedRate', { valueAsNumber: true })}
                id="specializedRate"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.specializedRate && <p className="text-red-500 text-sm">{errors.specializedRate.message}</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Frequency Discounts (%)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="dailyDiscount" className="block mb-1">Daily</label>
              <input
                {...register('dailyDiscount', { valueAsNumber: true })}
                id="dailyDiscount"
                type="number"
                step="1"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.dailyDiscount && <p className="text-red-500 text-sm">{errors.dailyDiscount.message}</p>}
            </div>
            <div>
              <label htmlFor="weeklyDiscount" className="block mb-1">Weekly</label>
              <input
                {...register('weeklyDiscount', { valueAsNumber: true })}
                id="weeklyDiscount"
                type="number"
                step="1"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.weeklyDiscount && <p className="text-red-500 text-sm">{errors.weeklyDiscount.message}</p>}
            </div>
            <div>
              <label htmlFor="monthlyDiscount" className="block mb-1">Monthly</label>
              <input
                {...register('monthlyDiscount', { valueAsNumber: true })}
                id="monthlyDiscount"
                type="number"
                step="1"
                className="w-full px-3 py-2 border rounded"
              />
              {errors.monthlyDiscount && <p className="text-red-500 text-sm">{errors.monthlyDiscount.message}</p>}
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          Update Pricing
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;