import React, {ReactNode} from "react";
import { ThreeCircles } from 'react-loader-spinner'
import './Loader.css'

export interface ILoaderProps {
    isShow: boolean;
    children: ReactNode
}

export const Loader = ({isShow, children}: ILoaderProps) => {
    return (<div className={'loaderContainer'}>
        {isShow && <div className={'loader'}><ThreeCircles
            height="80"
            width="80"
            // radius="9"
            color="#4acb9b"
            ariaLabel="loading"
        /></div>}
        {children}
    </div>);
}
