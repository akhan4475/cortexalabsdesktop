import ServiceDetailTemplate from './ServiceDetailTemplate';

const BENEFITS = [
  'Remove and store or install winter cover',
  'Reconnect and prime equipment',
  'Full water chemistry startup balance',
  'Inspect all equipment before first use',
  'Clear pool of winter debris',
  'Document equipment condition on every visit',
];

export default function PoolOpeningClosingPage() {
  return (
    <ServiceDetailTemplate
      slug="pool-opening-closing"
      title="Pool Opening & Closing"
      headline="Pool Opening and Closing Done Right"
      description="Start the season with a clean, balanced pool and close it properly to protect your equipment through the off-season. We handle every step."
      benefits={BENEFITS}
    />
  );
}
