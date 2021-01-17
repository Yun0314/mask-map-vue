export const API_BASE_URL = 'https://raw.githubusercontent.com/'

export const mapDataCopy = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'

export const mapInfo_popupStyle = function (data) {
  const {
    name,
    mask_adult,
    mask_child,
    address,
    phone,
    updated
  } = data
  return `<div class="text-h6 text-bold text-center" style="min-width:280px;">
            【${name}】
            </div>
            <div class="text-center">
                ${address}<br>
                ${phone}<br><br>
            </div>
            <div class="row justify-center q-mb-xs">
                <div class="chip ${mask_adult ? 'bg-secondary' : 'bg-grey-5'}">
                    成人口罩：${
                        mask_adult
                        ? `${mask_adult}`
                        : "已售完"
                    }
                </div>
                <div class="chip  ${mask_child ? 'bg-light-green-6' : 'bg-grey-5'}">
                兒童口罩：${
                    mask_child
                    ? `${mask_child}`
                    : "已售完"
                }
                </div>
            </div>
            <div class="text-center">
                更新時間: ${updated}
            </div>
            `
}
