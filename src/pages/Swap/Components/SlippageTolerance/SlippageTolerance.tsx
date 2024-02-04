import {SettingOutlined} from "@ant-design/icons";
import {Popover, Radio} from "antd";


export function SlippageTolerance ({handleSlippage, slippage}: any) {
    const settingsContent = (
        <>
            <div>Slippage Tolerance</div>
            <div>
                <Radio.Group onChange={handleSlippage} value={slippage}>
                    <Radio.Button value={0.5}>0.5%</Radio.Button>
                    <Radio.Button value={1}>1%</Radio.Button>
                    <Radio.Button value={1.5}>1.5%</Radio.Button>
                    <Radio.Button value={2}>2%</Radio.Button>
                </Radio.Group>
            </div>
        </>
    )
    return (
        <Popover
        title='Settings'
        trigger='click'
        placement='bottomRight'
        content={settingsContent}
    >
        <SettingOutlined className='cog'/>
    </Popover>
    )
}
