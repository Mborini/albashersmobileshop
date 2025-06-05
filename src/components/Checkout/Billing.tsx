import React from "react";

const Billing = () => {
  return (
    <div>
      <div className="bg-white shadow-1 rounded-[10px] p-4 mb-6">
        <h2 className="font-medium text-dark text-xl sm:text-2xl ">
          Billing details
        </h2>
      </div>
      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              First Name <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="John"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              Last Name <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Doe"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className=" w-full mb-5">
            <label htmlFor="email" className="block mb-2.5">
              Email Address <span className="text-red">*</span>
            </label>

            <input
              type="email"
              name="email"
              id="email"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className=" w-full mb-5">
            <label htmlFor="phone" className="block mb-2.5">
              Phone <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="phone"
              id="phone"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className=" w-full mb-5">
            <label htmlFor="country" className="block mb-2.5">
              Country <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="country"
              id="country"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="w-full mb-5">
            <label htmlFor="city" className="block mb-2.5">
              City <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="city"
              id="city"
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            Street Address
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            placeholder="House number and street name"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <div>
            <label htmlFor="notes" className="block mb-2.5">
              Notes (optional)
            </label>

            <textarea
              name="note"
              id="note"
              rows={5}
              placeholder="Notes about your order, e.g. speacial notes for delivery."
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
