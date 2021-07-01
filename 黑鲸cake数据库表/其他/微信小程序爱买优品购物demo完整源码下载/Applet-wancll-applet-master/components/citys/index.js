const APP = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    condition: {
      type: Boolean,
      description: '控制隐显'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cityData: [],
    provinces: [],
    citys: [],
    countys: [],
    province: {},
    city: {},
    county: {},
    value: [0, 0, 0],
    values: [0, 0, 0],
  },
  /**
   * 生命周期
   */
  attached() {
    let cityData = wx.getStorageSync('citys');
    if (cityData) {
      this.setData({
        cityData: cityData
      }, () => {
        this.init(this);
      })
    } else {
      APP.ajax({
        url: APP.api.addressRegions,
        success:(res)=> {
          wx.setStorageSync('citys', res.data)
          this.setData({
            cityData: res.data
          }, () => {
            this.init(this);
          })
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(that) {
      let cityData = that.data.cityData;
      let provinces = [];
      let citys = [];
      let countys = [];
      for (let i = 0; i < cityData.length; i++) {
        provinces.push({
          name: cityData[i].name,
          code: cityData[i].id
        });
      }
      for (let i = 0; i < cityData[0].citys.length; i++) {
        citys.push({
          name: cityData[0].citys[i].name,
          code: cityData[0].citys[i].id
        })
      }
      for (let i = 0; i < cityData[0].citys[0].areas.length; i++) {
        countys.push({
          name: cityData[0].citys[0].areas[i].name,
          code: cityData[0].citys[0].areas[i].id
        })
      }
      that.setData({
        'provinces': provinces,
        'citys': citys,
        'countys': countys,
        'province': {
          name: cityData[0].name,
          code: cityData[0].id
        },
        'city': {
          name: cityData[0].citys[0].name,
          code: cityData[0].citys[0].id
        },
        'county': {
          name: cityData[0].citys[0].areas[0].name,
          code: cityData[0].citys[0].areas[0].id
        }
      }, () => {
        this.eventTar()
      })
    },
    bindChange: function (e) {
      let val = e.detail.value
      let t = this.data.values;
      let cityData = this.data.cityData;
      // 转动省份
      if (val[0] != t[0]) {
        let citys = [];
        let countys = [];
        for (let i = 0; i < cityData[val[0]].citys.length; i++) {
          citys.push({
            name: cityData[val[0]].citys[i].name,
            code: cityData[val[0]].citys[i].id
          })
        }
        for (let i = 0; i < cityData[val[0]].citys[0].areas.length; i++) {
          countys.push({
            name: cityData[val[0]].citys[0].areas[i].name,
            code: cityData[val[0]].citys[0].areas[i].id
          })
        }
        this.setData({
          province: this.data.provinces[val[0]],
          city: {
            name: cityData[val[0]].citys[0].name,
            code: cityData[val[0]].citys[0].id,
          },
          county: {
            name: cityData[val[0]].citys[0].areas[0].name,
            code: cityData[val[0]].citys[0].areas[0].id
          },
          citys: citys,
          countys: countys,
          values: val,
          value: [val[0], 0, 0]
        }, () => {
          this.eventTar()
        })
        return;
      }
      // 转动 城市
      if (val[1] != t[1]) {
        const countys = [];
        for (let i = 0; i < cityData[val[0]].citys[val[1]].areas.length; i++) {
          countys.push({
            name: cityData[val[0]].citys[val[1]].areas[i].name,
            code: cityData[val[0]].citys[val[1]].areas[i].id
          })
        }
        this.setData({
          city: this.data.citys[val[1]],
          county: {
            name: cityData[val[0]].citys[val[1]].areas[0].name,
            code: cityData[val[0]].citys[val[1]].areas[0].id,
          },
          countys: countys,
          values: val,
          value: [val[0], val[1], 0]
        }, () => {
          this.eventTar()
        })
        return;
      }
      // 转动 县市
      if (val[2] != t[2]) {
        this.setData({
          county: this.data.countys[val[2]],
          values: val
        }, () => {
          this.eventTar()
        })
        return;
      }
    },
    eventTar() {
      let data = {
        province: this.data.province,
        city: this.data.city,
        county: this.data.county
      }
      this.triggerEvent('getCitys', data)
    },
    open() {
      this.setData({
        condition: false
      })
    },
  },

})