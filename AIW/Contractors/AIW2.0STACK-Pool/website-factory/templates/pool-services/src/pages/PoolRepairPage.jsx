import ServiceDetailTemplate from './ServiceDetailTemplate';

const BENEFITS = [
  'Pump and motor replacement',
  'Filter and cartridge service',
  'Pool heater repair and installation',
  'Leak detection and patching',
  'Automation and control system repair',
  'All work backed by a service warranty',
];

export default function PoolRepairPage() {
  return (
    <ServiceDetailTemplate
      slug="pool-repair"
      title="Pool Repair Service"
      headline="Fast Pool Repairs by Certified Technicians"
      description="Pool not working right? We diagnose and fix pump, filter, heater, and leak issues quickly. Most repairs are completed in a single visit."
      benefits={BENEFITS}
    />
  );
}
