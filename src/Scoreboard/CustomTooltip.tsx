import React from 'react';

export default function CustomTooltipContent({
  payload,
  separator,
  formatter,
  itemStyle,
  itemSorter,
  ignore
}: {
  payload?: any;
  separator?: any;
  formatter?: any;
  itemStyle?: any;
  itemSorter?: any;
  ignore?: string[];
}) {
  if (payload && payload.length) {
    const listStyle = { padding: 0, margin: 0 };

    const finalStyle: React.CSSProperties = {
      margin: 0,
      padding: 10,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      whiteSpace: 'nowrap'
    };

    const items = payload.map((entry: any, i: any) => {
      if (entry.type === 'none') {
        return null;
      }

      if (ignore?.includes(entry.name) ?? false) {
        return null;
      }

      const finalItemStyle = {
        display: 'block',
        paddingTop: 4,
        paddingBottom: 4,
        color: entry.color || '#000',
        ...itemStyle
      };
      let { name, value } = entry;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <li
          className="recharts-tooltip-item"
          key={`tooltip-item-${i}`}
          style={finalItemStyle}
        >
          {typeof name === 'number' || typeof name === 'string' ? (
            <span className="recharts-tooltip-item-name">{name}</span>
          ) : null}
          {typeof name === 'number' || typeof name === 'string' ? (
            <span className="recharts-tooltip-item-separator">{separator}</span>
          ) : null}
          <span className="recharts-tooltip-item-value">{value}</span>
          <span className="recharts-tooltip-item-unit">{entry.unit || ''}</span>
        </li>
      );
    });

    return (
      <React.Fragment>
        <div style={finalStyle}>
          <ul className="recharts-tooltip-item-list" style={listStyle}>
            {items}
          </ul>
        </div>
      </React.Fragment>
    );
  }
  return null;
}
