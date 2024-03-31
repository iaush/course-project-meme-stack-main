import { Excalidraw } from "@excalidraw/excalidraw";
import UI from './assets/UI.json';
import { useRef } from 'react';

export default function UIElement() {
    const excalidrawRef = useRef(null);

    return (<>
        <p style={{color: 'gray', fontSize: '10px'}}>
            Reload this page if text / words are not appearing in the element below. <br />
            Wireframe is interactive, ctrl + mousewheel to zoom in and out;
            hold down left mouse button to pan.
        </p>
        <Excalidraw
            ref={excalidrawRef}
            initialData={UI}
            onChange={(elements, state) =>
                console.log(state)
            }
            viewModeEnabled={true}
            zenModeEnabled={true}
            gridModeEnabled={true}
        />
    </>)
}