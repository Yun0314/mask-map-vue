<template>
  <div>
    <q-select
      v-model="cityModel"
      :options="cityBus"
      label="縣市"
      color="positive"
      @filter="filterCity"
      @input="citySelected()"
      :rules="[val => !!val || '請選擇縣市']"
      stack-label
      clearable
      use-input
      outlined
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey" v-text="'查無縣市'" />
        </q-item>
      </template>
    </q-select>

    <q-select
      v-model="districtModel"
      :options="districtBus"
      label="地區"
      option-label="AreaName"
      option-value="AreaName"
      color="positive"
      :rules="[val => !!val || '請選擇地區']"
      @filter="filterDistrict"
      @input="districtSelected(districtModel)"
      :disable="cityModel && cityModel.AreaList ? false : true"
      hide-bottom-space
      map-options
      emit-value
      stack-label
      clearable
      use-input
      outlined
      dense
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey" v-text="'查無地區'" />
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      cityModel: null,
      cityBus: [],
      districtModel: null,
      districtBus: []
    };
  },
  computed: {
    ...mapState({
      city: state => state.common.city.city
    }),
    loading() {
      return _.isEmpty(this.city) || false;
    }
  },
  methods: {
    citySelected() {
      this.districtModel = null;
      this.districtSelected();
    },
    districtSelected(district) {
      district
        ? this.$emit("searchMap", district, this.cityModel.label)
        : this.$emit("clearMap");
    },
    // 過濾/篩選縣市
    filterCity(val, update) {
      if (val === "") {
        update(() => {
          this.cityBus = this.city;
        });
        return;
      }
      update(() => {
        this.cityBus = _.filter(
          this.city,
          name =>
            name.label.match(val) ||
            _.lowerCase(name.CityEngName).match(_.lowerCase(val))
        );
      });
    },
    // 過濾/篩選地區
    filterDistrict(val, update) {
      if (val === "") {
        update(() => {
          this.districtBus = this.cityModel.AreaList;
        });
        return;
      }
      update(() => {
        this.districtBus = _.filter(
          this.cityModel.AreaList,
          name =>
            name.AreaName.match(val) ||
            _.lowerCase(name.AreaEngName).match(_.lowerCase(val))
        );
      });
    }
  }
};
</script>
