// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { TrendingUpIcon, DollarSignIcon } from 'lucide-react';
// import { Card } from './ui/Card';
// import { Input } from './ui/Input';
// export function ROISimulator() {
//   const [currentRent, setCurrentRent] = useState(25000);
//   const [increase, setIncrease] = useState(5);
//   const newRent = currentRent * (1 + increase / 100);
//   const monthlyIncrease = newRent - currentRent;
//   const yearlyIncrease = monthlyIncrease * 12;
//   return <Card className="p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//           <TrendingUpIcon className="w-6 h-6 text-green-600" />
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-primary">ROI Simulator</h3>
//           <p className="text-sm text-gray-500">
//             Predict your rental income changes
//           </p>
//         </div>
//       </div>

//       <div className="space-y-4 mb-6">
//         <Input label="Current Monthly Rent (रू)" type="number" value={currentRent} onChange={e => setCurrentRent(Number(e.target.value))} />

//         <div>
//           <label className="block text-sm font-medium text-primary mb-2">
//             Rent Increase (%)
//           </label>
//           <div className="flex items-center gap-4">
//             <input type="range" min="0" max="20" step="1" value={increase} onChange={e => setIncrease(Number(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-button-primary" />
//             <span className="text-lg font-bold text-primary w-16 text-right">
//               {increase}%
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <motion.div initial={{
//         opacity: 0,
//         scale: 0.9
//       }} animate={{
//         opacity: 1,
//         scale: 1
//       }} className="bg-blue-50 rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">New Monthly Rent</p>
//           <p className="text-2xl font-bold text-blue-600">
//             रू {newRent.toLocaleString()}
//           </p>
//         </motion.div>

//         <motion.div initial={{
//         opacity: 0,
//         scale: 0.9
//       }} animate={{
//         opacity: 1,
//         scale: 1
//       }} transition={{
//         delay: 0.1
//       }} className="bg-green-50 rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">Monthly Increase</p>
//           <p className="text-2xl font-bold text-green-600">
//             +रू {monthlyIncrease.toLocaleString()}
//           </p>
//         </motion.div>

//         <motion.div initial={{
//         opacity: 0,
//         scale: 0.9
//       }} animate={{
//         opacity: 1,
//         scale: 1
//       }} transition={{
//         delay: 0.2
//       }} className="bg-purple-50 rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">Yearly Increase</p>
//           <p className="text-2xl font-bold text-purple-600">
//             +रू {yearlyIncrease.toLocaleString()}
//           </p>
//         </motion.div>
//       </div>

//       <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
//         <p className="text-sm font-medium text-gray-700 mb-2">💡 Insight</p>
//         <p className="text-sm text-gray-600">
//           Raising rent by {increase}% adds{' '}
//           <strong>रू {yearlyIncrease.toLocaleString()}</strong> to your annual
//           income. Market analysis suggests this is{' '}
//           {increase <= 10 ? 'within' : 'above'} the typical range for your area.
//         </p>
//       </div>
//     </Card>;
// }