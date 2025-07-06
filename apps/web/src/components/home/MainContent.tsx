import { Container } from "../Container";
import { Blurb } from "./Blurb";
import { InfoButtons } from "./InfoButtons";
import { SampleChart } from "./SampleChart";
import { WorksWith } from "./WorksWith";

export function MainContent() {
  return (
    <Container className="py-6 md:py-10 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-10">
        {/* Grid areas match legacy app layout */}
        <div className="order-1 md:order-1">
          <Blurb />
        </div>
        <div className="order-3 md:order-2">
          <SampleChart />
        </div>
        <div className="order-2 md:order-3 md:col-span-2">
          <InfoButtons />
        </div>
        <div className="order-4 md:col-span-2">
          <WorksWith />
        </div>
      </div>
    </Container>
  );
}
