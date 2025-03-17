import React, { useState, useEffect } from "react";
import "../../css/app.css";
import { usePage, router } from "@inertiajs/react";

const Welcome = () => {
    const props = usePage().props || {};
    const { auth = { user: null }, errors = {} } = props;

    console.log("usePage().props:", props);

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            router.visit("/content-moderator");
        }
    }, [auth?.user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post("/login", form, {
            onSuccess: () => {
                setLoading(false);
                router.visit("/content-moderator");
            },
            onError: () => setLoading(false),
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f4f4f9]">
            <div className="bg-white p-8 border border-gray rounded-xl w-[400px]">
                <h2 className="text-2xl font-bold mb-4 text-center text-[#333]">
                    Suitescape Admin Login
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-[#555]">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#ccc] rounded focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />
                        {errors?.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-[#555]">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-[#ccc] rounded focus:outline-none focus:ring-2 focus:ring-[#4a90e2]"
                            required
                        />
                        {errors?.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full text-white p-2 rounded transition ${
                            loading
                                ? "bg-[#94b3e6] cursor-not-allowed"
                                : "bg-[#4a90e2] hover:bg-[#357abd]"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Welcome;
