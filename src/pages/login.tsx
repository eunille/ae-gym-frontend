import { useAuth } from "@/context/auth-context";
import dataFetch from "@/service/data-service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, success, id } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await login(username, password);

    if (isSuccess) {
      console.log("Login successful!");
      setTimeout(() => navigate("/membership"), 1000);
    } else {
      console.log("Invalid credentials!");
    }
  };

  return (
    <div className="font-[sans-serif] bg-gradient-to-r from-black via-gray-800 to-gray-900 text-gray-800">
      <div className="min-h-screen flex   flex-col items-center justify-center lg:p-6 p-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <img
              src="../src/assets/img/logo/gym-logo.png"
              alt="Gym Logo"
              className="w-52 mb-4 inline-block"
            />
            <h2 className="text-4xl font-extrabold lg:leading-[50px] text-yellow-400">
              Gym Management System AE Home Gym
            </h2>
            <p className="text-lg mt-4 text-white leading-relaxed">
              Welcome to your ultimate gym management companion! This innovative
              system is designed to empower gym administrators like you,
              streamlining the management of memberships, tracking product
              receipts, and generating insightful analytical reports—all in one
              place.
            </p>
            <p className="text-sm mt-6 text-white leading-relaxed">
              Experience the ease of managing your gym with our intuitive
              interface, ensuring that you can focus on what truly
              matters—creating a thriving fitness community.
            </p>
          </div>

          <form className="bg-white rounded-xl px-8 py-10 shadow-lg space-y-6 max-w-md md:ml-auto w-full">
            <h3 className="text-3xl font-extrabold mb-8 text-gray-800">
              Sign in
            </h3>

            <div className="relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                name="username"
                type="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 border-2 border-gray-300 focus:border-yellow-400 transition-colors"
                placeholder="Enter your email"
                id="email"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-gray-100 border-2 border-gray-300 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800 focus:border-yellow-400 transition-colors"
                placeholder="Enter your password"
                id="password"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none border-2 border-black transition-colors"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
