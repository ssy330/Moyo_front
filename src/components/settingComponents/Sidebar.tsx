// src/components/Sidebar.tsx
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
    <div className="border-border bg-background flex min-h-screen w-56 flex-col items-center justify-center border-r shadow-md">
      <div className="flex w-full max-w-[180px] flex-col">
        {menuList.map((menu) => (
          <button
            key={menu}
            onClick={() => onSelect(menu)}
            className={`block w-full rounded-md px-4 py-3 text-left text-sm font-medium transition-all ${
              selected === menu
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {menu}
          </button>
        ))}
      </div>
    </div>
  );
}
