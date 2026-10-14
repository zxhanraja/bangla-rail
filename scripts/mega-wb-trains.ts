export interface TrainDef {
  num: string;
  name: string;
  type: string;
  orig: string;
  days: string;
  km: number;
  stops: [string, string | null, string | null, number, number][]; // [code, arr, dep, seq, halt]
}

export const MEGA_WB_TRAINS: TrainDef[] = [
  // =========================================================================
  // 1. KOLKATA METRO BLUE LINE (LINE 1: DAKSHINESWAR <-> KAVI SUBHASH)
  // =========================================================================
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
      ["M-BLG", "07:08", "07:09", 5, 1],
      ["M-SBN", "07:12", "07:13", 6, 1],
      ["M-SOB", "07:15", "07:16", 7, 1],
      ["M-GPR", "07:18", "07:19", 8, 1],
      ["M-MHT", "07:22", "07:23", 9, 1],
      ["M-CST", "07:25", "07:26", 10, 1],
      ["M-CDK", "07:28", "07:29", 11, 1],
      ["M-ESP", "07:31", "07:32", 12, 1],
      ["M-PKT", "07:35", "07:36", 13, 1],
      ["M-MDN", "07:38", "07:39", 14, 1],
      ["M-RBS", "07:41", "07:42", 15, 1],
      ["M-NBN", "07:44", "07:45", 16, 1],
      ["M-JDN", "07:47", "07:48", 17, 1],
      ["M-KGH", "07:50", "07:51", 18, 1],
      ["M-RNS", "07:54", "07:55", 19, 1],
      ["M-MNM", "07:58", "07:59", 20, 1],
      ["M-NSB", "08:02", "08:03", 21, 1],
      ["M-MAS", "08:05", "08:06", 22, 1],
      ["M-GNT", "08:08", "08:09", 23, 1],
      ["M-KRN", "08:12", "08:13", 24, 1],
      ["M-SSD", "08:16", "08:17", 25, 1],
      ["M-KVS", "08:22", null, 26, 0]
    ]
  },
  {
    num: "M-102",
    name: "Kavi Subhash - Dakshineswar Morning Metro",
    type: "Metro",
    orig: "M-KVS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-KVS", null, "06:50", 1, 0],
      ["M-SSD", "06:54", "06:55", 2, 1],
      ["M-KRN", "06:58", "06:59", 3, 1],
      ["M-GNT", "07:02", "07:03", 4, 1],
      ["M-MAS", "07:05", "07:06", 5, 1],
      ["M-NSB", "07:08", "07:09", 6, 1],
      ["M-MNM", "07:12", "07:13", 7, 1],
      ["M-RNS", "07:16", "07:17", 8, 1],
      ["M-KGH", "07:20", "07:21", 9, 1],
      ["M-JDN", "07:23", "07:24", 10, 1],
      ["M-NBN", "07:26", "07:27", 11, 1],
      ["M-RBS", "07:29", "07:30", 12, 1],
      ["M-MDN", "07:32", "07:33", 13, 1],
      ["M-PKT", "07:35", "07:36", 14, 1],
      ["M-ESP", "07:39", "07:40", 15, 1],
      ["M-CDK", "07:42", "07:43", 16, 1],
      ["M-CST", "07:45", "07:46", 17, 1],
      ["M-MHT", "07:48", "07:49", 18, 1],
      ["M-GPR", "07:52", "07:53", 19, 1],
      ["M-SOB", "07:55", "07:56", 20, 1],
      ["M-SBN", "07:58", "07:59", 21, 1],
      ["M-BLG", "08:02", "08:03", 22, 1],
      ["M-DDJ", "08:07", "08:08", 23, 1],
      ["M-NPR", "08:13", "08:14", 24, 1],
      ["M-BAR", "08:18", "08:19", 25, 1],
      ["M-DKS", "08:24", null, 26, 0]
    ]
  },
  {
    num: "M-103",
    name: "Dakshineswar - Kavi Subhash Peak Rush Metro",
    type: "Metro",
    orig: "M-DKS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-DKS", null, "08:45", 1, 0],
      ["M-BAR", "08:48", "08:49", 2, 1],
      ["M-NPR", "08:53", "08:54", 3, 1],
      ["M-DDJ", "08:59", "09:00", 4, 1],
      ["M-SBN", "09:06", "09:07", 5, 1],
      ["M-GPR", "09:12", "09:13", 6, 1],
      ["M-CST", "09:18", "09:19", 7, 1],
      ["M-ESP", "09:23", "09:24", 8, 1],
      ["M-PKT", "09:27", "09:28", 9, 1],
      ["M-RBS", "09:32", "09:33", 10, 1],
      ["M-KGH", "09:39", "09:40", 11, 1],
      ["M-MNM", "09:47", "09:48", 12, 1],
      ["M-GNT", "09:54", "09:55", 13, 1],
      ["M-KRN", "09:58", "09:59", 14, 1],
      ["M-KVS", "10:08", null, 15, 0]
    ]
  },
  {
    num: "M-104",
    name: "Kavi Subhash - Dakshineswar Peak Rush Metro",
    type: "Metro",
    orig: "M-KVS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-KVS", null, "08:50", 1, 0],
      ["M-KRN", "08:58", "08:59", 2, 1],
      ["M-GNT", "09:02", "09:03", 3, 1],
      ["M-MNM", "09:10", "09:11", 4, 1],
      ["M-KGH", "09:18", "09:19", 5, 1],
      ["M-RBS", "09:25", "09:26", 6, 1],
      ["M-PKT", "09:30", "09:31", 7, 1],
      ["M-ESP", "09:35", "09:36", 8, 1],
      ["M-CST", "09:40", "09:41", 9, 1],
      ["M-GPR", "09:46", "09:47", 10, 1],
      ["M-SBN", "09:52", "09:53", 11, 1],
      ["M-DDJ", "10:00", "10:01", 12, 1],
      ["M-NPR", "10:06", "10:07", 13, 1],
      ["M-BAR", "10:11", "10:12", 14, 1],
      ["M-DKS", "10:16", null, 15, 0]
    ]
  },
  {
    num: "M-107",
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
  {
    num: "M-108",
    name: "Kavi Subhash - Dakshineswar Evening Metro",
    type: "Metro",
    orig: "M-KVS",
    days: "Daily",
    km: 32,
    stops: [
      ["M-KVS", null, "17:50", 1, 0],
      ["M-MNM", "18:10", "18:11", 2, 1],
      ["M-KGH", "18:18", "18:19", 3, 1],
      ["M-PKT", "18:30", "18:31", 4, 1],
      ["M-ESP", "18:35", "18:36", 5, 1],
      ["M-SBN", "18:50", "18:51", 6, 1],
      ["M-DDJ", "18:58", "18:59", 7, 1],
      ["M-NPR", "19:04", "19:05", 8, 1],
      ["M-DKS", "19:14", null, 9, 0]
    ]
  },

  // =========================================================================
  // 2. KOLKATA METRO GREEN LINE (LINE 2: UNDERWATER METRO)
  // =========================================================================
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
  {
    num: "M-207",
    name: "Howrah Maidan - Esplanade Riverbed Shuttle",
    type: "Metro",
    orig: "M-HMD",
    days: "Daily",
    km: 5,
    stops: [
      ["M-HMD", null, "08:30", 1, 0],
      ["M-HWH", "08:33", "08:34", 2, 1],
      ["M-MHTG", "08:38", "08:39", 3, 1],
      ["M-ESP", "08:44", null, 4, 0]
    ]
  },
  {
    num: "M-208",
    name: "Esplanade - Howrah Maidan Riverbed Shuttle",
    type: "Metro",
    orig: "M-ESP",
    days: "Daily",
    km: 5,
    stops: [
      ["M-ESP", null, "08:50", 1, 0],
      ["M-MHTG", "08:54", "08:55", 2, 1],
      ["M-HWH", "08:59", "09:00", 3, 1],
      ["M-HMD", "09:04", null, 4, 0]
    ]
  },

  // =========================================================================
  // 3. KOLKATA METRO LINE 3: PURPLE LINE (JOKA <-> MAJERHAT)
  // =========================================================================
  {
    num: "M-301",
    name: "Joka - Majerhat Morning Metro",
    type: "Metro",
    orig: "M-JOK",
    days: "Mon-Sat",
    km: 8,
    stops: [
      ["M-JOK", null, "08:30", 1, 0],
      ["M-TKP", "08:33", "08:34", 2, 1],
      ["M-SKB", "08:37", "08:38", 3, 1],
      ["M-BCR", "08:41", "08:42", 4, 1],
      ["M-BBZ", "08:45", "08:46", 5, 1],
      ["M-TRT", "08:49", "08:50", 6, 1],
      ["M-MJT", "08:55", null, 7, 0]
    ]
  },
  {
    num: "M-302",
    name: "Majerhat - Joka Morning Metro",
    type: "Metro",
    orig: "M-MJT",
    days: "Mon-Sat",
    km: 8,
    stops: [
      ["M-MJT", null, "09:10", 1, 0],
      ["M-TRT", "09:14", "09:15", 2, 1],
      ["M-BBZ", "09:18", "09:19", 3, 1],
      ["M-BCR", "09:22", "09:23", 4, 1],
      ["M-SKB", "09:26", "09:27", 5, 1],
      ["M-TKP", "09:30", "09:31", 6, 1],
      ["M-JOK", "09:35", null, 7, 0]
    ]
  },
  {
    num: "M-305",
    name: "Joka - Majerhat Evening Metro",
    type: "Metro",
    orig: "M-JOK",
    days: "Mon-Sat",
    km: 8,
    stops: [
      ["M-JOK", null, "17:30", 1, 0],
      ["M-TKP", "17:33", "17:34", 2, 1],
      ["M-SKB", "17:37", "17:38", 3, 1],
      ["M-BCR", "17:41", "17:42", 4, 1],
      ["M-BBZ", "17:45", "17:46", 5, 1],
      ["M-TRT", "17:49", "17:50", 6, 1],
      ["M-MJT", "17:55", null, 7, 0]
    ]
  },

  // =========================================================================
  // 4. KOLKATA METRO LINE 6: ORANGE LINE (KAVI SUBHASH <-> RUBY HEMANTA MUKHOPADHYAY)
  // =========================================================================
  {
    num: "M-601",
    name: "Kavi Subhash - Hemanta Mukhopadhyay Morning Metro",
    type: "Metro",
    orig: "M-KVS",
    days: "Mon-Fri",
    km: 6,
    stops: [
      ["M-KVS", null, "09:00", 1, 0],
      ["M-SJR", "09:03", "09:04", 2, 1],
      ["M-JTN", "09:07", "09:08", 3, 1],
      ["M-KSK", "09:11", "09:12", 4, 1],
      ["M-HMK", "09:16", null, 5, 0]
    ]
  },
  {
    num: "M-602",
    name: "Hemanta Mukhopadhyay - Kavi Subhash Morning Metro",
    type: "Metro",
    orig: "M-HMK",
    days: "Mon-Fri",
    km: 6,
    stops: [
      ["M-HMK", null, "09:25", 1, 0],
      ["M-KSK", "09:28", "09:29", 2, 1],
      ["M-JTN", "09:32", "09:33", 3, 1],
      ["M-SJR", "09:36", "09:37", 4, 1],
      ["M-KVS", "09:41", null, 5, 0]
    ]
  },
  {
    num: "M-605",
    name: "Kavi Subhash - Hemanta Mukhopadhyay Evening Metro",
    type: "Metro",
    orig: "M-KVS",
    days: "Mon-Fri",
    km: 6,
    stops: [
      ["M-KVS", null, "18:00", 1, 0],
      ["M-SJR", "18:03", "18:04", 2, 1],
      ["M-JTN", "18:07", "18:08", 3, 1],
      ["M-KSK", "18:11", "18:12", 4, 1],
      ["M-HMK", "18:16", null, 5, 0]
    ]
  },

  // =========================================================================
  // 5. ALL VANDE BHARAT EXPRESSES IN WEST BENGAL
  // =========================================================================
  {
    num: "22301",
    name: "Howrah - New Jalpaiguri Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Wed",
    km: 565,
    stops: [
      ["HWH", null, "05:55", 1, 0],
      ["BHP", "07:37", "07:39", 2, 2],
      ["MLDT", "10:30", "10:35", 3, 5],
      ["BOE", "11:38", "11:40", 4, 2],
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
      ["MLDT", "17:50", "17:55", 3, 5],
      ["BHP", "20:52", "20:54", 4, 2],
      ["HWH", "22:35", null, 5, 0]
    ]
  },
  {
    num: "22309",
    name: "Sealdah - New Jalpaiguri Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "SDAH",
    days: "Daily Except Thu",
    km: 570,
    stops: [
      ["SDAH", null, "05:35", 1, 0],
      ["BHP", "07:28", "07:30", 2, 2],
      ["MLDT", "10:20", "10:25", 3, 5],
      ["KNE", "11:50", "11:52", 4, 2],
      ["NJP", "13:15", null, 5, 0]
    ]
  },
  {
    num: "22310",
    name: "New Jalpaiguri - Sealdah Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "NJP",
    days: "Daily Except Thu",
    km: 570,
    stops: [
      ["NJP", null, "15:00", 1, 0],
      ["KNE", "16:08", "16:10", 2, 2],
      ["MLDT", "17:45", "17:50", 3, 5],
      ["BHP", "20:45", "20:47", 4, 2],
      ["SDAH", "22:40", null, 5, 0]
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
    num: "22347",
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
  {
    num: "22348",
    name: "Patna - Howrah Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "CRAE",
    days: "Daily Except Wed",
    km: 535,
    stops: [
      ["CRAE", "11:58", "12:00", 1, 2],
      ["ASN", "12:20", "12:22", 2, 2],
      ["DGP", "12:50", "12:52", 3, 2],
      ["BWN", "13:34", "13:36", 4, 2],
      ["HWH", "14:35", null, 5, 0]
    ]
  },
  {
    num: "20897",
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
    num: "20898",
    name: "Ranchi - Howrah Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "ASN",
    days: "Daily Except Tue",
    km: 463,
    stops: [
      ["ASN", "08:20", "08:22", 1, 2],
      ["DGP", "08:48", "08:50", 2, 2],
      ["BWN", "09:35", "09:37", 3, 2],
      ["KQU", "10:14", "10:15", 4, 1],
      ["HWH", "10:50", null, 5, 0]
    ]
  },
  {
    num: "22227",
    name: "New Jalpaiguri - Guwahati Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "NJP",
    days: "Daily Except Tue",
    km: 407,
    stops: [
      ["NJP", null, "06:10", 1, 0],
      ["NCB", "07:35", "07:37", 2, 2],
      ["NOQ", "07:58", "08:00", 3, 2]
    ]
  },
  {
    num: "22228",
    name: "Guwahati - New Jalpaiguri Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "NOQ",
    days: "Daily Except Tue",
    km: 407,
    stops: [
      ["NOQ", "19:58", "20:00", 1, 2],
      ["NCB", "20:20", "20:22", 2, 2],
      ["NJP", "22:00", null, 3, 0]
    ]
  },
  {
    num: "20835",
    name: "Howrah - Rourkela Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Tue",
    km: 413,
    stops: [
      ["HWH", null, "06:00", 1, 0],
      ["KGP", "07:22", "07:24", 2, 2],
      ["JGM", "07:52", "07:54", 3, 2]
    ]
  },
  {
    num: "20836",
    name: "Rourkela - Howrah Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "JGM",
    days: "Daily Except Tue",
    km: 413,
    stops: [
      ["JGM", "18:25", "18:27", 1, 2],
      ["KGP", "18:55", "18:57", 2, 2],
      ["HWH", "20:15", null, 3, 0]
    ]
  },
  {
    num: "22305",
    name: "Howrah - Bhagalpur Vande Bharat Express",
    type: "Vande Bharat Express",
    orig: "HWH",
    days: "Daily Except Fri",
    km: 388,
    stops: [
      ["HWH", null, "07:45", 1, 0],
      ["BHP", "09:28", "09:30", 2, 2],
      ["RPH", "10:15", "10:17", 3, 2]
    ]
  },

  // =========================================================================
  // 6. HOWRAH - BANDEL & BARDHAMAN SUBURBAN LOCALS (CRITICAL: STOPS AT ADISAPTAGRAM)
  // =========================================================================
  {
    num: "37211",
    name: "Howrah - Bandel Local (First Morning)",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "04:45", 1, 0],
      ["LLH", "04:53", "04:54", 2, 1],
      ["BEQ", "04:56", "04:57", 3, 1],
      ["BLY", "04:59", "05:00", 4, 1],
      ["UPA", "05:02", "05:03", 5, 1],
      ["HM", "05:05", "05:06", 6, 1],
      ["KON", "05:08", "05:09", 7, 1],
      ["RIS", "05:12", "05:13", 8, 1],
      ["SRP", "05:16", "05:17", 9, 1],
      ["SHE", "05:21", "05:22", 10, 1],
      ["BBAE", "05:24", "05:25", 11, 1],
      ["BHR", "05:28", "05:29", 12, 1],
      ["MUU", "05:31", "05:32", 13, 1],
      ["CHN", "05:34", "05:35", 14, 1],
      ["CHT", "05:38", "05:39", 15, 1],
      ["HRAE", "05:41", "05:42", 16, 1],
      ["BDC", "05:52", null, 17, 0]
    ]
  },
  {
    num: "37213",
    name: "Howrah - Bandel Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "05:15", 1, 0],
      ["LLH", "05:23", "05:24", 2, 1],
      ["BEQ", "05:26", "05:27", 3, 1],
      ["BLY", "05:29", "05:30", 4, 1],
      ["UPA", "05:32", "05:33", 5, 1],
      ["HM", "05:35", "05:36", 6, 1],
      ["KON", "05:38", "05:39", 7, 1],
      ["RIS", "05:42", "05:43", 8, 1],
      ["SRP", "05:46", "05:47", 9, 1],
      ["SHE", "05:51", "05:52", 10, 1],
      ["BBAE", "05:54", "05:55", 11, 1],
      ["BHR", "05:58", "05:59", 12, 1],
      ["MUU", "06:01", "06:02", 13, 1],
      ["CHN", "06:04", "06:05", 14, 1],
      ["CHT", "06:08", "06:09", 15, 1],
      ["HRAE", "06:11", "06:12", 16, 1],
      ["BDC", "06:22", null, 17, 0]
    ]
  },
  {
    num: "37217",
    name: "Howrah - Bandel Morning Peak Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "08:10", 1, 0],
      ["LLH", "08:18", "08:19", 2, 1],
      ["BEQ", "08:21", "08:22", 3, 1],
      ["BLY", "08:24", "08:25", 4, 1],
      ["UPA", "08:27", "08:28", 5, 1],
      ["HM", "08:30", "08:31", 6, 1],
      ["KON", "08:33", "08:34", 7, 1],
      ["RIS", "08:37", "08:38", 8, 1],
      ["SRP", "08:41", "08:42", 9, 1],
      ["SHE", "08:46", "08:47", 10, 1],
      ["BBAE", "08:49", "08:50", 11, 1],
      ["BHR", "08:53", "08:54", 12, 1],
      ["MUU", "08:56", "08:57", 13, 1],
      ["CHN", "08:59", "09:00", 14, 1],
      ["CHT", "09:03", "09:04", 15, 1],
      ["HRAE", "09:06", "09:07", 16, 1],
      ["BDC", "09:18", null, 17, 0]
    ]
  },
  {
    num: "37225",
    name: "Howrah - Bandel Midday Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "12:15", 1, 0],
      ["BLY", "12:28", "12:29", 2, 1],
      ["SRP", "12:40", "12:41", 3, 1],
      ["SHE", "12:46", "12:47", 4, 1],
      ["CHN", "12:56", "12:57", 5, 1],
      ["CHT", "13:01", "13:02", 6, 1],
      ["BDC", "13:15", null, 7, 0]
    ]
  },
  {
    num: "37255",
    name: "Howrah - Bandel Evening Commuter Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "18:05", 1, 0],
      ["LLH", "18:13", "18:14", 2, 1],
      ["BEQ", "18:16", "18:17", 3, 1],
      ["BLY", "18:19", "18:20", 4, 1],
      ["UPA", "18:22", "18:23", 5, 1],
      ["HM", "18:25", "18:26", 6, 1],
      ["KON", "18:28", "18:29", 7, 1],
      ["RIS", "18:32", "18:33", 8, 1],
      ["SRP", "18:36", "18:37", 9, 1],
      ["SHE", "18:41", "18:42", 10, 1],
      ["BBAE", "18:44", "18:45", 11, 1],
      ["BHR", "18:48", "18:49", 12, 1],
      ["MUU", "18:51", "18:52", 13, 1],
      ["CHN", "18:54", "18:55", 14, 1],
      ["CHT", "18:58", "18:59", 15, 1],
      ["HRAE", "19:01", "19:02", 16, 1],
      ["BDC", "19:15", null, 17, 0]
    ]
  },
  {
    num: "37285",
    name: "Howrah - Bandel Night Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 40,
    stops: [
      ["HWH", null, "22:45", 1, 0],
      ["BLY", "22:58", "22:59", 2, 1],
      ["SRP", "23:10", "23:11", 3, 1],
      ["SHE", "23:16", "23:17", 4, 1],
      ["CHN", "23:25", "23:26", 5, 1],
      ["BDC", "23:45", null, 6, 0]
    ]
  },

  // --- HOWRAH - BARDDHAMAN MAIN LOCALS (STOPPING AT ADISAPTAGRAM ADST) ---
  {
    num: "37811",
    name: "Howrah - Barddhaman Main Early Morning Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "04:15", 1, 0],
      ["LLH", "04:23", "04:24", 2, 1],
      ["BEQ", "04:26", "04:27", 3, 1],
      ["BLY", "04:29", "04:30", 4, 1],
      ["UPA", "04:32", "04:33", 5, 1],
      ["HM", "04:35", "04:36", 6, 1],
      ["KON", "04:38", "04:39", 7, 1],
      ["RIS", "04:42", "04:43", 8, 1],
      ["SRP", "04:46", "04:47", 9, 1],
      ["SHE", "04:51", "04:52", 10, 1],
      ["BBAE", "04:54", "04:55", 11, 1],
      ["BHR", "04:58", "04:59", 12, 1],
      ["MUU", "05:01", "05:02", 13, 1],
      ["CHN", "05:04", "05:05", 14, 1],
      ["CHT", "05:08", "05:09", 15, 1],
      ["HRAE", "05:11", "05:12", 16, 1],
      ["BDC", "05:22", "05:24", 17, 2],
      ["ADST", "05:28", "05:29", 18, 1], // ADISAPTAGRAM HALT!
      ["MGM", "05:32", "05:33", 19, 1],
      ["TLO", "05:37", "05:38", 20, 1],
      ["KNY", "05:42", "05:43", 21, 1],
      ["PDA", "05:47", "05:48", 22, 1],
      ["SLG", "05:52", "05:53", 23, 1],
      ["BCGM", "05:56", "05:57", 24, 1],
      ["BNCX", "06:00", "06:01", 25, 1],
      ["DBP", "06:05", "06:06", 26, 1],
      ["BGF", "06:09", "06:10", 27, 1],
      ["MSAE", "06:14", "06:15", 28, 1],
      ["NMF", "06:18", "06:19", 29, 1],
      ["RSLP", "06:22", "06:23", 30, 1],
      ["PLAE", "06:27", "06:28", 31, 1],
      ["SKG", "06:33", "06:34", 32, 1],
      ["GRP", "06:38", "06:39", 33, 1],
      ["BWN", "06:50", null, 34, 0]
    ]
  },
  {
    num: "37813",
    name: "Howrah - Barddhaman Main Morning Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "06:15", 1, 0],
      ["BLY", "06:28", "06:29", 2, 1],
      ["SRP", "06:40", "06:41", 3, 1],
      ["SHE", "06:46", "06:47", 4, 1],
      ["CHN", "06:56", "06:57", 5, 1],
      ["CHT", "07:01", "07:02", 6, 1],
      ["BDC", "07:15", "07:17", 7, 2],
      ["ADST", "07:21", "07:22", 8, 1], // ADISAPTAGRAM HALT!
      ["MGM", "07:25", "07:26", 9, 1],
      ["PDA", "07:38", "07:39", 10, 1],
      ["BNCX", "07:50", "07:51", 11, 1],
      ["MSAE", "08:02", "08:03", 12, 1],
      ["BWN", "08:35", null, 13, 0]
    ]
  },
  {
    num: "37817",
    name: "Howrah - Barddhaman Main Rush Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "08:35", 1, 0],
      ["BLY", "08:48", "08:49", 2, 1],
      ["SRP", "09:00", "09:01", 3, 1],
      ["SHE", "09:06", "09:07", 4, 1],
      ["BDC", "09:28", "09:30", 5, 2],
      ["ADST", "09:34", "09:35", 6, 1], // ADISAPTAGRAM!
      ["MGM", "09:38", "09:39", 7, 1],
      ["KNY", "09:47", "09:48", 8, 1],
      ["PDA", "09:53", "09:54", 9, 1],
      ["BNCX", "10:04", "10:05", 10, 1],
      ["MSAE", "10:17", "10:18", 11, 1],
      ["BWN", "10:50", null, 12, 0]
    ]
  },
  {
    num: "37825",
    name: "Howrah - Barddhaman Main Afternoon Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "13:20", 1, 0],
      ["SHE", "13:48", "13:49", 2, 1],
      ["BDC", "14:10", "14:12", 3, 2],
      ["ADST", "14:16", "14:17", 4, 1], // ADISAPTAGRAM!
      ["MGM", "14:20", "14:21", 5, 1],
      ["PDA", "14:34", "14:35", 6, 1],
      ["BNCX", "14:46", "14:47", 7, 1],
      ["MSAE", "14:58", "14:59", 8, 1],
      ["BWN", "15:30", null, 9, 0]
    ]
  },
  {
    num: "37837",
    name: "Howrah - Barddhaman Main Evening Peak Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "17:40", 1, 0],
      ["BLY", "17:53", "17:54", 2, 1],
      ["SRP", "18:05", "18:06", 3, 1],
      ["SHE", "18:11", "18:12", 4, 1],
      ["BDC", "18:32", "18:34", 5, 2],
      ["ADST", "18:38", "18:39", 6, 1], // ADISAPTAGRAM!
      ["MGM", "18:42", "18:43", 7, 1],
      ["PDA", "18:55", "18:56", 8, 1],
      ["BNCX", "19:07", "19:08", 9, 1],
      ["MSAE", "19:20", "19:21", 10, 1],
      ["BWN", "19:55", null, 11, 0]
    ]
  },
  {
    num: "37845",
    name: "Howrah - Barddhaman Main Night Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 107,
    stops: [
      ["HWH", null, "20:55", 1, 0],
      ["SHE", "21:22", "21:23", 2, 1],
      ["BDC", "21:44", "21:46", 3, 2],
      ["ADST", "21:50", "21:51", 4, 1], // ADISAPTAGRAM!
      ["MGM", "21:54", "21:55", 5, 1],
      ["PDA", "22:07", "22:08", 6, 1],
      ["BNCX", "22:19", "22:20", 7, 1],
      ["MSAE", "22:31", "22:32", 8, 1],
      ["BWN", "23:05", null, 9, 0]
    ]
  },

  // --- DOWN TRAINS: BARDDHAMAN & BANDEL TO HOWRAH (STOPPING AT ADISAPTAGRAM) ---
  {
    num: "37812",
    name: "Barddhaman - Howrah Main Morning Commuter Local",
    type: "EMU Local",
    orig: "BWN",
    days: "Daily",
    km: 107,
    stops: [
      ["BWN", null, "05:00", 1, 0],
      ["GRP", "05:07", "05:08", 2, 1],
      ["SKG", "05:13", "05:14", 3, 1],
      ["PLAE", "05:19", "05:20", 4, 1],
      ["RSLP", "05:24", "05:25", 5, 1],
      ["NMF", "05:28", "05:29", 6, 1],
      ["MSAE", "05:32", "05:33", 7, 1],
      ["BGF", "05:36", "05:37", 8, 1],
      ["DBP", "05:40", "05:41", 9, 1],
      ["BNCX", "05:45", "05:46", 10, 1],
      ["BCGM", "05:49", "05:50", 11, 1],
      ["SLG", "05:53", "05:54", 12, 1],
      ["PDA", "05:58", "05:59", 13, 1],
      ["KNY", "06:03", "06:04", 14, 1],
      ["TLO", "06:08", "06:09", 15, 1],
      ["MGM", "06:13", "06:14", 16, 1],
      ["ADST", "06:17", "06:18", 17, 1], // ADISAPTAGRAM TO HOWRAH!
      ["BDC", "06:27", "06:29", 18, 2],
      ["HRAE", "06:33", "06:34", 19, 1],
      ["CHT", "06:36", "06:37", 20, 1],
      ["CHN", "06:40", "06:41", 21, 1],
      ["MUU", "06:44", "06:45", 22, 1],
      ["BHR", "06:47", "06:48", 23, 1],
      ["BBAE", "06:51", "06:52", 24, 1],
      ["SHE", "06:55", "06:56", 25, 1],
      ["SRP", "06:59", "07:00", 26, 1],
      ["RIS", "07:04", "07:05", 27, 1],
      ["KON", "07:08", "07:09", 28, 1],
      ["HM", "07:11", "07:12", 29, 1],
      ["UPA", "07:14", "07:15", 30, 1],
      ["BLY", "07:18", "07:19", 31, 1],
      ["BEQ", "07:22", "07:23", 32, 1],
      ["LLH", "07:26", "07:27", 33, 1],
      ["HWH", "07:45", null, 34, 0]
    ]
  },
  {
    num: "37818",
    name: "Barddhaman - Howrah Morning Fast Local",
    type: "Fast Local",
    orig: "BWN",
    days: "Daily",
    km: 107,
    stops: [
      ["BWN", null, "07:40", 1, 0],
      ["MSAE", "08:05", "08:06", 2, 1],
      ["BNCX", "08:18", "08:19", 3, 1],
      ["PDA", "08:30", "08:31", 4, 1],
      ["MGM", "08:44", "08:45", 5, 1],
      ["ADST", "08:48", "08:49", 6, 1], // ADISAPTAGRAM!
      ["BDC", "08:58", "09:00", 7, 2],
      ["CHN", "09:09", "09:10", 8, 1],
      ["SHE", "09:18", "09:19", 9, 1],
      ["SRP", "09:23", "09:24", 10, 1],
      ["HWH", "09:55", null, 11, 0]
    ]
  },
  {
    num: "37826",
    name: "Barddhaman - Howrah Main Afternoon Local",
    type: "EMU Local",
    orig: "BWN",
    days: "Daily",
    km: 107,
    stops: [
      ["BWN", null, "12:00", 1, 0],
      ["MSAE", "12:28", "12:29", 2, 1],
      ["BNCX", "12:41", "12:42", 3, 1],
      ["PDA", "12:54", "12:55", 4, 1],
      ["MGM", "13:08", "13:09", 5, 1],
      ["ADST", "13:12", "13:13", 6, 1], // ADISAPTAGRAM!
      ["BDC", "13:22", "13:24", 7, 2],
      ["SHE", "13:42", "13:43", 8, 1],
      ["HWH", "14:15", null, 9, 0]
    ]
  },
  {
    num: "37838",
    name: "Barddhaman - Howrah Main Evening Local",
    type: "EMU Local",
    orig: "BWN",
    days: "Daily",
    km: 107,
    stops: [
      ["BWN", null, "17:15", 1, 0],
      ["MSAE", "17:42", "17:43", 2, 1],
      ["BNCX", "17:55", "17:56", 3, 1],
      ["PDA", "18:07", "18:08", 4, 1],
      ["ADST", "18:24", "18:25", 5, 1], // ADISAPTAGRAM!
      ["BDC", "18:34", "18:36", 6, 2],
      ["SHE", "18:52", "18:53", 7, 1],
      ["HWH", "19:30", null, 8, 0]
    ]
  },
  {
    num: "37846",
    name: "Barddhaman - Howrah Main Night Local",
    type: "EMU Local",
    orig: "BWN",
    days: "Daily",
    km: 107,
    stops: [
      ["BWN", null, "20:30", 1, 0],
      ["MSAE", "20:56", "20:57", 2, 1],
      ["BNCX", "21:09", "21:10", 3, 1],
      ["PDA", "21:20", "21:21", 4, 1],
      ["ADST", "21:36", "21:37", 5, 1], // ADISAPTAGRAM!
      ["BDC", "21:46", "21:48", 6, 2],
      ["SHE", "22:04", "22:05", 7, 1],
      ["HWH", "22:40", null, 8, 0]
    ]
  },

  // =========================================================================
  // 7. HOWRAH - BARDDHAMAN CHORD LOCALS (VIA DANKUNI & KAMARKUNDU)
  // =========================================================================
  {
    num: "36811",
    name: "Howrah - Barddhaman Chord Morning Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 95,
    stops: [
      ["HWH", null, "04:30", 1, 0],
      ["BLYG", "04:42", "04:43", 2, 1],
      ["DBAE", "04:50", "04:51", 3, 1],
      ["GBRA", "04:54", "04:55", 4, 1],
      ["JOX", "04:57", "04:58", 5, 1],
      ["BPAE", "05:00", "05:01", 6, 1],
      ["BRPA", "05:04", "05:05", 7, 1],
      ["KQU", "05:14", "05:15", 8, 1],
      ["CDAE", "05:22", "05:23", 9, 1],
      ["BMAE", "05:30", "05:31", 10, 1],
      ["GRAE", "05:42", "05:43", 11, 1],
      ["JRAE", "05:52", "05:53", 12, 1],
      ["MSAG", "06:01", "06:02", 13, 1],
      ["SKG", "06:14", "06:15", 14, 1],
      ["BWN", "06:30", null, 15, 0]
    ]
  },
  {
    num: "36821",
    name: "Howrah - Barddhaman Chord Peak Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 95,
    stops: [
      ["HWH", null, "09:20", 1, 0],
      ["DBAE", "09:40", "09:41", 2, 1],
      ["KQU", "09:59", "10:00", 3, 1],
      ["CDAE", "10:08", "10:09", 4, 1],
      ["GRAE", "10:24", "10:25", 5, 1],
      ["MSAG", "10:41", "10:42", 6, 1],
      ["BWN", "11:05", null, 7, 0]
    ]
  },
  {
    num: "36841",
    name: "Howrah - Barddhaman Chord Evening Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 95,
    stops: [
      ["HWH", null, "18:25", 1, 0],
      ["DBAE", "18:45", "18:46", 2, 1],
      ["KQU", "19:05", "19:06", 3, 1],
      ["CDAE", "19:14", "19:15", 4, 1],
      ["GRAE", "19:30", "19:31", 5, 1],
      ["MSAG", "19:47", "19:48", 6, 1],
      ["BWN", "20:15", null, 7, 0]
    ]
  },
  {
    num: "36812",
    name: "Barddhaman - Howrah Chord Morning Commuter",
    type: "EMU Local",
    orig: "BWN",
    days: "Daily",
    km: 95,
    stops: [
      ["BWN", null, "06:00", 1, 0],
      ["MSAG", "06:20", "06:21", 2, 1],
      ["GRAE", "06:36", "06:37", 3, 1],
      ["CDAE", "06:51", "06:52", 4, 1],
      ["KQU", "07:01", "07:02", 5, 1],
      ["DBAE", "07:22", "07:23", 6, 1],
      ["HWH", "07:50", null, 7, 0]
    ]
  },

  // =========================================================================
  // 8. HOWRAH - TARAKESWAR & ARAMBAGH LOCALS
  // =========================================================================
  {
    num: "37311",
    name: "Howrah - Tarakeswar Morning Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 58,
    stops: [
      ["HWH", null, "05:55", 1, 0],
      ["SHE", "06:26", "06:28", 2, 2],
      ["DEA", "06:34", "06:35", 3, 1],
      ["SIU", "06:41", "06:42", 4, 1],
      ["KQU", "06:48", "06:49", 5, 1],
      ["NLK", "06:54", "06:55", 6, 1],
      ["HPL", "07:01", "07:02", 7, 1],
      ["LOK", "07:14", "07:15", 8, 1],
      ["TAK", "07:25", null, 9, 0]
    ]
  },
  {
    num: "37319",
    name: "Howrah - Tarakeswar Peak Rush Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 58,
    stops: [
      ["HWH", null, "10:20", 1, 0],
      ["SHE", "10:50", "10:52", 2, 2],
      ["SIU", "11:04", "11:05", 3, 1],
      ["KQU", "11:11", "11:12", 4, 1],
      ["HPL", "11:24", "11:25", 5, 1],
      ["TAK", "11:45", null, 6, 0]
    ]
  },
  {
    num: "37351",
    name: "Howrah - Arambagh Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 82,
    stops: [
      ["HWH", null, "12:35", 1, 0],
      ["SHE", "13:06", "13:08", 2, 2],
      ["SIU", "13:20", "13:21", 3, 1],
      ["KQU", "13:27", "13:28", 4, 1],
      ["HPL", "13:40", "13:41", 5, 1],
      ["TAK", "14:02", "14:04", 6, 2],
      ["MYPR", "14:24", "14:25", 7, 1],
      ["AMBG", "14:40", null, 8, 0]
    ]
  },

  // =========================================================================
  // 9. BANDEL - KATWA LOCALS
  // =========================================================================
  {
    num: "37741",
    name: "Bandel - Katwa Morning Local",
    type: "EMU Local",
    orig: "BDC",
    days: "Daily",
    km: 104,
    stops: [
      ["BDC", null, "04:45", 1, 0],
      ["BSAE", "04:52", "04:53", 2, 1],
      ["TBAE", "04:57", "04:58", 3, 1],
      ["KJU", "05:02", "05:03", 4, 1],
      ["DMLE", "05:07", "05:08", 5, 1],
      ["SOAE", "05:16", "05:17", 6, 1],
      ["BGAE", "05:22", "05:23", 7, 1],
      ["JIT", "05:28", "05:29", 8, 1],
      ["GPAE", "05:35", "05:36", 9, 1],
      ["ABKA", "05:44", "05:45", 10, 1],
      ["BGRA", "05:50", "05:51", 11, 1],
      ["DTAE", "05:56", "05:57", 12, 1],
      ["SMAE", "06:04", "06:05", 13, 1],
      ["NDAE", "06:17", "06:18", 14, 1],
      ["PSAE", "06:33", "06:34", 15, 1],
      ["PTAE", "06:48", "06:49", 16, 1],
      ["DHAE", "07:05", "07:06", 17, 1],
      ["KWAE", "07:25", null, 18, 0]
    ]
  },
  {
    num: "37747",
    name: "Bandel - Katwa Afternoon Local",
    type: "EMU Local",
    orig: "BDC",
    days: "Daily",
    km: 104,
    stops: [
      ["BDC", null, "13:30", 1, 0],
      ["TBAE", "13:42", "13:43", 2, 1],
      ["JIT", "14:05", "14:06", 3, 1],
      ["ABKA", "14:20", "14:21", 4, 1],
      ["NDAE", "14:50", "14:52", 5, 2],
      ["PSAE", "15:06", "15:07", 6, 1],
      ["KWAE", "15:45", null, 7, 0]
    ]
  },

  // =========================================================================
  // 10. BARDDHAMAN - ASANSOL MEMU SERVICES
  // =========================================================================
  {
    num: "63505",
    name: "Barddhaman - Asansol Morning MEMU",
    type: "MEMU",
    orig: "BWN",
    days: "Daily",
    km: 106,
    stops: [
      ["BWN", null, "04:10", 1, 0],
      ["GKH", "04:26", "04:27", 2, 1],
      ["MNAE", "04:39", "04:40", 3, 1],
      ["PDAE", "04:52", "04:53", 4, 1],
      ["DGP", "05:07", "05:09", 5, 2],
      ["OYR", "05:18", "05:19", 6, 1],
      ["UDL", "05:27", "05:28", 7, 1],
      ["RNG", "05:37", "05:38", 8, 1],
      ["KPK", "05:49", "05:50", 9, 1],
      ["ASN", "06:10", null, 10, 0]
    ]
  },
  {
    num: "63513",
    name: "Barddhaman - Asansol Afternoon MEMU",
    type: "MEMU",
    orig: "BWN",
    days: "Daily",
    km: 106,
    stops: [
      ["BWN", null, "14:15", 1, 0],
      ["PDAE", "14:50", "14:51", 2, 1],
      ["DGP", "15:05", "15:07", 3, 2],
      ["UDL", "15:23", "15:24", 4, 1],
      ["RNG", "15:33", "15:34", 5, 1],
      ["ASN", "16:05", null, 6, 0]
    ]
  },
  {
    num: "63510",
    name: "Asansol - Barddhaman Morning MEMU",
    type: "MEMU",
    orig: "ASN",
    days: "Daily",
    km: 106,
    stops: [
      ["ASN", null, "07:20", 1, 0],
      ["RNG", "07:38", "07:39", 2, 1],
      ["UDL", "07:49", "07:50", 3, 1],
      ["DGP", "08:04", "08:06", 4, 2],
      ["PDAE", "08:21", "08:22", 5, 1],
      ["MNAE", "08:34", "08:35", 6, 1],
      ["BWN", "09:15", null, 7, 0]
    ]
  },

  // =========================================================================
  // 11. SEALDAH - NAIHATI - RANAGHAT - KRISHNANAGAR - SHANTIPUR - GEDE
  // =========================================================================
  {
    num: "31411",
    name: "Sealdah - Naihati Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 38,
    stops: [
      ["SDAH", null, "05:05", 1, 0],
      ["BNR", "05:12", "05:13", 2, 1],
      ["DDJ", "05:19", "05:20", 3, 1],
      ["BLH", "05:25", "05:26", 4, 1],
      ["SEP", "05:32", "05:33", 5, 1],
      ["BP", "05:41", "05:42", 6, 1],
      ["SNR", "05:51", "05:52", 7, 1],
      ["NH", "06:05", null, 8, 0]
    ]
  },
  {
    num: "31611",
    name: "Sealdah - Ranaghat Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 74,
    stops: [
      ["SDAH", null, "06:00", 1, 0],
      ["DDJ", "06:14", "06:15", 2, 1],
      ["BP", "06:33", "06:34", 3, 1],
      ["NH", "06:54", "06:55", 4, 1],
      ["KYI", "07:07", "07:08", 5, 1],
      ["CDH", "07:22", "07:23", 6, 1],
      ["RHA", "07:42", null, 7, 0]
    ]
  },
  {
    num: "31811",
    name: "Sealdah - Krishnanagar City Fast Local",
    type: "Fast Local",
    orig: "SDAH",
    days: "Daily",
    km: 100,
    stops: [
      ["SDAH", null, "07:20", 1, 0],
      ["DDJ", "07:33", "07:34", 2, 1],
      ["BP", "07:51", "07:52", 3, 1],
      ["NH", "08:10", "08:11", 4, 1],
      ["KYI", "08:23", "08:24", 5, 1],
      ["RHA", "08:52", "08:54", 6, 2],
      ["KLNP", "09:02", "09:03", 7, 1],
      ["BDZ", "09:12", "09:13", 8, 1],
      ["KNJ", "09:35", null, 9, 0]
    ]
  },
  {
    num: "31511",
    name: "Sealdah - Shantipur Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 93,
    stops: [
      ["SDAH", null, "08:45", 1, 0],
      ["DDJ", "08:58", "08:59", 2, 1],
      ["BP", "09:16", "09:17", 3, 1],
      ["NH", "09:35", "09:36", 4, 1],
      ["RHA", "10:14", "10:16", 5, 2],
      ["KLNP", "10:24", "10:25", 6, 1],
      ["STB", "10:45", null, 7, 0]
    ]
  },
  {
    num: "31741",
    name: "Sealdah - Gede Indo-Bangla Border Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 116,
    stops: [
      ["SDAH", null, "07:30", 1, 0],
      ["DDJ", "07:43", "07:44", 2, 1],
      ["NH", "08:20", "08:21", 3, 1],
      ["RHA", "09:00", "09:05", 4, 5],
      ["BGL", "09:25", "09:26", 5, 1],
      ["MIJ", "09:42", "09:43", 6, 1],
      ["BPN", "09:55", "09:56", 7, 1],
      ["GEDE", "10:15", null, 8, 0]
    ]
  },

  // =========================================================================
  // 12. SEALDAH - BONGAON & HASNABAD BRANCH LOCALS
  // =========================================================================
  {
    num: "33811",
    name: "Sealdah - Bongaon Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 77,
    stops: [
      ["SDAH", null, "05:20", 1, 0],
      ["BNR", "05:27", "05:28", 2, 1],
      ["DDJ", "05:34", "05:35", 3, 1],
      ["DDC", "05:41", "05:42", 4, 1],
      ["BBT", "05:48", "05:49", 5, 1],
      ["MMG", "05:55", "05:56", 6, 1],
      ["BT", "06:05", "06:07", 7, 2],
      ["DTK", "06:17", "06:18", 8, 1],
      ["HB", "06:32", "06:33", 9, 1],
      ["GBG", "06:46", "06:47", 10, 1],
      ["TKNR", "06:55", "06:56", 11, 1],
      ["CDP", "07:04", "07:05", 12, 1],
      ["BNJ", "07:22", null, 13, 0]
    ]
  },
  {
    num: "33825",
    name: "Sealdah - Bongaon Evening Peak Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 77,
    stops: [
      ["SDAH", null, "18:10", 1, 0],
      ["DDJ", "18:24", "18:25", 2, 1],
      ["BT", "18:50", "18:52", 3, 2],
      ["HB", "19:15", "19:16", 4, 1],
      ["GBG", "19:30", "19:31", 5, 1],
      ["BNJ", "20:05", null, 6, 0]
    ]
  },
  {
    num: "33511",
    name: "Sealdah - Hasnabad Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 75,
    stops: [
      ["SDAH", null, "06:25", 1, 0],
      ["DDJ", "06:39", "06:40", 2, 1],
      ["BT", "07:03", "07:05", 3, 2],
      ["HRO", "07:28", "07:29", 4, 1],
      ["SNDI", "07:42", "07:43", 5, 1],
      ["BSHT", "08:00", "08:02", 6, 2],
      ["HNB", "08:25", null, 7, 0]
    ]
  },

  // =========================================================================
  // 13. SEALDAH SOUTH (BARUIPUR, DIAMOND HARBOUR, CANNING, NAMKHANA, BUDGE BUDGE)
  // =========================================================================
  {
    num: "34811",
    name: "Sealdah - Diamond Harbour Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 60,
    stops: [
      ["SDAH", null, "05:12", 1, 0],
      ["BLN", "05:22", "05:23", 2, 1],
      ["JDP", "05:28", "05:29", 3, 1],
      ["GIA", "05:34", "05:35", 4, 1],
      ["SPR", "05:42", "05:43", 5, 1],
      ["BRP", "05:54", "05:56", 6, 2],
      ["HT", "06:06", "06:07", 7, 1],
      ["MGT", "06:14", "06:15", 8, 1],
      ["SNU", "06:21", "06:22", 9, 1],
      ["D", "06:29", "06:30", 10, 1],
      ["NTA", "06:36", "06:37", 11, 1],
      ["DH", "06:55", null, 12, 0]
    ]
  },
  {
    num: "34825",
    name: "Sealdah - Diamond Harbour Evening Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 60,
    stops: [
      ["SDAH", null, "17:55", 1, 0],
      ["BLN", "18:05", "18:06", 2, 1],
      ["JDP", "18:11", "18:12", 3, 1],
      ["SPR", "18:25", "18:26", 4, 1],
      ["BRP", "18:38", "18:40", 5, 2],
      ["MGT", "18:56", "18:57", 6, 1],
      ["DH", "19:35", null, 7, 0]
    ]
  },
  {
    num: "34511",
    name: "Sealdah - Canning Sundarban Gateway Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 45,
    stops: [
      ["SDAH", null, "05:45", 1, 0],
      ["BLN", "05:55", "05:56", 2, 1],
      ["JDP", "06:01", "06:02", 3, 1],
      ["SPR", "06:15", "06:17", 4, 2],
      ["CHT2", "06:27", "06:28", 5, 1],
      ["GOF", "06:38", "06:39", 6, 1],
      ["TLX", "06:52", "06:53", 7, 1],
      ["CG", "07:08", null, 8, 0]
    ]
  },
  {
    num: "34711",
    name: "Sealdah - Namkhana Coastal Express Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 109,
    stops: [
      ["SDAH", null, "04:55", 1, 0],
      ["BLN", "05:05", "05:06", 2, 1],
      ["SPR", "05:24", "05:25", 3, 1],
      ["BRP", "05:37", "05:39", 4, 2],
      ["GCN", "05:53", "05:54", 5, 1],
      ["JNM", "06:07", "06:08", 6, 1],
      ["LKPR", "06:25", "06:27", 7, 2],
      ["NCP", "06:50", "06:51", 8, 1],
      ["KWDP", "07:05", "07:07", 9, 2],
      ["NMKA", "07:35", null, 10, 0]
    ]
  },
  {
    num: "34111",
    name: "Sealdah - Budge Budge Morning Local",
    type: "EMU Local",
    orig: "SDAH",
    days: "Daily",
    km: 26,
    stops: [
      ["SDAH", null, "06:10", 1, 0],
      ["BLN", "06:20", "06:22", 2, 2],
      ["LKF", "06:27", "06:28", 3, 1],
      ["TLG", "06:31", "06:32", 4, 1],
      ["NAPR", "06:35", "06:36", 5, 1],
      ["MJT", "06:40", "06:41", 6, 1],
      ["BRJ", "06:46", "06:47", 7, 1],
      ["AKRA", "06:54", "06:55", 8, 1],
      ["BGB", "07:05", null, 9, 0]
    ]
  },

  // =========================================================================
  // 14. SOUTH EASTERN SUBURBAN (HOWRAH - MECHEDA - KHARAGPUR - MIDNAPORE - DIGHA)
  // =========================================================================
  {
    num: "38701",
    name: "Howrah - Kharagpur Morning Fast Local",
    type: "Fast Local",
    orig: "HWH",
    days: "Daily",
    km: 115,
    stops: [
      ["HWH", null, "05:40", 1, 0],
      ["SRC", "05:53", "05:54", 2, 1],
      ["ADL", "06:01", "06:02", 3, 1],
      ["ULB", "06:20", "06:21", 4, 1],
      ["BZN", "06:37", "06:38", 5, 1],
      ["MCAE", "06:54", "06:55", 6, 1],
      ["PKU", "07:08", "07:09", 7, 1],
      ["BCK", "07:24", "07:25", 8, 1],
      ["KGP", "07:55", null, 9, 0]
    ]
  },
  {
    num: "38801",
    name: "Howrah - Midnapore Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 128,
    stops: [
      ["HWH", null, "06:35", 1, 0],
      ["SRC", "06:48", "06:49", 2, 1],
      ["ULB", "07:15", "07:16", 3, 1],
      ["BZN", "07:33", "07:34", 4, 1],
      ["MCAE", "07:52", "07:53", 5, 1],
      ["PKU", "08:08", "08:09", 6, 1],
      ["BCK", "08:25", "08:26", 7, 1],
      ["KGP", "08:58", "09:03", 8, 5],
      ["GMDN", "09:12", "09:13", 9, 1],
      ["MDN", "09:30", null, 10, 0]
    ]
  },
  {
    num: "38825",
    name: "Howrah - Midnapore Evening Commuter",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 128,
    stops: [
      ["HWH", null, "18:15", 1, 0],
      ["SRC", "18:28", "18:29", 2, 1],
      ["ULB", "18:55", "18:56", 3, 1],
      ["MCAE", "19:30", "19:31", 4, 1],
      ["PKU", "19:47", "19:48", 5, 1],
      ["KGP", "20:30", "20:35", 6, 5],
      ["MDN", "21:05", null, 7, 0]
    ]
  },
  {
    num: "68685",
    name: "Howrah - Digha EMU Passenger",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 185,
    stops: [
      ["HWH", null, "08:00", 1, 0],
      ["SRC", "08:14", "08:15", 2, 1],
      ["ULB", "08:42", "08:43", 3, 1],
      ["MCAE", "09:18", "09:20", 4, 2],
      ["PKU", "09:35", "09:37", 5, 2],
      ["TMZ", "10:04", "10:06", 6, 2],
      ["NDKR", "10:18", "10:19", 7, 1],
      ["DSPN", "10:35", "10:36", 8, 1],
      ["KATI", "10:55", "10:57", 9, 2],
      ["RMRB", "11:15", "11:16", 10, 1],
      ["DGHA", "11:45", null, 11, 0]
    ]
  },
  {
    num: "38051",
    name: "Howrah - Haldia Local",
    type: "EMU Local",
    orig: "HWH",
    days: "Daily",
    km: 135,
    stops: [
      ["HWH", null, "06:05", 1, 0],
      ["SRC", "06:19", "06:20", 2, 1],
      ["MCAE", "07:15", "07:17", 3, 2],
      ["PKU", "07:32", "07:34", 4, 2],
      ["TMZ", "07:58", "08:00", 5, 2],
      ["MSDL", "08:24", "08:25", 6, 1],
      ["DZK", "08:46", "08:47", 7, 1],
      ["HLDZ", "09:10", null, 8, 0]
    ]
  },

  // =========================================================================
  // 15. PREMIER SUPERFAST, EXPRESS & RAJDHANI / SHATABDI ACROSS WEST BENGAL
  // =========================================================================
  {
    num: "12301",
    name: "Howrah - New Delhi Rajdhani Express",
    type: "Rajdhani Express",
    orig: "HWH",
    days: "Daily Except Sun",
    km: 260,
    stops: [
      ["HWH", null, "16:50", 1, 0],
      ["ASN", "19:00", "19:02", 2, 2]
    ]
  },
  {
    num: "12305",
    name: "Howrah - New Delhi Rajdhani Express (via Patna)",
    type: "Rajdhani Express",
    orig: "HWH",
    days: "Sun",
    km: 260,
    stops: [
      ["HWH", null, "14:05", 1, 0],
      ["BWN", "15:08", "15:10", 2, 2],
      ["MNAE", "15:35", "15:36", 3, 1]
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
    num: "12041",
    name: "Howrah - New Jalpaiguri Shatabdi Express",
    type: "Shatabdi Express",
    orig: "HWH",
    days: "Daily Except Sun",
    km: 565,
    stops: [
      ["HWH", null, "14:25", 1, 0],
      ["BHP", "16:13", "16:15", 2, 2],
      ["NFK", "18:58", "19:00", 3, 2],
      ["MLDT", "19:35", "19:45", 4, 10],
      ["BOE", "20:53", "20:55", 5, 2],
      ["KNE", "21:35", "21:37", 6, 2],
      ["NJP", "22:55", null, 7, 0]
    ]
  },
  {
    num: "12042",
    name: "New Jalpaiguri - Howrah Shatabdi Express",
    type: "Shatabdi Express",
    orig: "NJP",
    days: "Daily Except Sun",
    km: 565,
    stops: [
      ["NJP", null, "05:30", 1, 0],
      ["KNE", "06:33", "06:35", 2, 2],
      ["BOE", "07:15", "07:17", 3, 2],
      ["MLDT", "08:50", "09:00", 4, 10],
      ["NFK", "09:35", "09:37", 5, 2],
      ["BHP", "11:58", "12:00", 6, 2],
      ["HWH", "13:45", null, 7, 0]
    ]
  },
  {
    num: "12343",
    name: "Darjeeling Mail",
    type: "Superfast Express",
    orig: "SDAH",
    days: "Daily",
    km: 620,
    stops: [
      ["SDAH", null, "22:05", 1, 0],
      ["BWN", "23:32", "23:35", 2, 3],
      ["BHP", "00:22", "00:25", 3, 3],
      ["MLDT", "04:00", "04:10", 4, 10],
      ["KNE", "06:05", "06:07", 5, 2],
      ["NJP", "07:45", "07:55", 6, 10],
      ["JPG", "08:45", "08:47", 7, 2],
      ["HDB", "09:55", null, 8, 0]
    ]
  },
  {
    num: "12344",
    name: "Darjeeling Mail (Down)",
    type: "Superfast Express",
    orig: "HDB",
    days: "Daily",
    km: 620,
    stops: [
      ["HDB", null, "18:15", 1, 0],
      ["JPG", "19:05", "19:07", 2, 2],
      ["NJP", "19:55", "20:05", 3, 10],
      ["KNE", "21:13", "21:15", 4, 2],
      ["MLDT", "23:30", "23:40", 5, 10],
      ["BHP", "02:40", "02:43", 6, 3],
      ["BWN", "03:41", "03:44", 7, 3],
      ["SDAH", "05:30", null, 8, 0]
    ]
  },
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
      ["NJP", "09:15", "09:25", 8, 10],
      ["DQG", "10:30", "10:32", 9, 2],
      ["FLK", "10:55", "10:57", 10, 2],
      ["NCB", "11:35", "11:40", 11, 5],
      ["NOQ", "12:15", null, 12, 0]
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
      ["NMZ", "09:00", "09:02", 8, 2],
      ["CLD", "09:18", "09:20", 9, 2],
      ["BNQ", "10:15", "10:17", 10, 2],
      ["HSA", "11:00", "11:02", 11, 2],
      ["APDJ", "12:30", null, 12, 0]
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
      ["RHA", "19:50", "19:52", 2, 2],
      ["KNJ", "20:20", "20:22", 3, 2],
      ["BFT", "20:50", "20:51", 4, 1],
      ["DEB", "21:03", "21:04", 5, 1],
      ["PLY", "21:16", "21:17", 6, 1],
      ["BEB", "21:35", "21:36", 7, 1],
      ["BPC", "22:04", "22:06", 8, 2],
      ["MBB", "22:24", "22:25", 9, 1],
      ["JJG", "22:34", "22:35", 10, 1],
      ["BQG", "22:49", "22:50", 11, 1],
      ["LGL", "23:25", null, 12, 0]
    ]
  },
  {
    num: "13104",
    name: "Bhagirathi Express (Down)",
    type: "Express",
    orig: "LGL",
    days: "Daily",
    km: 228,
    stops: [
      ["LGL", null, "05:40", 1, 0],
      ["BQG", "05:52", "05:53", 2, 1],
      ["JJG", "06:06", "06:07", 3, 1],
      ["MBB", "06:16", "06:17", 4, 1],
      ["BPC", "06:33", "06:35", 5, 2],
      ["BEB", "06:54", "06:55", 6, 1],
      ["PLY", "07:13", "07:14", 7, 1],
      ["KNJ", "08:08", "08:10", 8, 2],
      ["RHA", "08:48", "08:50", 9, 2],
      ["SDAH", "10:40", null, 10, 0]
    ]
  },
  {
    num: "12827",
    name: "Howrah - Purulia Superfast Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 323,
    stops: [
      ["HWH", null, "16:50", 1, 0],
      ["KGP", "18:22", "18:24", 2, 2],
      ["GMDN", "18:38", "18:39", 3, 1],
      ["MDN", "18:51", "18:53", 4, 2],
      ["SLB", "19:14", "19:15", 5, 1],
      ["CDGR", "19:26", "19:27", 6, 1],
      ["GBA", "19:39", "19:40", 7, 1],
      ["VSU", "20:01", "20:03", 8, 2],
      ["ODM", "20:16", "20:17", 9, 1],
      ["BQA", "20:33", "20:35", 10, 2],
      ["CJN", "20:47", "20:48", 11, 1],
      ["JPH", "20:58", "20:59", 12, 1],
      ["ADRA", "21:30", "21:35", 13, 5],
      ["ANR", "21:50", "21:51", 14, 1],
      ["PRR", "22:30", null, 15, 0]
    ]
  },
  {
    num: "12828",
    name: "Purulia - Howrah Superfast Express",
    type: "Superfast Express",
    orig: "PRR",
    days: "Daily",
    km: 323,
    stops: [
      ["PRR", null, "05:30", 1, 0],
      ["ANR", "05:53", "05:54", 2, 1],
      ["ADRA", "06:15", "06:20", 3, 5],
      ["BQA", "07:03", "07:05", 4, 2],
      ["VSU", "07:31", "07:33", 5, 2],
      ["GBA", "07:54", "07:55", 6, 1],
      ["MDN", "08:43", "08:45", 7, 2],
      ["KGP", "09:10", "09:12", 8, 2],
      ["HWH", "11:25", null, 9, 0]
    ]
  },
  {
    num: "13161",
    name: "Tebhaga Express",
    type: "Express",
    orig: "KOAA",
    days: "Daily Except Sun",
    km: 438,
    stops: [
      ["KOAA", null, "12:55", 1, 0],
      ["BWN", "14:28", "14:31", 2, 3],
      ["BHP", "15:23", "15:25", 3, 2],
      ["RPH", "16:21", "16:23", 4, 2],
      ["MLDT", "19:25", "19:35", 5, 10],
      ["EKI", "19:58", "20:00", 6, 2],
      ["GZO", "20:15", "20:17", 7, 2],
      ["BNDP", "20:45", "20:47", 8, 2],
      ["GRMP", "21:02", "21:04", 9, 2],
      ["BLGT", "21:55", null, 10, 0]
    ]
  },
  {
    num: "13053",
    name: "Kulik Express",
    type: "Express",
    orig: "HWH",
    days: "Daily",
    km: 485,
    stops: [
      ["HWH", null, "08:55", 1, 0],
      ["BWN", "10:11", "10:13", 2, 2],
      ["BHP", "11:02", "11:04", 3, 2],
      ["SURI", "11:41", "11:43", 4, 2],
      ["RPH", "12:43", "12:45", 5, 2],
      ["MLDT", "15:35", "15:45", 6, 10],
      ["SM", "16:20", "16:22", 7, 2],
      ["BOE", "17:10", "17:12", 8, 2],
      ["RGJ", "17:40", "17:45", 9, 5],
      ["KAJ", "18:08", "18:10", 10, 2],
      ["RDP", "18:45", null, 11, 0]
    ]
  },
  {
    num: "12339",
    name: "Coalfield Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 260,
    stops: [
      ["HWH", null, "17:20", 1, 0],
      ["MNAE", "18:50", "18:51", 2, 1],
      ["PDAE", "19:04", "19:05", 3, 1],
      ["DGP", "19:20", "19:22", 4, 2],
      ["UDL", "19:37", "19:38", 5, 1],
      ["RNG", "19:48", "19:50", 6, 2],
      ["ASN", "20:20", null, 7, 0]
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
      ["ASN", null, "07:00", 1, 0],
      ["RNG", "07:18", "07:20", 2, 2],
      ["UDL", "07:30", "07:31", 3, 1],
      ["DGP", "07:46", "07:48", 4, 2],
      ["PDAE", "08:03", "08:04", 5, 1],
      ["MNAE", "08:17", "08:18", 6, 1],
      ["HWH", "10:25", null, 7, 0]
    ]
  },
  {
    num: "12337",
    name: "Shantiniketan Express",
    type: "Superfast Express",
    orig: "HWH",
    days: "Daily",
    km: 146,
    stops: [
      ["HWH", null, "10:10", 1, 0],
      ["BWN", "11:22", "11:24", 2, 2],
      ["GHP", "11:58", "11:59", 3, 1],
      ["BHP", "12:25", null, 4, 0]
    ]
  },
  {
    num: "12338",
    name: "Shantiniketan Express (Down)",
    type: "Superfast Express",
    orig: "BHP",
    days: "Daily",
    km: 146,
    stops: [
      ["BHP", null, "13:10", 1, 0],
      ["GHP", "13:27", "13:28", 2, 1],
      ["BWN", "14:08", "14:10", 3, 2],
      ["HWH", "15:40", null, 4, 0]
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
      ["RMRB", "09:50", "09:52", 8, 2],
      ["DGHA", "10:20", null, 9, 0]
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
      ["RMRB", "10:48", "10:50", 2, 2],
      ["KATI", "11:05", "11:07", 3, 2],
      ["TMZ", "12:00", "12:02", 4, 2],
      ["MCAE", "12:35", "12:37", 5, 2],
      ["BZN", "12:55", "12:57", 6, 2],
      ["ULB", "13:16", "13:18", 7, 2],
      ["SRC", "13:43", "13:45", 8, 2],
      ["HWH", "14:15", null, 9, 0]
    ]
  },
  {
    num: "52541",
    name: "Darjeeling Himalayan Toy Train Passenger",
    type: "Heritage Toy Train",
    orig: "NJP",
    days: "Daily",
    km: 88,
    stops: [
      ["NJP", null, "10:00", 1, 0],
      ["SGUJ", "10:30", "10:35", 2, 5],
      ["SN", "11:10", "11:15", 3, 5],
      ["TDH", "12:30", "12:35", 4, 5],
      ["KGN", "13:50", "14:10", 5, 20],
      ["SDA", "15:20", "15:25", 6, 5],
      ["GHM", "16:20", "16:30", 7, 10],
      ["DJO", "17:20", null, 8, 0]
    ]
  }
];
