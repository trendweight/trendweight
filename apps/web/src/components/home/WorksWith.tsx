import { FaCheck } from 'react-icons/fa'

export function WorksWith() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-4">
      {/* Vendor logos */}
      <a href="https://www.withings.com/health-mate" className="w-full md:w-auto order-2 md:pr-6 text-black hover:no-underline">
        <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-1 w-56 h-56 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img src="/withings-app.png" alt="Withings app logo" className="h-35 w-32 object-contain" />
            <div className="flex flex-col items-center leading-none">
              <span className="text-brand-500 font-bold">Works with</span>
              <div className="font-medium text-3xl tracking-wider">WITHINGS</div>
            </div>
          </div>
        </div>
      </a>
      <a href="https://www.fitbit.com/sg/app" className="w-full md:w-auto order-2 md:pr-6 text-black hover:no-underline">
        <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-1 w-56 h-56 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img src="/fitbit-app.png" alt="Fitbit app logo" className="h-35 w-32 object-contain" />
            <div className="flex flex-col items-center leading-none">
              <span className="text-brand-500 font-bold">Works with</span>
              <div className="text-4xl font-normal">fitbit</div>
            </div>
          </div>
        </div>
      </a>
      
      {/* Text content */}
      <div className="order-1 md:order-3 md:pt-6 pb-6 text-xl">
        <div className="font-bold">Enter your daily weight how you like...</div>
        <div>
          <FaCheck className="inline-block text-green-500 mr-1" /> Smart Scales / WiFi Scales
        </div>
        <div>
          <FaCheck className="inline-block text-green-500 mr-1" /> Withings Health Mate App
        </div>
        <div>
          <FaCheck className="inline-block text-green-500 mr-1" /> Fitbit App
        </div>
      </div>
    </div>
  )
}