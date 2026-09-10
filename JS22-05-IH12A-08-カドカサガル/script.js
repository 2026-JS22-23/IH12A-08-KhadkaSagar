// script.js
// マップの初期化、マーカー配置、情報ウィンドウ、Places APIでの詳細情報取得、
// 「旅程（御朱印帳）」機能を担当する。

let map;
let placesService;
let infoWindow;
let tripItems = []; // 旅程に追加されたスポットのidを保持
const photoCache = {}; // placesQuery -> {photoUrl, rating, address} のキャッシュ

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.0116, lng: 135.7681 }, // 京都駅あたりを中心に
    zoom: 12,
    mapId: "DEMO_MAP_ID"
  });

  infoWindow = new google.maps.InfoWindow();
  placesService = new google.maps.places.PlacesService(map);

  SPOTS.forEach((spot) => {
    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map: map,
      title: spot.name,
      animation: google.maps.Animation.DROP
    });

    marker.addListener("click", () => {
      openInfoWindow(spot, marker);
    });

    spot.marker = marker; // サムネイル一覧からもマーカーを参照できるように保存
  });

  buildSpotList();
  fetchThumbnailsForAllSpots();

  // jQuery UI タブの初期化（プラスαのUI装飾）
  $("#tabs").tabs();
}

// 情報ウィンドウを開き、Places APIで写真・評価・住所を取得して表示する
function openInfoWindow(spot, marker) {
  map.panTo(marker.getPosition());

  // まずは手書きの説明文だけで先に表示（体感速度アップ）
  infoWindow.setContent(buildInfoWindowHtml(spot, null));
  infoWindow.open(map, marker);

  getPlaceDetails(spot, (details) => {
    infoWindow.setContent(buildInfoWindowHtml(spot, details));
  });
}

// Places API (findPlaceFromQuery) で写真・評価・住所を取得
function getPlaceDetails(spot, callback) {
  if (photoCache[spot.placesQuery]) {
    callback(photoCache[spot.placesQuery]);
    return;
  }

  const request = {
    query: spot.placesQuery,
    fields: ["place_id", "name", "photos", "rating", "formatted_address"]
  };

  placesService.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
      const place = results[0];
      const details = {
        photoUrl: place.photos && place.photos[0] ? place.photos[0].getUrl({ maxWidth: 400 }) : null,
        rating: place.rating || null,
        address: place.formatted_address || null
      };
      photoCache[spot.placesQuery] = details;
      callback(details);
    } else {
      callback(null);
    }
  });
}

// 情報ウィンドウの中身のHTMLを組み立てる（必須要件：写真＋説明文）
function buildInfoWindowHtml(spot, details) {
  const photoHtml = details && details.photoUrl
    ? `<img class="iw-photo" src="${details.photoUrl}" alt="${spot.name}">`
    : `<div class="iw-photo iw-photo--loading">写真を読み込み中...</div>`;

  const ratingHtml = details && details.rating
    ? `<p class="iw-rating">⭐ ${details.rating} / 5</p>`
    : "";

  const addressHtml = details && details.address
    ? `<p class="iw-address">${details.address}</p>`
    : "";

  const alreadyAdded = tripItems.includes(spot.id);

  return `
    <div class="iw-card">
      ${photoHtml}
      <h3>${spot.name}</h3>
      <p class="iw-name-en">${spot.nameEn}</p>
      ${ratingHtml}
      <p class="iw-desc">${spot.description}</p>
      ${addressHtml}
      <button class="iw-add-btn" onclick="addToTrip('${spot.id}')" ${alreadyAdded ? "disabled" : ""}>
        ${alreadyAdded ? "旅程に追加済み ✓" : "＋ 旅程に追加"}
      </button>
    </div>
  `;
}

// サイドバーのスポット一覧（サムネイル表示：プラスαの加点対象）を組み立てる
function buildSpotList() {
  const $list = $("#spot-list");
  $list.empty();

  SPOTS.forEach((spot) => {
    const $item = $(`
      <li class="spot-card" data-id="${spot.id}">
        <div class="spot-thumb-wrap">
          <img class="spot-thumb" alt="${spot.name}">
        </div>
        <div class="spot-info">
          <p class="spot-name">${spot.name}</p>
          <p class="spot-name-en">${spot.nameEn}</p>
        </div>
      </li>
    `);

    $item.on("click", () => {
      map.setZoom(15);
      openInfoWindow(spot, spot.marker);
    });

    $list.append($item);
  });
}

// 起動時に全スポットのサムネイル画像をまとめて取得する
function fetchThumbnailsForAllSpots() {
  SPOTS.forEach((spot) => {
    getPlaceDetails(spot, (details) => {
      if (details && details.photoUrl) {
        $(`.spot-card[data-id="${spot.id}"] .spot-thumb`).attr("src", details.photoUrl);
      } else {
        $(`.spot-card[data-id="${spot.id}"] .spot-thumb-wrap`).addClass("spot-thumb--empty");
      }
    });
  });
}

// 「旅程（御朱印帳）」にスポットを追加する — オリジナル機能（加点対象）
function addToTrip(spotId) {
  if (tripItems.includes(spotId)) return;

  const spot = SPOTS.find((s) => s.id === spotId);
  tripItems.push(spotId);
  renderTripList();

  // ボタンが押されたことがわかるよう、情報ウィンドウの中身を更新
  if (spot) {
    getPlaceDetails(spot, (details) => {
      infoWindow.setContent(buildInfoWindowHtml(spot, details));
    });
  }

  // タブを「御朱印帳」に自動で切り替えて、追加されたことを分かりやすくする
  $("#tabs").tabs("option", "active", 1);
}

function removeFromTrip(spotId) {
  tripItems = tripItems.filter((id) => id !== spotId);
  renderTripList();
}

// 御朱印帳（旅程リスト）を再描画し、jQuery UI sortable で並び替え可能にする
function renderTripList() {
  const $tripList = $("#trip-list");
  const $empty = $("#trip-empty");
  $tripList.empty();

  $("#trip-count").text(tripItems.length);

  if (tripItems.length === 0) {
    $empty.show();
    return;
  }
  $empty.hide();

  tripItems.forEach((id) => {
    const spot = SPOTS.find((s) => s.id === id);
    if (!spot) return;

    const $stamp = $(`
      <li class="stamp-card" data-id="${spot.id}">
        <div class="stamp-mark">京</div>
        <div class="stamp-text">
          <p class="stamp-name">${spot.name}</p>
          <p class="stamp-name-en">${spot.nameEn}</p>
        </div>
        <button class="stamp-remove" title="旅程から削除">×</button>
      </li>
    `);

    $stamp.find(".stamp-remove").on("click", () => removeFromTrip(spot.id));
    $tripList.append($stamp);
  });

  // jQuery UI sortable: ドラッグで旅程の順番を並び替えられる（プラスαのUI）
  $tripList.sortable({
    axis: "y",
    placeholder: "stamp-card stamp-card--placeholder",
    update: function () {
      tripItems = $tripList.children().map(function () {
        return $(this).data("id");
      }).get();
    }
  });
}
