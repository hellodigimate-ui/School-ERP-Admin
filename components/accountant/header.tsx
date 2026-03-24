interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const Header = ({ title, description, icon: Icon }: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Header;