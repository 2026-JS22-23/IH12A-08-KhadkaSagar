// spots.js
// 観光スポットのデータ一覧。説明文はオリジナルで作成（コピペではない）。
// placesQuery は Google Places API でその場所を検索するためのキーワード。

const SPOTS = [
  {
    id: "kinkakuji",
    name: "金閣寺（鹿苑寺）",
    nameEn: "Kinkaku-ji",
    lat: 35.0394,
    lng: 135.7292,
    placesQuery: "Kinkaku-ji Kyoto",
    description:
      "金箔で覆われた三層の楼閣が、鏡湖池の水面に映る姿で知られる禅寺。" +
      "室町幕府の将軍・足利義満の別荘がもとになっており、季節や天気によって金閣の見え方が大きく変わるため、" +
      "何度訪れても違った表情を楽しめるスポットです。"
  },
  {
    id: "fushimiinari",
    name: "伏見稲荷大社",
    nameEn: "Fushimi Inari Taisha",
    lat: 34.9671,
    lng: 135.7727,
    placesQuery: "Fushimi Inari Taisha Kyoto",
    description:
      "山全体を覆うように連なる真っ赤な千本鳥居が有名な神社。商売繁盛の神様として親しまれており、" +
      "鳥居のトンネルを奥へ進むほど山道になっていくため、時間に余裕を持って散策するのがおすすめです。"
  },
  {
    id: "kiyomizudera",
    name: "清水寺",
    nameEn: "Kiyomizu-dera",
    lat: 34.9949,
    lng: 135.7850,
    placesQuery: "Kiyomizu-dera Kyoto",
    description:
      "釘を一本も使わない「懸造り」の舞台から京都市街を一望できる、世界遺産にも登録されているお寺。" +
      "春の桜、秋の紅葉の時期は特に人気が高く、清水の舞台からの景色は京都観光の定番として知られています。"
  },
  {
    id: "arashiyama",
    name: "嵐山 竹林の道",
    nameEn: "Arashiyama Bamboo Grove",
    lat: 35.0094,
    lng: 135.6721,
    placesQuery: "Arashiyama Bamboo Grove Kyoto",
    description:
      "空を覆うほど高く伸びた竹に囲まれた散策路。風が吹くたびに竹がこすれ合う音が響き、" +
      "独特の静けさと涼しさを感じられます。近くの渡月橋とあわせて訪れる観光客が多いエリアです。"
  },
  {
    id: "gion",
    name: "祇園",
    nameEn: "Gion District",
    lat: 35.0037,
    lng: 135.7752,
    placesQuery: "Gion District Kyoto",
    description:
      "石畳の路地と伝統的な町家が並ぶ、京都らしい景観が残るエリア。運が良ければ舞妓さんや芸妓さんの姿を" +
      "見かけることもあります。夕方から夜にかけて、提灯に灯りがともる雰囲気も魅力のひとつです。"
  },
  {
    id: "nijojo",
    name: "二条城",
    nameEn: "Nijo Castle",
    lat: 35.0141,
    lng: 135.7481,
    placesQuery: "Nijo Castle Kyoto",
    description:
      "徳川家康が京都の宿所として築いた城で、歩くと鳥の鳴き声のような音が鳴る「鶯張り」の廊下が有名。" +
      "内部の障壁画や庭園も見どころが多く、江戸時代の政治の中心地としての歴史も感じられる場所です。"
  }
];
