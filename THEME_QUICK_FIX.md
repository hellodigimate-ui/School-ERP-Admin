# Theme Toggle - Quick Fix Reference

## 🎯 Fastest Way to Fix Your Components

### The Problem
Your theme toggle only changes the background because components use hardcoded colors instead of theme-aware CSS variables.

### The Solution
Replace hardcoded colors with Tailwind theme classes that automatically respond to dark mode.

---

## ⚡ 5-Minute Quick Fixes

### 1. **Replace ALL Hardcoded Colors**

| Find | Replace |
|------|---------|
| `bg-white` | `bg-card` |
| `bg-gray-50` | `bg-secondary` |
| `bg-gray-100` | `bg-background` |
| `bg-slate-900` | `bg-background` |
| `text-gray-900` | `text-foreground` |
| `text-gray-800` | `text-foreground` |
| `text-gray-700` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `text-gray-400` | `text-muted-foreground` |
| `text-white` | `text-foreground` |
| `border-gray-200` | `border-border` |
| `border-gray-300` | `border-border` |
| `shadow-gray-900` | `shadow-md` |

### 2. **For Charts & Dynamic Colors**

```tsx
// Copy this template:
const { theme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return null;

const isDark = theme === "dark";
const colors = {
  background: isDark ? "#1F2937" : "#FFFFFF",
  text: isDark ? "#E5E7EB" : "#1F2937",
  border: isDark ? "#374151" : "#E5E7EB",
  bar: isDark ? "#06B6D4" : "#3B82F6",
};
```

### 3. **For Images**

```tsx
{/* Light mode */}
<img src="/light-image.png" className="dark:hidden" />

{/* Dark mode */}
<img src="/dark-image.png" className="hidden dark:block" />
```

---

## 🔍 Find & Replace Command (VS Code)

Press `Ctrl + H` and use these replacements:

1. Find: `bg-white(?!-|\w)` | Replace: `bg-card` | **Regex: ✓**
2. Find: `bg-gray-\d+` | Replace: `bg-secondary` | **Regex: ✓** (then manual review)
3. Find: `text-gray-\d+` | Replace: `text-foreground` | **Regex: ✓** (then manual review)
4. Find: `border-gray-\d+` | Replace: `border-border` | **Regex: ✓** (then manual review)

---

## 📝 Before & After Examples

### ❌ BEFORE - Hardcoded Colors

```tsx
export function StudentCard() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-gray-900 font-bold">John Doe</h3>
      <p className="text-gray-600">Grade: 10-A</p>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Active</span>
    </div>
  );
}
```

### ✅ AFTER - Theme-Aware

```tsx
export function StudentCard() {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-border">
      <h3 className="text-foreground font-bold">John Doe</h3>
      <p className="text-muted-foreground">Grade: 10-A</p>
      <span className="bg-accent/10 text-accent px-3 py-1 rounded">Active</span>
    </div>
  );
}
```

---

### ❌ BEFORE - Static Chart

```tsx
export function Revenue() {
  return (
    <BarChart data={data}>
      <Bar dataKey="amount" fill="#3B82F6" />
    </BarChart>
  );
}
```

### ✅ AFTER - Theme-Responsive Chart

```tsx
export function Revenue() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const barColor = theme === "dark" ? "#06B6D4" : "#3B82F6";

  return (
    <BarChart data={data}>
      <Bar dataKey="amount" fill={barColor} />
    </BarChart>
  );
}
```

---

## 🎨 Color Mapping Cheat Sheet

### Text Colors
- **Primary text** → `text-foreground`
- **Secondary text** → `text-muted-foreground`
- **Accent text** → `text-accent`
- **Success text** → `text-success`
- **Danger text** → `text-destructive`

### Background Colors
- **Main background** → `bg-background`
- **Cards/containers** → `bg-card`
- **Secondary areas** → `bg-secondary`
- **Highlights** → `bg-accent`
- **Muted areas** → `bg-muted`

### Border Colors
- **Standard borders** → `border-border`
- **Accent borders** → `border-accent`
- **Input borders** → `border-input`

### Sidebar (if used)
- **Sidebar bg** → `bg-sidebar`
- **Sidebar text** → `text-sidebar-foreground`
- **Sidebar hover** → `hover:bg-sidebar-accent`

---

## 🔧 Step-by-Step Component Fix

1. **Open the component file**
2. **Search for colors** using Find: `bg-|text-|border-`
3. **For each color found:**
   - Is it gray? → Use theme color
   - Is it white? → Use `bg-card` or `bg-background`
   - Is it black text? → Use `text-foreground`
   - Is it gray text? → Use `text-muted-foreground`
4. **Add transitions:** `transition-colors duration-300`
5. **Test in both themes** ✓

---

## 🚀 Most Critical Files to Fix

1. **Sidebar components** (`components/layout/*`)
2. **Card/Stats components** (`components/admin/*`)
3. **Table components** (`components/receptionist/*`)
4. **Charts** (any component using recharts/charts)
5. **Forms/Inputs** (all input fields)
6. **Buttons** (all button styles)

---

## ✨ New Helper Classes Available

These are now in your `globals.css` - use them!

```tsx
// Smooth theme transition
<div className="theme-transition">...</div>

// Input with theme support
<input className="input-theme" />

// Button with theme support
<button className="btn-theme">Click me</button>
<button className="btn-theme-secondary">Secondary</button>

// Dark mode aware shadow
<div className="shadow-dark">...</div>
```

---

## ✅ Testing Checklist

After changes, test each component:

- [ ] Click theme toggle
- [ ] Background changes ✓
- [ ] Text changes ✓
- [ ] Colors change ✓
- [ ] Images display correctly ✓
- [ ] Charts update ✓
- [ ] Borders visible in both modes ✓
- [ ] Text readable in dark mode ✓
- [ ] No console errors ✓

---

## 💡 Pro Tips

1. **Use Tailwind IntelliSense** - It'll suggest theme colors
2. **Add `transition-colors`** to everything for smooth changes
3. **Test in both modes** - Don't just assume dark mode works
4. **Check contrast ratios** - Text should be readable in both modes
5. **Use `dark:` prefix** when you need explicit dark mode styles

Example:
```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  {/* Light: white bg, black text */}
  {/* Dark: dark bg, white text */}
</div>
```

---

## 🎉 That's It!

Your theme should now be fully functional. The toggle button will smoothly transition between light and dark modes across:
- ✅ Backgrounds
- ✅ Text colors  
- ✅ Images
- ✅ Borders
- ✅ Charts
- ✅ All UI elements

Happy theming! 🌙☀️
