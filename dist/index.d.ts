import React from 'react';
export interface CanvaslyHandle {
    exportDrawing?: () => Promise<string>;
}
interface CanvaslyProps {
    canvasWidth?: string;
    canvasHeight?: string;
    initialCanvasColor?: string;
    customColorPalette?: string[];
}
declare const Canvasly: React.ForwardRefExoticComponent<CanvaslyProps & React.RefAttributes<CanvaslyHandle>>;
export default Canvasly;
