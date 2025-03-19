import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import Image from 'next/image';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const FastingPlanSelector = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    weekly: {
      id: 'weekly',
      title: '1-WEEK PLAN',
      price: 14.99,
      perDay: 2.14,
      selected: selectedPlan === 'weekly',
    },
    monthly: {
      id: 'monthly',
      title: '1-MONTH PLAN',
      price: 39.99,
      perDay: 1.34,
      selected: selectedPlan === 'monthly',
    },
    quarterly: {
      id: 'quarterly',
      title: '3-MONTH PLAN',
      price: 69.99,
      perDay: 0.76,
      selected: selectedPlan === 'quarterly',
      popular: true,
    }
  };

  const handler = async () => {
    try {
      const stripe = await asyncStripe;
      const selectedAmount = plans[selectedPlan].price;
      
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        body: JSON.stringify({
          amount: selectedAmount,
        }),
        headers: { "Content-Type": "application/json" },
      });
      
      const { sessionId } = await res.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      console.log(error);
      if (error) {
        router.push("/error");
      }
    } catch (err) {
      console.log(err);
      router.push("/error");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your personal</h1>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Intermittent Fasting</h1>
        <h1 className="text-4xl font-bold text-gray-800">plan is ready!</h1>
      </div>

      <div className="space-y-4 mb-6">
        {Object.values(plans).map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-md p-4 flex justify-between items-center cursor-pointer ${
              plan.selected ? 'border-teal-600 border-2' : 'border-gray-300'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border ${
                plan.selected ? 'border-teal-600' : 'border-gray-400'
              } flex items-center justify-center mr-3`}>
                {plan.selected && <div className="w-4 h-4 bg-teal-600 rounded-full"></div>}
              </div>
              <div>
                <div className="font-medium text-gray-800">{plan.title}</div>
                <div className="text-gray-500">{plan.price.toFixed(2)} EUR</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">{plan.perDay.toFixed(2)} <span className="text-sm">EUR</span></div>
              <div className="text-gray-500 text-sm">per day</div>
              {plan.popular && (
                <div className="bg-teal-600 text-white text-xs py-1 px-2 rounded-md mt-1 font-medium">
                  MOST POPULAR
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-md mb-6 flex items-center">
        <div className="text-teal-600 mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div>
          <div className="font-medium text-gray-800">"The best plan to achieve your goals comfortably and without restrictions"</div>
          <div className="text-gray-600">Ievgeniia Dobrynina, Head of Nutrition at Unimeal</div>
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>

      <button
        onClick={handler}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 rounded-md transition duration-300 mb-3"
      >
        Get my plan
      </button>

      <div className="text-center text-gray-600 text-sm mb-4">
        30-day money back guarantee
      </div>

      <div className="text-xs text-gray-400 text-center">
        By continuing, you agree to pay {plans[selectedPlan].price.toFixed(2)} EUR excluding VAT for your plan and agree that if you don't cancel at least 24 hours prior to the end of the one-month introductory offer.
      </div>
    </div>
  );
};

export default FastingPlanSelector;