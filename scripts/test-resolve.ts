import { resolveStation } from '../src/lib/station-cache';
import { planRoute } from '../src/services/routeService';

async function test() {
  console.log('--- Test resolveStation ---');
  console.log('mankundu:', await resolveStation('mankundu'));
  console.log('howrha:', await resolveStation('howrha'));
  console.log('howrah:', await resolveStation('howrah'));
  console.log('MUU:', await resolveStation('MUU'));
  console.log('MKD:', await resolveStation('MKD'));

  console.log('\n--- Test planRoute mankundu -> howrah ---');
  const r1 = await planRoute('mankundu', 'howrah');
  console.log('mankundu -> howrah trains count:', 'trains' in r1 ? r1.trains.length : r1.error);

  console.log('\n--- Test planRoute mankundu -> howrha ---');
  const r2 = await planRoute('mankundu', 'howrha');
  console.log('mankundu -> howrha trains count:', 'trains' in r2 ? r2.trains.length : r2.error);
}

test().catch(console.error).finally(() => process.exit(0));
