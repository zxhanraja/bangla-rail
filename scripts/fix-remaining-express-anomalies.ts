import { prisma } from '../src/lib/prisma';

async function fixExpress() {
  console.log('Fixing remaining express route anomalies...');

  const allStations = await prisma.station.findMany({ select: { id: true, code: true } });
  const stationMap = new Map<string, string>(allStations.map(s => [s.code.toUpperCase(), s.id]));

  // Ensure any missing express stations exist
  const neededStations = [
    { code: 'BGP', name: 'Bhagalpur Junction', zone: 'ER', division: 'Malda', district: 'Bhagalpur' },
    { code: 'DUMK', name: 'Dumka', zone: 'ER', division: 'Asansol', district: 'Dumka' },
    { code: 'PAN', name: 'Panagarh', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
    { code: 'MLDT', name: 'Malda Town', zone: 'ER', division: 'Malda', district: 'Malda' },
    { code: 'BOE', name: 'Barsoi Junction', zone: 'NFR', division: 'Katihar', district: 'Katihar' },
    { code: 'KNE', name: 'Kishanganj', zone: 'NFR', division: 'Katihar', district: 'Kishanganj' },
    { code: 'NJP', name: 'New Jalpaiguri Junction', zone: 'NFR', division: 'Katihar', district: 'Jalpaiguri' },
    { code: 'JPG', name: 'Jalpaiguri Road', zone: 'NFR', division: 'Katihar', district: 'Jalpaiguri' },
    { code: 'HDB', name: 'Haldibari', zone: 'NFR', division: 'Katihar', district: 'Cooch Behar' },
  ];

  for (const st of neededStations) {
    if (!stationMap.has(st.code)) {
      const created = await prisma.station.upsert({
        where: { code: st.code },
        update: { name: st.name, zone: st.zone, division: st.division, district: st.district },
        create: { code: st.code, name: st.name, zone: st.zone, division: st.division, district: st.district, status: 'OPERATIONAL' },
      });
      stationMap.set(st.code, created.id);
    }
  }

  // 1. COALFIELD EXPRESS (12339 UP: HWH -> ASN)
  const coalfieldStopsUp = [
    { code: 'HWH', arr: null, dep: '17:20' },
    { code: 'BWN', arr: '18:28', dep: '18:30' },
    { code: 'MNAE', arr: '18:48', dep: '18:49' },
    { code: 'PAN', arr: '18:59', dep: '19:00' },
    { code: 'DGP', arr: '19:12', dep: '19:14' },
    { code: 'UDL', arr: '19:26', dep: '19:27' },
    { code: 'RNG', arr: '19:37', dep: '19:39' },
    { code: 'ASN', arr: '20:05', dep: null },
  ];

  const coalfieldStopsDown = [
    { code: 'ASN', arr: null, dep: '05:40' },
    { code: 'RNG', arr: '05:58', dep: '06:00' },
    { code: 'UDL', arr: '06:10', dep: '06:11' },
    { code: 'DGP', arr: '06:23', dep: '06:25' },
    { code: 'PAN', arr: '06:37', dep: '06:38' },
    { code: 'MNAE', arr: '06:48', dep: '06:49' },
    { code: 'BWN', arr: '07:15', dep: '07:17' },
    { code: 'HWH', arr: '08:40', dep: null },
  ];

  async function reseedTrain(num: string, name: string, orig: string, dest: string, stops: any[]) {
    const tr = await prisma.train.upsert({
      where: { number: num },
      update: { name, originStationCode: orig, destinationStationCode: dest, verificationStatus: 'verified' },
      create: { number: num, name, originStationCode: orig, destinationStationCode: dest, verificationStatus: 'verified', type: 'Superfast Express' },
    });
    await prisma.scheduleStop.deleteMany({ where: { trainId: tr.id } });

    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      const stationId = stationMap.get(s.code);
      if (!stationId) continue;
      await prisma.scheduleStop.create({
        data: {
          trainId: tr.id,
          stationId,
          sequenceNo: i + 1,
          arrivalTime: s.arr,
          departureTime: s.dep,
          haltMinutes: (s.arr && s.dep) ? 2 : 0,
          source: 'verified',
        }
      });
    }
  }

  await reseedTrain('12339', 'Coalfield Express', 'HWH', 'ASN', coalfieldStopsUp);
  await reseedTrain('12340', 'Coalfield Express (Down)', 'ASN', 'HWH', coalfieldStopsDown);

  // 2. DARJEELING MAIL (12343 SDAH -> HDB)
  const darjeelingStopsUp = [
    { code: 'SDAH', arr: null, dep: '22:05' },
    { code: 'BWN', arr: '23:32', dep: '23:35' },
    { code: 'BHP', arr: '00:22', dep: '00:25' },
    { code: 'RPH', arr: '01:25', dep: '01:30' },
    { code: 'MLDT', arr: '04:00', dep: '04:10' },
    { code: 'BOE', arr: '05:15', dep: '05:17' },
    { code: 'KNE', arr: '06:05', dep: '06:07' },
    { code: 'NJP', arr: '07:45', dep: '07:55' },
    { code: 'JPG', arr: '08:45', dep: '08:47' },
    { code: 'HDB', arr: '09:55', dep: null },
  ];

  const darjeelingStopsDown = [
    { code: 'HDB', arr: null, dep: '18:05' },
    { code: 'JPG', arr: '18:50', dep: '18:52' },
    { code: 'NJP', arr: '19:40', dep: '19:55' },
    { code: 'KNE', arr: '21:10', dep: '21:12' },
    { code: 'BOE', arr: '21:55', dep: '21:57' },
    { code: 'MLDT', arr: '00:05', dep: '00:15' },
    { code: 'RPH', arr: '02:35', dep: '02:40' },
    { code: 'BHP', arr: '03:30', dep: '03:33' },
    { code: 'BWN', arr: '04:33', dep: '04:35' },
    { code: 'SDAH', arr: '06:00', dep: null },
  ];

  await reseedTrain('12343', 'Darjeeling Mail', 'SDAH', 'HDB', darjeelingStopsUp);
  await reseedTrain('12344', 'Darjeeling Mail (Down)', 'HDB', 'SDAH', darjeelingStopsDown);

  // 3. HOWRAH - BHAGALPUR VANDE BHARAT (22305 HWH -> BGP)
  const vandeBharatStopsUp = [
    { code: 'HWH', arr: null, dep: '07:45' },
    { code: 'BHP', arr: '09:20', dep: '09:22' },
    { code: 'RPH', arr: '10:08', dep: '10:10' },
    { code: 'DUMK', arr: '11:00', dep: '11:02' },
    { code: 'BGP', arr: '13:30', dep: null },
  ];

  const vandeBharatStopsDown = [
    { code: 'BGP', arr: null, dep: '14:30' },
    { code: 'DUMK', arr: '16:45', dep: '16:47' },
    { code: 'RPH', arr: '17:40', dep: '17:42' },
    { code: 'BHP', arr: '18:25', dep: '18:27' },
    { code: 'HWH', arr: '20:30', dep: null },
  ];

  await reseedTrain('22305', 'Howrah - Bhagalpur Vande Bharat Express', 'HWH', 'BGP', vandeBharatStopsUp);
  await reseedTrain('22306', 'Bhagalpur - Howrah Vande Bharat Express', 'BGP', 'HWH', vandeBharatStopsDown);

  console.log('✅ Express trains fixed successfully!');
}

fixExpress().catch(console.error).finally(() => prisma.$disconnect());

