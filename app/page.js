import { domains } from '@/lib/domains';
import DomainSalePage from '@/components/DomainSalePage';

export default function Home() {
  // The first domain in the config is treated as the primary listing
  return <DomainSalePage domain={domains[0]} />;
}
