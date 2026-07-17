import ServiceDetailTemplate from './ServiceDetailTemplate';

const BENEFITS = [
  'Surface skimming and debris removal',
  'Brush walls, steps, and waterline',
  'Vacuum pool floor',
  'Empty pump and skimmer baskets',
  'Test and balance water chemistry',
  'Inspect equipment and report issues',
];

export default function PoolCleaningPage() {
  return (
    <ServiceDetailTemplate
      slug="pool-cleaning"
      title="Pool Cleaning Service"
      headline="Professional Pool Cleaning You Can Count On"
      description="Weekly and bi-weekly pool cleaning that keeps your water crystal clear. Our certified technicians handle everything so you can enjoy your pool, not maintain it."
      benefits={BENEFITS}
    />
  );
}
