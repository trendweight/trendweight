import Image from "next/image";

const SampleChart = () => (
  <div className="grid-in-chart relative">
    <Image src="/assets/chart-home.png" layout="responsive" objectFit="contain" height={894} width={1706} />
  </div>
);

export default SampleChart;
