import React from 'react';
import { type TooltipProps } from 'recharts';
import {
  type NameType,
  type ValueType
} from 'recharts/types/component/DefaultTooltipContent';

export default function CustomTooltipContent({
  payload,
  separator,
  itemStyle,
  ignore
}: TooltipProps<ValueType, NameType> & { ignore?: string[] }) {
  if (payload?.length) {
    const listStyle = { padding: 0, margin: 0 };

    const finalStyle: React.CSSProperties = {
      margin: 0,
      padding: 10,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      whiteSpace: 'nowrap'
    };

    const items = payload.map((entry) => {
      if (entry.type === 'none') {
        return null;
      }

      if (ignore?.includes(entry.name as string) ?? false) {
        return null;
      }

      const finalItemStyle = {
        display: 'block',
        paddingTop: 4,
        paddingBottom: 4,
        color: entry.color ?? '#000',
        ...itemStyle
      };
      const { name, value } = entry;

      return (
        <li
          className="recharts-tooltip-item"
          key={`tooltip-item-${entry.name}`}
          style={finalItemStyle}
        >
          {typeof name === 'number' || typeof name === 'string' ? (
            <span className="recharts-tooltip-item-name">{name}</span>
          ) : null}
          {typeof name === 'number' || typeof name === 'string' ? (
            <span className="recharts-tooltip-item-separator">{separator}</span>
          ) : null}
          <span className="recharts-tooltip-item-value">{value}</span>
          <span className="recharts-tooltip-item-unit">{entry.unit ?? ''}</span>
        </li>
      );
    });

    return (
      <>
        <div style={finalStyle}>
          <ul className="recharts-tooltip-item-list" style={listStyle}>
            {items}
          </ul>
        </div>
      </>
    );
  }
  return null;
}
