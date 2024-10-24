import React from "react";

// import { Container } from './styles';

export const Help: React.FC = () => {
  return (
    <div className="grid gap-8 py-4 text-text-header">
      <section className="space-y-3 mt-4">
        <h1 className="font-semibold text-text-header/70">
          What&apos;s a Tabata workout?{" "}
        </h1>
        <p>
          Tabata is a form of high-intensity interval training (HIIT) developed
          by Japanese scientist Dr. Izumi Tabata. The protocol consists of:
          <ul className="list-disc ml-4 my-4">
            <li>20 seconds of intense exercise</li>
            <li>10 seconds of rest</li>
            <li>8 rounds total (4 minutes)</li>
          </ul>
          This specific timing creates a highly effective workout that boosts
          both aerobic and anaerobic fitness levels.
        </p>
      </section>

      <section className="space-y-3">
        <h1 className="font-semibold text-text-header/70">Why Do Tabatas?</h1>
        <p>
          Tabata training offers numerous benefits:
          <ul className="list-disc ml-4 my-4">
            <li>Burns fat and calories efficiently</li>
            <li>Improves endurance and stamina</li>
            <li>Increases metabolic rate for hours after workout</li>
            <li>Requires minimal or no equipment</li>
            <li>Helps build and maintain muscle</li>
            <li>Improves insulin sensitivity</li>
            <li>Time-efficient way to get fit</li>
          </ul>
          This specific timing creates a highly effective workout that boosts
          both aerobic and anaerobic fitness levels.
        </p>
      </section>
    </div>
  );
};
