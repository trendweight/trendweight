import clsx from "clsx";
import React, { FC } from "react";

export interface PlaceholderGridProps {
  rows?: number;
  rowHeight?: number;
  rowMargin?: number;
  columns?: number;
  active?: boolean;
}

const PlaceholderGrid: FC<PlaceholderGridProps> = ({
  rows = 5,
  columns = 5,
  rowHeight = 10,
  rowMargin = 20,
  active,
  ...rest
}) => {
  const colItems = [];
  const firstRowItemWidth = Math.random() * 30 + 30;
  const itemWidth = firstRowItemWidth / 2;
  for (let i = 0; i < columns; i++) {
    const rowItems = [];
    for (let j = 0; j < rows; j++) {
      let widthPercent = Math.random() * 50 + 10; // when first column
      if (i > 0) {
        // when other columns
        widthPercent = j > 0 ? itemWidth : firstRowItemWidth;
      }
      rowItems.push(
        <p
          key={j}
          style={{
            width: `${widthPercent}%`,
            height: rowHeight,
            marginTop: j > 0 ? rowMargin : undefined,
          }}
        />
      );
    }
    colItems.push(
      <div key={i} className="placeholder-grid-col">
        {rowItems}
      </div>
    );
  }

  return (
    <div {...rest} className={clsx("placeholder placeholder-grid", { "placeholder-active": active })}>
      {colItems}
    </div>
  );
};

PlaceholderGrid.displayName = "PlaceholderGrid";

export default React.memo(PlaceholderGrid);
