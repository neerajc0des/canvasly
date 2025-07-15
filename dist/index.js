"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ReactSketchCanvas, } from 'react-sketch-canvas';
import { Slider } from "./ui/slider";
import { Button } from './ui/button';
import { CirclePicker, SketchPicker } from 'react-color';
import { Circle, CircleDot, Download, Eraser, PaintRoller, Plus, Redo, Trash, Undo } from 'lucide-react';
const defaultPredefinedColors = [
    '#FF7F7F', // Vivid Rose (A deeper, more saturated pink-red)
    '#FFBF00', // Amber (Bright, warm orange-yellow)
    '#80D880', // Medium Spring Green (Lively but still soft green)
    '#fafafa', // Soft White (for highlights or 'erasing' to background)
    '#303030', // Deep Charcoal (Strong, dark neutral for outlines)
    '#F1C27D', // face
    '#64B5F6', // Cerulean Blue (Clear, vibrant blue)
    '#FFB7C5',
    '#B39DDB', // Amethyst (Rich, muted purple)
    '#795548', // Brown (Earth tone)
    'rgba(255, 0, 0, 0.5)', //tranaslucent red
    'rgba(0, 128, 0, 0.5)', // translucent green
    'rgba(0, 0, 0, 0.5)', // translucent black
    'rgba(0, 0, 255, 0.5)', // translucent blue
    'rgba(255, 165, 0, 0.5)', // translucent orange
    'rgba(128, 0, 128, 0.5)', // translucent purple
];
const Canvasly = forwardRef(({ canvasWidth = '100%', canvasHeight = 'calc(100vh - 77px)', initialCanvasColor = '#ffffff', customColorPalette }, ref) => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const sliderBoxRef = useRef(null);
    const customColorPickerRef = useRef(null);
    const customColorIconRef = useRef(null);
    const brushIconRef = useRef(null);
    const [brushColor, setBrushColor] = useState('#1e1e1e');
    const [showBrushSlider, setShowBrushSlider] = useState(false);
    const [brushRadius, setBrushRadius] = useState(5);
    const [isErasing, setIsErasing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [tempPickerColor, setTempPickerColor] = useState(null);
    const [fillColor, setFillColor] = useState(initialCanvasColor);
    const [canvasActualWidth, setCanvasActualWidth] = useState(0);
    const [canvasActualHeight, setCanvasActualHeight] = useState(0);
    const [userColorPalette, setUserColorPalette] = useState([]);
    const colorPalette = customColorPalette && customColorPalette.length > 0
        ? [...userColorPalette, ...defaultPredefinedColors, ...customColorPalette]
        : [...userColorPalette, ...defaultPredefinedColors];
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sliderBoxRef.current &&
                !sliderBoxRef.current.contains(event.target) &&
                brushIconRef.current &&
                !brushIconRef.current.contains(event.target)) {
                setShowBrushSlider(false);
            }
            if (showColorPicker &&
                customColorPickerRef.current &&
                !customColorPickerRef.current.contains(event.target) &&
                customColorIconRef.current &&
                !customColorIconRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        };
        if (showBrushSlider || showColorPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showBrushSlider, showColorPicker]);
    const updateCanvasDimensions = () => {
        if (canvasContainerRef.current) {
            const { clientWidth, clientHeight } = canvasContainerRef.current;
            setCanvasActualWidth(clientWidth);
            setCanvasActualHeight(clientHeight);
        }
    };
    useEffect(() => {
        updateCanvasDimensions();
        window.addEventListener('resize', updateCanvasDimensions);
        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
        };
    }, []);
    const handleBrushIconClick = (e) => {
        e.stopPropagation();
        setShowBrushSlider(prev => !prev);
    };
    const handleChangeColor = (color) => {
        if (canvasRef.current) {
            canvasRef.current.eraseMode(false);
        }
        setIsErasing(false);
        setShowColorPicker(false);
        let newBrushColor;
        if (color.rgb.a !== undefined && color.rgb.a < 1) {
            newBrushColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        }
        else {
            newBrushColor = color.hex;
        }
        setBrushColor(newBrushColor);
    };
    const handleSketchPickerChange = (color) => {
        setTempPickerColor(color);
    };
    const handleConfirmCustomColor = () => {
        if (tempPickerColor) {
            if (canvasRef.current) {
                canvasRef.current.eraseMode(false);
            }
            setIsErasing(false);
            let newBrushColor;
            if (tempPickerColor.rgb.a !== undefined && tempPickerColor.rgb.a < 1) {
                newBrushColor = `rgba(${tempPickerColor.rgb.r}, ${tempPickerColor.rgb.g}, ${tempPickerColor.rgb.b}, ${tempPickerColor.rgb.a})`;
            }
            else {
                newBrushColor = tempPickerColor.hex;
            }
            setUserColorPalette(prev => {
                return [newBrushColor, ...prev];
            });
            setBrushColor(newBrushColor);
            setShowColorPicker(false);
            setTempPickerColor(null);
        }
    };
    const handleUndo = () => {
        if (canvasRef.current) {
            canvasRef.current.undo();
        }
    };
    const handleRedo = () => {
        var _a;
        (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.redo();
    };
    const handleClear = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };
    const handleEraserClick = () => {
        const newIsErasing = !isErasing;
        setIsErasing(newIsErasing);
        if (canvasRef.current) {
            canvasRef.current.eraseMode(newIsErasing);
        }
        if (showBrushSlider) {
            setShowBrushSlider(false);
        }
    };
    const handleFillColor = () => {
        setFillColor(brushColor);
    };
    // to export image thru parent component 
    useImperativeHandle(ref, () => ({
        exportDrawing: async () => {
            if (canvasRef.current) {
                const imageData = await canvasRef.current.exportImage('png');
                return imageData;
            }
            throw new Error("Canvas not ready");
        }
    }));
    // to export image internally
    const handleExport = async () => {
        if (!canvasRef.current)
            return;
        try {
            const img = await canvasRef.current.exportImage('png');
            return img;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    };
    const handleExportIconClick = async () => {
        const exportImgUrl = await handleExport();
        if (exportImgUrl) {
            const link = document.createElement('a');
            link.href = exportImgUrl;
            link.download = `canvasly-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(exportImgUrl);
        }
        else {
            console.warn("No image URL to download.");
        }
    };
    return (React.createElement("div", { className: 'w-full' },
        React.createElement("div", { className: 'controls w-full flex flex-wrap items-center justify-between bg-accent py-1 relative border-b border-b-zinc-300' },
            React.createElement("div", { className: "colorPickerContainer relative w-full sm:w-[60%] overflow-x-auto py-2 pl-10 whitespace-nowrap no-scrollbar" },
                React.createElement("div", { onClick: () => setShowColorPicker((prev) => !prev), ref: customColorIconRef, title: "New color", className: "w-[20px] h-[20px] text-primary/60  shadow-sm flex items-center justify-center font-semibold hue-wheel-gradient border-zinc-400 border absolute top-[8px] left-[10px] cursor-pointer hover:scale-110" },
                    React.createElement(Plus, { size: 15, strokeWidth: 3 })),
                React.createElement(CirclePicker, { colors: colorPalette, color: brushColor, onChangeComplete: handleChangeColor, width: '600px', circleSize: 20, circleSpacing: 10 })),
            showColorPicker &&
                React.createElement("div", { className: "sketchPickerWrapper absolute top-[55px] left-[10px] z-50", ref: customColorPickerRef },
                    React.createElement(SketchPicker, { color: tempPickerColor ? tempPickerColor.rgb : brushColor, onChange: handleSketchPickerChange, width: '250px' }),
                    React.createElement("div", { className: "confirmColorPickContainer w-full flex items-center justify-end gap-5 px-2 mt-1 py-2 bg-white border border-zinc-300 shadow-md rounded-sm" },
                        React.createElement(Button, { type: 'button', onClick: () => { setShowColorPicker(false); setTempPickerColor(null); }, variant: 'secondary', className: '!text-xs cursor-pointer border-zinc-300 border h-[30px]' }, "Cancel"),
                        React.createElement(Button, { type: 'button', variant: 'default', className: '!text-xs cursor-pointer h-[30px]', onClick: handleConfirmCustomColor }, "Ok"))),
            React.createElement("div", { className: "flex gap-0 items-center tools w-full sm:w-[30%] justify-between sm:justify-end" },
                React.createElement(Button, { title: 'Undo', onClick: handleUndo, className: " hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  hover:text-accent-foreground cursor-pointer", variant: "ghost", type: "button" },
                    React.createElement(Undo, null)),
                React.createElement(Button, { title: 'Redo', onClick: handleRedo, className: " hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  hover:text-primary/60 cursor-pointer", variant: "ghost", type: "button" },
                    React.createElement(Redo, null)),
                React.createElement(Button, { onClick: handleClear, className: " hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px] hover:text-primary/60 cursor-pointer", variant: "ghost", type: "button", title: 'Clear' },
                    React.createElement(Trash, null)),
                React.createElement(Button, { title: 'Eraser', className: ` hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px] ${isErasing ? "bg-zinc-200" : "bg-primary/0"} hover:bg-zinc-200/90 transition-all duration-200 hover:text-primary/60 cursor-pointer`, variant: "ghost", type: "button", onClick: handleEraserClick },
                    React.createElement(Eraser, null)),
                React.createElement(Button, { onClick: handleFillColor, className: "hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px] hover:text-primary/60 cursor-pointer", variant: "ghost", type: "button", title: 'Fill' },
                    React.createElement(PaintRoller, null)),
                React.createElement(Button, { title: 'Brush size', className: ` hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  bg-primary/0 hover:text-primary/60 cursor-pointer`, variant: "ghost", type: "button", ref: brushIconRef, onClick: handleBrushIconClick },
                    React.createElement(CircleDot, null)),
                React.createElement(Button, { title: 'download', className: `mr-1 hover:bg-zinc-200/90 rounded-[5px] p-1 w-[40px] h-[38px]  bg-primary/0 hover:text-primary/60 cursor-pointer`, variant: "ghost", type: "button", onClick: handleExportIconClick },
                    React.createElement(Download, null))),
            React.createElement("div", { ref: sliderBoxRef, className: `sliderContainer ${showBrushSlider ? "block" : "hidden"} z-50 absolute top-[50px] border-zinc-300 border rounded-sm right-[5px] w-[150px] h-[120px] p-5 bg-white flex flex-col justify-between items-center` },
                React.createElement(Slider, { value: [brushRadius], onValueChange: ([val]) => setBrushRadius(val), className: 'cursor-pointer', defaultValue: [5], min: 2, max: 70, step: 1 }),
                React.createElement(Circle, { size: brushRadius, color: brushColor }),
                React.createElement("span", { className: "text-gray-700 text-xs font-medium" },
                    brushRadius,
                    "px"))),
        React.createElement("div", { ref: canvasContainerRef, className: "canvasContainer overflow-hidden w-full h-[calc(100vh-77px)] relative" },
            React.createElement(ReactSketchCanvas, { ref: canvasRef, strokeColor: brushColor, strokeWidth: brushRadius, eraserWidth: brushRadius, canvasColor: fillColor, width: canvasWidth, height: canvasHeight, style: { border: '0px transparent' } })),
        React.createElement("div", { className: "footerStrip select-none absolute bottom-0 w-full bg-accent border-t border-t-zinc-300 px-1 md:px-5 py-1 text-xs flex flex-wrap items-center justify-between sm:justify-start sm:gap-10" },
            React.createElement("div", { className: "text-primary " },
                React.createElement("span", { className: "font-semibold" }, "Eraser: "),
                " ",
                isErasing ? "On" : "Off"),
            React.createElement("div", { className: "text-primary flex items-center gap-2" },
                React.createElement("span", { className: "font-semibold" }, "Brush color: "),
                React.createElement("div", { onClick: () => setShowColorPicker((prev) => !prev), ref: customColorIconRef, title: "brush", className: `w-[18px] h-[18px] rounded-sm shadow-sm  border-zinc-400 border cursor-pointer hover:scale-105`, style: { backgroundColor: brushColor } }),
                brushColor),
            React.createElement("div", { className: "text-primary " },
                React.createElement("span", { className: "font-semibold" }, "Brush Size: "),
                " ",
                brushRadius),
            React.createElement("div", { className: "text-primary hidden sm:block" },
                React.createElement("span", { className: "font-semibold" }, "Canvas dimensions: "),
                " ",
                canvasActualWidth,
                " x ",
                canvasActualHeight)),
        React.createElement("style", null, `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }

                .canvasly-circle-picker-wrapper .circle-picker > span > div {
                    border: 1px solid #ababab;
                    border-radius: 100%;
                    box-sizing: border-box;
                }
                .hue-wheel-gradient {
                    background: conic-gradient(
                        from 0deg,
                        rgb(255, 90, 90),
                        rgb(255, 198, 92),
                        rgb(255, 255, 90),
                        rgb(93, 255, 93),
                        rgb(88, 255, 255),
                        rgb(91, 91, 255),
                        rgb(255, 98, 255),
                        rgb(255, 90, 90)
                    );
                    border-radius: 50%;
                }
            `)));
});
Canvasly.displayName = 'Canvasly';
export default Canvasly;
