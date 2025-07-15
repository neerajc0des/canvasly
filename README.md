# 🎨 Canvasly

**Canvasly** is a customizable and easy-to-use **React drawing/sketching component** built with TypeScript, styled using **Tailwind CSS**, and powered by **react-sketch-canvas**.

It comes with built-in color pickers, brush controls, eraser, download support, and a responsive UI — perfect for creative tools, annotation features, or sketch pads in web apps.

---

## 🖼️ Canvasly Preview

<img width="1919" height="817" alt="Canvasly preview" src="https://github.com/user-attachments/assets/54329971-619e-4381-bf47-b2bdc5d25901" />

---

## 📋 Prerequisites

To use `canvasly`, ensure the following are installed in your project:

### 🧹 Required Peer Dependencies

```bash
npm install react react-dom react-sketch-canvas react-color lucide-react
```

> These are **peer dependencies** and must be installed manually in your project.

---

### 🎨 Tailwind CSS Setup

Canvasly uses Tailwind CSS for styling. If Tailwind is not yet set up in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add this to your `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Then include Tailwind in your CSS:

```css
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🚀 Features

- ✏️ Freehand sketching and erasing  
- 🌈 Predefined + custom color palettes  
- 📏 Adjustable brush size slider  
- 🎨 Fill canvas background with a color  
- 📂 Download canvas as PNG  
- ♻️ Undo / Redo  
- 💅 ShadCN-styled buttons and sliders  
- 🧠 Type-safe and responsive  

---

## 📆 Installation

```bash
npm install canvasly
```

---

## 🔧 Usage

```tsx
import React, { useRef } from "react";
import Canvasly, { CanvaslyHandle } from "canvasly";

export default function DrawingBoard() {
  const canvasRef = useRef<CanvaslyHandle>(null);

  const exportImage = async () => {
    const img = await canvasRef.current?.exportDrawing();
    console.log("Image URL:", img);
  };

  return (
    <div className="w-full h-full">
      <Canvasly ref={canvasRef} />
    </div>
  );
}
```

---

## 📜 License

MIT © [Neeraj](mailto:n33raj.kr@gmail.com)
