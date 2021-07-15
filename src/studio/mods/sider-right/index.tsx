import * as React from 'react';
import { Layout, Collapse,  } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Elements } from '../elements';
import { Attribute } from '../attribute';
import { Description } from '../description';
import eventHub from './../../util/event-hub';

const { useState, useCallback } = React;
const { Panel } = Collapse;
const { Sider } = Layout;
type TypeProps = {
  width: number,
  height: number,
}

const panelHeaderHeight = 30;
const siderHeaderHeight = 24;

export function SiderRight(props: TypeProps) {
  const { width, height } = props;
  const panelContentMaxHeight = ((height - siderHeaderHeight) / 2) - 30;
  const [elemMaxHeight, setElemMaxHeight] = useState(panelContentMaxHeight);
  const [descMaxHeight, setDescMaxHeight] = useState(panelContentMaxHeight);

  const onCollapseChange = useCallback((key: string|string[]) => {
    let keys: string[] = [];
    if (typeof key === 'string') {
      keys.push(key);
    } else if (Array.isArray(key)) {
      keys = key;
    }
    if (keys.length > 0) {
      const maxHeight = ((height - siderHeaderHeight) - panelHeaderHeight * 2) / keys.length;
      if (keys.includes('elements')) {
        setElemMaxHeight(maxHeight);
      }
      if (keys.includes('description')) {
        setDescMaxHeight(maxHeight);
      }
    }
    
  }, [elemMaxHeight, descMaxHeight]);

  return (
    <Sider width={width} className="idraw-studio-siderright">
      <div className="idraw-studio-siderright-header" style={{height: siderHeaderHeight}}>
        <DoubleRightOutlined
          className="studio-siderright-header-icon  siderright-close-btn"
          onClick={() => {
            eventHub.trigger('studioCloseRightSider', true);
          }}
        />
      </div>
      <Collapse
        bordered={false} 
        defaultActiveKey={['elements', 'description']}
        expandIconPosition={'right'}
        className="idraw-studio-siderright-collapse"
        onChange={onCollapseChange}
      >
        <Panel header="Elements" key="elements" className="idraw-studio-siderright-panel">
          <Elements maxHeight={elemMaxHeight}/>
        </Panel>
        <Panel header="Description" key="description" className="idraw-studio-siderright-panel" >
          <div style={{height: descMaxHeight, overflow: 'scroll'}}>
            <Attribute />
            <Description />
          </div>
        </Panel>
      </Collapse>
    </Sider>
  )
}
 


export function SiderRightBtn(props: { style?: React.HTMLAttributes<HTMLDivElement>['style'] }) {
  return (
    <div
      style={props.style}
      className="idraw-studio-siderright-open-btn"
      onClick={() => {
        eventHub.trigger('studioCloseRightSider', false);
      }}
    >
      <DoubleLeftOutlined
        className="siderright-open-btn-icon"
      />
    </div>
  )
}