<template>
  <q-dialog v-model="toggle" @hide="hide">
    <q-card style="max-width:800px">
      <q-toolbar class="q-px-md q-py-sm">
        <q-toolbar-title>
          <q-icon name="bar_chart" />
          口罩數量統計【{{ position }}】
        </q-toolbar-title>
        <q-btn round flat color="grey" icon="clear" v-close-popup />
      </q-toolbar>
      <!-- 全台比 -->
      <q-card-section class="row">
        <div
          :class="`text-${data.color} q-ma-lg text-center`"
          v-for="(data, index) in statistics"
          :key="index"
        >
          <div class="text-bold text-subtitle1" v-text="data.label" />
          <q-knob
            class="q-my-sm"
            v-model="data.percentage"
            :thickness="0.3"
            track-color="grey-3"
            :color="data.color"
            size="90px"
            show-value
            disable
          />
          <div class="text-grey-9" v-text="`全台：${data.count}個`" />
          <div class="text-grey-9" v-text="`${position}：${data.mapCount}個`" />
        </div>
      </q-card-section>
      <q-separator />
      <!-- 地區比 -->
      <q-card-section class="row" v-if="Object.keys(mapInfo).length > 0">
        <div
          :class="`text-${data.color} q-ma-lg text-center`"
          v-for="(data, index) in statistics"
          :key="index"
        >
          <div class="text-bold text-subtitle1" v-text="data.label" />
          <q-knob
            class="q-my-sm"
            v-model="data.infoPercentage"
            :thickness="0.3"
            track-color="grey-3"
            :color="data.color"
            size="90px"
            show-value
            disable
          />
          <div class="text-grey-9" v-text="`${position}：${data.mapCount}個`" />
          <div
            class="text-grey-9"
            v-text="`${mapInfo.name}：${data.InfoCount}個`"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="關閉" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      toggle: false,
      value: 71
    };
  },
  computed: {
    ...mapState({
      mapData: state => state.map.mapData,
      mapInfo: state => state.map.mapInfo
    }),
    ...mapGetters({
      mapStatistics: "map/mapStatistics"
    }),
    position() {
      return _.isEmpty(this.mapData)
        ? "尚未選擇"
        : `${this.mapData[0].properties.county} ${this.mapData[0].properties.town}`;
    },
    statistics() {
      let arr = _.cloneDeep(this.mapStatistics);
      _.forEach(
        arr,
        (a, index) =>
          (arr[index] = _.assign(a, {
            percentage: _.floor((a.mapCount / a.count) * 100, 2),
            infoPercentage: _.floor((a.InfoCount / a.mapCount) * 100, 2)
          }))
      );
      return arr;
    }
  },
  watch: {
    prompt() {
      !this.prompt || (this.toggle = true);
    }
  },
  methods: {
    hide() {
      this.$emit("close");
    }
  },
  props: {
    prompt: {
      type: Boolean,
      default: false
    },
    filterTotal: {
      type: Number,
      default: 0
    }
  }
};
</script>
