interface SidebarProps {
  menuList: string[];
  selected: string;
  onSelect: (menu: string) => void;
}

export default function Sidebar({
  menuList,
  selected,
  onSelect,
}: SidebarProps) {
  return (
    <div className="flex min-h-screen w-56 flex-col items-center justify-center border-r border-gray-200 bg-white shadow-md">
      <div className="flex w-full max-w-[180px] flex-col">
        {menuList.map((menu) => (
          <button
            key={menu}
            onClick={() => onSelect(menu)}
            className={`block w-full rounded-md px-4 py-3 text-left text-sm font-medium transition-all ${
              selected === menu
                ? "bg-green-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {menu}
          </button>
        ))}
      </div>
    </div>
  );
}
