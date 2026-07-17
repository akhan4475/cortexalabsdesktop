import ServiceDetailTemplate from './ServiceDetailTemplate';

const BENEFITS = [
  'Full water chemistry analysis and balancing',
  'Filter cleaning and backwash service',
  'Pump and motor inspection',
  'Heater and automation check',
  'Salt system testing (if applicable)',
  'Written service report after every visit',
];

export default function PoolMaintenancePage() {
  return (
    <ServiceDetailTemplate
      slug="pool-maintenance"
      title="Pool Maintenance Plans"
      headline="Pool Maintenance Plans That Protect Your Investment"
      description="Ongoing pool maintenance keeps your equipment running longer and your water safe year-round. Choose a plan that fits your pool and your schedule."
      benefits={BENEFITS}
    />
  );
}
