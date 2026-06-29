type LearningPathConnectorProps = {
  unitCount: number;
  segmentHeight: number;
};

export function LearningPathConnector({ unitCount, segmentHeight }: LearningPathConnectorProps) {
  const height = unitCount * segmentHeight;

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-24"
      style={{ height }}
      viewBox={`0 0 96 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={buildZigzagPath(unitCount, height)}
        fill="none"
        stroke="rgb(186 230 253)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="12 10"
      />
    </svg>
  );
}

function buildZigzagPath(unitCount: number, height: number): string {
  const segmentHeight = height / unitCount;
  const centerX = 48;
  const leftX = 20;
  const rightX = 76;

  let path = `M ${centerX} 0`;

  for (let i = 0; i < unitCount; i++) {
    const y = (i + 0.5) * segmentHeight;
    const x = i % 2 === 0 ? leftX : rightX;
    const nextY = (i + 1) * segmentHeight;

    path += ` Q ${centerX} ${y - segmentHeight * 0.2} ${x} ${y}`;

    if (i < unitCount - 1) {
      const nextX = (i + 1) % 2 === 0 ? leftX : rightX;
      path += ` Q ${centerX} ${y + segmentHeight * 0.5} ${nextX} ${nextY}`;
    }
  }

  return path;
}
