import { prisma } from '../src/lib/prisma';

// Exact stations extracted from the Kolkata Suburban Network Map
const MAP_STATIONS: { line: string; stations: { name: string; possibleCodes: string[] }[] }[] = [
  {
    line: 'Howrah - Burdwan Main Line',
    stations: [
      { name: 'Howrah', possibleCodes: ['HWH'] },
      { name: 'Liluah', possibleCodes: ['LLH', 'LLAH'] },
      { name: 'Belur', possibleCodes: ['BEQ', 'BELR'] },
      { name: 'Bally', possibleCodes: ['BLY', 'BALY'] },
      { name: 'Uttarpara', possibleCodes: ['UPA', 'UTAE'] },
      { name: 'Hind Motor', possibleCodes: ['HMZ', 'HLMT'] },
      { name: 'Konnagar', possibleCodes: ['KOG', 'KTAE'] },
      { name: 'Rishra', possibleCodes: ['RIS', 'RSAE'] },
      { name: 'Serampore', possibleCodes: ['SRP', 'SRAE'] },
      { name: 'Seoraphuli Jn.', possibleCodes: ['SHE'] },
      { name: 'Baidyabati', possibleCodes: ['BBAE', 'BBA'] },
      { name: 'Bhadreshwar', possibleCodes: ['BHR'] },
      { name: 'Mankundu', possibleCodes: ['MUU'] },
      { name: 'Chandernagor', possibleCodes: ['CGR'] },
      { name: 'Chinsurah', possibleCodes: ['CNS', 'CHN'] },
      { name: 'Hooghly', possibleCodes: ['HGY'] },
      { name: 'Bandel Jn.', possibleCodes: ['BDC'] },
      { name: 'Adi Saptagram', possibleCodes: ['ADST'] },
      { name: 'Magra', possibleCodes: ['MGAE'] },
      { name: 'Talandu', possibleCodes: ['TLO'] },
      { name: 'Khanyan', possibleCodes: ['KNY', 'KHN'] },
      { name: 'Pundooah', possibleCodes: ['PDA', 'PHDE'] },
      { name: 'Simlagarh', possibleCodes: ['SLG'] },
      { name: 'Bainchigram', possibleCodes: ['BCGM'] },
      { name: 'Bainchi', possibleCodes: ['BNCX', 'BOI'] },
      { name: 'Debipur', possibleCodes: ['DBP'] },
      { name: 'Bagila', possibleCodes: ['BGF'] },
      { name: 'Memari', possibleCodes: ['MYM', 'MSAE'] },
      { name: 'Nimo Halt', possibleCodes: ['NMF'] },
      { name: 'Rasulpur', possibleCodes: ['RSLP', 'RSLR'] },
      { name: 'Palsit', possibleCodes: ['PLAE'] },
      { name: 'Saktigarh', possibleCodes: ['SKG', 'SKLE'] },
      { name: 'Gangpur', possibleCodes: ['GRP'] },
      { name: 'Burdwan', possibleCodes: ['BWN'] }
    ]
  },
  {
    line: 'Howrah - Burdwan Chord Line',
    stations: [
      { name: 'Belanagar', possibleCodes: ['BZL'] },
      { name: 'Dankuni', possibleCodes: ['DKAE'] },
      { name: 'Gobra', possibleCodes: ['GBRA'] },
      { name: 'Janai Road', possibleCodes: ['JOX'] },
      { name: 'Begampur', possibleCodes: ['BPAE'] },
      { name: 'Baruipara', possibleCodes: ['BRPA'] },
      { name: 'Mirzapur Bankipur', possibleCodes: ['MBP'] },
      { name: 'Kamarkundu', possibleCodes: ['KQU'] },
      { name: 'Madhusudanpur', possibleCodes: ['MDSE'] },
      { name: 'Chandanpur', possibleCodes: ['CDAE'] },
      { name: 'Porabazar', possibleCodes: ['PBZ'] },
      { name: 'Belmuri', possibleCodes: ['BMAE'] },
      { name: 'Sibaichandi', possibleCodes: ['SHBC'] },
      { name: 'Hajigarh', possibleCodes: ['HIH'] },
      { name: 'Gurap', possibleCodes: ['GRAE', 'GRAP'] },
      { name: 'Jhapandanga', possibleCodes: ['JPQ'] },
      { name: 'Jaugram', possibleCodes: ['JRAE'] },
      { name: 'Nabagram', possibleCodes: ['NBAE'] },
      { name: 'Masagram', possibleCodes: ['MSAG', 'MSAE'] },
      { name: 'Chanchal Halt', possibleCodes: ['CHC'] },
      { name: 'Palla Road', possibleCodes: ['PRAE'] }
    ]
  },
  {
    line: 'Seoraphuli - Tarakeshwar Branch',
    stations: [
      { name: 'Diara', possibleCodes: ['DEA'] },
      { name: 'Nasibpur', possibleCodes: ['NSF'] },
      { name: 'Singur', possibleCodes: ['SIU'] },
      { name: 'Kamarkundu', possibleCodes: ['KQU'] },
      { name: 'Maliya Halt', possibleCodes: ['MLYA'] },
      { name: 'Nalikul', possibleCodes: ['NLK', 'NKL'] },
      { name: 'Haripal', possibleCodes: ['HPL'] },
      { name: 'Kaikala', possibleCodes: ['KKAE'] },
      { name: 'Bahirkhanda', possibleCodes: ['BAHW'] },
      { name: 'Loknath', possibleCodes: ['LOK'] },
      { name: 'Tarakeshwar', possibleCodes: ['TAK'] }
    ]
  },
  {
    line: 'Bandel - Katwa Line',
    stations: [
      { name: 'Bansberia', possibleCodes: ['BSAE'] },
      { name: 'Tribeni', possibleCodes: ['TBAE'] },
      { name: 'Kuntighat', possibleCodes: ['KJU'] },
      { name: 'Dumurdaha', possibleCodes: ['DMLE'] },
      { name: 'Khamargachhi', possibleCodes: ['KMAE'] },
      { name: 'Jirat', possibleCodes: ['JIT'] },
      { name: 'Balagarh', possibleCodes: ['BGAE'] },
      { name: 'Somra Bazar', possibleCodes: ['SOAE'] },
      { name: 'Behula', possibleCodes: ['BHLA'] },
      { name: 'Guptipara', possibleCodes: ['GPAE'] },
      { name: 'Ambika Kalna', possibleCodes: ['ABKA'] },
      { name: 'Baghnapara', possibleCodes: ['BGRA'] },
      { name: 'Dhatrigram', possibleCodes: ['DTAE'] },
      { name: 'Samudragarh', possibleCodes: ['SMAE'] },
      { name: 'Nabadwip Dham', possibleCodes: ['NDAE'] },
      { name: 'Bishnupriya', possibleCodes: ['BFZ'] },
      { name: 'Bhandartikuri', possibleCodes: ['VSPR', 'BTRI'] },
      { name: 'Purbasthali', possibleCodes: ['PSAE'] },
      { name: 'Mertala Phaleya', possibleCodes: ['MTFA'] },
      { name: 'Lakshmipur', possibleCodes: ['LKX'] },
      { name: 'Belerhat', possibleCodes: ['BQY'] },
      { name: 'Patuli', possibleCodes: ['PTAE'] },
      { name: 'Agradwip', possibleCodes: ['AGAE'] },
      { name: 'Sahebtala', possibleCodes: ['SHBA', 'SHBL'] },
      { name: 'Dainhat', possibleCodes: ['DHAE'] },
      { name: 'Katwa Jn.', possibleCodes: ['KWAE'] }
    ]
  },
  {
    line: 'Bandel - Naihati Branch',
    stations: [
      { name: 'Hooghly Ghat', possibleCodes: ['HYGT', 'HYG'] },
      { name: 'Garifa', possibleCodes: ['GRFA', 'GFAE'] }
    ]
  },
  {
    line: 'Calcutta Chord Link (Dankuni - Dum Dum)',
    stations: [
      { name: 'Rajchandrapur', possibleCodes: ['RCD'] },
      { name: 'Bally Halt', possibleCodes: ['BLYH'] },
      { name: 'Ballyghat', possibleCodes: ['BLYG'] },
      { name: 'Dakshineshwar', possibleCodes: ['DAKE', 'DKAE2'] },
      { name: 'Baranagar Road', possibleCodes: ['BARN'] }
    ]
  },
  {
    line: 'Circular Railway',
    stations: [
      { name: 'Patipukur', possibleCodes: ['PTKR'] },
      { name: 'Ultadanga Road', possibleCodes: ['UDR', 'KOAA'] },
      { name: 'Tala', possibleCodes: ['TALA'] },
      { name: 'Bagbazar', possibleCodes: ['BGB', 'BBR'] },
      { name: 'Sovabazar Ahiritola', possibleCodes: ['SOLA'] },
      { name: 'Burrabazar', possibleCodes: ['BZB'] },
      { name: 'BBD Bagh', possibleCodes: ['BBDB'] },
      { name: 'Eden Gardens', possibleCodes: ['EDG'] },
      { name: 'Princep Ghat', possibleCodes: ['PPGT'] }
    ]
  },
  {
    line: 'Sealdah North Main Line',
    stations: [
      { name: 'Sealdah', possibleCodes: ['SDAH'] },
      { name: 'Bidhannagar Road', possibleCodes: ['BNXR', 'BYNR'] },
      { name: 'Dum Dum Jn.', possibleCodes: ['DDJ'] },
      { name: 'Belghoria', possibleCodes: ['BLH'] },
      { name: 'Agarpara', possibleCodes: ['AGP', 'AGPD'] },
      { name: 'Sodepur', possibleCodes: ['SEP', 'SGAE'] },
      { name: 'Khardaha', possibleCodes: ['KDH', 'KHNA'] },
      { name: 'Titagarh', possibleCodes: ['TGH', 'TLGD'] },
      { name: 'Barrackpore', possibleCodes: ['BP'] },
      { name: 'Palta', possibleCodes: ['PTF'] },
      { name: 'Ichhapur', possibleCodes: ['IP'] },
      { name: 'Shyamnagar', possibleCodes: ['SNR', 'SGMR'] },
      { name: 'Jagaddal', possibleCodes: ['JGDL'] },
      { name: 'Kankinara', possibleCodes: ['KNR', 'KLAE'] },
      { name: 'Naihati Jn.', possibleCodes: ['NH', 'NKPR'] },
      { name: 'Halishahar', possibleCodes: ['HLR', 'HSTN'] },
      { name: 'Kanchrapara', possibleCodes: ['KPA'] },
      { name: 'Kalyani', possibleCodes: ['KYI', 'KLYJ'] },
      { name: 'Kalyani Silpanchal', possibleCodes: ['KLYS'] },
      { name: 'Kalyani Ghoshpara', possibleCodes: ['KLYG'] },
      { name: 'Kalyani Simanta', possibleCodes: ['KLYM'] },
      { name: 'Madanpur', possibleCodes: ['MPJ'] },
      { name: 'Simurali', possibleCodes: ['SMX'] },
      { name: 'Palpara', possibleCodes: ['PXR'] },
      { name: 'Chakdaha', possibleCodes: ['CDH', 'CLAH'] },
      { name: 'Payradanga', possibleCodes: ['PDX'] },
      { name: 'Ranaghat Jn.', possibleCodes: ['RHA'] }
    ]
  },
  {
    line: 'Ranaghat - Krishnanagar / Shantipur',
    stations: [
      { name: 'Kalinarayanpur Jn.', possibleCodes: ['KLNP'] },
      { name: 'Birnagar', possibleCodes: ['BIJ'] },
      { name: 'Taherpur', possibleCodes: ['THP'] },
      { name: 'Badkulla', possibleCodes: ['BDZ'] },
      { name: 'Jalalkhali Halt', possibleCodes: ['JKL'] },
      { name: 'Krishnanagar City Jn.', possibleCodes: ['KNJ', 'KRSJ'] },
      { name: 'Habibpur', possibleCodes: ['HBE'] },
      { name: 'Phulia', possibleCodes: ['FLU', 'FNAE'] },
      { name: 'Bathna Krittibas', possibleCodes: ['BTKB'] },
      { name: 'Shantipur Jn.', possibleCodes: ['STB', 'SNTP'] }
    ]
  },
  {
    line: 'Ranaghat - Gede Branch',
    stations: [
      { name: 'Bankimnagar', possibleCodes: ['BNKA'] },
      { name: 'Panchberia', possibleCodes: ['PNCB'] },
      { name: 'Aranghata', possibleCodes: ['AG'] },
      { name: 'Bahirgachhi', possibleCodes: ['BHGH'] },
      { name: 'Bhayna', possibleCodes: ['BHNA'] },
      { name: 'Bagula', possibleCodes: ['BGL'] },
      { name: 'Mayurhat', possibleCodes: ['MYHT'] },
      { name: 'Taraknagar', possibleCodes: ['TNX'] },
      { name: 'Majhdia', possibleCodes: ['MIJ'] },
      { name: 'Banpur', possibleCodes: ['BPN'] },
      { name: 'Harishnagar', possibleCodes: ['HRSR'] },
      { name: 'Gede', possibleCodes: ['GEDE'] }
    ]
  },
  {
    line: 'Ranaghat - Bangaon Branch',
    stations: [
      { name: 'Naba Raynagar Halt', possibleCodes: ['NBRN'] },
      { name: 'Gangnapur', possibleCodes: ['GNG'] },
      { name: 'Majhergram', possibleCodes: ['MAJ'] },
      { name: 'Akaipur Halt', possibleCodes: ['AKIP'] },
      { name: 'Gopalnagar', possibleCodes: ['GN'] },
      { name: 'Satberia Halt', possibleCodes: ['STBR'] }
    ]
  },
  {
    line: 'Sealdah - Bangaon Line',
    stations: [
      { name: 'Dum Dum Cantt.', possibleCodes: ['DDC', 'DDPC'] },
      { name: 'Durganagar', possibleCodes: ['DGNR'] },
      { name: 'Birati', possibleCodes: ['BBT'] },
      { name: 'Bisharpara Kodalia', possibleCodes: ['BRPK'] },
      { name: 'New Barrackpore', possibleCodes: ['NBE'] },
      { name: 'Madhyamgram', possibleCodes: ['MMG'] },
      { name: 'Hridaypur', possibleCodes: ['HHR'] },
      { name: 'Barasat Jn.', possibleCodes: ['BT'] },
      { name: 'Bamangachhi', possibleCodes: ['BMG'] },
      { name: 'Dattapukur', possibleCodes: ['DTK'] },
      { name: 'Bira', possibleCodes: ['BIRA'] },
      { name: 'Guma', possibleCodes: ['GUMA'] },
      { name: 'Ashoknagar Road', possibleCodes: ['ASKR'] },
      { name: 'Habra', possibleCodes: ['HB'] },
      { name: 'Sanhati Halt', possibleCodes: ['SNHT'] },
      { name: 'Machlandapur', possibleCodes: ['MSL'] },
      { name: 'Gobardanga', possibleCodes: ['GBG'] },
      { name: 'Thakurnagar', possibleCodes: ['TKNR'] },
      { name: 'Chandpara', possibleCodes: ['CDP'] },
      { name: 'Bibhuti Bhushan Halt', possibleCodes: ['BNAA'] },
      { name: 'Bongaon Jn.', possibleCodes: ['BNJ'] }
    ]
  },
  {
    line: 'Barasat - Hasnabad Line',
    stations: [
      { name: 'Karea Kadambgachi', possibleCodes: ['KZPR', 'KBGH'] },
      { name: 'Bahira Kalibari Halt', possibleCodes: ['BHKA'] },
      { name: 'Sondalia', possibleCodes: ['SNDI', 'SXC'] },
      { name: 'Beliaghata Road Halt', possibleCodes: ['BGRD'] },
      { name: 'Labutala Halt', possibleCodes: ['LBTL'] },
      { name: 'Bhasila Flag', possibleCodes: ['BSLA'] },
      { name: 'Harua Road', possibleCodes: ['HRO'] },
      { name: 'Kankra Mirzanagar Halt', possibleCodes: ['KMZA'] },
      { name: 'Malatipur Flag', possibleCodes: ['MPE'] },
      { name: 'Ghoraras Chona Halt', possibleCodes: ['GGV'] },
      { name: 'Champapukur', possibleCodes: ['CHPX', 'CPHX'] },
      { name: 'Bhyabla Halt', possibleCodes: ['BBLA'] },
      { name: 'Basirhat', possibleCodes: ['BSHT'] },
      { name: 'Madhyampur Halt', possibleCodes: ['MPN'] },
      { name: 'Nimdari', possibleCodes: ['NMDR'] },
      { name: 'Taki Road', possibleCodes: ['TKI', 'TKX'] },
      { name: 'Hasanabad', possibleCodes: ['HNB'] }
    ]
  },
  {
    line: 'Sealdah South Lines',
    stations: [
      { name: 'Park Circus', possibleCodes: ['PQS'] },
      { name: 'Ballygunge Jn.', possibleCodes: ['BLN', 'BLGJ'] },
      { name: 'Lake Gardens', possibleCodes: ['LKF'] },
      { name: 'Tollygunge', possibleCodes: ['TLG'] },
      { name: 'New Alipore', possibleCodes: ['NAPR', 'NACC'] },
      { name: 'Majerhat', possibleCodes: ['MJT', 'MJHT'] },
      { name: 'Brace Bridge', possibleCodes: ['BRJ'] },
      { name: 'Santoshpur', possibleCodes: ['SSP'] },
      { name: 'Akra', possibleCodes: ['AKRA'] },
      { name: 'Nangi', possibleCodes: ['NAI'] },
      { name: 'Budge Budge', possibleCodes: ['KBGB', 'BGB', 'BDGE'] },
      { name: 'Dhakuria', possibleCodes: ['DHK'] },
      { name: 'Jadavpur', possibleCodes: ['JDP'] },
      { name: 'Bagha Jatin', possibleCodes: ['BGJT'] },
      { name: 'Garia', possibleCodes: ['NGRI', 'GIA', 'GRYA', 'GARI'] },
      { name: 'Narendrapur', possibleCodes: ['NRPR'] },
      { name: 'Sonarpur Jn.', possibleCodes: ['SPR'] },
      { name: 'Bidyadharpur', possibleCodes: ['BDYP'] },
      { name: 'Kalikapur', possibleCodes: ['KLKR'] },
      { name: 'Champahati', possibleCodes: ['CHT'] },
      { name: 'Piali', possibleCodes: ['PLF'] },
      { name: 'Gourdaha', possibleCodes: ['GQD'] },
      { name: 'Ghutiari Shariff', possibleCodes: ['GOF'] },
      { name: 'Betberia Ghola Halt', possibleCodes: ['BTP'] },
      { name: 'Taldi', possibleCodes: ['TLX'] },
      { name: 'Canning', possibleCodes: ['CG', 'CNJG'] },
      { name: 'Subhasgram', possibleCodes: ['SBGR', 'SJRM'] },
      { name: 'Mallikpur', possibleCodes: ['MAK'] },
      { name: 'Baruipur Jn.', possibleCodes: ['BRP', 'BRJN'] },
      { name: 'Kalyanpur', possibleCodes: ['KYP', 'KLYP'] },
      { name: 'Dakshin Durgapur', possibleCodes: ['DKDP'] },
      { name: 'Hotar', possibleCodes: ['HT'] },
      { name: 'Dhamuah', possibleCodes: ['DMU'] },
      { name: 'Magra Hat', possibleCodes: ['MGT'] },
      { name: 'Bahirpuya Halt', possibleCodes: ['BHPA'] },
      { name: 'Sangrampur', possibleCodes: ['SNU'] },
      { name: 'Deula', possibleCodes: ['DLA', 'D'] },
      { name: 'Netra', possibleCodes: ['NTA', 'NET'] },
      { name: 'Basuldanga', possibleCodes: ['BSD'] },
      { name: 'Gurudas Nagar', possibleCodes: ['GURN'] },
      { name: 'Diamond Harbour', possibleCodes: ['DH', 'DMHB'] },
      { name: 'Shasan Road', possibleCodes: ['SSRD'] },
      { name: 'Krishnamohan', possibleCodes: ['KRXM'] },
      { name: 'Dhadhpapi', possibleCodes: ['DPDP'] },
      { name: 'Surjyapur', possibleCodes: ['SJPR'] },
      { name: 'Gocharan', possibleCodes: ['GCN'] },
      { name: 'Hogla Halt', possibleCodes: ['HGA'] },
      { name: 'Dakshin Barasat', possibleCodes: ['DBT'] },
      { name: 'Baharu', possibleCodes: ['BARU'] },
      { name: 'Jaynagar Majilpur', possibleCodes: ['JNM'] },
      { name: 'Mathurapur', possibleCodes: ['MPRD'] },
      { name: 'Madhabpur', possibleCodes: ['MDBP'] },
      { name: 'Lakshmikantapur', possibleCodes: ['LKPR', 'LKAE'] },
      { name: 'Udayrampur', possibleCodes: ['URP'] },
      { name: 'Kulpi', possibleCodes: ['KLW'] },
      { name: 'Nischindapur Market', possibleCodes: ['KNJI', 'NCPM'] },
      { name: 'Nischindapur', possibleCodes: ['NCP'] },
      { name: 'Kashinagar', possibleCodes: ['KNGR', 'KHGR'] },
      { name: 'Kakdwip', possibleCodes: ['KWDP'] }
    ]
  },
  {
    line: 'South Eastern Railway (Howrah / Santragachi / Kharagpur / Haldia / Amta)',
    stations: [
      { name: 'Padmapukur', possibleCodes: ['PDPK'] },
      { name: 'Shalimar', possibleCodes: ['SHM'] },
      { name: 'Tikiapara', possibleCodes: ['TPKR'] },
      { name: 'Dasnagar', possibleCodes: ['DSNR'] },
      { name: 'Ramrajatala', possibleCodes: ['RMJ'] },
      { name: 'Santragachi Jn.', possibleCodes: ['SRC', 'SNTG'] },
      { name: 'Maurigram', possibleCodes: ['MRGM'] },
      { name: 'Andul', possibleCodes: ['ADL'] },
      { name: 'Sankrail', possibleCodes: ['SEL'] },
      { name: 'Abada', possibleCodes: ['ABB'] },
      { name: 'Nalpur', possibleCodes: ['NALR'] },
      { name: 'Bauria', possibleCodes: ['BVA'] },
      { name: 'Chenigail', possibleCodes: ['CGA'] },
      { name: 'Phuleswar', possibleCodes: ['FLR'] },
      { name: 'Uluberia', possibleCodes: ['ULB', 'ULBR'] },
      { name: 'Birshibpur', possibleCodes: ['BSBP'] },
      { name: 'Kulgachia', possibleCodes: ['KGY'] },
      { name: 'Bagnan', possibleCodes: ['BZN'] },
      { name: 'Ghoraghata', possibleCodes: ['GGTA'] },
      { name: 'Deulti', possibleCodes: ['DTE'] },
      { name: 'Kolaghat', possibleCodes: ['KIG'] },
      { name: 'Mecheda', possibleCodes: ['MCA', 'MNCD', 'MCAE'] },
      { name: 'Nandai Gajan', possibleCodes: ['NDGJ'] },
      { name: 'Bhogpur', possibleCodes: ['BOP'] },
      { name: 'Narayan Pakuria Murail', possibleCodes: ['NPMR'] },
      { name: 'Panskura Jn.', possibleCodes: ['PKU', 'PNKA'] },
      { name: 'Khirai', possibleCodes: ['KHAI'] },
      { name: 'Haur', possibleCodes: ['HAUR'] },
      { name: 'Radhamohanpur', possibleCodes: ['RDU'] },
      { name: 'Duan', possibleCodes: ['DUAN'] },
      { name: 'Balichak', possibleCodes: ['BCK'] },
      { name: 'Shyamchak', possibleCodes: ['SMCK', 'SMTK'] },
      { name: 'Madpur', possibleCodes: ['MPX', 'MPD'] },
      { name: 'Jakpur', possibleCodes: ['JPR'] },
      { name: 'Kharagpur Jn.', possibleCodes: ['KGP'] },
      { name: 'Giri Maidan', possibleCodes: ['GMDN'] },
      { name: 'Gokulpur', possibleCodes: ['GKL'] },
      { name: 'Midnapore', possibleCodes: ['MDN'] },
      { name: 'Raghunathbari', possibleCodes: ['RGX'] },
      { name: 'Rajgoda', possibleCodes: ['RGA'] },
      { name: 'Shahid Matangini', possibleCodes: ['SMTG'] },
      { name: 'Tamluk', possibleCodes: ['TMZ'] },
      { name: 'Keshabpur', possibleCodes: ['KSBP'] },
      { name: 'Satish Samanta', possibleCodes: ['SSPH'] },
      { name: 'Mahishadal', possibleCodes: ['MSDL'] },
      { name: 'Barda', possibleCodes: ['BRDB'] },
      { name: 'Basulyasutahata', possibleCodes: ['BYSA'] },
      { name: 'Durgachak', possibleCodes: ['DZK'] },
      { name: 'Durgachak Town', possibleCodes: ['DZKT'] },
      { name: 'Haldia', possibleCodes: ['HLZ'] },
      { name: 'Bankra Nayabaz', possibleCodes: ['BKNM'] },
      { name: 'Kona', possibleCodes: ['KONA'] },
      { name: 'Dansi', possibleCodes: ['DNI'] },
      { name: 'Jhaluarber', possibleCodes: ['JLBR'] },
      { name: 'Makardaha', possibleCodes: ['MDC'] },
      { name: 'Domjur Road', possibleCodes: ['DMJR'] },
      { name: 'Domjur', possibleCodes: ['DJR'] },
      { name: 'Dakshinbari', possibleCodes: ['DKB'] },
      { name: 'Bargachia', possibleCodes: ['BAC'] },
      { name: 'Pantihal', possibleCodes: ['PTHL'] },
      { name: 'Munshirhat', possibleCodes: ['MNH'] },
      { name: 'Mahendralalnagar', possibleCodes: ['MHLN'] },
      { name: 'Amta', possibleCodes: ['AMSN', 'AMZ'] }
    ]
  }
];

async function checkMapStations() {
  const allDbStations = await prisma.station.findMany({
    include: {
      _count: {
        select: { scheduleStops: true }
      }
    }
  });

  const dbByCode = new Map(allDbStations.map(s => [s.code.toUpperCase(), s]));
  const dbByName = new Map(allDbStations.map(s => [s.name.toLowerCase(), s]));

  let totalCount = 0;
  let activeCount = 0;
  let inactiveCount = 0;
  let missingCount = 0;

  const missingList: any[] = [];
  const inactiveList: any[] = [];

  for (const corridor of MAP_STATIONS) {
    for (const st of corridor.stations) {
      totalCount++;
      let foundStation: any = null;
      for (const code of st.possibleCodes) {
        if (dbByCode.has(code.toUpperCase())) {
          foundStation = dbByCode.get(code.toUpperCase());
          break;
        }
      }

      if (!foundStation) {
        const cleanName = st.name.toLowerCase();
        for (const [name, s] of dbByName.entries()) {
          if (name === cleanName || name.includes(cleanName) || cleanName.includes(name)) {
            foundStation = s;
            break;
          }
        }
      }

      if (!foundStation) {
        missingCount++;
        missingList.push({ corridor: corridor.line, name: st.name, codes: st.possibleCodes });
      } else if (foundStation._count.scheduleStops === 0) {
        inactiveCount++;
        inactiveList.push({ corridor: corridor.line, name: st.name, code: foundStation.code, id: foundStation.id });
      } else {
        activeCount++;
      }
    }
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('KOLKATA SUBURBAN NETWORK COVERAGE RESULTS:');
  console.log({
    totalMapStations: totalCount,
    activeStationsWithSchedules: activeCount,
    inactiveStationsWithoutSchedules: inactiveCount,
    missingStations: missingCount
  });
  console.log('═══════════════════════════════════════════════════');

  if (missingList.length > 0) {
    console.log('\n❌ MISSING FROM DB:');
    console.log(missingList);
  }

  if (inactiveList.length > 0) {
    console.log('\n⚠️ INACTIVE IN DB (NO STOPS):');
    console.log(inactiveList);
  }
}

checkMapStations().finally(() => prisma.$disconnect());
