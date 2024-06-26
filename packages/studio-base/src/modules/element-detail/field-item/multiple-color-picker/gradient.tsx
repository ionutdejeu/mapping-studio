import React, { useMemo, useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import type { GradientStop, LinearGradientColor, RadialGradientColor } from 'idraw';
import { colorToLinearGradientCSS } from 'idraw';
import IconDelete from '../../../../icons/delete';
import { generateClassName } from '../../../../css';

import { modName } from './config';
import type { ColorValue, ColorModeType, GradientColor } from './types';

export type GradientPickerProps = {
  value?: ColorValue;
  mode: ColorModeType;
  onChange?: (value: string | LinearGradientColor | RadialGradientColor) => void;
  onSelectStop?: (value: GradientStop | null) => void;
  // disabled?: boolean;
  currentPickedColor: string;
  internalColor: string | null;
  internalLinearGradient: LinearGradientColor | null;
  internalRadialGradient: RadialGradientColor | null;
};

const pointSize = 16;

const getStopOffset = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const parentRect = e.currentTarget.parentElement?.getBoundingClientRect() as DOMRect;
  const rect = e.currentTarget.getBoundingClientRect() as DOMRect;
  const left = e.clientX - parentRect.x - pointSize / 2;
  let offset = parseFloat((left / rect.width)?.toFixed(2));
  offset = Math.min(Math.max(offset, 0), 1);
  return offset;
};

export function GradientPicker(props: GradientPickerProps) {
  const { mode, value, internalColor, internalLinearGradient, internalRadialGradient, currentPickedColor, onChange, onSelectStop } = props;
  const [css, setCSS] = useState(colorToLinearGradientCSS(value));
  const [activeStop, setActiveStop] = useState<GradientStop | null>(null);
  const isPointMoving = useRef<boolean>(false);

  const gradientRootClassName = generateClassName(modName, 'gradient-root');
  const gradientDeleteClassName = generateClassName(modName, 'gradient-delete');
  const gradientClassName = generateClassName(modName, 'gradient');
  const gradientBarClassName = generateClassName(modName, 'gradient-bar');
  const gradientStopClassName = generateClassName(modName, 'gradient-point');
  const gradientStopActiveClassName = generateClassName(modName, 'gradient-point-active');

  useEffect(() => {
    const newCSS = colorToLinearGradientCSS(value);
    setCSS(newCSS);
    if (['linear-gradient', 'radial-gradient'].includes((value as GradientColor)?.type)) {
      if (!activeStop) {
        setActiveStop((value as GradientColor)?.stops?.[0]);
      }
    }
  }, [value]);

  useEffect(() => {
    if (activeStop) {
      onSelectStop?.({ ...activeStop });
    } else {
      onSelectStop?.(activeStop);
    }
  }, [activeStop]);

  const onMouseDownGradient = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    isPointMoving.current = true;
    const offset = getStopOffset(e);
    let gradient: null | LinearGradientColor | RadialGradientColor = null;
    if (mode === 'linear-gradient') {
      gradient = internalLinearGradient;
    } else if (mode === 'radial-gradient') {
      gradient = internalRadialGradient;
    }
    if (gradient) {
      const stops = [...gradient.stops];
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const nextStop = stops[i + 1];
        const data = { offset, color: currentPickedColor };
        if (stop.offset === offset) {
          break;
        }
        if (offset < stop.offset) {
          stops.unshift(data);
          setActiveStop(data);
          break;
        } else if (stop.offset < offset && offset < nextStop?.offset) {
          stops.splice(i + 1, 0, data);
          setActiveStop(data);
          break;
        } else if (offset > stop.offset && !nextStop) {
          stops.push(data);
          setActiveStop(data);
          break;
        }
        if (!nextStop) {
          break;
        }
      }

      const newGradient = { ...gradient, ...{ stops } };
      onChange?.(newGradient);
    }
  };

  const onMouseMoveGradient = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // e.stopPropagation();

    if (isPointMoving.current === true && activeStop) {
      const offset = getStopOffset(e);

      let gradient: null | LinearGradientColor | RadialGradientColor = null;
      if (mode === 'linear-gradient') {
        gradient = internalLinearGradient;
      } else if (mode === 'radial-gradient') {
        gradient = internalRadialGradient;
      }
      if (gradient) {
        const stops = [...gradient.stops];
        for (let i = 0; i < stops.length; i++) {
          const stop = stops[i];
          if (stop.offset === activeStop.offset) {
            stop.offset = offset;
            setActiveStop({ ...stop });
            break;
          }
        }
        const newStops = stops.sort((a, b) => {
          return a.offset - b.offset;
        });
        const newGradient = { ...gradient, ...{ stops: newStops } };
        onChange?.(newGradient);
      }
    }
  };

  const onMouseUpGradient = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    isPointMoving.current = false;
  };

  const onMouseDownStop = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, stop: GradientStop) => {
    e.stopPropagation();
    setActiveStop(stop);
    isPointMoving.current = true;
  };

  const deleteStop = () => {
    let gradient = null;
    if (mode === 'linear-gradient') {
      gradient = internalLinearGradient;
    } else if (mode === 'radial-gradient') {
      gradient = internalRadialGradient;
    }
    let index = -1;

    if (gradient && activeStop) {
      const stops = [...gradient.stops];
      for (let i = 0; i < stops.length; i++) {
        if (stops[i].offset === activeStop.offset) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        stops.splice(index, 1);
        const newGradient = { ...gradient, ...{ stops } };
        onChange?.(newGradient);
      }
    }
  };

  const onMouseUpStop = () => {
    // e.stopPropagation();
    isPointMoving.current = false;
  };

  return useMemo(() => {
    return (
      <>
        {(mode === 'linear-gradient' || mode === 'radial-gradient') && (
          <div className={gradientRootClassName}>
            <div
              className={gradientClassName}
              data-css={css}
              style={{
                background: css
              }}
            >
              <div
                className={gradientBarClassName}
                onMouseDown={onMouseDownGradient}
                onMouseUp={onMouseUpGradient}
                onMouseMove={onMouseMoveGradient}
                onMouseLeave={onMouseUpGradient}
              >
                {((mode === 'linear-gradient' ? internalLinearGradient : internalRadialGradient) as LinearGradientColor | RadialGradientColor)?.stops?.map?.(
                  (stop, i) => {
                    return (
                      <span
                        key={i}
                        className={classnames({
                          [gradientStopClassName]: true,
                          [gradientStopActiveClassName]: activeStop?.offset === stop.offset
                        })}
                        style={{ left: `calc(${stop.offset * 100}% - ${pointSize / 2}px)`, background: stop.color }}
                        onMouseDown={(e) => {
                          onMouseDownStop(e, stop);
                        }}
                        onMouseUp={onMouseUpStop}
                      ></span>
                    );
                  }
                )}
              </div>
            </div>
            <div
              className={gradientDeleteClassName}
              onClick={(e) => {
                e.stopPropagation();
                deleteStop();
              }}
            >
              <IconDelete />
            </div>
          </div>
        )}
      </>
    );
  }, [mode, css, currentPickedColor, internalColor, internalLinearGradient, internalRadialGradient, activeStop]);
}
