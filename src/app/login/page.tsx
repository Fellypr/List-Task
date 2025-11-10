

export default function Login() {
    return (
        <main className="flex flex-col items-center justify-center h-screen bg-[url(/backGround/geometric-shapes-background/5390929.jpg)] bg-cover">
            <div className="flex flex-col items-center justify-center h-90 gap-15 w-90  shadow-[0px_0px_2px_4px_rgba(0,0,0,0.35)] rounded-sm bg-stone-100 ">
                <h1 className="text-3xl font-medium">Login</h1>
                <form className="flex flex-col gap-4 items-center justify-center">
                    <input type="email" placeholder="Email" className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"/>
                    <input type="password" placeholder="Password" className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"/>
                    <button  className="w-50 bg-blue-600 text-white p-2 rounded-sm relative top-5 hover:bg-blue-700 hover:cursor-pointer">Login</button>
                </form>
                <p>Don't have an account? <a href="/register" className="text-blue-600">Register</a></p>
            </div>
        </main>
    );
}