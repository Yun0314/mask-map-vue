<template>
  <q-layout view="lHh lpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="menuOpen = !menuOpen" />
        <q-toolbar-title>
          <q-icon :name="$router.currentRoute.meta.icon" class="q-pb-xs" />
          {{ $router.currentRoute.meta.label }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 選單 -->
    <q-drawer
      class="menu"
      v-model="menuOpen"
      bordered
      side="left"
      :width="$q.screen.width > 600 ? 400 : 300"
    >
      <q-scroll-area class="search-block">
        <InfoContent />
      </q-scroll-area>

      <div class="absolute-top" style="height: 210px">
        <q-item-label header class="text-center q-pa-sm">
          <h6>
            <span>查詢/資訊欄</span>
          </h6>
        </q-item-label>
        <div
          class="text-subtitle1 text-center text-primary text-weight-bold"
          v-text="nowDate"
        />
        <!-- 搜尋框 -->
        <SearchContent
          class="q-pa-md"
          @searchMap="$refs.map.filterMap(...arguments)"
          @clearMap="$refs.map.clearMap()"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view ref="map" />
    </q-page-container>
  </q-layout>
</template>

<script>
import SearchContent from "@/components/content/SearchContent";
import InfoContent from "@/components/content/InfoContent";
import { date } from "quasar";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      menuOpen: false
    };
  },
  components: { SearchContent, InfoContent },
  computed: {
    nowDate() {
      return date
        .formatDate(Date.now(), "YYYY年MM月DD日 dddd HH:mm:ss")
        .substring(0, 16);
    }
  },
  methods: {
    ...mapActions({
      getCity: "common/city/getCity",
      getMap: "map/getMap"
    })
  },
  async beforeMount() {
    this.$q.loading.show({ message: "資料讀取中" });
    await this.getCity();
    await this.getMap();
    this.$q.loading.hide();
  }
};
</script>

<style lang="scss" scoped>
.search-block {
  height: calc(100% - 210px);
  margin-top: 210px;
}
</style>
