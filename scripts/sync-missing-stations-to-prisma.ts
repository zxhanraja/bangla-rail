import { prisma } from '../src/lib/prisma';

const EXTRA_STATIONS = [
  // ─ Howrah-Burdwan Main Line (all local halts) ─────────────────────────────
  { code: 'HLMT', name: 'Hindmotor', nameBn: 'হিন্দমোটর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'BELR', name: 'Belur', nameBn: 'বেলুড়', zone: 'ER', division: 'Howrah', district: 'Howrah' },
  { code: 'LLAH', name: 'Liluah', nameBn: 'লিলুয়া', zone: 'ER', division: 'Howrah', district: 'Howrah' },
  { code: 'BALY', name: 'Bally', nameBn: 'বালি', zone: 'ER', division: 'Howrah', district: 'Howrah' },
  { code: 'DKAE', name: 'Dankuni Junction', nameBn: 'ডানকুনি জংশন', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'PNJE', name: 'Panchla', nameBn: 'পাঁচলা', zone: 'ER', division: 'Howrah', district: 'Howrah' },
  { code: 'BGAE', name: 'Balagarh', nameBn: 'বলাগড়', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'TBAE', name: 'Tribeni', nameBn: 'ত্রিবেণী', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'ADST', name: 'Adisaptagram', nameBn: 'আদিসপ্তগ্রাম', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'BDC', name: 'Bandel Junction', nameBn: 'বাঁদেল জংশন', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'HGY', name: 'Hooghly', nameBn: 'হুগলি', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'CHN', name: 'Chinsurah', nameBn: 'চুঁচুড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'MGAE', name: 'Mogra', nameBn: 'মগরা', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'PHDE', name: 'Pundooah', nameBn: 'পান্ডুয়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'MSAE', name: 'Memari', nameBn: 'মেমারি', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'SKLE', name: 'Saktigarh', nameBn: 'শক্তিগড়', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  // ─ Howrah-Burdwan Chord Line ─────────────────────────────────────────────
  { code: 'SHE', name: 'Sheoraphuli', nameBn: 'শেওড়াফুলি', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'SRAE', name: 'Serampore', nameBn: 'শ্রীরামপুর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'RSAE', name: 'Rishra', nameBn: 'রিষড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'KTAE', name: 'Konnagar', nameBn: 'কোন্নগর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'UTAE', name: 'Uttarpara', nameBn: 'উত্তরপাড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'KMLE', name: 'Kamarkundu', nameBn: 'কামারকুণ্ডু', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'BPAE', name: 'Bainchi', nameBn: 'বৈঁচি', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'BBAE', name: 'Baruipara', nameBn: 'বারুইপাড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  // ─ Bandel-Katwa Line ─────────────────────────────────────────────────────
  { code: 'BSAE', name: 'Bansberia', nameBn: 'বাঁশবেড়িয়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'IPRA', name: 'Islampara (Hazi Md Mohsin Halt)', nameBn: 'ইসলামপাড়া (হাজী মোঃ মহসিন হল্ট)', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'KJU', name: 'Kuntighat', nameBn: 'কুন্তীঘাট', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'DMLE', name: 'Dumurdaha', nameBn: 'ডুমুরদহ', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'KMAE', name: 'Khamargachi', nameBn: 'খামারগাছি', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'JIT', name: 'Jirat', nameBn: 'জিরাট', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'SOAE', name: 'Somra Bazar', nameBn: 'সোমড়া বাজার', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'BHLA', name: 'Behula', nameBn: 'বেহুলা', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'GPAE', name: 'Guptipara', nameBn: 'গুপ্তিপাড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'ABKA', name: 'Ambika Kalna', nameBn: 'অম্বিকা কালনা', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'BGRA', name: 'Baghnapara', nameBn: 'বাঘনাপাড়া', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'DTAE', name: 'Dhatrigram', nameBn: 'ধাত্রীগ্রাম', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'NDIM', name: 'Nandaigram Halt', nameBn: 'নন্দীগ্রাম হল্ট', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'SMAE', name: 'Samudragarh', nameBn: 'সমুদ্রগড়', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'KLNT', name: 'Kalinagar', nameBn: 'কালীনগর', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'VSPR', name: 'Bishnupriya Halt', nameBn: 'বিষ্ণুপ্রিয়া হল্ট', zone: 'ER', division: 'Howrah', district: 'Nadia' },
  { code: 'BFZ', name: 'Bhandartikuri', nameBn: 'ভাণ্ডারটিকুড়ি', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'PSAE', name: 'Purbasthali', nameBn: 'পূর্বস্থলী', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'MTFA', name: 'Mertala Phaleya Halt', nameBn: 'মেড়তলা ফলেয়া হল্ট', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'LKX', name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'BQY', name: 'Belerhat', nameBn: 'বেলেরহাট', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'PTAE', name: 'Patuli', nameBn: 'পাটুলি', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'AGAE', name: 'Agradwip', nameBn: 'অগ্রদ্বীপ', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'SHBA', name: 'Sahebtala Halt', nameBn: 'সাহেবতলা হল্ট', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'DHAE', name: 'Dainhat', nameBn: 'দাইনহাট', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  { code: 'KWAE', name: 'Katwa Junction', nameBn: 'কাটোয়া জংশন', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
  // ─ Sealdah North Section small stations ──────────────────────────────────
  { code: 'DKE', name: 'Dum Dum', nameBn: 'দমদম', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'DKJN', name: 'Dum Dum Junction', nameBn: 'দমদম জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'DKC', name: 'Dum Dum Cantonment', nameBn: 'দমদম ক্যান্টনমেন্ট', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'SGAE', name: 'Sodepur', nameBn: 'সোদপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'KHNA', name: 'Khardaha', nameBn: 'খড়দহ', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'BFPD', name: 'Bhatpara', nameBn: 'ভাটপাড়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'AGPD', name: 'Agarpara', nameBn: 'আগরপাড়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'SGMR', name: 'Shyamnagar', nameBn: 'শ্যামনগর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'GRFA', name: 'Garifa', nameBn: 'গরিফা', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'JGDL', name: 'Jagatdal', nameBn: 'জগদল', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'BRPK', name: 'Barrackpore', nameBn: 'ব্যারাকপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'TLGD', name: 'Titagarh', nameBn: 'টিটাগড়', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'NKPR', name: 'Naihati Junction', nameBn: 'নৈহাটি জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'HSTN', name: 'Halisahar', nameBn: 'হালিশহর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'KLAE', name: 'Kankinara', nameBn: 'কাঁকিনাড়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'GBDG', name: 'Gobardanga', nameBn: 'গোবরডাঙ্গা', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'HBRH', name: 'Habra', nameBn: 'হাবরা', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'ASKN', name: 'Ashoknagar', nameBn: 'অশোকনগর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'CRPD', name: 'Chandpara', nameBn: 'চাঁদপাড়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'BJNJ', name: 'Bangaon Junction', nameBn: 'বনগাঁ জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
  { code: 'HRJN', name: 'Haringhata', nameBn: 'হরিণঘাটা', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  // ─ Sealdah Main Line ─────────────────────────────────────────────────────
  { code: 'CLAH', name: 'Chakdaha', nameBn: 'চাকদহ', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'KNST', name: 'Kalyani Simanta', nameBn: 'কল্যাণী সীমান্ত', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'KLYJ', name: 'Kalyani Junction', nameBn: 'কল্যাণী জংশন', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'KLYG', name: 'Kalyani Ghoshpara', nameBn: 'কল্যাণী ঘোষপাড়া', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'PKRA', name: 'Phulia', nameBn: 'ফুলিয়া', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'SNTP', name: 'Shantipur', nameBn: 'শান্তিপুর', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'KRSJ', name: 'Krishnanagar City', nameBn: 'কৃষ্ণনগর সিটি', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'BTHD', name: 'Bethuadahari', nameBn: 'বেথুয়াডহরি', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'PLSY', name: 'Plassey', nameBn: 'পলাশী', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
  { code: 'LGLJ', name: 'Lalgola', nameBn: 'লালগোলা', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
  { code: 'JIAG', name: 'Jiaganj', nameBn: 'জিয়াগঞ্জ', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
  { code: 'AZGJ', name: 'Azimganj Junction', nameBn: 'আজিমগঞ্জ জংশন', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
  { code: 'BRCA', name: 'Berhampore', nameBn: 'বহরমপুর', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
  { code: 'BRMP', name: 'Berhampore Court', nameBn: 'বহরমপুর কোর্ট', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
  // ─ Sealdah South Section ─────────────────────────────────────────────────
  { code: 'BLGJ', name: 'Ballygunge Junction', nameBn: 'বালিগঞ্জ জংশন', zone: 'ER', division: 'Sealdah', district: 'Kolkata' },
  { code: 'BYNR', name: 'Bidhannagar Road', nameBn: 'বিধাননগর রোড', zone: 'ER', division: 'Sealdah', district: 'Kolkata' },
  { code: 'SRJN', name: 'Sonarpur Junction', nameBn: 'সোনারপুর জংশন', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'BRJN', name: 'Baruipur Junction', nameBn: 'বারুইপুর জংশন', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'CNJG', name: 'Canning', nameBn: 'ক্যানিং', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'LKPR', name: 'Lakshmikantapur', nameBn: 'লক্ষ্মীকান্তপুর', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'DMHB', name: 'Diamond Harbour', nameBn: 'ডায়মন্ড হারবার', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'BDGE', name: 'Budge Budge', nameBn: 'বাজে বাজে', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'MJHT', name: 'Majerhat', nameBn: 'মাজেরহাট', zone: 'ER', division: 'Sealdah', district: 'Kolkata' },
  { code: 'GRYA', name: 'Garia', nameBn: 'গড়িয়া', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  { code: 'NRPR', name: 'Narendrapur', nameBn: 'নরেন্দ্রপুর', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
  // ─ SER / Kharagpur line WB stations ──────────────────────────────────────
  { code: 'SNTG', name: 'Santragachi Junction', nameBn: 'সাঁতরাগাছি জংশন', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },
  { code: 'ULBR', name: 'Uluberia', nameBn: 'উলুবেড়িয়া', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },
  { code: 'MNCD', name: 'Mecheda', nameBn: 'মেচেদা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'PNKA', name: 'Panskura', nameBn: 'পাঁশকুড়া', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'AMSN', name: 'Amta', nameBn: 'আমতা', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },
  { code: 'MDN', name: 'Medinipur', nameBn: 'মেদিনীপুর', zone: 'SER', division: 'Kharagpur', district: 'Paschim Medinipur' },
  { code: 'DGSM', name: 'Digha', nameBn: 'দিঘা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'CNPJ', name: 'Contai', nameBn: 'কাঁথি', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'EGRA', name: 'Egra', nameBn: 'এগরা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'TMLK', name: 'Tamluk', nameBn: 'তমলুক', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
  { code: 'JGRM', name: 'Jhargram', nameBn: 'ঝাড়গ্রাম', zone: 'SER', division: 'Kharagpur', district: 'Jhargram' },
  { code: 'BNKR', name: 'Bankura', nameBn: 'বাঁকুড়া', zone: 'SER', division: 'Adra', district: 'Bankura' },
  { code: 'PRLJ', name: 'Purulia Junction', nameBn: 'পুরুলিয়া জংশন', zone: 'SER', division: 'Adra', district: 'Purulia' },
  { code: 'ADRA', name: 'Adra Junction', nameBn: 'আদ্রা জংশন', zone: 'SER', division: 'Adra', district: 'Purulia' },
  { code: 'BSNP', name: 'Bishnupur', nameBn: 'বিষ্ণুপুর', zone: 'SER', division: 'Adra', district: 'Bankura' },
  // ─ Asansol Division ───────────────────────────────────────────────────────
  { code: 'ANDL', name: 'Andal Junction', nameBn: 'আন্দাল জংশন', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'PNGH', name: 'Panagarh', nameBn: 'পানাগড়', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'RNGE', name: 'Raniganj', nameBn: 'রাণীগঞ্জ', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'JMRA', name: 'Jamuria', nameBn: 'জামুড়িয়া', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'SRPM', name: 'Sitarampur', nameBn: 'সীতারামপুর', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'SLAE', name: 'Sainthia', nameBn: 'সাঁইথিয়া', zone: 'ER', division: 'Asansol', district: 'Birbhum' },
  { code: 'RMPH', name: 'Rampurhat', nameBn: 'রামপুরহাট', zone: 'ER', division: 'Asansol', district: 'Birbhum' },
  { code: 'NLHJ', name: 'Nalhati Junction', nameBn: 'নলহাটি জংশন', zone: 'ER', division: 'Asansol', district: 'Birbhum' },
  { code: 'DGRP', name: 'Durgapur', nameBn: 'দুর্গাপুর', zone: 'ER', division: 'Asansol', district: 'Paschim Bardhaman' },
  { code: 'BPST', name: 'Bolpur Shantiniketan', nameBn: 'বোলপুর শান্তিনিকেতন', zone: 'ER', division: 'Asansol', district: 'Birbhum' },
  { code: 'AHDJ', name: 'Ahmedpur Junction', nameBn: 'আহমেদপুর জংশন', zone: 'ER', division: 'Asansol', district: 'Birbhum' },
  // ─ Malda Division ────────────────────────────────────────────────────────
  { code: 'MLDC', name: 'Malda Court', nameBn: 'মালদা কোর্ট', zone: 'ER', division: 'Malda', district: 'Malda' },
  { code: 'NSPD', name: 'Nashipur Road', nameBn: 'নশিপুর রোড', zone: 'ER', division: 'Malda', district: 'Murshidabad' },
  { code: 'KLMG', name: 'Kaliaganj', nameBn: 'কালিয়াগঞ্জ', zone: 'ER', division: 'Malda', district: 'Uttar Dinajpur' },
  { code: 'RYGJ', name: 'Raiganj', nameBn: 'রায়গঞ্জ', zone: 'ER', division: 'Malda', district: 'Uttar Dinajpur' },
  // ─ Howrah-Tarakeswar/Arambagh Line ───────────────────────────────────────
  { code: 'TRSE', name: 'Tarakeswar', nameBn: 'তারকেশ্বর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'ARSW', name: 'Arambagh', nameBn: 'আরামবাগ', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'HKAE', name: 'Haripal', nameBn: 'হরিপাল', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'GKAE', name: 'Goghat', nameBn: 'গোঘাট', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  { code: 'HYGT', name: 'Hooghly Ghat', nameBn: 'হুগলি ঘাট', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  // ─ NFR North Bengal ──────────────────────────────────────────────────────
  { code: 'RPAN', name: 'Rangapani', nameBn: 'রাঙ্গাপানি', zone: 'NFR', division: 'Katihar', district: 'Darjeeling' },
  { code: 'ALDE', name: 'Alipurduar Junction', nameBn: 'আলিপুরদুয়ার জংশন', zone: 'NFR', division: 'Alipurduar', district: 'Alipurduar' },
  { code: 'ALCT', name: 'Alipurduar Court', nameBn: 'আলিপুরদুয়ার কোর্ট', zone: 'NFR', division: 'Alipurduar', district: 'Alipurduar' },
  { code: 'COBH', name: 'Coochbehar', nameBn: 'কোচবিহার', zone: 'NFR', division: 'Alipurduar', district: 'Cooch Behar' },
  { code: 'MNGR', name: 'Maynaguri', nameBn: 'ময়নাগুড়ি', zone: 'NFR', division: 'Alipurduar', district: 'Jalpaiguri' },
  { code: 'JLPD', name: 'Jalpaiguri Road', nameBn: 'জলপাইগুড়ি রোড', zone: 'NFR', division: 'Alipurduar', district: 'Jalpaiguri' },
  { code: 'JPE', name: 'Jalpaiguri', nameBn: 'জলপাইগুড়ি', zone: 'NFR', division: 'Alipurduar', district: 'Jalpaiguri' },
  { code: 'MLJB', name: 'Malbazar', nameBn: 'মালবাজার', zone: 'NFR', division: 'Alipurduar', district: 'Jalpaiguri' },
  { code: 'CHLS', name: 'Chalsa', nameBn: 'চালসা', zone: 'NFR', division: 'Alipurduar', district: 'Jalpaiguri' },
  { code: 'MDRH', name: 'Madarihat', nameBn: 'মাদারিহাট', zone: 'NFR', division: 'Alipurduar', district: 'Alipurduar' },
  { code: 'BRPA', name: 'Birpara', nameBn: 'বীরপাড়া', zone: 'NFR', division: 'Alipurduar', district: 'Alipurduar' },
  { code: 'HSMR', name: 'Hasimara', nameBn: 'হাসিমারা', zone: 'NFR', division: 'Alipurduar', district: 'Alipurduar' },
  { code: 'BPSN', name: 'Barsoi', nameBn: 'বারসই', zone: 'NFR', division: 'Katihar', district: 'Uttar Dinajpur' },
  { code: 'ISLM', name: 'Islampur', nameBn: 'ইসলামপুর', zone: 'NFR', division: 'Katihar', district: 'Uttar Dinajpur' },
];

async function sync() {
  console.log('🔄 Syncing missing stations to Prisma SQLite...');
  let added = 0;
  let updated = 0;

  for (const st of EXTRA_STATIONS) {
    const existing = await prisma.station.findUnique({ where: { code: st.code } });
    if (!existing) {
      await prisma.station.create({
        data: {
          code: st.code,
          name: st.name,
          nameBn: st.nameBn,
          zone: st.zone,
          division: st.division,
          district: st.district
        }
      });
      added++;
    } else {
      // update name if better
      if (st.code === 'IPRA' && !existing.name.includes('Islampara')) {
        await prisma.station.update({
          where: { code: 'IPRA' },
          data: {
            name: 'Islampara (Hazi Md Mohsin Halt)',
            nameBn: 'ইসলামপাড়া (হাজী মোঃ মহসিন হল্ট)'
          }
        });
        updated++;
      }
    }
  }

  const total = await prisma.station.count();
  console.log(`✅ Synced! Added: ${added}, Updated: ${updated}, Total Stations in DB: ${total}`);
}

sync().finally(() => prisma.$disconnect());
