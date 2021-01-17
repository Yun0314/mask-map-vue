import {
  API_BASE_URL
} from '@/store/const';

const state = {
  city: [],
};

const mutations = {
  getCitySuccess(state, data) {
    //把相關key轉換成符合類星體格式(label,value)
    const maps = {
      CityName: "label"
    };
    const mapArray = _.map(data, val =>
      _.mapKeys(val, (value, key) => (maps[key] || key))
    );

    //加入sn(value)
    _.forEach(mapArray, (arr, index) => mapArray[index] = Object.assign(arr, {
      value: index + 1
    }));

    state.city = mapArray;
  },
  getCityFail(state, data) {
    state.city = [];
  },
};

const actions = {
  getCity({
    commit
  }) {
    return new Promise((resolve, reject) => {
      return axios
        .get(`${API_BASE_URL}donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json`)
        .then(resp => {
          commit('getCitySuccess', resp.data);
          resolve();
        })
        .catch(err => {
          commit('getCityFail');
          reject();
        })
        .finally(() => {});
    })
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
