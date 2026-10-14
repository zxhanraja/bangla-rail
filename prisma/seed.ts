import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding exhaustive West Bengal Railway Stations & Timetables data...");

  await prisma.scheduleStop.deleteMany();
  await prisma.correction.deleteMany();
  await prisma.train.deleteMany();
  await prisma.station.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: { email: "admin@banglarail.in", passwordHash },
  });

  // Exhaustive List of West Bengal Railway Stations (All Divisions, Junctions, Local Halts)
  const stationData = [
    // --- HOWRAH DIVISION MAIN LINE (HOWRAH - BANDEL - BARDHAMAN) ---
    { code: "HWH", name: "Howrah Junction", nameBn: "হাওড়া জংশন", zone: "ER", division: "Howrah", district: "Howrah" },
    { code: "LLH", name: "Liluah", nameBn: "লিলুয়া", zone: "ER", division: "Howrah", district: "Howrah" },
    { code: "BEQ", name: "Belur", nameBn: "বেলুড়", zone: "ER", division: "Howrah", district: "Howrah" },
    { code: "BRMH", name: "Belur Math", nameBn: "বেলুড় মঠ", zone: "ER", division: "Howrah", district: "Howrah" },
    { code: "BLY", name: "Bally", nameBn: "বালি", zone: "ER", division: "Howrah", district: "Howrah" },
    { code: "UPA", name: "Uttarpara", nameBn: "উত্তরপাড়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "HM", name: "Hind Motor", nameBn: "হিন্দ মোটর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "KON", name: "Konnagar", nameBn: "কোন্নগর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "RIS", name: "Rishra", nameBn: "রিষড়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SRP", name: "Serampore", nameBn: "শ্রীরামপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SHE", name: "Sheoraphuli Junction", nameBn: "শেওড়াফুলি জংশন", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BBAE", name: "Baidyabati", nameBn: "বৈদ্যবাটি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BHR", name: "Bhadreswar", nameBn: "ভদ্রেশ্বর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "MUU", name: "Mankundu", nameBn: "মানকুণ্ডু", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "CHN", name: "Chandannagar", nameBn: "চন্দননগর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "CHT", name: "Chinsurah", nameBn: "চুঁচুড়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "HRAE", name: "Hooghly", nameBn: "হুগলি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BDC", name: "Bandel Junction", nameBn: "ব্যান্ডেল জংশন", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "ADST", name: "Adisaptagram", nameBn: "আদি সপ্তগ্রাম", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "MGM", name: "Mogra", nameBn: "মগরা", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "TLO", name: "Talandu", nameBn: "তালান্ডু", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "KNY", name: "Khanyan", nameBn: "খানয়ান", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "PDA", name: "Pundooah", nameBn: "পাণ্ডুয়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SLG", name: "Simlagarh", nameBn: "সিমলাগড়", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BCGM", name: "Bainchigram", nameBn: "বৈঁচিগ্রাম", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BNCX", name: "Bainchi", nameBn: "বৈঁচি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "DBP", name: "Debipur", nameBn: "দেবীপুর", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "BGF", name: "Bagila", nameBn: "বাগিলা", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "MSAE", name: "Memari", nameBn: "মেমারি", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "NMF", name: "Nimo", nameBn: "নিমো", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "RSLP", name: "Rasulpur", nameBn: "রসুলপুর", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "PLAE", name: "Palsit", nameBn: "পালসিট", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "SKG", name: "Saktigarh", nameBn: "শক্তিগড়", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "BWN", name: "Barddhaman Junction", nameBn: "বর্ধমান জংশন", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },

    // --- HOWRAH CHORD LINE (DANKUNI - CHANDANPUR - BARDHAMAN) ---
    { code: "DBAE", name: "Dankuni Junction", nameBn: "ডানকুনি জংশন", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "GBRA", name: "Gobra", nameBn: "গোবরা", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "JOX", name: "Janai Road", nameBn: "জনাই রোড", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BPAE", name: "Begampur", nameBn: "বেগমপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BRPA", name: "Baruipara", nameBn: "বারুইপাড়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "MBP", name: "Mirzapur Bankipur", nameBn: "মির্জাপুর বাঁকিপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BLAE", name: "Balarambati", nameBn: "বলরামবাটি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "KQU", name: "Kamarkundu", nameBn: "কামারকুন্ডু", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "MDSE", name: "Madhusudanpur", nameBn: "মধুসূদনপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "CDAE", name: "Chandanpur", nameBn: "চন্দনপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "PBZ", name: "Porabazar", nameBn: "পোড়াবাজার", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BMAE", name: "Belmuri", nameBn: "বেলমুড়ি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SHBC", name: "Sibaichandi", nameBn: "শিবাইচন্ডী", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "HIH", name: "Hajigarh", nameBn: "হাজিগড়", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "GRAP", name: "Gurap", nameBn: "গুড়াপ", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "JPQ", name: "Jhapandanga", nameBn: "ঝাপানডাঙ্গা", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "JRAE", name: "Jaugram", nameBn: "ঝাউগ্রাম", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "NBAE", name: "Nabagram", nameBn: "নবাগ্রাম", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "MSAG", name: "Masagram", nameBn: "মসাগ্রাম", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },

    // --- TARAKESWAR & ARAMBAGH & GOGHAT BRANCH ---
    { code: "DEA", name: "Diara", nameBn: "দিয়ারা", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SKTE", name: "Singur", nameBn: "সিঙ্গুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "NSF", name: "Nasibpur", nameBn: "নসিবপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BAHW", name: "Bahirkhanda", nameBn: "বাহিরখণ্ড", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "LOK", name: "Loknath", nameBn: "লোকনাথ", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "TAK", name: "Tarakeswar", nameBn: "তারকেশ্বর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "TLPH", name: "Talpur Halt", nameBn: "তালপুর হল্ট", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "MYPR", name: "Mayapur", nameBn: "মায়াপুর", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "AMBG", name: "Arambagh", nameBn: "আরামবাগ", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "GOGT", name: "Goghat", nameBn: "গোঘাট", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "HRT", name: "Haripal", nameBn: "হরিপাল", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "PKBR", name: "Paikpara", nameBn: "পাইকপাড়া", zone: "ER", division: "Howrah", district: "Hooghly" },

    // --- BANDEL - KATWA LINE ---
    { code: "BSAE", name: "Bansh Baria", nameBn: "বাঁশবেড়িয়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "TRS", name: "Tribeni", nameBn: "ত্রিবেণী", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "KGT", name: "Kuntighat", nameBn: "কুন্তিঘাট", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "DMLE", name: "Dumurdaha", nameBn: "ডুমুরদহ", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "KMAE", name: "Khamargachhi", nameBn: "খামারগাছি", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "JIT", name: "Jirat", nameBn: "জিরাট", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BGAE", name: "Balagarh", nameBn: "বালাগড়", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "SOAE", name: "Somra Bazar", nameBn: "সোমরা বাজার", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "BHLA", name: "Behula", nameBn: "বেহুলা", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "GPAE", name: "Guptipara", nameBn: "গুপ্তিপাড়া", zone: "ER", division: "Howrah", district: "Hooghly" },
    { code: "ABKA", name: "Ambika Kalna", nameBn: "অম্বিকা কালনা", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "BGRA", name: "Baghnapara", nameBn: "বাঘনাপাড়া", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "DTAE", name: "Dhatrigram", nameBn: "ধাত্রীগ্রাম", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "SMAE", name: "Samudra Garh", nameBn: "সমুদ্রগড়", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "NDIM", name: "Nandaigram Halt", nameBn: "নন্দাইগ্রাম হল্ট", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "PSAE", name: "Purbasthali", nameBn: "পূর্বস্থলী", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "BFZ", name: "Bhandartikuri", nameBn: "ভাণ্ডারটিকুরি", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "PTAE", name: "Patuli", nameBn: "পাটুলী", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "AGAE", name: "Agradwip", nameBn: "অগ্রদ্বীপ", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "DHAE", name: "Dainhat", nameBn: "দাঁইহাট", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },
    { code: "KWAE", name: "Katwa Junction", nameBn: "কাটোয়া জংশন", zone: "ER", division: "Howrah", district: "Purba Bardhaman" },

    // --- SEALDAH MAIN & NORTH DIVISION ---
    { code: "SDAH", name: "Sealdah", nameBn: "শিয়ালদহ", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "KOAA", name: "Kolkata Terminal", nameBn: "কলকাতা টার্মিনাল", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "BDRN", name: "Bidhannagar Road", nameBn: "বিধাননগর রোড", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "DDJ", name: "Dum Dum Junction", nameBn: "দমদম জংশন", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BGH", name: "Belgharia", nameBn: "বেলঘরিয়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "AGP", name: "Agarpara", nameBn: "আগরপাড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "SEP", name: "Sodepur", nameBn: "সোদেপুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "KDH", name: "Khardaha", nameBn: "খড়দহ", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "THK", name: "Titagarh", nameBn: "টিটাগড়", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BP", name: "Barrackpore", nameBn: "ব্যারাকপুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "PTF", name: "Palta", nameBn: "পলতা", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "IP", name: "Ichhapur", nameBn: "ইছাপুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "SNE", name: "Shyamnagar", nameBn: "শ্যামনগর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "JGDL", name: "Jagaddal", nameBn: "জগদ্দল", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "KNR", name: "Kankinara", nameBn: "কাঁকিনাড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "NH", name: "Naihati Junction", nameBn: "নৈহাটি জংশন", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "HLZ", name: "Halisahar", nameBn: "হালিসহর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "KAJU", name: "Kanchrapara", nameBn: "কাঁচড়াপাড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "KLYM", name: "Kalyani", nameBn: "কল্যাণী", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "KLMJ", name: "Kalyani Simanta", nameBn: "কল্যাণী সীমান্ত", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "MPJ", name: "Madanpur", nameBn: "মদনপুর", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "SMX", name: "Simurali", nameBn: "শিমুরালী", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "PXR", name: "Payradanga", nameBn: "পায়রাডাঙ্গা", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "CPAE", name: "Chakdaha", nameBn: "চাকদহ", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "PPA", name: "Palpara", nameBn: "পালপাড়া", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "RHA", name: "Ranaghat Junction", nameBn: "রানাঘাট জংশন", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "KLNP", name: "Kalinarayanpur", nameBn: "কালীনারায়ণপুর", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "BIJ", name: "Birnagar", nameBn: "বীরনগর", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "THP", name: "Taherpur", nameBn: "তাহেরপুর", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "BDZ", name: "Badkulla", nameBn: "বাদকুল্লা", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "STB", name: "Shantipur", nameBn: "শান্তিপুর", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "FNAE", name: "Fulia", nameBn: "ফুলিয়া", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "KRH", name: "Krishnanagar City Junction", nameBn: "কৃষ্ণনগর সিটি জংশন", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "DHU", name: "Dhubulia", nameBn: "ধুবুলিয়া", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "MGMG", name: "Muragacha", nameBn: "মুড়াগাছা", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "BTY", name: "Bethuadahari", nameBn: "বেথুয়াডহরী", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "SNDI", name: "Sonadanga", nameBn: "সোনাডাঙ্গা", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "DEB", name: "Debagram", nameBn: "দেবাগ্রাম", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "PLSE", name: "Plassey", nameBn: "পলাশী", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "SRJN", name: "Sirajnagar", nameBn: "সিরাজনগর", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "REJ", name: "Rejinagar", nameBn: "রেজীনগর", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "BDNG", name: "Beldanga", nameBn: "বেলডাঙ্গা", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "BFT", name: "Bhabta", nameBn: "ভাবতা", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "SGV", name: "Sargachhi", nameBn: "সারগাছি", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "BJAE", name: "Baharampur Court", nameBn: "বহরমপুর কোর্ট", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "CSZ", name: "Cossimbazar", nameBn: "কাশিমবাজার", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "MBB", name: "Murshidabad", nameBn: "মুর্শিদাবাদ", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "JJG", name: "Jiaganj", nameBn: "জিয়াগঞ্জ", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "BQG", name: "Bhagwangola", nameBn: "ভগবানগোলা", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "LGL", name: "Lalgola", nameBn: "লালগোলা", zone: "ER", division: "Sealdah", district: "Murshidabad" },
    { code: "GEDE", name: "Gede", nameBn: "গেদে", zone: "ER", division: "Sealdah", district: "Nadia" },
    { code: "MIJ", name: "Majhdia", nameBn: "মাঝদিয়া", zone: "ER", division: "Sealdah", district: "Nadia" },

    // --- SEALDAH BONGAON & HASNABAD LINES ---
    { code: "DDC", name: "Dum Dum Cantonment", nameBn: "দমদম ক্যান্টনমেন্ট", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "DGNR", name: "Durganagar", nameBn: "দুর্গানগর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BRTI", name: "Birati", nameBn: "বিরাটি", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BBDB", name: "Bisharpara Kodaliya", nameBn: "বিশারপাড়া কোদালিয়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "NBE", name: "New Barrackpore", nameBn: "নিউ ব্যারাকপুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "MGRM", name: "Madhyamgram", nameBn: "মধ্যমগ্রাম", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "HHR", name: "Hridaypur", nameBn: "হৃদয়পুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BT", name: "Barasat Junction", nameBn: "বারাসাত জংশন", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BMG", name: "Bamangachhi", nameBn: "বামনগাছি", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "DTK", name: "Duttapukur", nameBn: "দত্তপুকুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BIRA", name: "Bira", nameBn: "বিড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "GUMA", name: "Guma", nameBn: "গুমা", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "ASKR", name: "Ashoknagar Road", nameBn: "অশোকনগর রোড", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "HB", name: "Habra", nameBn: "হাবড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "MCA", name: "Machhalandapur", nameBn: "মছলন্দপুর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "GUAE", name: "Gobardanga", nameBn: "গোবরডাঙ্গা", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "TKNR", name: "Thakurnagar", nameBn: "ঠাকুরনগর", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "CDP", name: "Chandpara", nameBn: "চাঁদপাড়া", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BNJ", name: "Bongaon Junction", nameBn: "বনগাঁ জংশন", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "BSHT", name: "Basirhat", nameBn: "বসিরহাট", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "TKI", name: "Taki Road", nameBn: "টাকি রোড", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },
    { code: "HNB", name: "Hasnabad", nameBn: "হাসনাবাদ", zone: "ER", division: "Sealdah", district: "North 24 Parganas" },

    // --- SEALDAH SOUTH LINES (DIAMOND HARBOUR, CANNING, NAMKHANA, BUDGE BUDGE) ---
    { code: "PQS", name: "Park Circus", nameBn: "পার্ক সার্কাস", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "BTAG", name: "Ballygunge Junction", nameBn: "বালিগঞ্জ জংশন", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "DHK", name: "Dhakuria", nameBn: "ঢাকুরিয়া", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "JDP", name: "Jadavpur", nameBn: "যাদবপুর", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "BGJT", name: "Baghajatin", nameBn: "বাঘাযতীন", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "NGRI", name: "New Garia", nameBn: "নিউ গড়িয়া", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "GARI", name: "Garia", nameBn: "গড়িয়া", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "NRPR", name: "Narendrapur", nameBn: "নরেন্দ্রপুর", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "SPR", name: "Sonarpur Junction", nameBn: "সোনারপুর জংশন", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "SJRM", name: "Subhasgram", nameBn: "সুভাষগ্রাম", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "MAK", name: "Mallikpur", nameBn: "মল্লিকপুর", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "BRP", name: "Baruipur Junction", nameBn: "বারুইপুর জংশন", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "KYP", name: "Kalyanpur", nameBn: "কল্যাণপুর", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "DKDP", name: "Dakshin Barasat", nameBn: "দক্ষিণ বারাসাত", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "BARU", name: "Baharu", nameBn: "বাহারু", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "JYNE", name: "Joynagar-Majilpur", nameBn: "জয়নগর-মজিলপুর", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "MPRD", name: "Mathurapur Road", nameBn: "মথুরাপুর রোড", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "LKAE", name: "Lakshmikantapur", nameBn: "লক্ষ্মীকান্তপুর", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "KWDP", name: "Kakdwip", nameBn: "কাকদ্বীপ", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "NMKA", name: "Namkhana", nameBn: "নামখানা", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "DH", name: "Diamond Harbour", nameBn: "ডায়মন্ড হারবার", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "CG", name: "Canning", nameBn: "ক্যানিং", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },
    { code: "MJHT", name: "Majherhat", nameBn: "মাঝেরহাট", zone: "ER", division: "Sealdah", district: "Kolkata" },
    { code: "BGB", name: "Budge Budge", nameBn: "বজবজ", zone: "ER", division: "Sealdah", district: "South 24 Parganas" },

    // --- ASANSOL & DURGAPUR & BIRBHUM ---
    { code: "GKH", name: "Galsi", nameBn: "গলসি", zone: "ER", division: "Asansol", district: "Purba Bardhaman" },
    { code: "PDAE", name: "Panagarh", nameBn: "পানাগড়", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "DGP", name: "Durgapur", nameBn: "দুর্গাপুর", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "UDL", name: "Andal Junction", nameBn: "আন্দাল জংশন", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "RNG", name: "Raniganj", nameBn: "রানীগঞ্জ", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "ASN", name: "Asansol Junction", nameBn: "আসানসোল জংশন", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "CRAE", name: "Chittaranjan", nameBn: "চিত্তরঞ্জন", zone: "ER", division: "Asansol", district: "Paschim Bardhaman" },
    { code: "BHP", name: "Bolpur Shantiniketan", nameBn: "বোলপুর শান্তিনিকেতন", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "AMP", name: "Ahmadpur Junction", nameBn: "আহমদপুর জংশন", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "STN", name: "Sainthia Junction", nameBn: "সাঁইথিয়া জংশন", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "SURI", name: "Siuri", nameBn: "সিউড়ী", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "RPH", name: "Rampurhat Junction", nameBn: "রামপুরহাট জংশন", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "NRLT", name: "Nalhati Junction", nameBn: "নলহাটি জংশন", zone: "ER", division: "Howrah", district: "Birbhum" },
    { code: "MRR", name: "Murarai", nameBn: "মুরারই", zone: "ER", division: "Howrah", district: "Birbhum" },

    // --- MALDA & NORTH BENGAL ---
    { code: "NFK", name: "New Farakka Junction", nameBn: "নিউ ফারাক্কা জংশন", zone: "ER", division: "Malda", district: "Murshidabad" },
    { code: "MLDT", name: "Malda Town", nameBn: "মালদা টাউন", zone: "ER", division: "Malda", district: "Malda" },
    { code: "SM", name: "Samsi", nameBn: "সামসী", zone: "ER", division: "Malda", district: "Malda" },
    { code: "BKRD", name: "Bhaluka Road", nameBn: "ভালুকা রোড", zone: "ER", division: "Malda", district: "Malda" },
    { code: "HCR", name: "Harischandrapur", nameBn: "হরিশ্চন্দ্রপুর", zone: "ER", division: "Malda", district: "Malda" },
    { code: "BOE", name: "Barsoi Junction", nameBn: "বারসই জংশন", zone: "NFR", division: "Katihar", district: "Uttar Dinajpur" },
    { code: "DLK", name: "Dalkhola", nameBn: "ডালখোলা", zone: "NFR", division: "Katihar", district: "Uttar Dinajpur" },
    { code: "KNE", name: "Kishanganj", nameBn: "কিষাণগঞ্জ", zone: "NFR", division: "Katihar", district: "Uttar Dinajpur" },
    { code: "AUB", name: "Aluabari Road", nameBn: "আলুয়াবাড়ী রোড", zone: "NFR", division: "Katihar", district: "Uttar Dinajpur" },
    { code: "NJP", name: "New Jalpaiguri Junction", nameBn: "নিউ জলপাইগুড়ি জংশন", zone: "NFR", division: "Katihar", district: "Jalpaiguri" },
    { code: "SGUJ", name: "Siliguri Junction", nameBn: "শিলিগুড়ি জংশন", zone: "NFR", division: "Katihar", district: "Darjeeling" },
    { code: "GHM", name: "Ghum", nameBn: "ঘুম", zone: "NFR", division: "Katihar", district: "Darjeeling" },
    { code: "DJO", name: "Darjeeling", nameBn: "দার্জিলিং", zone: "NFR", division: "Katihar", district: "Darjeeling" },
    { code: "JPG", name: "Jalpaiguri Road", nameBn: "জলপাইগুড়ি রোড", zone: "NFR", division: "Alipurduar", district: "Jalpaiguri" },
    { code: "DQG", name: "Dhupguri", nameBn: "ধূপগুড়ি", zone: "NFR", division: "Alipurduar", district: "Jalpaiguri" },
    { code: "FLK", name: "Falakata", nameBn: "ফালাকাটা", zone: "NFR", division: "Alipurduar", district: "Alipurduar" },
    { code: "NCB", name: "New Cooch Behar", nameBn: "নিউ কোচবিহার", zone: "NFR", division: "Alipurduar", district: "Cooch Behar" },
    { code: "APDJ", name: "Alipur Duar Junction", nameBn: "আলিপুরদুয়ার জংশন", zone: "NFR", division: "Alipurduar", district: "Alipurduar" },
    { code: "NOQ", name: "New Alipurduar", nameBn: "নিউ আলিপুরদুয়ার", zone: "NFR", division: "Alipurduar", district: "Alipurduar" },
    { code: "HDB", name: "Haldibari", nameBn: "হলদিবাড়ি", zone: "NFR", division: "Katihar", district: "Cooch Behar" },
    { code: "BLGT", name: "Balurghat", nameBn: "বালুরঘাট", zone: "ER", division: "Malda", district: "Dakshin Dinajpur" },

    // --- SOUTH EASTERN RAILWAY (HOWRAH - KHARAGPUR - DIGHA - PURULIA) ---
    { code: "SRC", name: "Santragachi Junction", nameBn: "সাঁতরাগাছি জংশন", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "SHM", name: "Shalimar", nameBn: "শালিমার", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "MRGM", name: "Maurigram", nameBn: "মৌরিগ্রাম", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "ADL", name: "Andul", nameBn: "আন্দুল", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "SEL", name: "Sankrail", nameBn: "সাঁকরাইল", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "BVA", name: "Bauria", nameBn: "বাউড়িয়া", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "CGA", name: "Chengel", nameBn: "চেঙ্গাইল", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "FLR", name: "Fuleswar", nameBn: "ফুলেশ্বর", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "ULB", name: "Uluberia", nameBn: "উলুবেড়িয়া", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "BSBP", name: "Bir Shibpur", nameBn: "বীর শিবপুর", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "KGY", name: "Kulgachia", nameBn: "কুলগাছিয়া", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "BZN", name: "Bagnan", nameBn: "বাগনান", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "DTE", name: "Deulti", nameBn: "দেউলটি", zone: "SER", division: "Kharagpur", district: "Howrah" },
    { code: "KIG", name: "Kolaghat", nameBn: "কোলাঘাট", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "MCAE", name: "Mecheda", nameBn: "মেচেদা", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "BOP", name: "Bhogpur", nameBn: "ভোগপুর", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "PKU", name: "Panskura Junction", nameBn: "পাঁশকুড়া জংশন", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "KHAI", name: "Khirai", nameBn: "ক্ষীরাই", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "HAUR", name: "Haur", nameBn: "হাউর", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "RDU", name: "Radhamohanpur", nameBn: "রাধামোহনপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "DUAN", name: "Duan", nameBn: "দুয়ান", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "BCK", name: "Balichak", nameBn: "বালিচক", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "MPX", name: "Madpur", nameBn: "মাদপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "JPR", name: "Jakpur", nameBn: "জকপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "KGP", name: "Kharagpur Junction", nameBn: "খড়গপুর জংশন", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "GMDN", name: "Girimaidan", nameBn: "গিরি ময়দান", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "GKL", name: "Gokulpur", nameBn: "গোকুলপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "MDN", name: "Midnapore", nameBn: "মেদিনীপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
    { code: "BQA", name: "Bankura Junction", nameBn: "বাঁকুড়া জংশন", zone: "SER", division: "Adra", district: "Bankura" },
    { code: "VSU", name: "Bishnupur Junction", nameBn: "বিষ্ণুপুর জংশন", zone: "SER", division: "Adra", district: "Bankura" },
    { code: "ADRA", name: "Adra Junction", nameBn: "আদ্রা জংশন", zone: "SER", division: "Adra", district: "Purulia" },
    { code: "PRR", name: "Purulia Junction", nameBn: "পুরুলিয়া জংশন", zone: "SER", division: "Adra", district: "Purulia" },
    { code: "TMZ", name: "Tamluk Junction", nameBn: "তমলুক জংশন", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "NDKR", name: "Nandakumar", nameBn: "নন্দকুমার", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "HLDZ", name: "Haldia", nameBn: "হলদিয়া", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "KATI", name: "Kanthi (Contai)", nameBn: "কাঁথি", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "RMRB", name: "Ramnagar Bengal", nameBn: "রামনগর বেঙ্গল", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
    { code: "DGHA", name: "Digha", nameBn: "দিঘা", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" }
  ];

  // Deduplicate stations by code
  const uniqueStations = Array.from(new Map(stationData.map(s => [s.code, s])).values());

  const stationMap = new Map<string, string>();
  for (const s of uniqueStations) {
    const created = await prisma.station.create({ data: s });
    stationMap.set(s.code, created.id);
  }
  console.log(`Created ${uniqueStations.length} stations across West Bengal`);

  const g = (code: string) => stationMap.get(code) ?? null;

  // -------------------------------------------------------------------------------------
  // COMPLETE TIMETABLE TRAIN DEFINITIONS
  // -------------------------------------------------------------------------------------
  const trains: {
    num: string;
    name: string;
    type: string;
    orig: string;
    days: string;
    km: number;
    stops: [string, string | null, string | null, number, number][]; // [code, arr, dep, seq, halt]
  }[] = [
    // =========================================================================
    // 1. HOWRAH MAIN LINE: DOWN TRAINS (BARDDHAMAN / MEMARI / BANDEL -> HOWRAH)
    // ALL PASSING ADISAPTAGRAM (ADST) WITH FULL DAY FREQUENCY TO HOWRAH (HWH)
    // =========================================================================
    {
      num: "37812",
      name: "Barddhaman - Howrah Morning Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "03:40", 1, 0],
        ["SKG", "03:48", "03:49", 2, 1],
        ["MSAE", "04:02", "04:03", 3, 1],
        ["BNCX", "04:12", "04:13", 4, 1],
        ["PDA", "04:22", "04:23", 5, 1],
        ["KNY", "04:28", "04:29", 6, 1],
        ["MGM", "04:36", "04:37", 7, 1],
        ["ADST", "04:41", "04:42", 8, 1],
        ["BDC", "04:50", "04:52", 9, 2],
        ["HRAE", "04:55", "04:56", 10, 1],
        ["CHT", "04:58", "04:59", 11, 1],
        ["CHN", "05:02", "05:03", 12, 1],
        ["BHR", "05:08", "05:09", 13, 1],
        ["SHE", "05:16", "05:17", 14, 1],
        ["SRP", "05:21", "05:22", 15, 1],
        ["RIS", "05:26", "05:27", 16, 1],
        ["KON", "05:30", "05:31", 17, 1],
        ["HM", "05:34", "05:35", 18, 1],
        ["UPA", "05:38", "05:39", 19, 1],
        ["BLY", "05:42", "05:43", 20, 1],
        ["BEQ", "05:46", "05:47", 21, 1],
        ["LLH", "05:51", "05:52", 22, 1],
        ["HWH", "06:05", null, 23, 0]
      ]
    },
    {
      num: "37814",
      name: "Barddhaman - Howrah Fast Local",
      type: "Fast Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "04:30", 1, 0],
        ["MSAE", "04:50", "04:51", 2, 1],
        ["BNCX", "05:00", "05:01", 3, 1],
        ["PDA", "05:09", "05:10", 4, 1],
        ["MGM", "05:22", "05:23", 5, 1],
        ["ADST", "05:27", "05:28", 6, 1],
        ["BDC", "05:35", "05:37", 7, 2],
        ["CHT", "05:43", "05:44", 8, 1],
        ["CHN", "05:47", "05:48", 9, 1],
        ["SHE", "05:58", "05:59", 10, 1],
        ["SRP", "06:03", "06:04", 11, 1],
        ["BLY", "06:14", "06:15", 12, 1],
        ["LLH", "06:21", "06:22", 13, 1],
        ["HWH", "06:35", null, 14, 0]
      ]
    },
    {
      num: "37816",
      name: "Barddhaman - Howrah Peak Commuter",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "05:15", 1, 0],
        ["SKG", "05:24", "05:25", 2, 1],
        ["MSAE", "05:38", "05:39", 3, 1],
        ["BNCX", "05:48", "05:49", 4, 1],
        ["PDA", "05:58", "05:59", 5, 1],
        ["KNY", "06:04", "06:05", 6, 1],
        ["TLO", "06:09", "06:10", 7, 1],
        ["MGM", "06:14", "06:15", 8, 1],
        ["ADST", "06:19", "06:20", 9, 1],
        ["BDC", "06:28", "06:30", 10, 2],
        ["HRAE", "06:34", "06:35", 11, 1],
        ["CHT", "06:38", "06:39", 12, 1],
        ["CHN", "06:42", "06:43", 13, 1],
        ["MUU", "06:46", "06:47", 14, 1],
        ["BHR", "06:50", "06:51", 15, 1],
        ["BBAE", "06:54", "06:55", 16, 1],
        ["SHE", "06:58", "06:59", 17, 1],
        ["SRP", "07:04", "07:05", 18, 1],
        ["RIS", "07:09", "07:10", 19, 1],
        ["KON", "07:14", "07:15", 20, 1],
        ["HM", "07:18", "07:19", 21, 1],
        ["UPA", "07:22", "07:23", 22, 1],
        ["BLY", "07:26", "07:27", 23, 1],
        ["BEQ", "07:30", "07:31", 24, 1],
        ["LLH", "07:35", "07:36", 25, 1],
        ["HWH", "07:50", null, 26, 0]
      ]
    },
    {
      num: "37818",
      name: "Memari - Howrah Morning Local",
      type: "EMU Local",
      orig: "MSAE",
      days: "Daily",
      km: 82,
      stops: [
        ["MSAE", null, "06:10", 1, 0],
        ["BNCX", "06:20", "06:21", 2, 1],
        ["SLG", "06:26", "06:27", 3, 1],
        ["PDA", "06:32", "06:33", 4, 1],
        ["KNY", "06:38", "06:39", 5, 1],
        ["TLO", "06:44", "06:45", 6, 1],
        ["MGM", "06:50", "06:51", 7, 1],
        ["ADST", "06:56", "06:57", 8, 1],
        ["BDC", "07:06", "07:08", 9, 2],
        ["HRAE", "07:12", "07:13", 10, 1],
        ["CHT", "07:16", "07:17", 11, 1],
        ["CHN", "07:20", "07:21", 12, 1],
        ["SHE", "07:30", "07:31", 13, 1],
        ["SRP", "07:36", "07:37", 14, 1],
        ["RIS", "07:41", "07:42", 15, 1],
        ["KON", "07:46", "07:47", 16, 1],
        ["HM", "07:50", "07:51", 17, 1],
        ["UPA", "07:54", "07:55", 18, 1],
        ["BLY", "07:58", "07:59", 19, 1],
        ["LLH", "08:06", "08:07", 20, 1],
        ["HWH", "08:22", null, 21, 0]
      ]
    },
    {
      num: "37820",
      name: "Barddhaman - Howrah Super Rush Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "06:30", 1, 0],
        ["MSAE", "06:52", "06:53", 2, 1],
        ["BNCX", "07:02", "07:03", 3, 1],
        ["PDA", "07:13", "07:14", 4, 1],
        ["KNY", "07:20", "07:21", 5, 1],
        ["MGM", "07:29", "07:30", 6, 1],
        ["ADST", "07:35", "07:36", 7, 1],
        ["BDC", "07:45", "07:47", 8, 2],
        ["CHT", "07:53", "07:54", 9, 1],
        ["CHN", "07:58", "07:59", 10, 1],
        ["SHE", "08:08", "08:09", 11, 1],
        ["SRP", "08:14", "08:15", 12, 1],
        ["RIS", "08:20", "08:21", 13, 1],
        ["UPA", "08:29", "08:30", 14, 1],
        ["BLY", "08:34", "08:35", 15, 1],
        ["LLH", "08:42", "08:43", 16, 1],
        ["HWH", "08:58", null, 17, 0]
      ]
    },
    {
      num: "37822",
      name: "Barddhaman - Howrah Ladies Special / Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "07:10", 1, 0],
        ["MSAE", "07:32", "07:33", 2, 1],
        ["BNCX", "07:42", "07:43", 3, 1],
        ["PDA", "07:52", "07:53", 4, 1],
        ["TLO", "08:02", "08:03", 5, 1],
        ["MGM", "08:08", "08:09", 6, 1],
        ["ADST", "08:14", "08:15", 7, 1],
        ["BDC", "08:24", "08:26", 8, 2],
        ["CHT", "08:32", "08:33", 9, 1],
        ["CHN", "08:37", "08:38", 10, 1],
        ["SHE", "08:47", "08:48", 11, 1],
        ["SRP", "08:53", "08:54", 12, 1],
        ["BLY", "09:04", "09:05", 13, 1],
        ["LLH", "09:12", "09:13", 14, 1],
        ["HWH", "09:28", null, 15, 0]
      ]
    },
    {
      num: "37824",
      name: "Barddhaman - Howrah Office Rush Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "07:55", 1, 0],
        ["SKG", "08:04", "08:05", 2, 1],
        ["MSAE", "08:18", "08:19", 3, 1],
        ["BNCX", "08:28", "08:29", 4, 1],
        ["PDA", "08:39", "08:40", 5, 1],
        ["KNY", "08:46", "08:47", 6, 1],
        ["MGM", "08:54", "08:55", 7, 1],
        ["ADST", "09:00", "09:01", 8, 1],
        ["BDC", "09:10", "09:12", 9, 2],
        ["HRAE", "09:16", "09:17", 10, 1],
        ["CHT", "09:20", "09:21", 11, 1],
        ["CHN", "09:24", "09:25", 12, 1],
        ["SHE", "09:34", "09:35", 13, 1],
        ["SRP", "09:40", "09:41", 14, 1],
        ["RIS", "09:46", "09:47", 15, 1],
        ["BLY", "09:56", "09:57", 16, 1],
        ["LLH", "10:04", "10:05", 17, 1],
        ["HWH", "10:20", null, 18, 0]
      ]
    },
    {
      num: "37826",
      name: "Barddhaman - Howrah Morning Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "08:45", 1, 0],
        ["MSAE", "09:07", "09:08", 2, 1],
        ["BNCX", "09:18", "09:19", 3, 1],
        ["PDA", "09:29", "09:30", 4, 1],
        ["MGM", "09:43", "09:44", 5, 1],
        ["ADST", "09:49", "09:50", 6, 1],
        ["BDC", "09:59", "10:01", 7, 2],
        ["CHT", "10:07", "10:08", 8, 1],
        ["CHN", "10:12", "10:13", 9, 1],
        ["SHE", "10:22", "10:23", 10, 1],
        ["SRP", "10:28", "10:29", 11, 1],
        ["BLY", "10:39", "10:40", 12, 1],
        ["LLH", "10:47", "10:48", 13, 1],
        ["HWH", "11:05", null, 14, 0]
      ]
    },
    {
      num: "37828",
      name: "Barddhaman - Howrah Midday Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "09:40", 1, 0],
        ["MSAE", "10:02", "10:03", 2, 1],
        ["BNCX", "10:13", "10:14", 3, 1],
        ["PDA", "10:24", "10:25", 4, 1],
        ["KNY", "10:31", "10:32", 5, 1],
        ["MGM", "10:39", "10:40", 6, 1],
        ["ADST", "10:45", "10:46", 7, 1],
        ["BDC", "10:55", "10:57", 8, 2],
        ["CHT", "11:03", "11:04", 9, 1],
        ["CHN", "11:08", "11:09", 10, 1],
        ["SHE", "11:18", "11:19", 11, 1],
        ["SRP", "11:24", "11:25", 12, 1],
        ["RIS", "11:29", "11:30", 13, 1],
        ["BLY", "11:39", "11:40", 14, 1],
        ["LLH", "11:48", "11:49", 15, 1],
        ["HWH", "12:05", null, 16, 0]
      ]
    },
    {
      num: "37830",
      name: "Barddhaman - Howrah Afternoon Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "11:15", 1, 0],
        ["MSAE", "11:37", "11:38", 2, 1],
        ["BNCX", "11:48", "11:49", 3, 1],
        ["PDA", "11:59", "12:00", 4, 1],
        ["MGM", "12:13", "12:14", 5, 1],
        ["ADST", "12:19", "12:20", 6, 1],
        ["BDC", "12:29", "12:31", 7, 2],
        ["CHT", "12:37", "12:38", 8, 1],
        ["CHN", "12:42", "12:43", 9, 1],
        ["SHE", "12:52", "12:53", 10, 1],
        ["SRP", "12:58", "12:59", 11, 1],
        ["BLY", "13:10", "13:11", 12, 1],
        ["LLH", "13:18", "13:19", 13, 1],
        ["HWH", "13:35", null, 14, 0]
      ]
    },
    {
      num: "37832",
      name: "Barddhaman - Howrah Afternoon Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "12:40", 1, 0],
        ["MSAE", "13:02", "13:03", 2, 1],
        ["BNCX", "13:13", "13:14", 3, 1],
        ["PDA", "13:24", "13:25", 4, 1],
        ["KNY", "13:31", "13:32", 5, 1],
        ["MGM", "13:39", "13:40", 6, 1],
        ["ADST", "13:45", "13:46", 7, 1],
        ["BDC", "13:55", "13:57", 8, 2],
        ["CHT", "14:03", "14:04", 9, 1],
        ["CHN", "14:08", "14:09", 10, 1],
        ["SHE", "14:18", "14:19", 11, 1],
        ["SRP", "14:24", "14:25", 12, 1],
        ["BLY", "14:35", "14:36", 13, 1],
        ["LLH", "14:43", "14:44", 14, 1],
        ["HWH", "15:00", null, 15, 0]
      ]
    },
    {
      num: "37834",
      name: "Barddhaman - Howrah Post-Meridiem Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "14:00", 1, 0],
        ["MSAE", "14:22", "14:23", 2, 1],
        ["BNCX", "14:33", "14:34", 3, 1],
        ["PDA", "14:44", "14:45", 4, 1],
        ["MGM", "14:58", "14:59", 5, 1],
        ["ADST", "15:04", "15:05", 6, 1],
        ["BDC", "15:14", "15:16", 7, 2],
        ["CHT", "15:22", "15:23", 8, 1],
        ["CHN", "15:27", "15:28", 9, 1],
        ["SHE", "15:37", "15:38", 10, 1],
        ["SRP", "15:43", "15:44", 11, 1],
        ["BLY", "15:55", "15:56", 12, 1],
        ["LLH", "16:03", "16:04", 13, 1],
        ["HWH", "16:20", null, 14, 0]
      ]
    },
    {
      num: "37836",
      name: "Barddhaman - Howrah Evening Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "15:10", 1, 0],
        ["MSAE", "15:32", "15:33", 2, 1],
        ["BNCX", "15:43", "15:44", 3, 1],
        ["PDA", "15:54", "15:55", 4, 1],
        ["KNY", "16:01", "16:02", 5, 1],
        ["MGM", "16:09", "16:10", 6, 1],
        ["ADST", "16:15", "16:16", 7, 1],
        ["BDC", "16:25", "16:27", 8, 2],
        ["CHT", "16:33", "16:34", 9, 1],
        ["CHN", "16:38", "16:39", 10, 1],
        ["SHE", "16:48", "16:49", 11, 1],
        ["SRP", "16:54", "16:55", 12, 1],
        ["RIS", "16:59", "17:00", 13, 1],
        ["BLY", "17:10", "17:11", 14, 1],
        ["LLH", "17:18", "17:19", 15, 1],
        ["HWH", "17:35", null, 16, 0]
      ]
    },
    {
      num: "37838",
      name: "Barddhaman - Howrah Evening Commuter",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "16:30", 1, 0],
        ["SKG", "16:39", "16:40", 2, 1],
        ["MSAE", "16:53", "16:54", 3, 1],
        ["BNCX", "17:04", "17:05", 4, 1],
        ["PDA", "17:15", "17:16", 5, 1],
        ["KNY", "17:22", "17:23", 6, 1],
        ["MGM", "17:30", "17:31", 7, 1],
        ["ADST", "17:36", "17:37", 8, 1],
        ["BDC", "17:46", "17:48", 9, 2],
        ["HRAE", "17:52", "17:53", 10, 1],
        ["CHT", "17:56", "17:57", 11, 1],
        ["CHN", "18:00", "18:01", 12, 1],
        ["SHE", "18:10", "18:11", 13, 1],
        ["SRP", "18:16", "18:17", 14, 1],
        ["RIS", "18:21", "18:22", 15, 1],
        ["BLY", "18:31", "18:32", 16, 1],
        ["LLH", "18:39", "18:40", 17, 1],
        ["HWH", "18:55", null, 18, 0]
      ]
    },
    {
      num: "37840",
      name: "Barddhaman - Howrah Evening Rush Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "17:40", 1, 0],
        ["MSAE", "18:02", "18:03", 2, 1],
        ["BNCX", "18:13", "18:14", 3, 1],
        ["PDA", "18:24", "18:25", 4, 1],
        ["MGM", "18:38", "18:39", 5, 1],
        ["ADST", "18:44", "18:45", 6, 1],
        ["BDC", "18:54", "18:56", 7, 2],
        ["CHT", "19:02", "19:03", 8, 1],
        ["CHN", "19:07", "19:08", 9, 1],
        ["SHE", "19:17", "19:18", 10, 1],
        ["SRP", "19:23", "19:24", 11, 1],
        ["BLY", "19:35", "19:36", 12, 1],
        ["LLH", "19:43", "19:44", 13, 1],
        ["HWH", "20:00", null, 14, 0]
      ]
    },
    {
      num: "37842",
      name: "Barddhaman - Howrah Night Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "18:50", 1, 0],
        ["MSAE", "19:12", "19:13", 2, 1],
        ["BNCX", "19:23", "19:24", 3, 1],
        ["PDA", "19:34", "19:35", 4, 1],
        ["KNY", "19:41", "19:42", 5, 1],
        ["MGM", "19:49", "19:50", 6, 1],
        ["ADST", "19:55", "19:56", 7, 1],
        ["BDC", "20:05", "20:07", 8, 2],
        ["CHT", "20:13", "20:14", 9, 1],
        ["CHN", "20:18", "20:19", 10, 1],
        ["SHE", "20:28", "20:29", 11, 1],
        ["SRP", "20:34", "20:35", 12, 1],
        ["RIS", "20:39", "20:40", 13, 1],
        ["BLY", "20:50", "20:51", 14, 1],
        ["LLH", "20:58", "20:59", 15, 1],
        ["HWH", "21:15", null, 16, 0]
      ]
    },
    {
      num: "37844",
      name: "Barddhaman - Howrah Late Night Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "20:15", 1, 0],
        ["MSAE", "20:37", "20:38", 2, 1],
        ["BNCX", "20:48", "20:49", 3, 1],
        ["PDA", "20:59", "21:00", 4, 1],
        ["MGM", "21:13", "21:14", 5, 1],
        ["ADST", "21:19", "21:20", 6, 1],
        ["BDC", "21:29", "21:31", 7, 2],
        ["CHT", "21:37", "21:38", 8, 1],
        ["CHN", "21:42", "21:43", 9, 1],
        ["SHE", "21:52", "21:53", 10, 1],
        ["SRP", "21:58", "21:59", 11, 1],
        ["BLY", "22:10", "22:11", 12, 1],
        ["LLH", "22:18", "22:19", 13, 1],
        ["HWH", "22:35", null, 14, 0]
      ]
    },
    {
      num: "37846",
      name: "Barddhaman - Howrah Last Night Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 107,
      stops: [
        ["BWN", null, "21:40", 1, 0],
        ["SKG", "21:49", "21:50", 2, 1],
        ["MSAE", "22:03", "22:04", 3, 1],
        ["BNCX", "22:14", "22:15", 4, 1],
        ["PDA", "22:25", "22:26", 5, 1],
        ["KNY", "22:32", "22:33", 6, 1],
        ["TLO", "22:37", "22:38", 7, 1],
        ["MGM", "22:42", "22:43", 8, 1],
        ["ADST", "22:48", "22:49", 9, 1],
        ["BDC", "22:58", "23:00", 10, 2],
        ["CHT", "23:06", "23:07", 11, 1],
        ["CHN", "23:11", "23:12", 12, 1],
        ["SHE", "23:21", "23:22", 13, 1],
        ["SRP", "23:27", "23:28", 14, 1],
        ["BLY", "23:38", "23:39", 15, 1],
        ["LLH", "23:46", "23:47", 16, 1],
        ["HWH", "00:05", null, 17, 0]
      ]
    },

    // =========================================================================
    // 2. HOWRAH MAIN LINE: UP TRAINS (HOWRAH -> BANDEL / ADISAPTAGRAM / BARDDHAMAN)
    // =========================================================================
    {
      num: "37811",
      name: "Howrah - Barddhaman Early Morning Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "04:15", 1, 0],
        ["LLH", "04:22", "04:23", 2, 1],
        ["BEQ", "04:26", "04:27", 3, 1],
        ["BLY", "04:30", "04:31", 4, 1],
        ["UPA", "04:34", "04:35", 5, 1],
        ["HM", "04:37", "04:38", 6, 1],
        ["KON", "04:41", "04:42", 7, 1],
        ["RIS", "04:45", "04:46", 8, 1],
        ["SRP", "04:50", "04:51", 9, 1],
        ["SHE", "04:55", "04:56", 10, 1],
        ["BBAE", "04:59", "05:00", 11, 1],
        ["BHR", "05:03", "05:04", 12, 1],
        ["MUU", "05:07", "05:08", 13, 1],
        ["CHN", "05:11", "05:12", 14, 1],
        ["CHT", "05:15", "05:16", 15, 1],
        ["HRAE", "05:19", "05:20", 16, 1],
        ["BDC", "05:27", "05:29", 17, 2],
        ["ADST", "05:35", "05:36", 18, 1],
        ["MGM", "05:40", "05:41", 19, 1],
        ["TLO", "05:45", "05:46", 20, 1],
        ["KNY", "05:50", "05:51", 21, 1],
        ["PDA", "05:56", "05:57", 22, 1],
        ["SLG", "06:02", "06:03", 23, 1],
        ["BNCX", "06:07", "06:08", 24, 1],
        ["MSAE", "06:18", "06:19", 25, 1],
        ["SKG", "06:30", "06:31", 26, 1],
        ["BWN", "06:45", null, 27, 0]
      ]
    },
    {
      num: "37813",
      name: "Howrah - Barddhaman Morning Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "05:30", 1, 0],
        ["LLH", "05:37", "05:38", 2, 1],
        ["BLY", "05:45", "05:46", 3, 1],
        ["SRP", "06:00", "06:01", 4, 1],
        ["SHE", "06:06", "06:07", 5, 1],
        ["CHN", "06:17", "06:18", 6, 1],
        ["CHT", "06:21", "06:22", 7, 1],
        ["BDC", "06:30", "06:32", 8, 2],
        ["ADST", "06:38", "06:39", 9, 1],
        ["MGM", "06:44", "06:45", 10, 1],
        ["PDA", "06:58", "06:59", 11, 1],
        ["BNCX", "07:08", "07:09", 12, 1],
        ["MSAE", "07:19", "07:20", 13, 1],
        ["BWN", "07:45", null, 14, 0]
      ]
    },
    {
      num: "37815",
      name: "Howrah - Barddhaman Fast Local",
      type: "Fast Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "06:45", 1, 0],
        ["LLH", "06:52", "06:53", 2, 1],
        ["BLY", "06:59", "07:00", 3, 1],
        ["SRP", "07:12", "07:13", 4, 1],
        ["SHE", "07:18", "07:19", 5, 1],
        ["CHN", "07:28", "07:29", 6, 1],
        ["CHT", "07:32", "07:33", 7, 1],
        ["BDC", "07:40", "07:42", 8, 2],
        ["ADST", "07:48", "07:49", 9, 1],
        ["MGM", "07:54", "07:55", 10, 1],
        ["PDA", "08:08", "08:09", 11, 1],
        ["BNCX", "08:18", "08:19", 12, 1],
        ["MSAE", "08:29", "08:30", 13, 1],
        ["BWN", "08:55", null, 14, 0]
      ]
    },
    {
      num: "37817",
      name: "Howrah - Barddhaman Morning Rush Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "08:00", 1, 0],
        ["LLH", "08:07", "08:08", 2, 1],
        ["BLY", "08:15", "08:16", 3, 1],
        ["UPA", "08:20", "08:21", 4, 1],
        ["RIS", "08:29", "08:30", 5, 1],
        ["SRP", "08:35", "08:36", 6, 1],
        ["SHE", "08:41", "08:42", 7, 1],
        ["CHN", "08:52", "08:53", 8, 1],
        ["CHT", "08:56", "08:57", 9, 1],
        ["BDC", "09:05", "09:07", 10, 2],
        ["ADST", "09:14", "09:15", 11, 1],
        ["MGM", "09:20", "09:21", 12, 1],
        ["KNY", "09:28", "09:29", 13, 1],
        ["PDA", "09:35", "09:36", 14, 1],
        ["BNCX", "09:46", "09:47", 15, 1],
        ["MSAE", "09:58", "09:59", 16, 1],
        ["BWN", "10:25", null, 17, 0]
      ]
    },
    {
      num: "37819",
      name: "Howrah - Barddhaman Midday Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "09:30", 1, 0],
        ["LLH", "09:37", "09:38", 2, 1],
        ["BLY", "09:45", "09:46", 3, 1],
        ["SRP", "09:58", "09:59", 4, 1],
        ["SHE", "10:04", "10:05", 5, 1],
        ["CHN", "10:15", "10:16", 6, 1],
        ["CHT", "10:19", "10:20", 7, 1],
        ["BDC", "10:28", "10:30", 8, 2],
        ["ADST", "10:37", "10:38", 9, 1],
        ["MGM", "10:43", "10:44", 10, 1],
        ["PDA", "10:57", "10:58", 11, 1],
        ["BNCX", "11:08", "11:09", 12, 1],
        ["MSAE", "11:20", "11:21", 13, 1],
        ["BWN", "11:45", null, 14, 0]
      ]
    },
    {
      num: "37821",
      name: "Howrah - Memari Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 82,
      stops: [
        ["HWH", null, "11:00", 1, 0],
        ["LLH", "11:07", "11:08", 2, 1],
        ["BLY", "11:15", "11:16", 3, 1],
        ["SRP", "11:28", "11:29", 4, 1],
        ["SHE", "11:34", "11:35", 5, 1],
        ["CHN", "11:45", "11:46", 6, 1],
        ["CHT", "11:49", "11:50", 7, 1],
        ["BDC", "11:58", "12:00", 8, 2],
        ["ADST", "12:07", "12:08", 9, 1],
        ["MGM", "12:13", "12:14", 10, 1],
        ["PDA", "12:27", "12:28", 11, 1],
        ["BNCX", "12:38", "12:39", 12, 1],
        ["MSAE", "12:55", null, 13, 0]
      ]
    },
    {
      num: "37823",
      name: "Howrah - Barddhaman Afternoon Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "12:30", 1, 0],
        ["LLH", "12:37", "12:38", 2, 1],
        ["BLY", "12:45", "12:46", 3, 1],
        ["SRP", "12:58", "12:59", 4, 1],
        ["SHE", "13:04", "13:05", 5, 1],
        ["CHN", "13:15", "13:16", 6, 1],
        ["CHT", "13:19", "13:20", 7, 1],
        ["BDC", "13:28", "13:30", 8, 2],
        ["ADST", "13:37", "13:38", 9, 1],
        ["MGM", "13:43", "13:44", 10, 1],
        ["PDA", "13:57", "13:58", 11, 1],
        ["BNCX", "14:08", "14:09", 12, 1],
        ["MSAE", "14:20", "14:21", 13, 1],
        ["BWN", "14:45", null, 14, 0]
      ]
    },
    {
      num: "37825",
      name: "Howrah - Barddhaman Afternoon Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "14:15", 1, 0],
        ["LLH", "14:22", "14:23", 2, 1],
        ["BLY", "14:30", "14:31", 3, 1],
        ["SRP", "14:44", "14:45", 4, 1],
        ["SHE", "14:50", "14:51", 5, 1],
        ["CHN", "15:01", "15:02", 6, 1],
        ["CHT", "15:05", "15:06", 7, 1],
        ["BDC", "15:14", "15:16", 8, 2],
        ["ADST", "15:23", "15:24", 9, 1],
        ["MGM", "15:29", "15:30", 10, 1],
        ["PDA", "15:43", "15:44", 11, 1],
        ["BNCX", "15:54", "15:55", 12, 1],
        ["MSAE", "16:06", "16:07", 13, 1],
        ["BWN", "16:30", null, 14, 0]
      ]
    },
    {
      num: "37827",
      name: "Howrah - Barddhaman Evening Rush Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "15:45", 1, 0],
        ["LLH", "15:52", "15:53", 2, 1],
        ["BLY", "16:00", "16:01", 3, 1],
        ["UPA", "16:05", "16:06", 4, 1],
        ["RIS", "16:14", "16:15", 5, 1],
        ["SRP", "16:20", "16:21", 6, 1],
        ["SHE", "16:26", "16:27", 7, 1],
        ["CHN", "16:37", "16:38", 8, 1],
        ["CHT", "16:41", "16:42", 9, 1],
        ["BDC", "16:50", "16:52", 10, 2],
        ["ADST", "16:59", "17:00", 11, 1],
        ["MGM", "17:05", "17:06", 12, 1],
        ["PDA", "17:20", "17:21", 13, 1],
        ["BNCX", "17:31", "17:32", 14, 1],
        ["MSAE", "17:43", "17:44", 15, 1],
        ["BWN", "18:10", null, 16, 0]
      ]
    },
    {
      num: "37829",
      name: "Howrah - Barddhaman Evening Peak Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "17:00", 1, 0],
        ["LLH", "17:07", "17:08", 2, 1],
        ["BLY", "17:15", "17:16", 3, 1],
        ["SRP", "17:28", "17:29", 4, 1],
        ["SHE", "17:34", "17:35", 5, 1],
        ["CHN", "17:45", "17:46", 6, 1],
        ["CHT", "17:49", "17:50", 7, 1],
        ["BDC", "17:58", "18:00", 8, 2],
        ["ADST", "18:08", "18:09", 9, 1],
        ["MGM", "18:14", "18:15", 10, 1],
        ["KNY", "18:22", "18:23", 11, 1],
        ["PDA", "18:29", "18:30", 12, 1],
        ["BNCX", "18:40", "18:41", 13, 1],
        ["MSAE", "18:52", "18:53", 14, 1],
        ["BWN", "19:20", null, 15, 0]
      ]
    },
    {
      num: "37831",
      name: "Howrah - Barddhaman Evening Super Rush Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "18:15", 1, 0],
        ["LLH", "18:22", "18:23", 2, 1],
        ["BLY", "18:30", "18:31", 3, 1],
        ["SRP", "18:44", "18:45", 4, 1],
        ["SHE", "18:50", "18:51", 5, 1],
        ["CHN", "19:01", "19:02", 6, 1],
        ["CHT", "19:05", "19:06", 7, 1],
        ["BDC", "19:14", "19:16", 8, 2],
        ["ADST", "19:24", "19:25", 9, 1],
        ["MGM", "19:30", "19:31", 10, 1],
        ["PDA", "19:44", "19:45", 11, 1],
        ["BNCX", "19:55", "19:56", 12, 1],
        ["MSAE", "20:07", "20:08", 13, 1],
        ["BWN", "20:35", null, 14, 0]
      ]
    },
    {
      num: "37833",
      name: "Howrah - Barddhaman Night Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "19:35", 1, 0],
        ["LLH", "19:42", "19:43", 2, 1],
        ["BLY", "19:50", "19:51", 3, 1],
        ["SRP", "20:04", "20:05", 4, 1],
        ["SHE", "20:10", "20:11", 5, 1],
        ["CHN", "20:21", "20:22", 6, 1],
        ["CHT", "20:25", "20:26", 7, 1],
        ["BDC", "20:34", "20:36", 8, 2],
        ["ADST", "20:44", "20:45", 9, 1],
        ["MGM", "20:50", "20:51", 10, 1],
        ["PDA", "21:04", "21:05", 11, 1],
        ["BNCX", "21:15", "21:16", 12, 1],
        ["MSAE", "21:27", "21:28", 13, 1],
        ["BWN", "21:55", null, 14, 0]
      ]
    },
    {
      num: "37835",
      name: "Howrah - Barddhaman Late Night Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "21:10", 1, 0],
        ["LLH", "21:17", "21:18", 2, 1],
        ["BLY", "21:25", "21:26", 3, 1],
        ["SRP", "21:39", "21:40", 4, 1],
        ["SHE", "21:45", "21:46", 5, 1],
        ["CHN", "21:56", "21:57", 6, 1],
        ["CHT", "22:00", "22:01", 7, 1],
        ["BDC", "22:10", "22:12", 8, 2],
        ["ADST", "22:20", "22:21", 9, 1],
        ["MGM", "22:26", "22:27", 10, 1],
        ["PDA", "22:40", "22:41", 11, 1],
        ["BNCX", "22:51", "22:52", 12, 1],
        ["MSAE", "23:03", "23:04", 13, 1],
        ["BWN", "23:30", null, 14, 0]
      ]
    },
    {
      num: "37837",
      name: "Howrah - Barddhaman Last Night Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 107,
      stops: [
        ["HWH", null, "22:30", 1, 0],
        ["LLH", "22:37", "22:38", 2, 1],
        ["BLY", "22:45", "22:46", 3, 1],
        ["SRP", "22:59", "23:00", 4, 1],
        ["SHE", "23:05", "23:06", 5, 1],
        ["CHN", "23:16", "23:17", 6, 1],
        ["CHT", "23:20", "23:21", 7, 1],
        ["BDC", "23:30", "23:32", 8, 2],
        ["ADST", "23:40", "23:41", 9, 1],
        ["MGM", "23:46", "23:47", 10, 1],
        ["PDA", "00:01", "00:02", 11, 1],
        ["BNCX", "00:12", "00:13", 12, 1],
        ["MSAE", "00:24", "00:25", 13, 1],
        ["BWN", "00:50", null, 14, 0]
      ]
    },

    // =========================================================================
    // 3. HOWRAH CHORD LINE (HOWRAH - DANKUNI - BARDDHAMAN)
    // =========================================================================
    {
      num: "36811",
      name: "Howrah - Barddhaman Chord Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 95,
      stops: [
        ["HWH", null, "05:00", 1, 0],
        ["LLH", "05:07", "05:08", 2, 1],
        ["BEQ", "05:11", "05:12", 3, 1],
        ["BLY", "05:15", "05:16", 4, 1],
        ["DBAE", "05:25", "05:26", 5, 1],
        ["GBRA", "05:29", "05:30", 6, 1],
        ["JOX", "05:33", "05:34", 7, 1],
        ["BPAE", "05:37", "05:38", 8, 1],
        ["BRPA", "05:41", "05:42", 9, 1],
        ["KQU", "05:49", "05:50", 10, 1],
        ["CDAE", "05:56", "05:57", 11, 1],
        ["BMAE", "06:04", "06:05", 12, 1],
        ["GRAP", "06:12", "06:13", 13, 1],
        ["JRAE", "06:20", "06:21", 14, 1],
        ["MSAG", "06:27", "06:28", 15, 1],
        ["SKG", "06:36", "06:37", 16, 1],
        ["BWN", "06:50", null, 17, 0]
      ]
    },
    {
      num: "36812",
      name: "Barddhaman - Howrah Chord Morning Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 95,
      stops: [
        ["BWN", null, "05:30", 1, 0],
        ["SKG", "05:39", "05:40", 2, 1],
        ["MSAG", "05:48", "05:49", 3, 1],
        ["JRAE", "05:55", "05:56", 4, 1],
        ["GRAP", "06:03", "06:04", 5, 1],
        ["BMAE", "06:11", "06:12", 6, 1],
        ["CDAE", "06:19", "06:20", 7, 1],
        ["KQU", "06:26", "06:27", 8, 1],
        ["BRPA", "06:34", "06:35", 9, 1],
        ["BPAE", "06:38", "06:39", 10, 1],
        ["DBAE", "06:49", "06:50", 11, 1],
        ["BLY", "07:00", "07:01", 12, 1],
        ["LLH", "07:08", "07:09", 13, 1],
        ["HWH", "07:25", null, 14, 0]
      ]
    },
    {
      num: "36814",
      name: "Barddhaman - Howrah Chord Peak Local",
      type: "EMU Local",
      orig: "BWN",
      days: "Daily",
      km: 95,
      stops: [
        ["BWN", null, "07:20", 1, 0],
        ["MSAG", "07:38", "07:39", 2, 1],
        ["GRAP", "07:53", "07:54", 3, 1],
        ["CDAE", "08:09", "08:10", 4, 1],
        ["KQU", "08:16", "08:17", 5, 1],
        ["DBAE", "08:35", "08:36", 6, 1],
        ["BLY", "08:46", "08:47", 7, 1],
        ["LLH", "08:54", "08:55", 8, 1],
        ["HWH", "09:10", null, 9, 0]
      ]
    },

    // =========================================================================
    // 4. HOWRAH - TARAKESWAR / ARAMBAGH / GOGHAT
    // =========================================================================
    {
      num: "37315",
      name: "Howrah - Tarakeswar Morning Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 58,
      stops: [
        ["HWH", null, "06:15", 1, 0],
        ["LLH", "06:22", "06:23", 2, 1],
        ["BLY", "06:30", "06:31", 3, 1],
        ["SRP", "06:44", "06:45", 4, 1],
        ["SHE", "06:50", "06:52", 5, 2],
        ["DEA", "06:58", "06:59", 6, 1],
        ["SKTE", "07:04", "07:05", 7, 1],
        ["NSF", "07:09", "07:10", 8, 1],
        ["HRT", "07:15", "07:16", 9, 1],
        ["LOK", "07:25", "07:26", 10, 1],
        ["TAK", "07:35", null, 11, 0]
      ]
    },
    {
      num: "37316",
      name: "Tarakeswar - Howrah Morning Local",
      type: "EMU Local",
      orig: "TAK",
      days: "Daily",
      km: 58,
      stops: [
        ["TAK", null, "07:55", 1, 0],
        ["LOK", "08:02", "08:03", 2, 1],
        ["HRT", "08:12", "08:13", 3, 1],
        ["NSF", "08:18", "08:19", 4, 1],
        ["SKTE", "08:23", "08:24", 5, 1],
        ["DEA", "08:29", "08:30", 6, 1],
        ["SHE", "08:38", "08:40", 7, 2],
        ["SRP", "08:46", "08:47", 8, 1],
        ["RIS", "08:52", "08:53", 9, 1],
        ["BLY", "09:03", "09:04", 10, 1],
        ["LLH", "09:12", "09:13", 11, 1],
        ["HWH", "09:30", null, 12, 0]
      ]
    },

    // =========================================================================
    // 5. BANDEL - KATWA LINE
    // =========================================================================
    {
      num: "37911",
      name: "Howrah - Katwa Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 145,
      stops: [
        ["HWH", null, "06:00", 1, 0],
        ["LLH", "06:07", "06:08", 2, 1],
        ["BLY", "06:15", "06:16", 3, 1],
        ["SRP", "06:29", "06:30", 4, 1],
        ["SHE", "06:35", "06:36", 5, 1],
        ["CHN", "06:46", "06:47", 6, 1],
        ["CHT", "06:50", "06:51", 7, 1],
        ["BDC", "07:00", "07:02", 8, 2],
        ["BSAE", "07:09", "07:10", 9, 1],
        ["TRS", "07:15", "07:16", 10, 1],
        ["KGT", "07:20", "07:21", 11, 1],
        ["JIT", "07:33", "07:34", 12, 1],
        ["BGAE", "07:42", "07:43", 13, 1],
        ["GPAE", "07:54", "07:55", 14, 1],
        ["ABKA", "08:05", "08:07", 15, 2],
        ["SMAE", "08:19", "08:20", 16, 1],
        ["PSAE", "08:28", "08:29", 17, 1],
        ["PTAE", "08:40", "08:41", 18, 1],
        ["DHAE", "08:52", "08:53", 19, 1],
        ["KWAE", "09:10", null, 20, 0]
      ]
    },
    {
      num: "37912",
      name: "Katwa - Howrah Local",
      type: "EMU Local",
      orig: "KWAE",
      days: "Daily",
      km: 145,
      stops: [
        ["KWAE", null, "09:30", 1, 0],
        ["DHAE", "09:42", "09:43", 2, 1],
        ["PTAE", "09:54", "09:55", 3, 1],
        ["PSAE", "10:06", "10:07", 4, 1],
        ["SMAE", "10:15", "10:16", 5, 1],
        ["ABKA", "10:28", "10:30", 6, 2],
        ["GPAE", "10:40", "10:41", 7, 1],
        ["BGAE", "10:52", "10:53", 8, 1],
        ["JIT", "11:01", "11:02", 9, 1],
        ["TRS", "11:19", "11:20", 10, 1],
        ["BSAE", "11:25", "11:26", 11, 1],
        ["BDC", "11:36", "11:38", 12, 2],
        ["CHT", "11:44", "11:45", 13, 1],
        ["CHN", "11:48", "11:49", 14, 1],
        ["SHE", "11:58", "11:59", 15, 1],
        ["SRP", "12:04", "12:05", 16, 1],
        ["BLY", "12:16", "12:17", 17, 1],
        ["LLH", "12:24", "12:25", 18, 1],
        ["HWH", "12:45", null, 19, 0]
      ]
    },

    // =========================================================================
    // 6. SEALDAH MAIN & NORTH: SEALDAH - RANAGHAT - KRISHNANAGAR - LALGOLA
    // =========================================================================
    {
      num: "31211",
      name: "Sealdah - Ranaghat Local",
      type: "EMU Local",
      orig: "SDAH",
      days: "Daily",
      km: 74,
      stops: [
        ["SDAH", null, "05:00", 1, 0],
        ["BDRN", "05:06", "05:07", 2, 1],
        ["DDJ", "05:12", "05:13", 3, 1],
        ["BGH", "05:18", "05:19", 4, 1],
        ["AGP", "05:22", "05:23", 5, 1],
        ["SEP", "05:26", "05:27", 6, 1],
        ["KDH", "05:30", "05:31", 7, 1],
        ["THK", "05:34", "05:35", 8, 1],
        ["BP", "05:39", "05:40", 9, 1],
        ["PTF", "05:43", "05:44", 10, 1],
        ["IP", "05:47", "05:48", 11, 1],
        ["SNE", "05:52", "05:53", 12, 1],
        ["KNR", "06:00", "06:01", 13, 1],
        ["NH", "06:07", "06:09", 14, 2],
        ["HLZ", "06:14", "06:15", 15, 1],
        ["KAJU", "06:19", "06:20", 16, 1],
        ["KLYM", "06:25", "06:26", 17, 1],
        ["MPJ", "06:31", "06:32", 18, 1],
        ["SMX", "06:36", "06:37", 19, 1],
        ["PXR", "06:41", "06:42", 20, 1],
        ["CPAE", "06:47", "06:48", 21, 1],
        ["PPA", "06:52", "06:53", 22, 1],
        ["RHA", "07:05", null, 23, 0]
      ]
    },
    {
      num: "31212",
      name: "Ranaghat - Sealdah Local",
      type: "EMU Local",
      orig: "RHA",
      days: "Daily",
      km: 74,
      stops: [
        ["RHA", null, "07:20", 1, 0],
        ["PPA", "07:26", "07:27", 2, 1],
        ["CPAE", "07:31", "07:32", 3, 1],
        ["PXR", "07:36", "07:37", 4, 1],
        ["SMX", "07:41", "07:42", 5, 1],
        ["MPJ", "07:46", "07:47", 6, 1],
        ["KLYM", "07:53", "07:54", 7, 1],
        ["KAJU", "07:59", "08:00", 8, 1],
        ["NH", "08:10", "08:12", 9, 2],
        ["BP", "08:24", "08:25", 10, 1],
        ["SEP", "08:34", "08:35", 11, 1],
        ["DDJ", "08:48", "08:49", 12, 1],
        ["BDRN", "08:54", "08:55", 13, 1],
        ["SDAH", "09:10", null, 14, 0]
      ]
    },
    {
      num: "31811",
      name: "Sealdah - Krishnanagar City Local",
      type: "EMU Local",
      orig: "SDAH",
      days: "Daily",
      km: 100,
      stops: [
        ["SDAH", null, "07:15", 1, 0],
        ["DDJ", "07:26", "07:27", 2, 1],
        ["BP", "07:41", "07:42", 3, 1],
        ["NH", "07:57", "07:59", 4, 2],
        ["KLYM", "08:11", "08:12", 5, 1],
        ["RHA", "08:40", "08:42", 6, 2],
        ["KLNP", "08:49", "08:50", 7, 1],
        ["BIJ", "08:54", "08:55", 8, 1],
        ["THP", "08:59", "09:00", 9, 1],
        ["BDZ", "09:06", "09:07", 10, 1],
        ["KRH", "09:25", null, 11, 0]
      ]
    },
    {
      num: "13103",
      name: "Bhagirathi Express",
      type: "Express",
      orig: "SDAH",
      days: "Daily",
      km: 228,
      stops: [
        ["SDAH", null, "18:20", 1, 0],
        ["RHA", "19:50", "19:53", 2, 3],
        ["KRH", "20:20", "20:22", 3, 2],
        ["BTY", "20:47", "20:48", 4, 1],
        ["PLSE", "21:09", "21:10", 5, 1],
        ["BDNG", "21:26", "21:27", 6, 1],
        ["BJAE", "21:49", "21:51", 7, 2],
        ["MBB", "22:06", "22:08", 8, 2],
        ["JJG", "22:17", "22:18", 9, 1],
        ["BQG", "22:31", "22:32", 10, 1],
        ["LGL", "23:15", null, 11, 0]
      ]
    },

    // =========================================================================
    // 7. SEALDAH - BONGAON & HASNABAD
    // =========================================================================
    {
      num: "33811",
      name: "Sealdah - Bongaon Local",
      type: "EMU Local",
      orig: "SDAH",
      days: "Daily",
      km: 77,
      stops: [
        ["SDAH", null, "06:05", 1, 0],
        ["BDRN", "06:11", "06:12", 2, 1],
        ["DDJ", "06:17", "06:18", 3, 1],
        ["DDC", "06:23", "06:24", 4, 1],
        ["BRTI", "06:28", "06:29", 5, 1],
        ["MGRM", "06:34", "06:35", 6, 1],
        ["BT", "06:42", "06:44", 7, 2],
        ["DTK", "06:52", "06:53", 8, 1],
        ["HB", "07:05", "07:06", 9, 1],
        ["MCA", "07:16", "07:17", 10, 1],
        ["GUAE", "07:22", "07:23", 11, 1],
        ["TKNR", "07:30", "07:31", 12, 1],
        ["BNJ", "07:50", null, 13, 0]
      ]
    },
    {
      num: "33812",
      name: "Bongaon - Sealdah Local",
      type: "EMU Local",
      orig: "BNJ",
      days: "Daily",
      km: 77,
      stops: [
        ["BNJ", null, "08:10", 1, 0],
        ["TKNR", "08:24", "08:25", 2, 1],
        ["GUAE", "08:32", "08:33", 3, 1],
        ["MCA", "08:38", "08:39", 4, 1],
        ["HB", "08:49", "08:50", 5, 1],
        ["BT", "09:10", "09:12", 6, 2],
        ["MGRM", "09:19", "09:20", 7, 1],
        ["BRTI", "09:26", "09:27", 8, 1],
        ["DDJ", "09:38", "09:39", 9, 1],
        ["BDRN", "09:44", "09:45", 10, 1],
        ["SDAH", "09:58", null, 11, 0]
      ]
    },

    // =========================================================================
    // 8. SEALDAH SOUTH (DIAMOND HARBOUR, CANNING, NAMKHANA)
    // =========================================================================
    {
      num: "34811",
      name: "Sealdah - Diamond Harbour Local",
      type: "EMU Local",
      orig: "SDAH",
      days: "Daily",
      km: 60,
      stops: [
        ["SDAH", null, "06:30", 1, 0],
        ["PQS", "06:36", "06:37", 2, 1],
        ["BTAG", "06:40", "06:41", 3, 1],
        ["DHK", "06:44", "06:45", 4, 1],
        ["JDP", "06:48", "06:49", 5, 1],
        ["BGJT", "06:52", "06:53", 6, 1],
        ["GARI", "06:56", "06:57", 7, 1],
        ["SPR", "07:02", "07:04", 8, 2],
        ["SJRM", "07:08", "07:09", 9, 1],
        ["BRP", "07:15", "07:17", 10, 2],
        ["DKDP", "07:27", "07:28", 11, 1],
        ["DH", "07:55", null, 12, 0]
      ]
    },
    {
      num: "34511",
      name: "Sealdah - Canning Local",
      type: "EMU Local",
      orig: "SDAH",
      days: "Daily",
      km: 45,
      stops: [
        ["SDAH", null, "07:45", 1, 0],
        ["BTAG", "07:55", "07:56", 2, 1],
        ["JDP", "08:02", "08:03", 3, 1],
        ["GARI", "08:10", "08:11", 4, 1],
        ["SPR", "08:18", "08:20", 5, 2],
        ["CG", "08:58", null, 6, 0]
      ]
    },

    // =========================================================================
    // 9. SOUTH EASTERN RAILWAY (HOWRAH - KHARAGPUR - DIGHA - MIDNAPORE)
    // =========================================================================
    {
      num: "38711",
      name: "Howrah - Kharagpur Local",
      type: "EMU Local",
      orig: "HWH",
      days: "Daily",
      km: 115,
      stops: [
        ["HWH", null, "06:10", 1, 0],
        ["SRC", "06:24", "06:25", 2, 1],
        ["MRGM", "06:29", "06:30", 3, 1],
        ["ADL", "06:33", "06:34", 4, 1],
        ["SEL", "06:38", "06:39", 5, 1],
        ["BVA", "06:47", "06:48", 6, 1],
        ["ULB", "06:58", "06:59", 7, 1],
        ["BZN", "07:12", "07:13", 8, 1],
        ["DTE", "07:18", "07:19", 9, 1],
        ["KIG", "07:25", "07:26", 10, 1],
        ["MCAE", "07:32", "07:34", 11, 2],
        ["PKU", "07:45", "07:47", 12, 2],
        ["HAUR", "07:54", "07:55", 13, 1],
        ["RDU", "08:00", "08:01", 14, 1],
        ["BCK", "08:09", "08:10", 15, 1],
        ["MPX", "08:17", "08:18", 16, 1],
        ["KGP", "08:35", null, 17, 0]
      ]
    },
    {
      num: "38712",
      name: "Kharagpur - Howrah Local",
      type: "EMU Local",
      orig: "KGP",
      days: "Daily",
      km: 115,
      stops: [
        ["KGP", null, "09:00", 1, 0],
        ["BCK", "09:20", "09:21", 2, 1],
        ["PKU", "09:40", "09:42", 3, 2],
        ["MCAE", "09:53", "09:55", 4, 2],
        ["KIG", "10:01", "10:02", 5, 1],
        ["BZN", "10:14", "10:15", 6, 1],
        ["ULB", "10:28", "10:29", 7, 1],
        ["SRC", "10:55", "10:57", 8, 2],
        ["HWH", "11:20", null, 9, 0]
      ]
    },
    {
      num: "22847",
      name: "Howrah - Digha Kandari Express",
      type: "Superfast Express",
      orig: "HWH",
      days: "Daily",
      km: 185,
      stops: [
        ["HWH", null, "06:20", 1, 0],
        ["SRC", "06:33", "06:35", 2, 2],
        ["ULB", "06:58", "07:00", 3, 2],
        ["BZN", "07:18", "07:20", 4, 2],
        ["MCAE", "07:38", "07:40", 5, 2],
        ["TMZ", "08:12", "08:14", 6, 2],
        ["KATI", "09:00", "09:02", 7, 2],
        ["RMRB", "09:18", "09:20", 8, 2],
        ["DGHA", "09:50", null, 9, 0]
      ]
    },
    {
      num: "22848",
      name: "Digha - Howrah Kandari Express",
      type: "Superfast Express",
      orig: "DGHA",
      days: "Daily",
      km: 185,
      stops: [
        ["DGHA", null, "17:20", 1, 0],
        ["RMRB", "17:33", "17:35", 2, 2],
        ["KATI", "17:50", "17:52", 3, 2],
        ["TMZ", "18:48", "18:50", 4, 2],
        ["MCAE", "19:18", "19:20", 5, 2],
        ["BZN", "19:40", "19:42", 6, 2],
        ["ULB", "20:00", "20:02", 7, 2],
        ["SRC", "20:25", "20:27", 8, 2],
        ["HWH", "20:45", null, 9, 0]
      ]
    },

    // =========================================================================
    // 10. ASANSOL / DURGAPUR / INTERCITY EXPRESSES
    // =========================================================================
    {
      num: "12339",
      name: "Coalfield Express",
      type: "Superfast Express",
      orig: "HWH",
      days: "Daily",
      km: 260,
      stops: [
        ["HWH", null, "17:20", 1, 0],
        ["MSAG", "18:15", "18:16", 2, 1],
        ["BWN", "18:34", "18:36", 3, 2],
        ["PDAE", "19:15", "19:16", 4, 1],
        ["DGP", "19:30", "19:32", 5, 2],
        ["UDL", "19:45", "19:46", 6, 1],
        ["RNG", "19:56", "19:57", 7, 1],
        ["ASN", "20:25", null, 8, 0]
      ]
    },
    {
      num: "12340",
      name: "Coalfield Express (Down)",
      type: "Superfast Express",
      orig: "ASN",
      days: "Daily",
      km: 260,
      stops: [
        ["ASN", null, "05:40", 1, 0],
        ["RNG", "05:58", "05:59", 2, 1],
        ["UDL", "06:09", "06:10", 3, 1],
        ["DGP", "06:23", "06:25", 4, 2],
        ["PDAE", "06:39", "06:40", 5, 1],
        ["BWN", "07:22", "07:24", 6, 2],
        ["MSAG", "07:44", "07:45", 7, 1],
        ["HWH", "08:50", null, 8, 0]
      ]
    },
    {
      num: "12019",
      name: "Howrah - Ranchi Shatabdi Express",
      type: "Shatabdi Express",
      orig: "HWH",
      days: "Mon,Tue,Wed,Thu,Fri,Sat",
      km: 200,
      stops: [
        ["HWH", null, "06:05", 1, 0],
        ["BWN", "07:10", "07:12", 2, 2],
        ["DGP", "07:58", "08:00", 3, 2],
        ["RNG", "08:20", "08:21", 4, 1],
        ["ASN", "08:40", null, 5, 0]
      ]
    },

    // =========================================================================
    // 11. NORTH BENGAL EXPRESSES (DARJEELING MAIL, PADATIK, VANDE BHARAT)
    // =========================================================================
    {
      num: "12343",
      name: "Darjeeling Mail",
      type: "Superfast Express",
      orig: "SDAH",
      days: "Daily",
      km: 561,
      stops: [
        ["SDAH", null, "22:05", 1, 0],
        ["BDRN", "22:12", "22:13", 2, 1],
        ["BWN", "23:32", "23:35", 3, 3],
        ["BHP", "00:22", "00:25", 4, 3],
        ["RPH", "01:25", "01:30", 5, 5],
        ["MLDT", "04:00", "04:10", 6, 10],
        ["BOE", "05:15", "05:17", 7, 2],
        ["KNE", "06:00", "06:02", 8, 2],
        ["NJP", "08:00", null, 9, 0]
      ]
    },
    {
      num: "12344",
      name: "Darjeeling Mail (Down)",
      type: "Superfast Express",
      orig: "NJP",
      days: "Daily",
      km: 561,
      stops: [
        ["NJP", null, "20:00", 1, 0],
        ["KNE", "21:13", "21:15", 2, 2],
        ["BOE", "21:58", "22:00", 3, 2],
        ["MLDT", "23:45", "23:55", 4, 10],
        ["RPH", "02:15", "02:20", 5, 5],
        ["BHP", "03:15", "03:18", 6, 3],
        ["BWN", "04:15", "04:18", 7, 3],
        ["BDRN", "05:40", "05:41", 8, 1],
        ["SDAH", "06:00", null, 9, 0]
      ]
    },
    {
      num: "22301",
      name: "Howrah - New Jalpaiguri Vande Bharat Express",
      type: "Vande Bharat Express",
      orig: "HWH",
      days: "Daily Except Wed",
      km: 565,
      stops: [
        ["HWH", null, "05:55", 1, 0],
        ["BHP", "07:43", "07:45", 2, 2],
        ["MLDT", "10:32", "10:35", 3, 3],
        ["BOE", "11:50", "11:52", 4, 2],
        ["NJP", "13:25", null, 5, 0]
      ]
    },
    {
      num: "22302",
      name: "New Jalpaiguri - Howrah Vande Bharat Express",
      type: "Vande Bharat Express",
      orig: "NJP",
      days: "Daily Except Wed",
      km: 565,
      stops: [
        ["NJP", null, "15:05", 1, 0],
        ["BOE", "16:28", "16:30", 2, 2],
        ["MLDT", "17:55", "17:58", 3, 3],
        ["BHP", "20:52", "20:54", 4, 2],
        ["HWH", "22:35", null, 5, 0]
      ]
    }
  ];

  let tc = 0;
  let sc = 0;

  for (const t of trains) {
    const destCode = (t.stops[t.stops.length - 1] as any[])[0] as string;
    const created = await prisma.train.create({
      data: {
        number: t.num,
        name: t.name,
        type: t.type,
        originStationCode: t.orig,
        destinationStationCode: destCode,
        runningDays: t.days,
        distanceKm: t.km
      }
    });
    tc++;

    for (const [code, arr, dep, seq, halt] of t.stops) {
      const sid = g(code as string);
      if (!sid) {
        console.warn(`Station code ${code} not found in station map!`);
        continue;
      }
      try {
        await prisma.scheduleStop.create({
          data: {
            trainId: created.id,
            stationId: sid,
            arrivalTime: arr as string | null,
            departureTime: dep as string | null,
            sequenceNo: seq as number,
            haltMinutes: halt as number
          }
        });
        sc++;
      } catch (e: any) {
        if (!e.message?.includes('Unique')) throw e;
      }
    }
  }

  console.log(`Successfully seeded database!`);
  console.log(`Stations: ${stationData.length} | Trains: ${tc} | Schedule Stops: ${sc}`);
  console.log(`Admin Portal: admin@banglarail.in / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
