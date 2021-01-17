import {
  API_BASE_URL
} from '@/store/const';

const state = {
  map: [],
  mapData: [],
  mapInfo: {}
};

const mutations = {
  getMapSuccess(state, data) {
    state.map = data;
  },
  getMapFail(state, data) {
    state.map = [];
  },
  saveMapData(state, data) {
    state.mapData = data;
  },
  saveMapInfo(state, data) {
    state.mapInfo = data;
  },
};

const actions = {
  getMap({
    commit
  }) {
    return new Promise((resolve, reject) => {
      return axios
        .get(`${API_BASE_URL}kiang/pharmacies/master/json/points.json`)
        .then(resp => {
          commit('getMapSuccess', resp.data.features);
          resolve(resp.data);
        })
        .catch(err => {
          commit('getMapFail');
          reject();
        })
        .finally(() => {});
    })
  },
  getMapData({
    commit
  }, data) {
    const {
      map,
      district,
      city
    } = data;
    return new Promise((resolve, reject) => {
      const arr = _.filter(
        map,
        item => item.properties.county == city && item.properties.town == district
      );
      commit('saveMapData', arr);
      resolve();
    })
  },
  getMapInfo({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      commit('saveMapInfo', data);
      resolve();
    })
  }
};
0

const getters = {
  mapStatistics(state) {
    let arr = [];

    let all = {
      label: "總口罩數量比例",
      color: "primary",
      count: 0,
      mapCount: 0,
      InfoCount: state.mapInfo.mask_adult + state.mapInfo.mask_child || 0,
    }
    let allAdult = {
      label: "成人口罩數量比例",
      color: "secondary",
      count: 0,
      mapCount: 0,
      InfoCount: state.mapInfo.mask_adult || 0,
    };
    let allChild = {
      label: "兒童口罩數量比例",
      color: "light-green-6",
      count: 0,
      mapCount: 0,
      InfoCount: state.mapInfo.mask_child || 0
    };

    _.forEach(state.map, map => {
      map.properties.mask_adult
      all.count += map.properties.mask_adult + map.properties.mask_child
      allAdult.count += map.properties.mask_adult
      allChild.count += map.properties.mask_child
    });

    _.forEach(state.mapData, data => {
      data.properties.mask_adult
      all.mapCount += data.properties.mask_adult + data.properties.mask_child
      allAdult.mapCount += data.properties.mask_adult
      allChild.mapCount += data.properties.mask_child
    });

    arr.push(all, allAdult, allChild);
    return arr
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
