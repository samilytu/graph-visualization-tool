import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import GraphInfo from "../components/GraphInfo/GraphInfo";
import GraphCanvas from "../components/GraphCanvas/GraphCanvas";
import Welcome from "../Welcome";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/GraphInfo">
                <GraphInfo/>
            </ComponentPreview>
            <ComponentPreview path="/GraphCanvas">
                <GraphCanvas/>
            </ComponentPreview>
            <ComponentPreview path="/Welcome">
                <Welcome/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews