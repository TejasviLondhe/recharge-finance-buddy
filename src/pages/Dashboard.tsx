import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Phone, Bell, Home, User, Settings, ArrowRight } from 'lucide-react';
const Dashboard = () => {
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-emerald-500 w-8 h-8 rounded-full -mr-2"></div>
              <div className="bg-black w-8 h-8 rounded-full z-10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1 className="ml-2 font-semibold">YouPI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">Welcome back, User!</h2>
          <p className="text-gray-500">Your telecom recharge dashboard</p>
        </section>
        
        {/* Balance Card */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-8 shadow-lg">
          <p className="text-white/80 mb-2">Total Balance</p>
          <h3 className="text-3xl font-bold mb-4">₹ 2,500.00</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/80 text-sm">NBFC Wallet</p>
              <p className="font-medium">₹ 150.00</p>
            </div>
            <Button variant="outline" className="border-white hover:bg-white/20 text-green-50">
              Top up
            </Button>
          </div>
        </section>
        
        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-2">
                <Phone className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-700">Recharge</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-700">Pay EMI</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-2">
                <Wallet className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-700">Wallet</span>
            </div>
          </div>
        </section>
        
        {/* Current Plans */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Current Plans</h3>
            <Button variant="ghost" className="text-emerald-600 p-0 h-auto">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm mb-3 border-l-4 border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Jio ₹349 Plan</h4>
                <p className="text-sm text-gray-500">2GB/day | Unlimited calls</p>
                <p className="text-xs text-gray-400 mt-1">Exp: 20 Jun 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">EMI 1/3</p>
                <p className="font-medium">₹310 paid</p>
                <p className="text-xs text-emerald-500">Next: ₹310 on 20 May</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-300">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Airtel ₹199 Plan</h4>
                <p className="text-sm text-gray-500">1GB/day | Unlimited calls</p>
                <p className="text-xs text-gray-400 mt-1">Exp: 5 Jun 2023</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Fully paid</p>
                <p className="font-medium">₹199</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Special Offers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Special Offers</h3>
            <Button variant="ghost" className="text-emerald-600 p-0 h-auto">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 shadow-sm min-w-[270px] text-white">
                <p className="text-white/80 mb-1">Jio Special</p>
                <h4 className="font-bold text-lg mb-2">3 Months @ ₹900</h4>
                <p className="text-sm mb-4">Save ₹147 + get ₹50 in wallet</p>
                <Button className="bg-white text-indigo-600 hover:bg-white/90">
                  View Details
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-sm min-w-[270px] text-white">
                <p className="text-white/80 mb-1">Airtel Offer</p>
                <h4 className="font-bold text-lg mb-2">3 Months @ ₹699</h4>
                <p className="text-sm mb-4">Save ₹98 + get ₹40 in wallet</p>
                <Button className="bg-white text-pink-600 hover:bg-white/90">
                  View Details
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-sm min-w-[270px] text-white">
                <p className="text-white/80 mb-1">Vi Weekend</p>
                <h4 className="font-bold text-lg mb-2">3 Months @ ₹749</h4>
                <p className="text-sm mb-4">Save ₹78 + get ₹45 in wallet</p>
                <Button className="bg-white text-orange-600 hover:bg-white/90">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-gray-200">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center p-2 text-emerald-500">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <Wallet size={20} />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <CreditCard size={20} />
            <span className="text-xs mt-1">Plans</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>;
};
export default Dashboard;