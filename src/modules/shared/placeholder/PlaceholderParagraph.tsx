import clsx from "clsx";
import React, { FC, useMemo } from "react";

export interface PlaceholderParagraphProps {
  rows?: number;
  rowHeight?: number;
  rowMargin?: number;
  graph?: boolean | "circle" | "square" | "image";
  active?: boolean;
}

const PlaceholderParagraph: FC<PlaceholderParagraphProps> = ({ rows = 2, rowHeight = 10, rowMargin = 20, graph, active, ...rest }) => {
  const graphShape = graph === true ? "square" : graph;

  const rowElements = useMemo(() => {
    const rowArr = [];

    for (let i = 0; i < rows; i++) {
      const styles = {
        width: `${Math.random() * 75 + 25}%`,
        height: rowHeight,
        marginTop: i > 0 ? rowMargin : Number(rowMargin) / 2,
      };
      rowArr.push(<p key={i} style={styles} />);
    }
    return rowArr;
  }, [rowHeight, rowMargin, rows]);

  return (
    <div {...rest} className={clsx("placeholder placeholder-paragraph", { "placeholder-active": active })}>
      {graphShape && (
        <div className={`placeholder-paragraph-graph placeholder-paragraph-graph-${graphShape}`}>
          <span className="placeholder-paragraph-graph-inner" />
        </div>
      )}
      <div className="placeholder-paragraph-rows">{rowElements}</div>
    </div>
  );
};

PlaceholderParagraph.displayName = "PlaceholderParagraph";

export default React.memo(PlaceholderParagraph);
