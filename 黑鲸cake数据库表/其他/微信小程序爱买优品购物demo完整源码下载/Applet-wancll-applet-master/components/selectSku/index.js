const APP = getApp();
Component({
  properties: {
    goodsinfo: {
      type: Object,
      description: '传递过来的商品详情数据'
    },
    iscart: {
      type: Boolean,
      description: '是不是购物车'
    },
    sendfindsku:{
      type:Object,
      description: '传递过来的sku'
    },
    hassku:{
      type:Boolean,
      description: '判断是否存在sku数据'
    }
  },
  data: {
    // 请求到的模板数据
    templateInfo: '', // 模板信息
    skuData: '',      // 重新组装的sku数据
    lineValue: {},    // 当前点击的sku数据
    findSku: '',      // 点击后筛选出的sku
    defaultSku: '',   // 默认显示价格数据
  },
  // 组件生成到页面获取的参数
  attached() {
    // console.log(this.data.hassku)
    if(this.data.hassku){
      if (!this.data.iscart) {
        this.getTemplate()
      }
    }
  },
  // 组件的方法列表
  methods: {
    // 刷新
    refresh() {
      this.getTemplate();
      // 清空
      this.setData({
        skuData:'',
        lineValue:{},
        findSku:'',
        defaultSku:''
      })
    },
    // 获取模板数据
    getTemplate() {
      // console.log(this.data.goodsinfo)
      APP.ajax({
        url: APP.api.detailTemplate,
        data: {
          goods_cate_id: this.data.goodsinfo.goods_cate_id
        },
        success: res => {
          this.setData({
            templateInfo: res.data
          }, () => {
            this.defaultSelect();
            this.assemblySkuData()
          })
        }
      })
    },

    // 处理sku数据
    assemblySkuData() {
      // 只处理一次
      if (this.data.skuData.length != 0) {
        return;
      }
      let names = this.data.templateInfo.spec_template.names;
      let goodsGroupInfo = this.data.goodsinfo.goods_spec_group_info;
      let goodsSpecInfo = this.data.goodsinfo.goods_spec_info;
      let sku = [];
      names.forEach((item, index) => {
        let id = item.id
        sku.push({
          name: item,
          select: goodsSpecInfo[id]
        })
      });
      // 排序sku数据
      goodsGroupInfo.sort((n1, n2) => {
        return n1.sell_price - n2.sell_price
      })
      this.setData({
        skuData: sku,
        defaultSku: goodsGroupInfo,
      }, () => {
        // 把横线连接的sku数据用数组表示
        goodsGroupInfo.forEach((item, index) => {
          let optionsIds = item.spec_option_ids.split('_')
          item.spec_option_ids = optionsIds
        })
        // console.log('skuData', sku)
      })
    },
    // 解析传递过来的findsku
    defaultSelect(){
      // if(this.data.sendfindsku){
      //   console.log('解析传递过来的内容',this.data.sendfindsku)
      //   console.log('解析传递过来的内容',this.data.templateInfo.spec_template.names)
      // }
      // let lineValue = {};
    },
    // 改变选择
    changeSelect(e) {
      let nameid = APP.utils.getDataSet(e, 'nameid');
      let id = APP.utils.getDataSet(e, 'id');
      let lineValue = this.data.lineValue;
      lineValue[nameid] = id;
      // 这里应该做一个防止重复点击同一个按钮，先放着 
      this.setData({
        lineValue: lineValue
      }, () => {
        // console.log(lineValue)
        this.sortPriceFilter();
      })
    },
    // 排序对比选出匹配的数据
    sortPriceFilter() {
      let idsArray = this.data.goodsinfo.goods_spec_group_info;
      let lineValue = this.data.lineValue;
      let skuLength = this.data.skuData.length;
      let newValueArr = [];
      // 重组sku值
      idsArray.forEach(item => {
        item.spec_option_ids.sort()
      });
      // 生成数组
      for (const key in lineValue) {
        newValueArr.push(lineValue[key])
      }
      newValueArr.sort()
      // 筛选
      let find = idsArray.filter((item) => {
        return item.spec_option_ids.toString() == newValueArr.toString()
      })
      // 选择完了所有的sku才发生改变
      if (newValueArr.length == skuLength) {
        find[0].spec_option_group = find[0].spec_option_group.split("_").join(';')
        // console.log(find[0])
        this.setData({
          findSku: find[0]
        })
      }
    },
    // 点击确定按钮关闭
    confirm() {
      // 判断是不是选完了 
      let skuLength = this.data.skuData.length;
      if (Object.keys(this.data.lineValue).length != skuLength) {
        wx.showToast({
          title: "请选择商品属性",
          icon: 'none',
          duration: 500,
        })
        return
      }
      let data = {
        lineValue: this.data.lineValue,
        findSku: this.data.findSku,
      }
      this.triggerEvent('confirm', data)
    },
    // 点击关闭按钮关闭
    close() {
      this.triggerEvent('close')
    }
  }
})