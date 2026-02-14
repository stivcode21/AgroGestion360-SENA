import { Pie, PieChart, Sector } from "recharts";

// #region Sample data
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
// #endregion

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function ChartPie({ isAnimationActive = true }) {
  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "200px",
        maxHeight: "50vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        data={data}
        dataKey="value"
        labelLine={false}
        label={renderCustomizedLabel}
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
    </PieChart>
  );
}
