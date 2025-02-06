const Sidebar = () => {
    return (
      <div className="w-64 bg-white shadow-md min-h-screen p-4">
        <h2 className="text-lg font-bold text-[#333] mb-4">Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="block text-gray-700 hover:text-blue-600">Financial Administration</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block text-gray-700 font-bold">Content Management</a>
            </li>
            <li className="mt-6 text-gray-500">Other</li>
            <li>
              <a href="#" className="block text-gray-700 hover:text-blue-600">Help</a>
            </li>
            <li>
              <a href="#" className="block text-gray-700 hover:text-blue-600">Settings</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default Sidebar;
  