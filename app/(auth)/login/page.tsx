import Image from "next/image";

export default function page() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-gray-800 text-white p-10 flex flex-col justify-between">
        <h1 className="text-2xl font-semibold">Polosys</h1>
        <div className="mb-6 flex items-center justify-center min-h-fit">
          {/* Vector Shape */}
          <Image
            src="/images/vector-image-no-bg.png"
            alt="Polosys"
            width={300}
            height={200}
            priority
          />
        </div>
        <p className="mt-6 text-4xl leading-relaxed pb-8">
          Join now and manage <br />
          your customers from <br />
          anywhere
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Sign up</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Get start with an account on Polosys CRM
          </p>

          {/* Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="User"
              className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <div className="text-right">
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forgot password
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gray-700 text-white hover:bg-gray-900 transition"
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
