interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const Header = ({ title, description, icon: Icon }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 md:p-6 rounded-2xl 
                    bg-gradient-to-r from-white/80 to-white/40 dark:from-zinc-900 dark:to-zinc-800 
                    backdrop-blur-xl border border-white/20 shadow-lg">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        
        {/* Icon Box */}
        <div className="relative w-14 h-14 rounded-2xl 
                        bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                        flex items-center justify-center shadow-md">
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl blur-md opacity-40 
                          bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />

          <Icon className="relative w-7 h-7 text-white" />
        </div>

        {/* Text */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold 
                         bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                         bg-clip-text text-transparent">
            {title}
          </h1>

          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Optional Right Badge / Status */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full 
                      bg-primary/10 text-primary text-xs font-medium shadow-sm">
        ✨ Dashboard
      </div>
    </div>
  );
};

export default Header;