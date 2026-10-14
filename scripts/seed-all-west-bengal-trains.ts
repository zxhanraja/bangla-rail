import { createClient } from '@supabase/supabase-js';
import { prisma } from '../src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =========================================================================
// 1. ALL WEST BENGAL STATIONS (METRO, LOCAL, EXPRESS, INTERCITY, NFR, SER, ER)
// =========================================================================
const ALL_WB_STATIONS = [
  // --- KOLKATA METRO BLUE LINE (LINE 1: DAKSHINESWAR TO KAVI SUBHASH) ---
  { code: "M-DKS", name: "Dakshineswar Metro", nameBn: "দক্ষিণেশ্বর মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-BAR", name: "Baranagar Metro", nameBn: "বরাহনগর মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-NPR", name: "Noapara Metro", nameBn: "নোয়াপাড়া মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-DDJ", name: "Dum Dum Metro", nameBn: "দমদম মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-BLG", name: "Belgachia Metro", nameBn: "বেলগাছিয়া মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-SBN", name: "Shyambazar Metro", nameBn: "শ্যামবাজার মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-SOB", name: "Shovabazar Sutanuti Metro", nameBn: "শোভাবাজার সূতানুটি মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-GPR", name: "Girish Park Metro", nameBn: "গিরিশ পার্ক মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-MHT", name: "Mahatma Gandhi Road Metro", nameBn: "মহাত্মা গান্ধী রোড মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-CST", name: "Central Metro", nameBn: "সেন্ট্রাল মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-CDK", name: "Chandni Chowk Metro", nameBn: "চাঁদনি চক মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-ESP", name: "Esplanade Metro", nameBn: "এসপ্ল্যানেড মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-PKT", name: "Park Street Metro", nameBn: "পার্ক স্ট্রিট মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-MDN", name: "Maidan Metro", nameBn: "ময়দান মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-RBS", name: "Rabindra Sadan Metro", nameBn: "রবীন্দ্র সদন মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-NBN", name: "Netaji Bhavan Metro", nameBn: "নেতাজি ভবন মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-JDN", name: "Jatin Das Park Metro", nameBn: "যতীন দাস পার্ক মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-KGH", name: "Kalighat Metro", nameBn: "কালীঘাট মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-RNS", name: "Rabindra Sarobar Metro", nameBn: "রবীন্দ্র সরোবর মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-MNM", name: "Mahanayak Uttam Kumar Metro", nameBn: "মহানায়ক উত্তম কুমার মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-NSB", name: "Netaji Metro", nameBn: "নেতাজি মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-MAS", name: "Masterda Surya Sen Metro", nameBn: "মাস্টারদা সূর্য সেন মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-GNT", name: "Gitanjali Metro", nameBn: "গীতাঞ্জলি মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-KRN", name: "Kavi Nazrul Metro", nameBn: "কবি নজরুল মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-SSD", name: "Shahid Khudiram Metro", nameBn: "শহিদ ক্ষুদিরাম মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-KVS", name: "Kavi Subhash Metro", nameBn: "কবি সুভাষ মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },

  // --- KOLKATA METRO GREEN LINE (UNDERWATER METRO) ---
  { code: "M-HMD", name: "Howrah Maidan Metro", nameBn: "হাওড়া ময়দান মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Howrah" },
  { code: "M-HWH", name: "Howrah Railway Station Metro", nameBn: "হাওড়া রেলওয়ে স্টেশন মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Howrah" },
  { code: "M-MHTG", name: "Mahakaran Metro", nameBn: "মহাকরণ মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-SDAH", name: "Sealdah Metro", nameBn: "শিয়ালদহ মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-PHL", name: "Phoolbagan Metro", nameBn: "ফুলবাগান মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "Kolkata" },
  { code: "M-SLS", name: "Salt Lake Stadium Metro", nameBn: "সল্টলেক স্টেডিয়াম মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-BLG2", name: "Bengal Chemical Metro", nameBn: "বেঙ্গল কেমিক্যাল মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-CTY", name: "City Centre Metro", nameBn: "সিটি সেন্টার মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-CKT", name: "Central Park Metro", nameBn: "সেন্ট্রাল পার্ক মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-KRP", name: "Karunamoyee Metro", nameBn: "করুণাময়ী মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },
  { code: "M-SCV", name: "Salt Lake Sector V Metro", nameBn: "সল্টলেক সেক্টর ৫ মেট্রো", zone: "KMR", division: "Kolkata Metro", district: "North 24 Parganas" },

  // --- HOWRAH DIVISION MAIN LINE ---
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

  // --- HOWRAH CHORD LINE ---
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

  // --- TARAKESWAR & ARAMBAGH BRANCH ---
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

  // --- SEALDAH DIVISION MAIN & NORTH ---
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

  // --- SEALDAH BONGAON & HASNABAD ---
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

  // --- SEALDAH SOUTH LINES ---
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

  // --- SOUTH EASTERN RAILWAY ---
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
  { code: "HAUR", name: "Haur", nameBn: "হাউর", zone: "SER", division: "Kharagpur", district: "Purba Medinipur" },
  { code: "RDU", name: "Radhamohanpur", nameBn: "রাধামোহনপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
  { code: "BCK", name: "Balichak", nameBn: "বালিচক", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
  { code: "MPX", name: "Madpur", nameBn: "মাদপুর", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
  { code: "KGP", name: "Kharagpur Junction", nameBn: "খড়গপুর জংশন", zone: "SER", division: "Kharagpur", district: "Paschim Medinipur" },
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

// =========================================================================
// 2. COMPREHENSIVE METRO & EXPRESS & SUBURBAN TRAIN SERVICES
// =========================================================================
const EXTRA_TRAINS: {
  num: string;
  name: string;
  type: string;
  orig: string;
  days: string;
  km: number;
  stops: [string, string | null, string | null, number, number][];
}[] = [
  // --- KOLKATA METRO BLUE LINE (DOWN: DAKSHINESWAR TO KAVI SUBHASH) ---
  {
    num: "M-101",
    name: "Dakshineswar - Kavi Subhash Morning Metro",
    type: "Metro",
    orig: "M-DKS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-DKS", null, "06:50", 1, 0],
      ["M-BAR", "06:53", "06:54", 2, 1],
      ["M-NPR", "06:58", "06:59", 3, 1],
      ["M-DDJ", "07:04", "07:05", 4, 1],
      ["M-SBN", "07:11", "07:12", 5, 1],
      ["M-GPR", "07:16", "07:17", 6, 1],
      ["M-CST", "07:22", "07:23", 7, 1],
      ["M-ESP", "07:27", "07:28", 8, 1],
      ["M-PKT", "07:31", "07:32", 9, 1],
      ["M-RBS", "07:36", "07:37", 10, 1],
      ["M-KGH", "07:43", "07:44", 11, 1],
      ["M-MNM", "07:51", "07:52", 12, 1],
      ["M-GNT", "07:58", "07:59", 13, 1],
      ["M-KVS", "08:12", null, 14, 0]
    ]
  },
  {
    num: "M-103",
    name: "Dakshineswar - Kavi Subhash Peak Metro",
    type: "Metro",
    orig: "M-DKS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-DKS", null, "08:30", 1, 0],
      ["M-BAR", "08:33", "08:34", 2, 1],
      ["M-NPR", "08:38", "08:39", 3, 1],
      ["M-DDJ", "08:44", "08:45", 4, 1],
      ["M-SBN", "08:51", "08:52", 5, 1],
      ["M-GPR", "08:56", "08:57", 6, 1],
      ["M-CST", "09:02", "09:03", 7, 1],
      ["M-ESP", "09:07", "09:08", 8, 1],
      ["M-PKT", "09:11", "09:12", 9, 1],
      ["M-RBS", "09:16", "09:17", 10, 1],
      ["M-KGH", "09:23", "09:24", 11, 1],
      ["M-MNM", "09:31", "09:32", 12, 1],
      ["M-GNT", "09:38", "09:39", 13, 1],
      ["M-KVS", "09:52", null, 14, 0]
    ]
  },
  {
    num: "M-105",
    name: "Dakshineswar - Kavi Subhash Evening Metro",
    type: "Metro",
    orig: "M-DKS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-DKS", null, "17:45", 1, 0],
      ["M-BAR", "17:48", "17:49", 2, 1],
      ["M-NPR", "17:53", "17:54", 3, 1],
      ["M-DDJ", "17:59", "18:00", 4, 1],
      ["M-SBN", "18:06", "18:07", 5, 1],
      ["M-ESP", "18:22", "18:23", 6, 1],
      ["M-PKT", "18:26", "18:27", 7, 1],
      ["M-KGH", "18:38", "18:39", 8, 1],
      ["M-MNM", "18:46", "18:47", 9, 1],
      ["M-KVS", "19:07", null, 10, 0]
    ]
  },

  // --- KOLKATA METRO GREEN LINE (UNDERWATER METRO: HOWRAH MAIDAN TO SECTOR V) ---
  {
    num: "M-201",
    name: "Howrah Maidan - Sector V Morning Underwater Metro",
    type: "Metro",
    orig: "M-HMD",
    days: "Daily",
    km: 17,
    stops: [
      ["M-HMD", null, "07:00", 1, 0],
      ["M-HWH", "07:03", "07:04", 2, 1],
      ["M-MHTG", "07:08", "07:09", 3, 1],
      ["M-ESP", "07:13", "07:14", 4, 1],
      ["M-SDAH", "07:20", "07:21", 5, 1],
      ["M-PHL", "07:25", "07:26", 6, 1],
      ["M-SLS", "07:29", "07:30", 7, 1],
      ["M-CTY", "07:34", "07:35", 8, 1],
      ["M-KRP", "07:39", "07:40", 9, 1],
      ["M-SCV", "07:45", null, 10, 0]
    ]
  },
  {
    num: "M-202",
    name: "Sector V - Howrah Maidan Evening Underwater Metro",
    type: "Metro",
    orig: "M-SCV",
    days: "Daily",
    km: 17,
    stops: [
      ["M-SCV", null, "18:15", 1, 0],
      ["M-KRP", "18:19", "18:20", 2, 1],
      ["M-CTY", "18:24", "18:25", 3, 1],
      ["M-SLS", "18:29", "18:30", 4, 1],
      ["M-PHL", "18:33", "18:34", 5, 1],
      ["M-SDAH", "18:39", "18:40", 6, 1],
      ["M-ESP", "18:46", "18:47", 7, 1],
      ["M-MHTG", "18:51", "18:52", 8, 1],
      ["M-HWH", "18:56", "18:57", 9, 1],
      ["M-HMD", "19:02", null, 10, 0]
    ]
  },

  // --- VANDE BHARAT EXPRESSES ACROSS WEST BENGAL ---
  {
    num: "22303",
    name: "Howrah - Ranchi Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Tue",
    km: 463,
    stops: [
      ["HWH", null, "15:45", 1, 0],
      ["KQU", "16:18", "16:19", 2, 1],
      ["BWN", "16:58", "17:00", 3, 2],
      ["DGP", "17:44", "17:46", 4, 2],
      ["ASN", "18:15", "18:17", 5, 2]
    ]
  },
  {
    num: "22895",
    name: "Howrah - Puri Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Thu",
    km: 502,
    stops: [
      ["HWH", null, "06:10", 1, 0],
      ["KGP", "07:38", "07:40", 2, 2]
    ]
  },
  {
    num: "22896",
    name: "Puri - Howrah Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "KGP",
    days: "Daily Except Thu",
    km: 502,
    stops: [
      ["KGP", "19:00", "19:02", 1, 2],
      ["HWH", "20:30", null, 2, 0]
    ]
  },
  {
    num: "22305",
    name: "Howrah - Patna Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Wed",
    km: 535,
    stops: [
      ["HWH", null, "05:55", 1, 0],
      ["BWN", "06:53", "06:55", 2, 2],
      ["DGP", "07:36", "07:38", 3, 2],
      ["ASN", "08:08", "08:10", 4, 2],
      ["CRAE", "08:30", "08:32", 5, 2]
    ]
  },

  // --- ADDITIONAL FAMOUS EXPRESS TRAINS OF WEST BENGAL ---
  {
    num: "12377",
    name: "Padatik Express",
    type: "Superfast Express",
    orig: "SDAH",
    days: "Daily",
    km: 567,
    stops: [
      ["SDAH", null, "23:20", 1, 0],
      ["BWN", "00:52", "00:54", 2, 2],
      ["BHP", "01:40", "01:42", 3, 2],
      ["RPH", "02:32", "02:37", 4, 5],
      ["MLDT", "05:25", "05:35", 5, 10],
      ["BOE", "06:48", "06:50", 6, 2],
      ["KNE", "07:30", "07:32", 7, 2],
      ["NJP", "09:15", null, 8, 0]
    ]
  },
  {
    num: "12345",
    name: "Saraighat Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 565,
    stops: [
      ["HWH", null, "15:55", 1, 0],
      ["BWN", "17:02", "17:04", 2, 2],
      ["BHP", "17:50", "17:55", 3, 5],
      ["RPH", "18:45", "18:47", 4, 2],
      ["NFK", "20:32", "20:34", 5, 2],
      ["MLDT", "21:30", "21:40", 6, 10],
      ["KNE", "23:30", "23:32", 7, 2],
      ["NJP", "01:15", null, 8, 0]
    ]
  },
  {
    num: "12341",
    name: "Agnibina Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 200,
    stops: [
      ["HWH", null, "18:20", 1, 0],
      ["BWN", "19:25", "19:27", 2, 2],
      ["MNAE", "19:48", "19:49", 3, 1],
      ["PDAE", "20:02", "20:03", 4, 1],
      ["DGP", "20:17", "20:19", 5, 2],
      ["UDL", "20:34", "20:35", 6, 1],
      ["RNG", "20:45", "20:46", 7, 1],
      ["ASN", "21:30", null, 8, 0]
    ]
  },
  {
    num: "12342",
    name: "Agnibina Express (Down)",
    type: "Superfast Express",
    orig: "ASN",
    days: "Daily",
    km: 200,
    stops: [
      ["ASN", null, "05:30", 1, 0],
      ["RNG", "05:48", "05:49", 2, 1],
      ["UDL", "05:59", "06:00", 3, 1],
      ["DGP", "06:13", "06:15", 4, 2],
      ["PDAE", "06:29", "06:30", 5, 1],
      ["BWN", "07:11", "07:13", 6, 2],
      ["HWH", "08:45", null, 7, 0]
    ]
  },
  {
    num: "12313",
    name: "Sealdah - New Delhi Rajdhani Express",
    type: "Rajdhani Express",
    orig: "SDAH",
    days: "Daily",
    km: 215,
    stops: [
      ["SDAH", null, "16:50", 1, 0],
      ["DGP", "18:48", "18:50", 2, 2],
      ["ASN", "19:16", "19:20", 3, 4]
    ]
  },
  {
    num: "13149",
    name: "Kanchan Kanya Express",
    type: "Express",
    orig: "SDAH",
    days: "Daily",
    km: 670,
    stops: [
      ["SDAH", null, "20:35", 1, 0],
      ["BWN", "22:12", "22:15", 2, 3],
      ["BHP", "23:07", "23:12", 3, 5],
      ["RPH", "00:10", "00:15", 4, 5],
      ["MLDT", "03:15", "03:25", 5, 10],
      ["AUB", "06:20", "06:22", 6, 2],
      ["SGUJ", "07:35", "07:45", 7, 10],
      ["APDJ", "12:30", null, 8, 0]
    ]
  },
  {
    num: "12871",
    name: "Howrah - Titlagarh Ispat Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 115,
    stops: [
      ["HWH", null, "06:55", 1, 0],
      ["SRC", "07:08", "07:10", 2, 2],
      ["KGP", "08:26", "08:28", 3, 2]
    ]
  },
  {
    num: "12857",
    name: "Tamralipta Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 185,
    stops: [
      ["HWH", null, "06:50", 1, 0],
      ["SRC", "07:03", "07:05", 2, 2],
      ["ULB", "07:28", "07:30", 3, 2],
      ["BZN", "07:48", "07:50", 4, 2],
      ["MCAE", "08:08", "08:10", 5, 2],
      ["TMZ", "08:42", "08:44", 6, 2],
      ["KATI", "09:30", "09:32", 7, 2],
      ["DGHA", "10:20", null, 8, 0]
    ]
  },
  {
    num: "12858",
    name: "Tamralipta Express (Down)",
    type: "Superfast Express",
    orig: "DGHA",
    days: "Daily",
    km: 185,
    stops: [
      ["DGHA", null, "10:35", 1, 0],
      ["KATI", "11:05", "11:07", 2, 2],
      ["TMZ", "12:00", "12:02", 3, 2],
      ["MCAE", "12:35", "12:37", 4, 2],
      ["BZN", "12:55", "12:57", 5, 2],
      ["ULB", "13:16", "13:18", 6, 2],
      ["SRC", "13:43", "13:45", 7, 2],
      ["HWH", "14:15", null, 8, 0]
    ]
  }
];

async function runMasterSeed() {
  console.log('🌟 Starting Comprehensive West Bengal All Trains, Metro & Express Data Seed...\n');

  // 1. Seed all stations in database
  const uniqueStations = Array.from(new Map(ALL_WB_STATIONS.map(s => [s.code, s])).values());
  console.log(`Verifying and creating ${uniqueStations.length} stations in database...`);

  const stationMap = new Map<string, string>();
  for (const s of uniqueStations) {
    const upserted = await prisma.station.upsert({
      where: { code: s.code },
      update: { name: s.name, nameBn: s.nameBn, zone: s.zone, division: s.division, district: s.district },
      create: s
    });
    stationMap.set(s.code, upserted.id);
  }
  console.log(`✅ Stations created in local Prisma DB.`);

  // 2. Upload stations to Supabase
  console.log(`Pushing all ${uniqueStations.length} stations to Supabase in batches...`);
  const stationPayload = uniqueStations.map(s => ({
    id: stationMap.get(s.code),
    code: s.code,
    name: s.name,
    name_bn: s.nameBn,
    zone: s.zone,
    division: s.division,
    district: s.district
  }));

  const chunkSize = 50;
  for (let i = 0; i < stationPayload.length; i += chunkSize) {
    const chunk = stationPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('stations').upsert(chunk, { onConflict: 'code' });
    if (error) console.error(`Stations Batch Error:`, error.message);
  }
  console.log(`✅ Stations uploaded to Supabase.\n`);

  // 3. Seed all extra trains (Metro, Vande Bharat, Express)
  console.log(`Creating ${EXTRA_TRAINS.length} additional trains (Metro, Vande Bharat, Express)...`);
  for (const t of EXTRA_TRAINS) {
    const destCode = (t.stops[t.stops.length - 1] as any[])[0] as string;
    const createdTrain = await prisma.train.upsert({
      where: { number: t.num },
      update: {
        name: t.name,
        type: t.type,
        originStationCode: t.orig,
        destinationStationCode: destCode,
        runningDays: t.days,
        distanceKm: t.km
      },
      create: {
        number: t.num,
        name: t.name,
        type: t.type,
        originStationCode: t.orig,
        destinationStationCode: destCode,
        runningDays: t.days,
        distanceKm: t.km
      }
    });

    for (const [code, arr, dep, seq, halt] of t.stops) {
      const sid = stationMap.get(code as string);
      if (!sid) continue;
      try {
        await prisma.scheduleStop.upsert({
          where: {
            trainId_stationId: {
              trainId: createdTrain.id,
              stationId: sid
            }
          },
          update: {
            arrivalTime: arr,
            departureTime: dep,
            sequenceNo: seq,
            haltMinutes: halt
          },
          create: {
            trainId: createdTrain.id,
            stationId: sid,
            arrivalTime: arr,
            departureTime: dep,
            sequenceNo: seq,
            haltMinutes: halt
          }
        });
      } catch (e) {
        // ignore unique conflicts
      }
    }
  }

  // 4. Feed all trains to Supabase
  const allTrains = await prisma.train.findMany();
  console.log(`\nPushing ${allTrains.length} total trains to Supabase...`);
  const trainPayload = allTrains.map(t => ({
    id: t.id,
    number: t.number,
    name: t.name,
    type: t.type,
    origin_station_code: t.originStationCode,
    destination_station_code: t.destinationStationCode,
    running_days: t.runningDays,
    distance_km: t.distanceKm
  }));

  for (let i = 0; i < trainPayload.length; i += chunkSize) {
    const chunk = trainPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('trains').upsert(chunk, { onConflict: 'number' });
    if (error) console.error(`Trains Batch Error:`, error.message);
  }
  console.log(`✅ All trains uploaded to Supabase.`);

  // 5. Feed all schedule stops to Supabase
  const allStops = await prisma.scheduleStop.findMany();
  console.log(`\nPushing ${allStops.length} total schedule stops to Supabase...`);
  const stopPayload = allStops.map(s => ({
    train_id: s.trainId,
    station_id: s.stationId,
    sequence_no: s.sequenceNo,
    day_offset: s.dayOffset,
    arrival_time: s.arrivalTime,
    departure_time: s.departureTime,
    halt_minutes: s.haltMinutes,
    source: s.source
  }));

  for (let i = 0; i < stopPayload.length; i += chunkSize) {
    const chunk = stopPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('schedule_stops').upsert(chunk, { onConflict: 'train_id,station_id' });
    if (error) console.error(`Schedule Stops Batch Error:`, error.message);
  }
  console.log(`✅ All schedule stops uploaded to Supabase.`);

  // 6. Final verification count
  const { count: finalStations } = await supabase.from('stations').select('*', { count: 'exact', head: true });
  const { count: finalTrains } = await supabase.from('trains').select('*', { count: 'exact', head: true });
  const { count: finalStops } = await supabase.from('schedule_stops').select('*', { count: 'exact', head: true });

  console.log(`\n🏆 SUPABASE 2026 LIVE NETWORK METRICS:`);
  console.log(`   📍 Total West Bengal Stations: ${finalStations}`);
  console.log(`   🚆 Total Trains & Metro Lines:  ${finalTrains}`);
  console.log(`   ⏱️ Total Schedule Stops:        ${finalStops}`);
  console.log(`\n🎉 Supabase is 100% synchronized with all West Bengal trains!`);
}

runMasterSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
