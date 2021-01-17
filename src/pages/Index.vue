<template>
  <q-page>
    <q-card class="no-shadow">
      <!-- 地圖 -->
      <div id="map" />
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { mapDataCopy, mapInfo_popupStyle } from "@/store/const";
import Leaflet from "leaflet";
export default {
  data() {
    return {
      popup: { type: "popupclose", data: {} },
      openStreetMap: {}
    };
  },
  computed: {
    ...mapState({
      map: state => state.map.map,
      mapData: state => state.map.mapData,
      mapInfo: state => state.map.mapInfo
    })
  },
  watch: {
    mapInfo() {
      if (!_.isEmpty(this.mapData) && this.mapInfo) {
        // 附值要用陣列處理，因此用filter
        const check = _.filter(
          this.mapData,
          data => data.properties.id == this.mapInfo.id
        );
        //true => 打開popup
        this.assignMap(check, true);
      }
    },
    popup(val) {
      this.getMapInfo(val.type == "popupopen" ? val.data : {});
    }
  },
  methods: {
    ...mapActions({
      getMapData: "map/getMapData",
      getMapInfo: "map/getMapInfo"
    }),
    async filterMap(district, city) {
      this.$q.loading.show();
      //先重置
      await this.clearMap();
      //篩選
      await this.getMapData({ map: this.map, district, city });
      // 附值+資料
      await this.assignMap(this.mapData);
      this.$q.loading.hide();
    },
    assignMap(data, open) {
      // 有相關資料的話 -> 中心點移置第一個資訊
      _.isEmpty(data) ||
        this.openStreetMap.panTo(
          new Leaflet.LatLng(
            data[0].geometry.coordinates[1],
            data[0].geometry.coordinates[0]
          )
        );

      _.forEach(data, item => {
        const mapItem = Leaflet.marker([
          item.geometry.coordinates[1],
          item.geometry.coordinates[0]
        ])
          .addTo(this.openStreetMap)
          .bindPopup(mapInfo_popupStyle(item.properties))
          .on("popupclose popupopen", val => {
            this.popup = { type: val.type, data: item.properties };
          });
        !open || mapItem.openPopup();
      });
    },
    clearMap() {
      this.openStreetMap.eachLayer(layer => {
        !(layer instanceof Leaflet.Marker) ||
          this.openStreetMap.removeLayer(layer);
      });
      this.getMapData([]);
      this.getMapInfo({});
    }
  },
  mounted() {
    this.openStreetMap = Leaflet.map("map", {
      //中心點(台北市政府)
      center: [25.039, 121.562],
      //查詢範圍比例
      zoom: 18,
      closePopupOnClick: false
    });

    // 將地圖上的操作指定加在openStreetMap。
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: mapDataCopy,
      maxZoom: 20
    }).addTo(this.openStreetMap);
  }
};
</script>

<style lang="scss">
#map {
  position: relative;
  height: calc(100vh - 51px);
}
</style>
