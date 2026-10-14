import { prisma } from '../src/lib/prisma';

async function checkCodes() {
  const codesToCheck = [
    'HWH', 'BDC', 'BWN', 'ADST', 'MGAE', 'PDA', 'PHDE', 'MYM', 'MSAE', 'SKG', 'SKLE',
    'LLH', 'LLAH', 'BELR', 'BLY', 'BALY', 'UPA', 'UTAE', 'HMZ', 'HLMT', 'KOG', 'KTAE',
    'RIS', 'RSAE', 'SRP', 'SRAE', 'SHE', 'BBA', 'BBAE', 'BHR', 'MUU', 'CGR', 'CNS', 'CHN', 'HGY',
    'BSAE', 'IPRA', 'TBAE', 'KJU', 'DMLE', 'KMAE', 'JIT', 'BGAE', 'SOAE', 'BHLA', 'GPAE', 'ABKA',
    'BGRA', 'DTAE', 'SMAE', 'KLNT', 'NDAE', 'BFZ', 'PSAE', 'MTFA', 'LKX', 'BQY', 'PTAE', 'AGAE', 'SHBA', 'DHAE', 'KWAE',
    'SDAH', 'BNXR', 'BYNR', 'DDJ', 'BLH', 'AGP', 'AGPD', 'SEP', 'SGAE', 'KDH', 'KHNA', 'TGH', 'TLGD', 'BP', 'BRPK',
    'PTF', 'IP', 'SNR', 'SGMR', 'JGDL', 'KNR', 'KLAE', 'NH', 'NKPR', 'HLZ', 'HSTN', 'KPA', 'KYI', 'KLYJ', 'MPJ', 'SMX',
    'CDH', 'CLAH', 'PXR', 'RHA', 'STB', 'SNTP', 'KNJ', 'KRSJ', 'LGL', 'LGLJ',
    'BLGJ', 'DHK', 'JDP', 'BGJT', 'GIA', 'NRPR', 'SPR', 'SRJN', 'SBGR', 'MAK', 'BRP', 'BRJN',
    'CG', 'CNJG', 'DH', 'DMHB', 'LKPR', 'NMKA', 'BGB', 'BDGE', 'MJT', 'MJHT',
    'SRC', 'SNTG', 'ULB', 'ULBR', 'MCA', 'MNCD', 'PKU', 'PNKA', 'KGP', 'MDN', 'DGHA', 'DGSM'
  ];

  const found = await prisma.station.findMany({
    where: { code: { in: codesToCheck } },
    select: { code: true, name: true, id: true }
  });

  const foundMap = new Map(found.map(s => [s.code, s]));
  console.log(`Checked ${codesToCheck.length} codes, found ${found.length} in DB:`);
  for (const c of codesToCheck) {
    if (foundMap.has(c)) {
      console.log(`  ✅ ${c}: ${foundMap.get(c)?.name}`);
    } else {
      console.log(`  ❌ MISSING: ${c}`);
    }
  }
}

checkCodes().finally(() => prisma.$disconnect());
