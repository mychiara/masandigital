/**
 * Offline Malaysian Recipe Generator
 * -------------------------------------------------------------
 * Script ini menjana 500+ artikel resepi Malaysia yang sangat berkualiti tinggi,
 * lengkap dengan struktur HTML premium, Recipe Card (Prep/Cook Time, Kalori, dll.),
 * bahan-bahan, langkah demi langkah, tips ekstra, dan FAQ Schema-friendly.
 * 
 * Sesuai untuk di-import terus ke dalam database Supabase.
 */

const fs = require('fs');
const path = require('path');

// Senarai penuh keyword resepi daripada pengguna
const KEYWORDS = [
  "resepi biskut raya 2024",
  "resepi ubi getuk",
  "resepi ayam masak tempoyak",
  "5 rencah 5 rasa resepi",
  "resepi perap satay",
  "resepi kek coklat simple",
  "resepi bihun goreng mamak",
  "resepi biskut mudah",
  "resepi ayam bakar simple azie kitchen",
  "resepi ubi kentang goreng rangup",
  "resepi aiskrim milo tanpa susu cair",
  "resepi carbonara homemade sedap",
  "resepi tempe goreng rangup",
  "resepi seri muka gula merah tanpa telur",
  "resepi kangkung masak lemak cili api",
  "resepi sambal ikan goreng",
  "resepi kuah pasembur mamak haji",
  "resepi kambing masak merah singapore",
  "resepi kuih bom keledek bijan",
  "resepi kek marble sedap dan lembut",
  "resepi soto ayam azie kitchen",
  "resepi mie kari",
  "resepi kangkung masak lemak kuning",
  "resepi nasi goreng sotong petai",
  "resepi acar rampai azie kitchen",
  "resepi nasi ayam sheila rusly",
  "resepi sos karamel masin",
  "resepi red velvet cake azlita masam manis",
  "resepi mushroom sup azlita",
  "resepi sardin roll guna kulit popia",
  "resepi popia cheese pedas rangup",
  "resepi ikan terubuk masin",
  "resepi ice cream goreng",
  "resepi sardin sedap pedas",
  "best apple pie recipe from scratch",
  "daging masak kicap pedas",
  "resep masakan indonesia",
  "resepi burger",
  "resepi spaghetti cheese alfredo",
  "resepi sup kepala ikan salmon",
  "resepi cekodok pisang lembut dan sedap",
  "resepi biskut badam sedap",
  "resepi donut inti coklat",
  "resepi nasi udang",
  "resepi tomyam santan simple",
  "resepi doh pizza hut",
  "resepi mee goreng kering",
  "resepi kuih goyang mat gebu",
  "resepi nasi lemak simple tanpa santan",
  "resepi sos lokcing thailand",
  "resepi kek kurma tanpa telur",
  "resepi sos carbonara homemade azie kitchen",
  "resepi nasi minyak noxxa",
  "resepi tom yam ayam mudah",
  "resepi kuih rangin gula merah",
  "mee kari sedap resepi",
  "resepi ayam black pepper guna sos",
  "resepi cream horn mudah",
  "resepi sambal bawang sedap",
  "resepi biskut coklat chipsmore",
  "resepi donut coklat lembut",
  "resepi icing",
  "resepi inti cucur badak paling sedap",
  "resepi biskut dahlia rangup",
  "resepi karamel roti",
  "resepi bengkang roti azie kitchen",
  "resepi seri kaya labu manis",
  "resepi roti john cheese leleh",
  "resepi masak kicap daging",
  "resepi labu kuning",
  "resepi air koktel",
  "resepi mee hoon soto",
  "resepi tempoyak daun kayu perak",
  "resepi facebook",
  "resepi lala",
  "resepi kulit dumpling mudah",
  "ikan cencaru masak apa sedap",
  "resepi tempoyak ikan bilis perak",
  "resepi batang keladi masak lemak",
  "resepi apam beras gebu",
  "resepi pasta goreng sedap",
  "resepi ikan bawal hitam masak stim limau",
  "resepi biskut raya 2020",
  "resepi kek cheese biskut saltcheese",
  "resepi ayam mango thai",
  "resepi kek batik cadbury cheese",
  "resepi takoyaki goreng tanpa acuan",
  "resepi kuah tauhu bakar",
  "resepi inti roti pita ayam",
  "resepi kerepek brownies rangup",
  "resepi ikan tongkol",
  "resepi pulut panggang azie kitchen",
  "resepi bihun singapore sheila rusly",
  "resepi ayam rosemary",
  "resepi ayam masak percik",
  "resepi ikan steam chinese style",
  "resepi kuih talam tokyo paling sedap",
  "resepi tongkeng ayam goreng tepung",
  "resepi capati dan kuah",
  "resepi spageti goreng sedap",
  "resepi karipap sedap",
  "resepi mee kari chef wan",
  "resepi ayam goreng korea crispy",
  "resepi kuih kacang hijau azie kitchen",
  "resepi nasi goreng kampung viral",
  "resepi roti sardin goreng",
  "cara buat kuih cakoi",
  "resepi lala masak pedas telur",
  "resepi ayam panggang black pepper",
  "resepi siakap masam manis",
  "resepi cucur kodok",
  "resepi ayam popcorn nestum",
  "resepi kuih puteri ayu sedap",
  "resepi kuih kaswi mudah",
  "resepi sambal tumis udang kering",
  "resepi puding karamel kastard",
  "simple resepi ikan siakap",
  "resepi muruku rangup",
  "resepi sambal goreng jawa azlita masam manis",
  "resepi seri muka pandan bakar",
  "begedil ayam",
  "resepi rojak mee azie kitchen",
  "resepi air kunyit",
  "resepi ikan kembung masak sambal",
  "resepi sup ikan haruan ala thai",
  "resepi cucur kentang tanpa telur",
  "resepi salad telur kuah kacang",
  "resepi petai ikan bilis",
  "resepi ikan jenahak stim limau",
  "resepi topping cheese tatura",
  "resepi masak ikan bawal",
  "resepi burger ramly",
  "resepi bingka labu bakar sedap",
  "resepi kuey teow tom yam thai",
  "resepi cornflakes chocolate",
  "resepi dada ayam simple",
  "resepi cheese kek leleh",
  "resepi fish n chips mudah",
  "resepi serunding halia untuk berpantang",
  "resepi maggi goreng sedap dan ringkas",
  "resepi kek blueberry cheese",
  "resepi bubble rice",
  "aneka resepi biskut raya bergambar",
  "resepi daging salai masak lemak chef ismail",
  "resepi nasi goreng udang sedap",
  "buku resepi chef hanieliza",
  "resepi churros",
  "resepi masak lemak ikan masin",
  "resepi kek tanpa susu cair",
  "inti popia goreng",
  "resepi mee laksa sarawak",
  "resepi ikan celup tepung rangup",
  "resepi kek goyang dangdut",
  "resepi kurma telur azie kitchen",
  "resepi steak daging lembut",
  "resepi ikan tuna masak sambal",
  "resepi kacang tanah goreng bawang putih",
  "resepi briyani ayam simple",
  "resepi biskut tart nenas tanpa telur",
  "resepi sup jagung",
  "resepi pankek gebu",
  "resepi kuih jala kuah manis",
  "resepi blueberry cheesecake azie kitchen",
  "resepi kek minyak bakar",
  "resepi oden azie kitchen",
  "resepi lasagna daging step by step",
  "resepi kari ikan bawal tanpa santan",
  "resepi inti popia simpul",
  "resepi mango cheesecake tanpa bakar",
  "resepi sardin masak lemak cili api",
  "resepi bakar",
  "resepi nagasari nangka",
  "resepi nangka masak lemak putih",
  "resepi kek coklat moist tanpa telur",
  "resepi putu piring perak",
  "resepi aglio olio udang pedas",
  "resepi cucur jawa pandan",
  "resepi nasi serai azie kitchen",
  "resepi tosei",
  "nasi daging resepi",
  "resepi popia carbonara cheese sedap",
  "resepi kek minyak bakar tanpa ovalette",
  "resepi ikan pindang utara",
  "resepi nasi goreng sardin petai",
  "resepi tart portugis azie kitchen",
  "resepi ayam masak merah ala thai",
  "resepi ayam kerutuk adabi",
  "resepi pengat labu dengan sagu",
  "resepi acar rempah",
  "resepi ayam kicap berempah mamak",
  "resepi sos thai daun ketumbar",
  "resepi spaghetti goreng simple tapi sedap",
  "resepi perapan kambing mydin",
  "resepi pancake jepun",
  "resepi masak tauhu jepun",
  "resepi bubur nasi biasa",
  "resepi macaroni goreng",
  "resepi mee sotong sedap",
  "resepi ikan siakap bakar",
  "resepi nasi goreng usa paling sedap",
  "resepi biskut buah kana sedap",
  "resepi kuih ropa inti daging",
  "resepi roti john mudah dan sedap",
  "resepi bengkang tepung jawi",
  "resepi bubur lambuk terengganu sedap",
  "resepi rendang itik salai negeri sembilan",
  "resepi kek span pandan azlina ina",
  "resepi mushroom soup tanpa susu",
  "resepi masak ikan patin",
  "resepi roti putih bread maker noxxa",
  "resepi sup bayam merah",
  "resepi rendang hati lembu chef ismail",
  "resepi cucur udang mudah",
  "resepi roti kacang merah bread maker",
  "resepi seafood lasagna",
  "resepi bihun sup cina style",
  "resepi opor ayam jawa",
  "resepi kuih cek mek molek lembut",
  "resepi kek lava hantu azlina ina",
  "resepi telur masak sambal hijau",
  "resepi ikan singgang terengganu mudah",
  "resepi makanan bayi 1 tahun 3 bulan",
  "resepi kek hokkaido lemon",
  "resepi jus durian belanda",
  "resepi gulai lemak ketam",
  "resepi laksa kuah masak terengganu",
  "resepi cream kek",
  "resepi sos takoyaki mudah",
  "resepi ikan keli goreng tepung rangup",
  "resepi mee goreng seafood",
  "resepi aneka kek batik",
  "masak lemak cili api ayam",
  "resepi sos bbq black pepper",
  "resepi mee siam kuah azie kitchen",
  "resepi telur dadar",
  "resepi sambal tempe ikan bilis",
  "resepi mee goreng cina style",
  "resepi kuih apam nasi",
  "resepi kuih muih",
  "resepi lempeng tanpa telur",
  "ayam kurma resepi",
  "resepi ikan ampap",
  "resepi ikan bawal masam manis",
  "resepi kuah percik putih kelantan",
  "ikan bilis masak kicap",
  "resepi kek lumut cheese sarawak",
  "resepi kek span pandan santan",
  "resepi kek pisang moist gebu",
  "resepi ayam goreng kari kering",
  "resepi kuih qasidah azie kitchen",
  "viral 2019 resepi kuih muih viral",
  "resepi sambal ikan bilis petai kering",
  "resepi nasi goreng planta",
  "resepi hotteok malaysia",
  "resepi urap pucuk paku",
  "ayam goreng kfc resepi mudah",
  "murtabak mini",
  "resepi roti jala viral",
  "resepi ayam penyet asli indonesia",
  "resepi masakan daging kuda",
  "resepi kek marble minyak",
  "resepi breakfast simple",
  "resepi laksam utara",
  "oglio resepi",
  "resepi kuih pau gebu dan lembut",
  "resepi sayur goreng jawa simple",
  "resepi kuih cakoi ala cina",
  "resepi donut mudah tanpa uli",
  "resepi sawi goreng telur",
  "resepi kuih dadar inti kelapa",
  "resepi rendang ayam kedah",
  "resepi oatmeal cookies",
  "resepi agar2 buah naga",
  "kuih makmur resepi mudah",
  "resepi sawi goreng belacan",
  "resepi char kuey teow basah",
  "resepi membuat pizza",
  "resepi apam milo mekar",
  "resepi stew kambing ala arab",
  "resepi lauk berpantang czer",
  "resepi tomyam merah sedap",
  "resepi hotteok",
  "resepi asam pedas ikan sembilang",
  "resepi kek batik paling sedap",
  "resepi cili jeruk",
  "resepi aiskrim jagung",
  "resepi daging dendeng indonesia",
  "resepi keria ball",
  "resepi roti prata roll",
  "resepi mee berkuah sedap",
  "macaroons resepi",
  "resepi cream puff azlita",
  "resepi biskut susu pekat manis",
  "resepi memikat suami full episode",
  "resepi sandwich telur mayonis sedap",
  "resepi kek coklat leleh viral",
  "resepi ais kacang cendol",
  "resepi ketam masak sos lada hitam",
  "resepi juadah berbuka puasa",
  "resepi laksa utara pekat",
  "resepi cekodok pisang",
  "resepi minuman yogurt",
  "resepi bihun soto daging",
  "resepi char kuew teow",
  "resepi rendang daging hitam",
  "resepi yee mee goreng sedap",
  "resepi biskut mazola azie kitchen",
  "resepi nasi arab noxxa",
  "resepi kuah lodeh ikan bilis",
  "resepi bubur butir nangka",
  "resepi bubur sumsum tanpa santan",
  "resepi ayam goreng madu ala korea",
  "resepi sambal cili api ikan bilis",
  "resepi sotong sumbat pulut",
  "resepi ayam korea",
  "resepi biskut bayi setahun",
  "resepi rendang daging noxxa",
  "resepi sarapan mudah untuk kanak kanak",
  "resepi ketupat palas kacang",
  "resepi masak lemak ketam nipah",
  "resepi agar agar cendol",
  "resepi mee berkuah",
  "resepi nasi beriyani",
  "resepi sup tulang merah simple",
  "resepi kuih topi kelantan",
  "cara masak sagu gula melaka",
  "resepi bento malaysia",
  "nasi goreng cina sedap",
  "resepi bubur ubi manis simple",
  "resepi ayam bakar",
  "resepi brownies cookies azlita",
  "resepi kek lumut sarawak bakar",
  "resepi soto nasi impit johor",
  "resepi colek buah sedap",
  "resepi ikan siakap goreng berlada hijau",
  "resepi ikan siakap stim limau guna pemanggang ajaib",
  "resepi nasi carrot yang sedap",
  "resepi donut mudah dan sedap",
  "resepi jeruk cermai",
  "resepi lempeng pisang sihat",
  "resepi udang galah masak lemak tempoyak",
  "resepi ketam nipah masak cili",
  "resepi kuih talam ubi kayu gula melaka",
  "resepi biskut terkini 2019",
  "resepi agar agar merah",
  "resepi dadih milo mudah",
  "resepi laksa terengganu mudah",
  "resepi rendang ayam johor",
  "resepi kek koko bakar mudah",
  "resepi cekodok labu",
  "resepi percik ikan",
  "resepi dalca daging mat gebu",
  "bayam merah resepi",
  "resepi steak daging azie kitchen",
  "resepi mee kari simple",
  "resepi kuah yong tau fu guna otak udang",
  "resepi ayam bakar madu berempah",
  "resepi inti karipap ayam lada hitam",
  "resepi steamboat tomyam simple",
  "resepi ayam masak asam pedas adabi",
  "resepi mee rojak nani rostam",
  "goreng resepi masak udang",
  "resepi daging masak hitam kenduri",
  "resepi kuih raya tradisional",
  "resepi mentarang rebus",
  "resepi hati ayam",
  "resepi nasi kerabu kelantan paling sedap",
  "aneka resepi roti keping",
  "ayam berlada hijau",
  "rendang tok resepi chef wan",
  "resepi potato salad sedap",
  "resepi ayam masak lemak cili api negeri sembilan",
  "resepi char kuey teow kerang berkuah",
  "resepi makaroni bakar cheese paling sedap",
  "resepi kuah cucur udang sedap",
  "resepi puding buih azlina ina",
  "resepi bingka pandan bakar",
  "resepi mac n cheese mudah",
  "resepi pau kelapa",
  "resepi mee kuah udang",
  "resepi ikan bawal stim asam boi",
  "resepi ikan siakap masak kicap pedas",
  "resepi daging masak hitam utara",
  "resepi kari udang utara",
  "resepi lodeh muar",
  "resepi dalca sayur",
  "resepi mee udon halal",
  "resepi makaroni bakar cheese azie kitchen",
  "resepi rempah nasi arab kabsah",
  "resepi bubur untuk bayi 7 bulan",
  "resepi kek coklat lava bakar",
  "resepi fondant cake",
  "resepi kuih paling mudah",
  "ikan bawal emas masak apa sedap",
  "resepi roti arab simple",
  "resepi kuih cara berlauk",
  "resepi pengat labu dan keledek",
  "resepi kek biskut marie",
  "resepi sos meatball cheese",
  "resepi kari sayur",
  "resepi ikan haruan bakar",
  "resepi sosej roll tanpa serbuk roti",
  "resepi ikan sebelah masak taucu",
  "resepi ikan tiga rasa ala thai",
  "sos thai resepi",
  "resepi ayam gulai darat kelantan",
  "resepi ayam nestum",
  "resepi bubur jagung sagu azie kitchen",
  "resepi kuih lidah susu",
  "resepi biskut tiramisu kastard",
  "resepi sambal nasi lemak sedap",
  "resepi petola masak air terengganu",
  "resepi cream puff mudah",
  "resepi tauhu sumbat ala cina",
  "resepi kuah pasembur",
  "resepi sup ayam thai",
  "resepi soto nasi impit",
  "resepi bubur caca sedap",
  "resepi roti jala lembut",
  "resepi trifle cake",
  "resepi kulat",
  "resepi kek pisang cheese azlita",
  "bahan resepi biskut batik",
  "resepi kek simple tanpa oven",
  "resepi dalca ayam azie kitchen",
  "resepi ikan rohu",
  "resepi omelet telur sedap",
  "resepi butir nangka tanpa halba",
  "resepi ikan patin masak lemak tempoyak",
  "resepi kek viral rm1",
  "resepi kek minyak marble tanpa telur",
  "secret recipe set lunch menu 2019",
  "nasi kuning resepi",
  "resepi ikan singgang kelantan yang sedap",
  "resepi kek coklat brulee azlita",
  "resepi air mata kucing kering",
  "resepi yong tau foo sup",
  "resepi lasagna roti gardenia",
  "resepi sotong masak asam jawa",
  "resepi roti jala mudah dan senang",
  "resepi sambal nyet khairul aming",
  "resepi kari ayam sedap tanpa santan",
  "cara membuat resepi kek batik",
  "resepi kek minyak bakar mudah",
  "resepi bubur ayam noxxa",
  "resepi tepung pelita guna santan kotak",
  "resepi sotong bakar azie kitchen",
  "resepi kuih siput sedap",
  "resepi puding roti sedap mat gebu",
  "resepi kuih kacang",
  "resepi mee kuah udang kelantan",
  "resepi daging berkuah",
  "resepi kepala ikan merah masak sup",
  "resepi kuih serabai penang",
  "resepi krim kek",
  "resepi mee ketam utara",
  "resepi bulgogi daging",
  "resepi pulut seri muka periuk noxxa",
  "resepi dalca sayur mamak haji",
  "resepi kek pop azlita masam manis",
  "ayam masak sos thai",
  "resepi jeruk kedondong tahan lama",
  "resepi jamu asam kunyit manjakani",
  "resepi roti wholemeal diet",
  "resepi telur itik masak lemak kuning",
  "resepi aiskrim malaysia lembut",
  "resepi kek puding pavlova",
  "resepi ayam kicap simple",
  "resepi aneka puding sedap",
  "resepi kuey teow kungfu azlita",
  "cara masak tauhu telur",
  "resepi kuah laksa kelantan azie kitchen",
  "resepi bawal hitam masak kicap",
  "resepi biskut suji brunei",
  "resepi steak kambing",
  "resepi ketam masak merah sedap",
  "mee bandung muar resepi",
  "resepi urap kacang botol",
  "resepi daging masak kerutuk",
  "buku resepi masakan cina",
  "resepi telur masak sambal sos",
  "resepi daging goreng kicap berlada",
  "resepi ikan cencaru goreng bawang",
  "resepi ikan pais bakar",
  "resepi bistik daging mamak",
  "resepi kuih cempiang sedap",
  "resepi kerabu mangga ala thai",
  "resepi sos kastard vanilla",
  "resepi ikan selayang masak kicap",
  "resepi pau inti kelapa",
  "resepi somtam",
  "resepi sotong goreng kunyit mamak",
  "resepi tepung ayam goreng",
  "resepi murtabak cheese",
  "resepi inti karipap daging sedap",
  "resepi jus oren sedap",
  "resepi hati ayam goreng berempah",
  "resepi bubur pulut hitam sedap",
  "resepi nasi goreng belacan",
  "resepi mee kari sedap azlita",
  "resepi chee cheong fun",
  "resepi sayur bendi",
  "resepi kek buah moist",
  "resepi masak lemak labu pucuk manis",
  "resepi icing kek hari jadi",
  "resepi kuih ros mat gebu",
  "resepi kerang sheila rusly",
  "resepi daging masak halia",
  "resepi kek mango cheese",
  "apple pie recipe from scratch food network",
  "resepi nasi tumis utara",
  "resepi nasi goreng simple tanpa telur",
  "resepi biskut coklat chip simple",
  "resepi bubur nasi ala thai",
  "resepi kuih kering perut ayam",
  "trifle resepi",
  "cara masak sotong sambal",
  "resepi apam cornetto azlina ina",
  "resepi tauhu bergedil sheila rusly",
  "resepi ikan tamban masak lemak",
  "resepi kacang buncis goreng suhun",
  "resepi kuih bingka ubi kayu",
  "resepi kek durian azlina ina",
  "resepi asam rebus keladi",
  "resepi sambal kicap soto",
  "resepi tart nenas bunga tulip",
  "donut gebu resepi",
  "resepi cucur jagung rangup azie",
  "resepi masakan thai sedap",
  "resepi aiskrim oreo malaysia",
  "resepi cucur durian simple",
  "resepi gulai ayam kampung utara",
  "resepi suun goreng ala cina",
  "resepi black pepper sauce",
  "resepi nasi goreng usa ala thai",
  "resepi lasagna mudah sedap",
  "resepi maggi goreng sedap",
  "resepi sos black pepper mudah",
  "resepi pizza sosej mini",
  "resepi ayam kyochon sedap",
  "resepi sos black pepper mudah", // Duplicate will be handled
  "resepi sos bawang putih",
  "resepi lempeng nasi",
  "resepi ayam kari simple",
  "resepi biskut dam",
  "resepi kuih udang rangup",
  "resepi onion ring mudah",
  "resepi bun",
  "resepi steak daging noxxa",
  "resepi laksa perak sedap",
  "resepi pavlova mini kurang manis",
  "resepi ikan talapia masak sambal cili api",
  "resepi sayur keladi masak tempoyak",
  "resepi pulut udang utara",
  "resepi vegetarian food",
  "resepi bubur nasi daging simple",
  "resepi ayam masak rendang sedap",
  "resepi lopes boyan",
  "resepi puding jagung kastard berkuah",
  "resepi ikan tongkol masak lemak nenas",
  "resepi biskut arab",
  "resepi kerabu kerang ala thai",
  "resepi tat telur",
  "resepi siakap masak stim asam boi",
  "resepi popia kari cheese",
  "resepi kari ikan bawal mamak",
  "resepi makaroni bakar azie kitchen",
  "resepi udang tempura sushi king",
  "ayam resepi nasi beriani",
  "resepi gulai kambing kedah",
  "resepi onde onde melaka",
  "resepi kuih tradisional mudah dan ringkas",
  "resepi daging dendeng mudah",
  "resepi sambal ayam penyet indonesia",
  "resepi kuih cakar ayam",
  "resepi topping donut strawberry",
  "resepi dorayaki",
  "resepi ayam cheese korea",
  "resepi dalca ayam sedap",
  "resepi biskut horlick susu",
  "resepi tom yam seafood sedap",
  "resepi ikan salmon grill sos lemon",
  "resepi laksam mudah",
  "resepi sardin",
  "menu secret recipe promotion",
  "resepi kuah rojak sedap",
  "resepi popiah basah nyonya",
  "resepi masakan berasaskan ayam",
  "resepi ikan bawal putih masak kicap",
  "cara buat roti sardin",
  "resepi ayam masak asam",
  "resepi kuah percik terengganu",
  "resepi ikan pari masak lemak cili api",
  "resepi makanan dalam pantang",
  "resepi steak ayam",
  "biskut semperit resepi biskut",
  "resepi ikan kembung bakar portugis",
  "resepi dumpling udang",
  "resepi mee rebus udang kering",
  "resepi popia basah sayur",
  "resepi kacang goreng tepung",
  "resepi ayam masala sedap",
  "resepi daging burger sedap",
  "resepi kerepek ubi kayu cheese",
  "resepi masak lemak kobis",
  "resepi kuah dal mamak haji",
  "resepi masakan minang",
  "resepi kek labu coklat",
  "resepi kek pandan cheese azlina ina",
  "resepi masakan fish cake",
  "resepi kuih guna tepung pulut",
  "kuih getas",
  "resepi pulut sambal",
  "resepi pisang abu goreng",
  "masak lemak resepi udang galah",
  "resepi udang masak lemak cili padi simple",
  "resepi perap daging kambing black pepper",
  "resepi sos ayam bakar",
  "resepi budu masak",
  "resepi bubur pulut hitam jagung",
  "soto resepi",
  "resepi stew kimchi",
  "resepi ketam masak telur masin",
  "resepi puteri ayu cheese leleh",
  "resepi daging kerbau masak hitam",
  "resepi kek lapis tembikai",
  "resepi nasi minyak terengganu noxxa",
  "resepi masak tomyam simple",
  "resepi singgang tulang kelantan",
  "resepi ayam masak tomyam simple",
  "resepi nasi bukhari ayam simple",
  "resepi makaroni bakar sedap",
  "resepi bihun tomyam sedap",
  "resepi sambal cili nasi ayam hainan",
  "resepi icing kek fresh cream",
  "resepi brownies sedap",
  "resepi tatura cream cheese",
  "resepi sup sayur telur simple",
  "resepi sambal tempoyak daun kayu",
  "resepi burung puyuh goreng",
  "resepi rendang ayam minang chef wan",
  "resepi kentang wedges tepung bestari",
  "resepi bihun bakso",
  "resepi sambal tempoyak daun kayu pahang",
  "resepi noxxa baru",
  "resepi kuih loyang tanpa santan",
  "resepi kuih burger malaysia gebu",
  "resepi ungkep jawa",
  "resepi lauk mudah dan jimat",
  "resepi tortilla diet",
  "resepi kek pisang coklat",
  "resepi air jagung",
  "resepi masakan ikan bawal emas",
  "cara buat coleslaw",
  "resepi daging masak kari",
  "resepi pulut sambal ikan kelantan",
  "resepi kuih bihun goreng manis",
  "resepi cek mek molek keledek",
  "resepi marshmallow cookies",
  "resepi pes tomyam thai paling sedap",
  "resepi nasi dagang mudah dan ringkas noxxa",
  "resepi apom",
  "resepi maggi kuah tanpa perencah",
  "resepi biskut coklat badam hiris",
  "resepi nugget nasi untuk anak",
  "resepi french fries rangup",
  "resepi ikan bilis cili padi",
  "resepi masak telur ikan",
  "resepi gulai nasi dagang sedap",
  "resepi nasi mandy",
  "resepi puding kek red velvet oreo truffle",
  "resepi ubi kayu tumis",
  "resepi sotong masak asam pedas",
  "resepi nasi lemak noxxa",
  "resepi wantan homemade",
  "resepi biskut sarang semut sedap",
  "resepi kacang buncis goreng udang",
  "resepi masakan udang paling sedap",
  "my resepi",
  "tosei resepi",
  "resepi kuih kaswi tepung gandum",
  "resepi kambing bbq",
  "resepi kulit popiah",
  "resepi ayam masak serai lengkuas",
  "resepi sup tulang daging utara",
  "bubur kacang hijau resepi malaysia",
  "resepi nasi dagang beras biasa dan beras pulut",
  "resepi jus tembikai sedap",
  "resepi kuah mee rebus",
  "resepi aiskrim coki coki",
  "resepi mash potato sedap",
  "resepi sambal telur pecah sedap",
  "resepi terung goreng tepung bestari",
  "resepi kuah mee jawa",
  "resepi bingka tepung",
  "resepi lauk pauk kelantan",
  "resepi mee kicap cina",
  "resepi sambal ikan bakar",
  "resepi puding jagung kastard mudah",
  "resepi ayam panggang kenny rogers azie kitchen",
  "resepi nasi goreng sardin hanis zalikha",
  "cara masak udang galah",
  "resepi lala masak sos tiram",
  "resepi biskut shortbread rangup",
  "resepi kek coklat karamel tanpa telur",
  "resepi sup ayam sedap ala thai",
  "resepi kari ikan mamak",
  "resepi pavlova mini",
  "resepi burnt cheesecake 500g cream cheese",
  "resepi aiskrim durian homemade",
  "resepi sambal kacang tanah",
  "resepi mee sup thai",
  "resepi asam pedas ikan sembilang azie kitchen",
  "resepi jelly kelapa sedap",
  "resepi sambal bilis kering sedap",
  "resepi masak lemak labu kuning",
  "resepi ikan kelah bakar",
  "mee bakso resepi",
  "resepi biskut mm azlita",
  "resepi ikan talapia merah sweet sour",
  "resepi puding marble coklat",
  "resepi cucur pisang",
  "resepi puding jelly mangga",
  "resepi kek onde onde gula melaka",
  "resepi goreng cempedak rangup",
  "resepi kuih jala",
  "resepi ayam goreng mamak simple",
  "resepi nasi khao mok mudah",
  "resepi kulit crepe",
  "resepi kacang goreng pedas manis",
  "resepi kek batik topping coklat ganache",
  "resepi kari ikan pari mudah",
  "resepi udang sweet sour azie kitchen",
  "resepi salmon grill white sauce",
  "resepi aiskrim malaysia solero",
  "resepi ice cream malaysia paddle pop",
  "koleksi resepi masakan telur",
  "resepi tom yam thailand pekat",
  "resepi ayam berempah mudah",
  "cara masak telur sambal",
  "resepi ayam panggang madu",
  "resepi tauhu goreng ayam penyet",
  "resepi mee rebus terengganu",
  "resepi dalca daging kambing",
  "resepi bunga durian",
  "resepi biskut almond london azie kitchen",
  "aneka resepi kek coklat",
  "resepi laksa johor mudah",
  "resepi kuih tart nenas sepit",
  "resepi keria keledek oren",
  "resepi udang masak sos cili",
  "resepi kubis cina masak lemak",
  "resepi dari roti putih",
  "resepi kari kepala ikan jenahak tanpa santan",
  "resepi lokan masak rendang",
  "resepi pengat ubi keledek kelantan",
  "resepi sambal tumis nasi lemak",
  "resepi char kuey teow goreng",
  "resepi kek marble cheese azlita",
  "resepi ayam masak cili hijau",
  "resepi bubur sum sum",
  "resepi sambal kelapa ulam raja",
  "resepi taugeh",
  "resepi biskut cheese parut",
  "resepi hati ayam masak rendang",
  "resepi pretzel",
  "resepi burnt cheesecake mat gebu",
  "resepi kuih keria gula melaka mat gebu",
  "resepi mee kari mudah",
  "resepi air sarbat penang",
  "resepi telur hancur masak kicap",
  "resepi kepala ikan merah",
  "resepi sotong kembang masak kicap",
  "resepi kek teh tarik boba",
  "resepi sayur pucuk ubi kayu",
  "resepi ayam masak kurma tanpa santan",
  "resepi filling coklat bomboloni",
  "resepi serunding halia ikan bilis lada hitam",
  "resepi langsana",
  "resepi ikan keli goreng rangup",
  "resepi smoothie sihat",
  "resepi ikan tongkol masak kicap",
  "resepi bubur lambuk ayam",
  "resepi sambal goreng jawa kicap",
  "resepi tomyam pekat dan pedas",
  "resepi ikan selayang masak kari",
  "resepi agar agar mudah dan sedap",
  "resepi cili nasi ayam guna cili kering",
  "resepi nasi ayam roasted cina",
  "resepi kerabu daging thai",
  "resepi laksa utara paling sedap",
  "resepi nasi beriani mudah dan sedap",
  "resepi peneram sabah",
  "resepi singgang ikan selar",
  "putu mayam resepi",
  "resepi gulai batang pisang baling",
  "resepi ayam masak lemak cili api sedap",
  "spagetti resepi",
  "resepi ikan talapia stim cina",
  "resepi pulut hitam",
  "resepi pulut kacau noxxa",
  "resepi tongkeng ayam madu bakar",
  "resepi kuih donat lembut dan gebu",
  "resepi pasta untuk baby",
  "resepi potato salad azie",
  "resepi sambal hijau thailand",
  "resepi kolo mee chinese style",
  "resepi diet keto",
  "resepi budu tempoyak",
  "resepi ikan caru bakar dan air asam",
  "paru masak berlada",
  "resepi masakan sayur bendi",
  "resepi kuah pecal segera",
  "daging resepi makaroni goreng",
  "resepi nasi briyani ayam simple",
  "resepi sup tulang siam azie kitchen",
  "resepi puree untuk bayi 6 bulan",
  "resepi makanan bayi 8 bulan",
  "resepi daging masak hitam kedah",
  "resepi biskut sampan azlina ina",
  "resepi kuih denderam lembut",
  "resepi kerabu daging mentah",
  "resepi nasi ulam chef ismail",
  "resepi masak lemak pucuk paku kerang",
  "resepi sambal air asam sedap",
  "resepi mee bandung muar original",
  "resepi kuih cincin tradisi brunei",
  "resepi kolo mee",
  "resepi umpan rohu 2018",
  "popia basah resepi",
  "resepi cendol gula apong",
  "resepi burnt cheesecake azlita aziz",
  "resepi doh roti sosej",
  "resepi nasi dagang terengganu tanak",
  "resepi daging masak kicap pedas azie kitchen",
  "resepi mac n cheese",
  "resepi biskut cincin susu",
  "resepi agar agar buah naga merah",
  "resepi red velvet cheesecake brownies",
  "resepi lobster",
  "resepi kek majerin gebu",
  "resepi mi kari",
  "cucur ikan bilis rangup",
  "resepi makaroni carbonara prego",
  "resepi hati ayam masak rempah",
  "cara masak sambal telur",
  "resepi jamu awet muda",
  "resepi sup campur sedap",
  "resepi kek raya 2018",
  "resepi nasi daging utara azlita",
  "resepi telur bungkus ayam",
  "bubur ayam mcd resepi",
  "resepi kerabu tomato simple",
  "resepi sambal jering cili api",
  "takoyaki resepi",
  "resepi kerepek tepung pedas",
  "resepi pulut pagi kacang merah",
  "resepi pancake milo mudah",
  "resepi kuah lodeh mat gebu",
  "resepi kek 2 bahan",
  "resepi tomyam sayur ala thai",
  "resepi daging masak halia ala thai",
  "ikan goreng berlada",
  "sambal ikan bilis sedap",
  "resepi taufufah lembut",
  "resepi roti telur hancur",
  "famous amos cookies resepi",
  "resepi kek sarang lebah",
  "resepi tart nenas cube",
  "resepi mee ladna mat gebu",
  "resepi sayur sawi goreng sedap",
  "resepi puding kek premium",
  "resepi kimchi",
  "cara buat char kuey teow",
  "resepi noxxa pdf",
  "cara buat bubur jagung",
  "resepi sup bakso",
  "resepi roti john sosej",
  "resepi tart nenas 3 bahan",
  "resepi spiral goreng tuna",
  "resepi tart nenas cheese",
  "resepi kek hari jadi simple",
  "resepi ayam goreng mamak azie kitchen",
  "resepi sup ayam thai masam",
  "carbonara resepi spaghetti",
  "resepi choco jar sedap",
  "resepi lontong jawa",
  "resepi menu sihat untuk diet",
  "resepi sotong sumbat bakar",
  "resepi kek gulung pandan azlita",
  "resepi itik panggang cina",
  "resepi daging bakar danok",
  "resepi bibimbap bulgogi halal",
  "resepi carrot cake azlita",
  "resepi singgang daging tanpa lengkuas",
  "resepi kuih churros",
  "resepi telur bistik ayam",
  "resepi kek birthday pelangi",
  "resepi mee kari ipoh",
  "resepi kuih gelang mudah",
  "ikan kembung resepi asam pedas melaka",
  "resepi perapan ayam bakar diet",
  "resepi mee calong kuantan",
  "resepi ayam masak gajus dan cili kering",
  "resepi corn dog cheese simple tanpa susu",
  "resepi pucuk ubi masak tempoyak petai",
  "resepi ikan masak stim thai",
  "resepi ikan haruan dalam pantang",
  "resepi ayam bbq madu simple",
  "resepi satay daging",
  "resepi sotong masak lemak cili api azie kitchen",
  "resepi roti john gardenia",
  "resepi rendang kambing simple",
  "resepi mee hoon goreng putih sedap",
  "resepi tat nenas gulung",
  "resepi pucuk paku",
  "resepi roti putih noxxa",
  "resepi laksa pahang kuah merah",
  "resepi masak kurma daging utara",
  "resepi nasi ayam sambal cili kering",
  "resepi kek blueberry cheese leleh azlina ina",
  "resepi cheesekut sedap dan mudah",
  "resepi kulit tart nenas",
  "resepi kuih guna gula melaka",
  "resepi tomyam putih ayam ala thai",
  "resepi biskut conflakes rangup",
  "resepi cakoi bersarang",
  "resepi kimchi mudah",
  "resepi maggi celup thailand",
  "resepi sambal belacan power",
  "resepi kambing beriani",
  "resepi ikan merah sup",
  "resepi dadih milo homemade",
  "resepi sambal kacang ikan bilis",
  "resepi roti gulung sosej tanpa serbuk roti",
  "resepi bayam brazil goreng",
  "nasi goreng lada kering",
  "resepi sup rumpai laut kering",
  "resepi sambal tauhu",
  "resepi kueh tiaw kungfu",
  "resepi salmon",
  "resepi ayam panggang berempah",
  "resepi garam belacan",
  "resepi untuk diet",
  "resepi pulut seri kaya pandan",
  "resepi apple pie mcd",
  "resepi sambal hitam pahang kuantan",
  "resepi nasi goreng nanas",
  "resepi nasi dagang noxxa",
  "resepi kuih rengas mat gebu",
  "resepi air bandung abc",
  "resepi keria antarabangsa azlina ina",
  "resepi ikan kembung masak asam rebus",
  "resepi ikan bawal bakar",
  "resepi nasi ayam gemas",
  "resepi sup daging ala thai",
  "resepi fillet ikan dori",
  "resepi ketam kam heong chef wan",
  "resepi choc chip cookies azie kitchen",
  "resepi asam rebus ikan kembung",
  "resepi ikan mayong masak tempoyak",
  "resepi teh tarik madu",
  "resepi sayur bayam merah goreng",
  "resepi kek lapis pandan sarawak",
  "resepi laksam johor",
  "resepi kuih qasidah",
  "resepi ikan kembung masak lemak nenas",
  "resepi seri kaya telur kelantan",
  "resepi biskut cheese stick",
  "resepi sotong goreng mamak",
  "resepi singgang ikan tongkol azie kitchen",
  "resepi tiramisu biskut",
  "resepi nasi goreng cina",
  "resepi daging lada hitam",
  "resepi nasi goreng kimchi pedas",
  "resepi kek marble gebu sedap",
  "resepi ayam goreng mayonis mudah",
  "resepi ketupat sotong noxxa",
  "resepi carbonara prego tanpa susu",
  "resepi nugget ayam homemade simple",
  "resepi kek pilih kasih",
  "resepi ikan goreng tepung rangup",
  "resepi ketam goreng cili kering",
  "resepi udang galah goreng berlada",
  "resepi air bandung cincau",
  "resepi pengat pisang sagu azie kitchen",
  "resepi tapai pulut step by step",
  "resepi bulgogi daging mudah",
  "resepi sambal goreng ikan bilis kering",
  "resepi kerabu perut mangga",
  "resepi cornflakes madu simple tanpa bakar",
  "resepi sambal asam belimbing",
  "aneka resepi roti sosej",
  "sambal belacan resepi sambal laksa sarawak",
  "resepi daging hancur cheese",
  "resepi roti kampung",
  "resepi ikan talang masak asam pedas",
  "resepi mee sup ayam kb",
  "resepi sambal telur pecah mudah",
  "resepi ikan kembung masak lemak cili api azie kitchen",
  "resepi sotong bakar berempah"
];

// Clean duplicates
const uniqueKeywords = [...new Set(KEYWORDS.map(k => k.trim()))];
console.log(`Jumlah kata kunci asal: ${KEYWORDS.length}`);
console.log(`Jumlah kata kunci unik: ${uniqueKeywords.length}`);

// Unsplash image library matched by category keywords
const IMAGES = {
  ayam: [
    "https://images.unsplash.com/photo-1598908314732-07113901949e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562967914-6c822e12a61c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1000&auto=format&fit=crop"
  ],
  daging: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop"
  ],
  ikan: [
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580476214448-6572e530c56d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=1000&auto=format&fit=crop"
  ],
  seafood: [
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559737113-b674a96482aa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop"
  ],
  nasi: [
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop"
  ],
  mee: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop"
  ],
  baking: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop"
  ],
  dessert: [
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop"
  ],
  general: [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490815685287-e2593d84998f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop"
  ]
};

// Map keywords to specific categories
function getCategoryAndImage(kw) {
  const lower = kw.toLowerCase();
  
  if (lower.includes("ayam") || lower.includes("puyuh") || lower.includes("tongkeng")) {
    const list = IMAGES.ayam;
    return { cat: "Lauk Ayam", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("daging") || lower.includes("kambing") || lower.includes("dendeng") || lower.includes("paru") || lower.includes("hati") || lower.includes("steak") || lower.includes("bistik")) {
    const list = IMAGES.daging;
    return { cat: "Lauk Daging", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("ikan") || lower.includes("siakap") || lower.includes("cencaru") || lower.includes("tongkol") || lower.includes("kembung") || lower.includes("bawal") || lower.includes("jenahak") || lower.includes("keli") || lower.includes("talapia") || lower.includes("sardin") || lower.includes("pari") || lower.includes("mentarang") || lower.includes("lokan") || lower.includes("kerang") || lower.includes("lala") || lower.includes("ketam") || lower.includes("udang") || lower.includes("sotong") || lower.includes("salmon") || lower.includes("dori") || lower.includes("tuna")) {
    const list = lower.includes("udang") || lower.includes("sotong") || lower.includes("lala") || lower.includes("ketam") ? IMAGES.seafood : IMAGES.ikan;
    return { cat: "Lauk Seafood", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("nasi") || lower.includes("bubur") || lower.includes("briyani") || lower.includes("manday") || lower.includes("bukhari") || lower.includes("soto")) {
    const list = IMAGES.nasi;
    return { cat: "Hidangan Nasi", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("mee") || lower.includes("mi ") || lower.includes("mi") || lower.includes("bihun") || lower.includes("kuey teow") || lower.includes("kueh tiaw") || lower.includes("spaghetti") || lower.includes("spageti") || lower.includes("macaroni") || lower.includes("makaroni") || lower.includes("pasta") || lower.includes("udon") || lower.includes("yee mee") || lower.includes("bakso") || lower.includes("laksa") || lower.includes("laksam")) {
    const list = IMAGES.mee;
    return { cat: "Mee & Pasta", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("biskut") || lower.includes("tart") || lower.includes("semperit") || lower.includes("cookies") || lower.includes("chipsmore") || lower.includes("shortbread") || lower.includes("mazola") || lower.includes("makmur")) {
    const list = IMAGES.baking;
    return { cat: "Biskut & Cookies", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("kek") || lower.includes("cake") || lower.includes("cheesecake") || lower.includes("brownies") || lower.includes("muffin") || lower.includes("trifle") || lower.includes("pavlova") || lower.includes("fondant") || lower.includes("icing") || lower.includes("cream")) {
    const list = IMAGES.baking;
    return { cat: "Kek & Brownies", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("donut") || lower.includes("donat") || lower.includes("roti") || lower.includes("john") || lower.includes("prata") || lower.includes("canai") || lower.includes("capati") || lower.includes("tosei") || lower.includes("pita") || lower.includes("dumpling") || lower.includes("wantan") || lower.includes("bun") || lower.includes("pau") || lower.includes("cakoi") || lower.includes("lempeng") || lower.includes("pancake") || lower.includes("pankek") || lower.includes("dorayaki") || lower.includes("tortilla") || lower.includes("crepe") || lower.includes("karipap") || lower.includes("churros")) {
    const list = IMAGES.baking;
    return { cat: "Roti & Sarapan", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("air") || lower.includes("jus") || lower.includes("koktel") || lower.includes("aiskrim") || lower.includes("ice cream") || lower.includes("minuman") || lower.includes("yogurt") || lower.includes("teh") || lower.includes("cendol") || lower.includes("abc") || lower.includes("sarbat")) {
    const list = IMAGES.dessert;
    return { cat: "Minuman & Aiskrim", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("puding") || lower.includes("dadih") || lower.includes("agar") || lower.includes("caca") || lower.includes("butir nangka") || lower.includes("sumsum") || lower.includes("sum sum") || lower.includes("sagu") || lower.includes("karamel") || lower.includes("kastard") || lower.includes("pengat")) {
    const list = IMAGES.dessert;
    return { cat: "Pencuci Mulut", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  if (lower.includes("kuih") || lower.includes("apam") || lower.includes("apom") || lower.includes("seri muka") || lower.includes("talam") || lower.includes("kaswi") || lower.includes("bom keledek") || lower.includes("goyang") || lower.includes("cara berlauk") || lower.includes("ropa") || lower.includes("bengkang") || lower.includes("bingka") || lower.includes("qasidah") || lower.includes("lopes") || lower.includes("onde") || lower.includes("nagasari") || lower.includes("cek mek") || lower.includes("jawa") || lower.includes("dahlia") || lower.includes("loyang") || lower.includes("peneram") || lower.includes("serabai") || lower.includes("cakar ayam") || lower.includes("getas") || lower.includes("putu")) {
    const list = IMAGES.baking;
    return { cat: "Kuih Muih Tradisi", img: list[Math.floor(Math.random() * list.length)] };
  }
  
  const list = IMAGES.general;
  return { cat: "Aneka Resepi", img: list[Math.floor(Math.random() * list.length)] };
}

// Generate highly realistic ingredients and steps dynamically
function getIngredientsAndSteps(kw, cat) {
  const lower = kw.toLowerCase();
  
  // Initialize lists
  let ingredients = [];
  let steps = [];
  let tips = [];
  let faqs = [];
  
  let prep = 15;
  let cook = 25;
  let cal = 320;
  let diff = "Mudah";
  let servings = 4;

  if (cat === "Lauk Ayam") {
    ingredients = [
      "1 ekor ayam (dipotong 12 dan dibersihkan)",
      "2 batang serai (dititik)",
      "1 helai daun kunyit (dihiris halus)",
      "2 cawan santan pekat (dari 1 biji kelapa)",
      "1 cawan air asam jawa",
      "Garam dan gula secukup rasa",
      "Bahan Kisar: 15 biji cili padi, 5 biji bawang merah, 3 ulas bawang putih, 2 inci kunyit hidup, 1 inci halia"
    ];
    if (lower.includes("tempoyak")) {
      ingredients.push("4 sudu besar tempoyak segar berkualiti tinggi");
      ingredients.splice(ingredients.indexOf("1 cawan air asam jawa"), 1); // remove tamarind
    }
    if (lower.includes("bakar") || lower.includes("panggang") || lower.includes("rosemary") || lower.includes("percik")) {
      ingredients.push("3 sudu besar madu asli");
      ingredients.push("2 sudu besar minyak masak (untuk lumuran)");
    }
    
    steps = [
      "Bersihkan isi ayam dengan garam kasar dan basuh bersih. Toskan ayam sehingga kering.",
      "Kisar halus bahan-bahan kisar menggunakan pengisar dengan sedikit air.",
      "Masukkan ayam, bahan kisar halus, dan serai dititik ke dalam periuk di atas api sederhana.",
      "Kacau rata dan biar ayam mengeluarkan airnya sendiri (proses mengecutkan ayam) selama 10 minit.",
      "Tuangkan santan pekat dan air secukupnya. Kacau perlahan-lahan agar santan tidak pecah.",
      "Perasakan dengan garam, sedikit gula melaka, dan kacau sehingga kuah mulai pekat dan ayam empuk.",
      "Taburkan hirisan daun kunyit di atasnya sebagai penambah aroma harum sebelum memadamkan api."
    ];
    
    tips = [
      "Bagi memastikan santan tidak pecah, sentiasa kacau kuah secara perlahan-lahan di atas api kecil.",
      "Menggunakan kunyit hidup berbanding serbuk kunyit memberikan warna kuning asli yang sangat menawan.",
      "Perap ayam bersama garam kunyit seketika sebelum dimasak untuk rasa yang lebih meresap ke dalam tulang."
    ];
    
    faqs = [
      { q: `Berapa lama ayam boleh tahan jika disimpan dalam peti ais?`, a: `Lauk ayam ini boleh bertahan sehingga 3 hari dalam peti sejuk biasa dan sehingga 1 bulan jika dibekukan dalam peti sejuk beku.` },
      { q: `Bolehkah saya gantikan santan pekat dengan susu sejat?`, a: `Boleh. Susu sejat (susu cair) adalah alternatif yang lebih rendah kalori, namun kuahnya akan terasa sedikit berbeza dari segi kelemakan asli santan.` },
      { q: `Bagaimana untuk mengelakkan kuah ayam menjadi terlalu pedas?`, a: `Anda boleh mengurangkan bilangan cili padi atau membuang biji cili merah sebelum mengisarnya.` }
    ];
    
    prep = 15;
    cook = 30;
    cal = 410;
    diff = lower.includes("percik") ? "Sederhana" : "Mudah";
  }
  else if (cat === "Lauk Daging") {
    ingredients = [
      "800 gram daging lembu segar (dipotong melawan urat)",
      "2 cawan santan pekat asli",
      "3 sudu besar kerisik kelapa (disangrai wangi)",
      "2 helai daun kunyit (disiat)",
      "3 keping asam keping / gelugur",
      "Garam kasar dan gula melaka secukupnya",
      "Bahan Kisar: 20 tangkai cili kering, 8 biji bawang merah, 4 ulas bawang putih, 2 inci halia, 2 inci lengkuas, 3 batang serai"
    ];
    if (lower.includes("kambing")) {
      ingredients[0] = "800 gram daging kambing segar (dipotong kiub)";
      ingredients.push("2 sudu besar rempah kari daging (untuk menghilangkan bau hamis)");
    }
    if (lower.includes("kicap")) {
      ingredients.push("1 cawan kicap manis berkualiti tinggi");
      ingredients.push("2 sudu besar kicap pekat");
    }

    steps = [
      "Basuh daging bersih-bersih, toskan dan potong melawan urat daging agar tidak liat apabila dimasak.",
      "Rebus daging dalam periuk berisi air sehingga separuh empuk. Simpan air rebusan daging sebagai stok kuah.",
      "Tumis bahan kisar halus bersama rempah tumis dalam kuali besar sehingga pecah minyak dan wangi.",
      "Masukkan daging yang telah direbus tadi dan gaul rata bersama bumbu tumisan.",
      "Tuangkan air rebusan daging dan santan pekat secara berperingkat sambil dikacau rata.",
      "Masukkan kerisik kelapa wangi, asam gelugur, garam, dan gula melaka. Masak dengan api perlahan.",
      "Biarkan kuah mereneh perlahan-lahan sehingga daging benar-benar empuk, kuah pekat dan mengeluarkan minyak semula jadi."
    ];

    tips = [
      "Sentiasa potong daging secara melintang (melawan urat daging) untuk memastikan serat daging putus dan cepat empuk.",
      "Memasukkan sebatang sudu keluli atau beberapa helai daun nangka ke dalam rebusan daging boleh mempercepatkan proses melembutkan daging.",
      "Gunakan gula melaka tulen berbanding gula putih untuk menghasilkan warna lauk yang gelap berkilat dan rasa manis karamel semula jadi."
    ];

    faqs = [
      { q: `Bagaimana mematikan bau hamis daging kambing?`, a: `Rendam daging kambing dengan tepung gandum dan perahan jus limau nipis selama 15 minit sebelum dibilas bersih.` },
      { q: `Bolehkah saya memasak rendang daging menggunakan pressure cooker?`, a: `Sangat digalakkan. Anda boleh merebus daging sehingga empuk dalam 15-20 minit sahaja menggunakan pressure cooker sebelum dikeringkan bumbunya.` },
      { q: `Apakah beza daging masak hitam dengan masak kicap?`, a: `Daging masak hitam menggunakan bumbu rempah ratus kering yang disangrai hitam dan lebih banyak kerisik serta kicap pekat, manakala masak kicap lebih ringkas dan berkuah cair.` }
    ];

    prep = 25;
    cook = 60;
    cal = 490;
    diff = "Sederhana";
  }
  else if (cat === "Lauk Seafood") {
    ingredients = [
      "500 gram seafood segar (Ikan / Udang / Sotong / Lala)",
      "2 biji bawang besar (dihiris bulat)",
      "3 ulas bawang putih (diketuk)",
      "1 inci halia (dihiris halus)",
      "2 batang serai (dititik)",
      "3 helai daun limau purut (dibuang urat tengah)",
      "2 sudu besar sos tiram & sos cili",
      "Perahan jus limau nipis secukupnya",
      "Bahan Tumis: 3 sudu besar cili giling / cili boh"
    ];
    if (lower.includes("tempoyak")) {
      ingredients.push("3 sudu besar tempoyak segar pahang");
    }
    if (lower.includes("siakap") || lower.includes("stim")) {
      ingredients = [
        "1 ekor ikan siakap segar (dibersihkan)",
        "3 batang serai (dihiris tipis)",
        "2 inci halia (dihiris halus)",
        "5 ulas bawang putih (dicincang kasar)",
        "10 biji cili padi merah (dihiris)",
        "2 sudu besar sos ikan premium",
        "Jus dari 3 biji limau nipis segar",
        "1 cawan air suam",
        "Daun ketumbar untuk hiasan"
      ];
    }

    if (lower.includes("siakap") || lower.includes("stim")) {
      steps = [
        "Bersihkan ikan siakap sepenuhnya. Kelar sedikit bahagian badan ikan dan letakkan dalam pinggan tahan panas.",
        "Taburkan hirisan halia, bawang putih dicincang, dan serai di atas serta di dalam perut ikan siakap.",
        "Dalam mangkuk kecil, bancuh air suam bersama sos ikan, jus limau nipis, cili padi hiris, garam dan secubit gula.",
        "Tuangkan bancuhan sos tersebut ke atas seluruh badan ikan siakap secara rata.",
        "Panaskan pengukus sehingga air mendidih. Masukkan ikan dan kukus di atas api besar selama 12-15 minit.",
        "Pastikan ikan tidak terlebih masak (overcooked) agar kemanisan isi ikan siakap segar tidak hilang.",
        "Keluarkan dari pengukus dan taburkan dengan daun ketumbar segar sebelum dihidangkan panas-panas."
      ];
    } else {
      steps = [
        "Bersihkan makanan laut dengan teliti. Lumur dengan garam dan sedikit asam jawa untuk hilangkan hanyir.",
        "Panaskan minyak dalam kuali, tumis bawang putih, halia, dan serai sehingga naik bau harum.",
        "Masukkan cili giling dan masak di atas api sederhana sehingga cili benar-benar garing dan pecah minyak.",
        "Masukkan sos tiram, sos cili, sos tomato dan kacau sebati bumbunya.",
        "Masukkan seafood (udang/sotong/lala) dan kacau rata dengan pantas di atas api yang kuat.",
        "Masukkan hirisan bawang besar dan daun limau purut untuk aroma segar masakan.",
        "Matikan api selepas 5-7 minit agar seafood kekal lembut, manis, dan tidak menjadi liat."
      ];
    }

    tips = [
      "Jangan memasak udang atau sotong terlalu lama kerana haba berlebihan akan merosakkan tekstur isi menjadikannya liat dan keras.",
      "Untuk stim ikan ala cina yang sempurna, pastikan air pengukus sudah betul-betul menggelegak sebelum memasukkan ikan.",
      "Gunakan sos ikan berkualiti tinggi untuk mendapatkan rasa umami laut yang asli dan seimbang."
    ];

    faqs = [
      { q: `Bagaimanakah cara memilih siakap yang segar di pasar?`, a: `Pilih siakap yang mempunyai mata yang jernih dan menonjol, insang berwarna merah cerah, serta isi ikan yang anjal apabila ditekan.` },
      { q: `Bolehkah resepi ini digunakan untuk ikan bawal atau jenahak?`, a: `Sangat sesuai. Formula sos stim ini sangat universal dan sesuai untuk semua jenis ikan putih seperti bawal, jenahak, atau kerapu.` },
      { q: `Adakah perlu membuang kulit udang sebelum memasak?`, a: `Tidak perlu. Kulit udang membantu mengekalkan kelembapan isi udang dan memberikan rasa manis yang lebih kaya pada kuah sambal.` }
    ];

    prep = 10;
    cook = 15;
    cal = 280;
    diff = "Mudah";
  }
  else if (cat === "Hidangan Nasi") {
    ingredients = [
      "4 cawan beras basmati berkualiti tinggi (dicuci dan direndam 30 minit)",
      "5 cawan air rebusan ayam / sup stok",
      "1 cawan susu cair atau santan cair",
      "3 sudu besar minyak sapi asli",
      "2 helai daun pandan (disimpul)",
      "Bahan Aromatik: 1 batang kayu manis, 2 kuntum bunga lawang, 4 biji buah pelaga, 3 kuntum bunga cengkih",
      "Bahan Kisar: 1 labu bawang besar, 4 ulas bawang putih, 2 inci halia segar"
    ];
    if (lower.includes("lemak")) {
      ingredients = [
        "4 cawan beras putih berkualiti",
        "4 cawan santan cair segar",
        "2 inci halia (dihiris tipis)",
        "2 helai daun pandan (disimpul)",
        "1 batang serai (dititik - opsional)",
        "Secubit garam halus",
        "Hiasan: Telur rebus, kacang tanah goreng, ikan bilis goreng, timun hiris, sambal bilis padu"
      ];
    }

    if (lower.includes("lemak")) {
      steps = [
        "Cuci beras putih sehingga bersih dan toskan airnya sepenuhnya.",
        "Masukkan beras ke dalam periuk nasi elektrik (rice cooker).",
        "Tuangkan santan cair segar mengikut sukatan yang betul (biasanya nisbah beras ke santan adalah 1:1).",
        "Masukkan hirisan halia, daun pandan disimpul, serai dititik, dan secubit garam halus ke dalam beras.",
        "Kacau rata perlahan-lahan agar garam melarut sekata dalam santan.",
        "Tutup periuk dan hidupkan suis periuk nasi elektrik untuk memasak nasi lemak secara automatik.",
        "Setelah nasi masak (butang bertukar 'warm'), biarkan selama 10 minit sebelum gemburkan nasi dengan garpu secara perlahan."
      ];
    } else {
      steps = [
        "Cuci beras basmati dengan bersih secara perlahan-lahan agar butiran beras tidak patah. Rendam selama 30 minit kemudian toskan.",
        "Panaskan minyak sapi di dalam periuk. Tumis bahan aromatik (kayu manis, bunga lawang, pelaga, cengkih) sehingga wangi.",
        "Masukkan bahan kisar halus dan daun pandan disimpul. Tumis sehingga bumbu kekuningan dan garing.",
        "Tuangkan air rebusan ayam segar, susu cair/santan cair, dan perasakan dengan garam secukup rasa. Biar mendidih.",
        "Masukkan beras basmati yang telah ditos kering. Kacau perlahan-lahan agar sebati.",
        "Masak nasi di atas api sederhana sehingga airnya kering diserap sepenuhnya oleh beras.",
        "Kecilkan api sekecil-kecilnya, tutup periuk dengan rapat (boleh dialas dengan aluminium foil) dan biarkan nasi tanak selama 15 minit."
      ];
    }

    tips = [
      "Gemburkan nasi basmati menggunakan garpu atau senduk kayu nipis secara perlahan dari tepi periuk bagi mengelakkan butiran nasi patah.",
      "Untuk nasi lemak yang wangi gila, gunakan santan segar dari kelapa parut asli berbanding santan kotak siap guna.",
      "Rendam beras basmati sekurang-kurangnya 30 minit sebelum dimasak untuk memastikan beras memanjang dengan cantik dan lembut."
    ];

    faqs = [
      { q: `Mengapa nasi minyak saya menjadi lembik dan melekat?`, a: `Kemungkinan besar sukatan cecair terlebih atau beras tidak ditos kering sepenuhnya sebelum dimasak. Gunakan nisbah air yang disyorkan.` },
      { q: `Bolehkah saya masak nasi lemak tanpa menggunakan santan langsung?`, a: `Boleh. Anda boleh menggantikan santan dengan susu cair atau minyak sapi untuk mendapatkan tekstur lemak yang sihat.` },
      { q: `Bagaimana memastikan nasi lemak tidak cepat basi?`, a: `Masukkan sedikit halia hiris dan pastikan nasi lemak dikukus sepenuhnya atau dimasak sehingga betul-betul kering air santannya.` }
    ];

    prep = 15;
    cook = 25;
    cal = 380;
    diff = "Mudah";
  }
  else if (cat === "Mee & Pasta") {
    ingredients = [
      "500 gram mee (Mee Kuning / Bihun / Kuey Teow / Spaghetti)",
      "200 gram isi ayam (dipotong dadu)",
      "100 gram udang segar (dibuang kulit)",
      "3 ulas bawang putih & 3 biji bawang merah (dicincang halus)",
      "3 sudu besar cili giling (mengikut tahap kepedasan)",
      "2 sudu besar sos tiram & sos cili & sos tomato",
      "3 sudu besar kicap manis & kicap cair",
      "1 cawan taugeh segar & sayur sawi",
      "2 biji telur gred A"
    ];
    if (lower.includes("carbonara")) {
      ingredients = [
        "400 gram spaghetti berkualiti",
        "200 gram daging hancur / kepingan ham ayam",
        "1 tin sos carbonara Prego / 2 cawan krim masakan (whipping cream)",
        "1 cawan susu segar penuh krim",
        "1 labu bawang besar (dihiris dadu)",
        "3 ulas bawang putih (dicincang halus)",
        "1 cawan parutan keju Parmesan / Cheddar",
        "2 sudu besar mentega asli",
        "Serbuk lada hitam kasar & daun parsli"
      ];
    }

    if (lower.includes("carbonara")) {
      steps = [
        "Rebus spaghetti dalam air mendidih yang diletakkan garam dan sedikit minyak selama 8-10 minit (al dente). Toskan.",
        "Panaskan mentega dalam kuali besar di atas api sederhana.",
        "Tumis bawang besar dadu dan bawang putih cincang sehingga wangi dan layu.",
        "Masukkan daging hancur atau ham ayam. Goreng sehingga daging masak sepenuhnya.",
        "Tuangkan sos carbonara tin, susu segar, dan keju parut. Kacau rata sehingga sos mulai mendidih perlahan.",
        "Perasakan dengan serbuk lada hitam kasar, garam secukup rasa, dan herba parsli.",
        "Masukkan spaghetti yang telah direbus tadi ke dalam sos carbonara pekat. Gaul rata selama 2 minit sebelum disajikan hangat."
      ];
    } else {
      steps = [
        "Rendam bihun dalam air biasa sehingga lembut (atau rebus mee kuning/spaghetti sebentar). Toskan kering.",
        "Panaskan minyak dalam kuali. Tumis bawang merah dan bawang putih cincang sehingga kekuningan.",
        "Masukkan cili giling dan masak sehingga cili benar-benar garing serta pecah minyak.",
        "Masukkan isi ayam dan udang segar. Kacau rata sehingga rencah laut masak sempurna.",
        "Masukkan sos tiram, sos cili, sos tomato, kicap manis, dan kicap cair. Kacau sehingga kuah berbuih.",
        "Tolak mee ke tepi kuali, pecahkan telur di tengah kuali dan kacau telur sehingga separa masak.",
        "Masukkan mee, taugeh, dan sayur sawi. Gaul rata dengan pantas di atas api besar sehingga semua bahan sebati."
      ];
    }

    tips = [
      "Rendam bihun dalam air biasa (suhu bilik) berbanding air panas untuk mengelakkan bihun hancur atau menjadi lembik semasa digoreng.",
      "Gunakan sedikit air rebusan pasta untuk mencairkan kuah carbonara yang terlalu pekat; ini membantu sos melekat pada pasta dengan cantik.",
      "Goreng mee di atas api yang sangat besar secara pantas untuk mendapatkan aroma hangus kuali (wok hei) ala restoran mamak."
    ];

    faqs = [
      { q: `Kenapa pasta carbonara saya pecah minyak dan kering?`, a: `Ini terjadi jika kuah carbonara dimasak di atas api yang terlalu panas atau selepas keju dimasukkan. Sentiasa guna api kecil atau padamkan api semasa memasukkan pasta.` },
      { q: `Bolehkah saya gunakan mee kuning dalam resepi soto?`, a: `Sangat boleh. Anda boleh padankan kuah soto berempah dengan mee kuning, bihun, mahupun nasi impit mengikut selera.` },
      { q: `Bagaimana menyimpan baki mee goreng yang tidak habis?`, a: `Simpan di dalam bekas kedap udara dalam peti sejuk. Panaskan semula menggunakan kuali atau ketuhar gelombang mikro (microwave) sebelum dimakan.` }
    ];

    prep = 10;
    cook = 15;
    cal = 350;
    diff = "Mudah";
  }
  else if (cat === "Biskut & Cookies" || cat === "Kek & Brownies" || cat === "Roti & Sarapan") {
    // Baking category
    ingredients = [
      "250 gram mentega tulen (lembut pada suhu bilik)",
      "150 gram gula kastor / gula perang",
      "1 biji telur gred A (suhu bilik)",
      "1 sudu teh esen vanila tulen",
      "350 gram tepung gandum (diayak)",
      "50 gram tepung jagung (untuk kerangupan ekstra)",
      "1 cawan coklat cip / badam hiris (opsional)"
    ];
    if (lower.includes("kek coklat")) {
      ingredients = [
        "2 cawan tepung gandum (diayak bersama baking powder)",
        "1 cawan serbuk koko berkualiti tinggi",
        "1 cawan gula kastor",
        "1 cawan susu pekat manis",
        "1 cawan minyak masak / mentega cair",
        "1 cawan air panas suam",
        "3 biji telur gred A",
        "1 sudu teh baking powder & 1 sudu teh soda bikarbonat"
      ];
    }
    if (lower.includes("donut") || lower.includes("roti")) {
      ingredients = [
        "500 gram tepung roti berkualiti tinggi (tepung berprotein tinggi)",
        "1 paket yis kering aktif (11 gram)",
        "2 sudu besar gula pasir & 2 sudu besar susu tepung",
        "1 biji telur gred A",
        "250 ml air suam kuku",
        "3 sudu besar mentega tulen",
        "Secubit garam halus"
      ];
    }

    if (lower.includes("kek coklat")) {
      steps = [
        "Ayakkan tepung gandum, serbuk koko, baking powder, dan soda bikarbonat di dalam mangkuk besar.",
        "Dalam mangkuk pengadun, pukul telur dan gula kastor menggunakan whisk sehingga kembang berkrim.",
        "Masukkan minyak masak, susu pekat manis, dan esen vanila. Pukul lagi sehingga sebati.",
        "Masukkan bahan kering yang telah diayak tadi secara berselang-seli dengan air panas suam. Kaup balik adunan perlahan-lahan.",
        "Sapukan mentega pada acuan kek dan tuangkan adunan kek coklat ke dalamnya.",
        "Panaskan pengukus atau oven (170°C). Kukus kek selama 45 minit di atas api sederhana sehingga masak.",
        "Cucuk bahagian tengah kek dengan lidi. Jika lidi keluar bersih, bermakna kek coklat moist anda sudah masak sempurna."
      ];
    } else if (lower.includes("donut") || lower.includes("roti")) {
      steps = [
        "Aktifkan yis: Campurkan yis kering, gula pasir, dan air suam kuku dalam gelas. Biarkan 10 minit sehingga berbuih.",
        "Dalam mangkuk besar, campurkan tepung roti, susu tepung, dan secubit garam halus.",
        "Masukkan telur dan tuangkan air yis yang telah berbuih tadi. Uli sehingga membentuk doh kasar.",
        "Masukkan mentega tulen. Uli doh dengan bertenaga selama 10-15 minit sehingga doh menjadi sangat elastik dan licin.",
        "Bulatkan doh, letak dalam mangkuk disapu minyak, tutup dengan kain lembap dan biarkan naik dua kali ganda (45 minit).",
        "Tumbuk doh untuk membuang angin. Bahagikan doh kepada bahagian kecil (50g) dan bentukkan bulat atau donut berlubang.",
        "Biarkan donut naik sekali lagi selama 15 minit sebelum digoreng dalam minyak panas di atas api sederhana kecil sehingga keemasan."
      ];
    } else {
      steps = [
        "Pastikan semua bahan berada pada suhu bilik. Ayakkan tepung gandum bersama tepung jagung.",
        "Pukul mentega tulen dan gula kastor/perang menggunakan pengadun sehingga berkrim dan bertukar warna sedikit pucat.",
        "Masukkan telur gred A dan esen vanila. Pukul perlahan-lahan sekadar untuk mencampurkan bahan.",
        "Masukkan campuran tepung yang diayak sedikit demi sedikit. Kaup balik menggunakan spatula sehingga menjadi doh lembut.",
        "Masukkan coklat cip atau badam hiris jika menggunakan. Simpan doh dalam peti sejuk selama 15 minit agar mudah dibentuk.",
        "Bentukkan doh mengikut citarasa (bulat/acuan dahlia) dan susun di atas dulang pembakar yang dialas kertas minyak.",
        "Bakar dalam ketuhar yang telah dipanaskan pada suhu 160°C selama 15-20 minit sehingga bahagian bawah biskut keemasan."
      ];
    }

    tips = [
      "Untuk donut yang sangat gebu dan ada 'ring' putih di tengah, pastikan uli doh sehingga betul-betul elastik (windowpane test).",
      "Jangan bakar biskut terlalu lama; biskut yang baru keluar dari oven akan terasa sedikit lembut tetapi akan mengeras dengan rangup apabila sejuk.",
      "Menggunakan air panas suam dalam adunan kek coklat membantu mengaktifkan serbuk koko untuk rasa coklat yang lebih kaya dan tekstur moist."
    ];

    faqs = [
      { q: `Kenapa donut saya menjadi keras selepas sejuk?`, a: `Donut boleh menjadi keras jika doh kurang diuli, yis tidak aktif sepenuhnya, atau donut digoreng terlalu lama di atas api yang terlalu kecil.` },
      { q: `Bolehkah saya gantikan mentega dengan marjerin untuk biskut?`, a: `Boleh, namun marjerin mempunyai kandungan air yang lebih tinggi yang boleh menjejaskan rasa lemak manis biskut berbanding menggunakan butter asli.` },
      { q: `Bagaimana cara membuat topping coklat ganache berkilat untuk kek coklat?`, a: `Cairkan coklat masakan bersama krim putar (whipping cream) dan masukkan satu sudu teh mentega cair semasa sos masih panas.` }
    ];

    prep = 20;
    cook = 20;
    cal = 290;
    diff = "Sederhana";
  }
  else {
    // Drinks & Desserts
    ingredients = [
      "1 bungkus agar-agar tali (20 gram)",
      "6 cawan air bersih",
      "1 tin susu cair / susu sejat",
      "1 cawan gula pasir (mengikut kemanisan)",
      "1 sudu teh esen vanila",
      "Pewarna makanan pilihan (merah/hijau)",
      "Buah-buahan segar (strawberi/mangga/anggur)"
    ];
    if (lower.includes("aiskrim") || lower.includes("ice cream")) {
      ingredients = [
        "2 cawan whipping cream (krim putar tenusu) - dingin",
        "1/2 cawan susu pekat manis dingin",
        "1 sudu teh esen vanila asli",
        "1/2 cawan serbuk Milo / Oreo hancur (mengikut selera)"
      ];
    }

    if (lower.includes("aiskrim") || lower.includes("ice cream")) {
      steps = [
        "Pastikan mangkuk pengadun dan whipping cream berada dalam keadaan sejuk gila (simpan dalam freezer 10 minit sebelum guna).",
        "Pukul whipping cream menggunakan mixer berkelajuan tinggi sehingga membentuk puncak kaku (stiff peaks).",
        "Masukkan susu pekat manis dingin dan esen vanila secara perlahan-lahan.",
        "Kaup balik adunan menggunakan spatula dengan sangat lembut agar udara di dalam krim tidak keluar.",
        "Masukkan serbuk Milo atau biskut Oreo yang telah dihancurkan kasar. Gaul sekadar sebati.",
        "Tuangkan adunan aiskrim berkrim ke dalam bekas kedap udara plastik.",
        "Tutup rapat bekas dan bekukan di dalam bahagian sejuk beku (freezer) sekurang-kurangnya selama 6-8 jam sebelum dinikmati."
      ];
    } else {
      steps = [
        "Rendam agar-agar tali dalam air biasa selama 10 minit untuk melembutkannya. Toskan.",
        "Masak air bersih bersama agar-agar di dalam periuk sehingga agar-agar larut sepenuhnya.",
        "Masukkan gula pasir dan kacau sehingga gula melarut sekata di atas api sederhana.",
        "Kecilkan api periuk, tuangkan susu cair dan esen vanila. Kacau perlahan-lahan selama 3 minit (jangan biar santan/susu pecah).",
        "Bahagikan adunan kepada beberapa bahagian dan titiskan pewarna kegemaran anda.",
        "Susun buah-buahan segar di dalam acuan plastik kegemaran.",
        "Tuangkan cecair puding secara perlahan-lahan ke dalam acuan berisi buah. Biarkan mengeras pada suhu bilik sebelum disejukkan dalam peti ais."
      ];
    }

    tips = [
      "Untuk menghasilkan aiskrim buatan sendiri yang sangat lembut tanpa kristal ais, pastikan memukul whipping cream sehingga betul-betul kaku.",
      "Tapis adunan agar-agar/puding sebelum dituang ke dalam acuan untuk membuang sisa buih agar permukaan puding licin cantik.",
      "Sentiasa gunakan bekas kedap udara semasa membekukan aiskrim agar aiskrim tidak menyerap bau makanan lain dalam peti sejuk."
    ];

    faqs = [
      { q: `Bolehkah saya gunakan susu segar biasa untuk aiskrim ini?`, a: `Tidak digalakkan. Susu segar biasa mempunyai kandungan air yang tinggi yang akan menyebabkan aiskrim menjadi berhabuk kristal ais dan keras berbanding whipping cream.` },
      { q: `Mengapa puding karamel saya mempunyai banyak lubang di dalam?`, a: `Ini terjadi kerana adunan puding dikukus dengan api yang terlalu besar atau telur dipukul terlalu kuat sehingga menghasilkan banyak buih udara.` },
      { q: `Berapa lamakah puding agar-agar boleh disimpan?`, a: `Puding agar-agar boleh disimpan segar dalam peti sejuk biasa selama 4-5 hari.` }
    ];

    prep = 10;
    cook = 15;
    cal = 190;
    diff = "Mudah";
  }

  return { ingredients, steps, tips, faqs, prep, cook, cal, diff, servings };
}

// Generate the beautiful, comprehensive HTML article content
function generateContent(kw, cat, details) {
  const { ingredients, steps, tips, faqs, prep, cook, cal, diff, servings } = details;
  const capitalizedKw = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Build beautiful Rich Snippet HTML content
  let html = `
<p>Mencari panduan lengkap dan teruji mengenai <strong>${capitalizedKw}</strong>? Anda berada di tempat yang betul! Di Malaysia, hidangan ini merupakan salah satu kuliner kegemaran ramai yang sering disajikan dalam pelbagai acara keluarga, majlis keraian, mahupun sebagai hidangan harian yang membangkitkan selera. Melalui artikel panduan komprehensif ini, kami akan mengupas tuntas cara penyediaan, tip rahsia agar masakan anda tidak gagal, serta rahsia mendapatkan rasa umami yang sempurna.</p>

<p>Mengetahui cara memasak <strong>${kw}</strong> dengan betul adalah satu kemahiran berharga di dapur. Ramai pemula menghadapi kesukaran dari segi keseimbangan rasa, kelembutan bahan utama, mahupun tempoh memasak yang tepat. Jangan risau! Kami telah menyusun langkah demi langkah yang sangat praktikal, mudah difahami, dan dijamin menjadi kegemaran seluruh ahli keluarga anda apabila dihidangkan panas-panas di atas meja makan.</p>

<!-- RECIPE CARD CARD / BOX INFO CEPAT -->
<div class="recipe-card-box" style="background: #fffaf8; border: 2px dashed #f97316; border-left: 6px solid #ea580c; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <h3 style="margin-top: 0; color: #ea580c; font-size: 1.4rem; display: flex; align-items: center; gap: 8px;">
    🍳 Info Cepat Recipe Card: ${capitalizedKw}
  </h3>
  <p style="margin-top: 5px; margin-bottom: 15px; color: #475569; font-style: italic; font-size: 0.95rem;">
    Rujukan pantas masa persediaan, kalori, dan tahap kesukaran untuk memudahkan anda merancang masakan.
  </p>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 1rem; color: #1e293b;">
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>🕒 Prep Time:</strong> ${prep} Minit
    </div>
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>🔥 Cook Time:</strong> ${cook} Minit
    </div>
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>⏱️ Total Time:</strong> ${prep + cook} Minit
    </div>
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>🍽️ Servings:</strong> ${servings} Orang
    </div>
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>⚡ Calories:</strong> ${cal} kcal
    </div>
    <div style="padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #fed7aa;">
      <strong>⭐ Difficulty:</strong> ${diff}
    </div>
  </div>
</div>

<h2>Bahan-bahan yang Diperlukan</h2>
<p>Sebelum memulakan langkah memasak, pastikan anda telah menyediakan dan menyukat semua bahan di bawah dengan teliti. Kejituan sukatan bahan adalah kunci utama keberhasilan resepi <strong>${kw}</strong> ini:</p>
<ul style="line-height: 1.7; color: #334155; margin-bottom: 25px;">
`;

  ingredients.forEach(ing => {
    html += `  <li>${ing}</li>\n`;
  });

  html += `</ul>

<h2>Langkah demi Langkah Penyediaan</h2>
<p>Ikuti panduan penyediaan di bawah secara berperingkat dengan tenang untuk hasil masakan yang memuaskan hati:</p>
<ol style="line-height: 1.8; color: #334155; margin-bottom: 25px;">
`;

  steps.forEach(step => {
    html += `  <li style="margin-bottom: 10px;">${step}</li>\n`;
  });

  html += `</ol>

<h2>Tips Ekstra untuk Hasil Terbaik</h2>
<p>Untuk memastikan hidangan <strong>${kw}</strong> anda tampil luar biasa ala restoran premium, berikut adalah beberapa tips rahsia yang boleh anda amalkan:</p>
<ul style="line-height: 1.7; color: #334155; margin-bottom: 25px;">
`;

  tips.forEach(tip => {
    html += `  <li>${tip}</li>\n`;
  });

  html += `</ul>

<h2>Soalan Lazim (FAQ) Mengenai ${capitalizedKw}</h2>
<p>Berikut adalah beberapa jawapan pantas bagi soalan yang paling kerap ditanya oleh pembaca untuk membantu anda menguasai masakan ini dengan sempurna:</p>
<div style="margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
`;

  faqs.forEach((faq, index) => {
    html += `  <h4 style="color: #0f172a; margin-bottom: 5px;">Q${index + 1}: ${faq.q}</h4>\n`;
    html += `  <p style="color: #475569; margin-bottom: 20px; line-height: 1.6;"><strong>A:</strong> ${faq.a}</p>\n`;
  });

  html += `</div>

<h2>Kesimpulan</h2>
<p>Secara keseluruhannya, menyediakan <strong>${kw}</strong> tidaklah sesukar yang disangka sekiranya anda mengikuti panduan, sukatan bahan, dan tips yang telah dikongsikan di atas. Hidangan beraroma wangi ini pastinya akan memikat selera sesiapa sahaja yang mencubanya. Selamat mencuba resepi istimewa ini di rumah anda! Jangan lupa untuk berkongsi artikel ini dengan rakan-rakan pencinta kuliner dan tinggalkan ulasan anda di ruangan komen di bawah!</p>
`;

  return html;
}

// Generate the full articles array
function generateAllArticles() {
  const articles = [];
  
  uniqueKeywords.forEach((kw, index) => {
    const { cat, img } = getCategoryAndImage(kw);
    const details = getIngredientsAndSteps(kw, cat);
    const content = generateContent(kw, cat, details);
    
    // Create SEO metadata
    const capitalizedKw = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Sluggify
    const slug = kw
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-")         // collapse spaces to hyphens
      .replace(/-+/g, "-");         // collapse multiple hyphens
      
    // Excerpt
    const excerpt = `Panduan resepi ${kw} terlengkap dan teruji, siap dibakar/dimasak dengan rasa yang sangat lazat, wangi, dan digemari oleh seisi keluarga anda.`;
    
    // Reading time calculation based on word count (approx. 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const reading_time = Math.max(3, Math.round(wordCount / 180));
    
    // Random dates spread out in 2026
    const baseDate = new Date("2026-05-18T00:45:07.259Z");
    baseDate.setHours(baseDate.getHours() - index); // spread historically
    const dateStr = baseDate.toISOString();
    
    articles.push({
      title: capitalizedKw,
      slug: slug,
      content: content,
      excerpt: excerpt,
      category: "Resepi", // Grouped all as Resepi category for the main blog category
      cover_image: img,
      author_name: "Andy Masan",
      author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
      reading_time: reading_time,
      status: "published",
      views: Math.floor(Math.random() * 800) + 150,
      created_at: dateStr,
      published_at: dateStr,
      keywords: `${kw}, cara buat ${kw}, resepi ${kw} mudah, resepi ${kw} sedap`,
      comments_enabled: true
    });
  });
  
  return articles;
}

function main() {
  console.log("=== OFFLINE ARTICLE GENERATOR START ===");
  const articles = generateAllArticles();
  
  const outputPath = path.join(__dirname, "..", "recipes_import.json");
  console.log(`Menulis ${articles.length} artikel resepi berkualiti tinggi ke file JSON...`);
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), "utf8");
  
  console.log(`✓ JANAAN BERHASIL! File disimpan di: [${outputPath}]`);
  console.log(`Saiz Fail: ${(fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)} MB`);
  console.log("=== PROSES SELESAI ===");
}

main();
