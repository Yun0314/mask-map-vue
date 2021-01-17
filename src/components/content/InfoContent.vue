<template>
  <div>
    <div v-if="waiting" class="text-grey-5 text-center">
      <h5 class="q-mb-sm" v-text="'請選擇縣市與地區'" />
      <q-icon name="search" size="80px" />
    </div>
    <div v-else>
      <!-- 進階篩選(考慮移出去) -->
      <q-list bordered class="text-primary rounded-borders q-ma-md">
        <q-expansion-item
          v-model="expanded"
          icon="search"
          expand-icon-class="text-primary"
          label="進階搜尋"
        >
          <q-card-section class="text-grey-9">
            <q-input
              prefix="藥局搜索："
              placeholder="請輸入地址或藥局名稱"
              v-model="keyWord"
              color="positive"
              clearable
              dense
            />
            <div class="q-pt-md row">
              <q-checkbox
                class="col-12"
                v-model="adult_filter"
                label="過濾已售完成人口罩"
                color="secondary"
                keep-color
              />
              <q-checkbox
                class="col-12"
                v-model="child_filter"
                label="過濾已售完兒童口罩"
                color="positive"
                keep-color
              />
            </div>
          </q-card-section>
        </q-expansion-item>
      </q-list>

      <q-list separator class="rounded-borders">
        <q-item-label header class="row q-pt-xs">
          <q-btn
            icon="bar_chart"
            :label="$q.screen.width > 600 ? '口罩統計' : undefined"
            color="primary"
            size="sm"
            @click="showModal = true"
            unelevated
          />
          <q-space />
          <div class="self-center" v-text="`查詢結果 - 共${statistics}筆`" />
        </q-item-label>
        <q-separator />
        <q-item
          class="block"
          v-for="item in filterMapData"
          :key="item.properties.id"
          active-class=" bg-grey-4 text-grey-9"
          :active="item.properties.id == mapInfo.id ? true : false"
          @click="filterMap(item.properties)"
          clickable
          v-ripple
        >
          <!-- 主標 -->
          <q-item-section class="q-pb-sm">
            <q-item-label lines="1"
              ><q-avatar
                class="q-mr-sm q-mb-xs"
                icon="medical_services"
                color="positive"
                text-color="white"
                size="28px"
              />
              <span
                class="text-positive text-bold text-subtitle1"
                v-text="item.properties.name"
              />
              <q-btn
                class="float-right"
                icon="bar_chart"
                color="primary"
                size="sm"
                @click="showModal = true"
                unelevated
                round
              />
            </q-item-label>
            <q-item-label>
              <q-chip
                :color="item.properties.mask_adult ? 'secondary' : 'grey-5'"
                text-color="white"
                size="12px"
              >
                成人口罩： {{ item.properties.mask_adult || "已售完" }}
              </q-chip>
              <q-chip
                :color="item.properties.mask_child ? 'light-green' : 'grey-5'"
                text-color="white"
                size="12px"
              >
                兒童口罩： {{ item.properties.mask_child || "已售完" }}
              </q-chip>
            </q-item-label>
          </q-item-section>
          <!-- 資訊 -->
          <q-item-section class="q-pb-sm">
            <q-item-label v-text="item.properties.address" />
            <q-item-label v-text="item.properties.phone" />
            <q-item-label>
              網站：<a
                v-if="item.properties.website"
                :href="item.properties.website"
                v-text="'點擊前往'"
                target="_blank"
              />
              <span class="text-grey-5" v-else v-text="'無'" />
            </q-item-label>

            <q-item-label
              >營業時間：
              <q-table
                class="no-shadow text-grey-8 q-my-xs"
                :data="timeHandle(item.properties.available)"
                :columns="OPENING_HOURS"
                row-key="week"
                :rows-per-page-options="[0]"
                hide-bottom
                bordered
                dense
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="week" :props="props" v-text="props.row.week" />
                    <q-td
                      key="morning"
                      :class="{ 'text-red': props.row.morning == 'X' }"
                      :props="props"
                      v-text="props.row.morning"
                    />
                    <q-td
                      key="after"
                      :class="{ 'text-red': props.row.after == 'X' }"
                      :props="props"
                      v-text="props.row.after"
                    />
                    <q-td
                      key="night"
                      :class="{ 'text-red': props.row.night == 'X' }"
                      :props="props"
                      v-text="props.row.night"
                    />
                  </q-tr>
                </template>
              </q-table>
              <div class="text-red text-center" v-text="item.properties.note" />
            </q-item-label>
          </q-item-section>
        </q-item>
        <div class="text-grey-5 text-center" v-if="filterMapData.length == 0">
          <h5 class="q-mb-sm" v-text="'查無結果'" />
          <q-icon name="clear" size="80px" />
        </div>
      </q-list>

      <StatisticsContent
        :prompt="showModal"
        :filterTotal="filterMapData.length"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<script>
import StatisticsContent from "@/components/content/StatisticsContent";
import { OPENING_HOURS } from "@/store/tableHead";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      expanded: true,
      showModal: false,
      //篩選
      keyWord: "",
      adult_filter: false,
      child_filter: false,
      OPENING_HOURS
    };
  },
  components: { StatisticsContent },
  computed: {
    ...mapState({
      mapData: state => state.map.mapData,
      mapInfo: state => state.map.mapInfo
    }),
    ...mapGetters({
      mapStatistics: "map/mapStatistics"
    }),
    waiting() {
      return _.isEmpty(this.mapData);
    },
    filterMapData() {
      const check = _.filter(this.mapData, data => {
        if (!this.adult_filter && !this.child_filter && !this.keyWord) {
          return data;
        } else {
          const adult = this.adult_filter
            ? data.properties.mask_adult
              ? true
              : false
            : true;
          const child = this.child_filter
            ? data.properties.mask_child
              ? true
              : false
            : true;
          const key = this.keyWord
            ? data.properties.address.match(this.keyWord) ||
              data.properties.name.match(this.keyWord)
              ? true
              : false
            : true;
          return adult && child && key ? data : null;
        }
      });
      return check;
    },
    statistics() {
      return this.filterMapData.length;
    }
  },
  watch: {
    mapData(val) {
      !_.isEmpty(val) || this.onReset();
    },
    mapInfo(val) {
      !_.isEmpty(val) || this.onReset();
    }
  },
  methods: {
    ...mapActions({
      getMapInfo: "map/getMapInfo"
    }),
    //呼叫地圖相關資訊與位置
    filterMap(info) {
      info === this.mapInfo || this.getMapInfo(info);
    },
    // 處理營業時間
    timeHandle(time) {
      //字串轉換成陣列
      const arr = _.split(time, "、");
      const newArr = [];

      //重新整理陣列
      // 看診:O   休診:X
      _.forEach(arr, (v, index) => {
        const check = _.find(
          newArr,
          a => a.week && a.week == v.substring(0, 3)
        );
        if (check) {
          //第一次加入陣列時都是早上，所以應該可以不用再判斷
          // _.includes(v, "上午") ? check.moring= _.includes(v, "看診") ? 'O' : 'X' :
          _.includes(v, "下午")
            ? (check.after = _.includes(v, "看診") ? "O" : "X")
            : (check.night = _.includes(v, "看診") ? "O" : "X");
        } else {
          //第一個 時間看診先全套用(後面判斷的再覆蓋)
          newArr.push({
            week: v.substring(0, 3),
            morning: _.includes(v, "看診") ? "O" : "X",
            after: _.includes(v, "看診") ? "O" : "X",
            night: _.includes(v, "看診") ? "O" : "X"
          });
        }
      });
      return newArr;
    },
    //重置進階篩選內容
    onReset() {
      this.keyWord = "";
      this.adult_filter = false;
      this.child_filter = false;
    }
  }
};
</script>
