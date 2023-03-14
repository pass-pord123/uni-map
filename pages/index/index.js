"use strict";
require("../../libs/qqmap-wx-jssdk.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      longitude: 113.289937,
      latitude: 23.200197,
      scale: 16,
      markers: [
        {
          id: 0,
          latitude: 23.200197,
          longitude: 113.289937,
          width: 30,
          height: 50,
          callout: {
            content: "\u5947\u8FF9\u53D1\u751F\u7684\u5730\u65B9",
            display: "ALWAYS",
            color: "#FF0000",
            fontSize: 16
          }
        }
      ],
      polyline: [
        {
          points: [
            {
              longitude: 113.289937,
              latitude: 23.200197
            },
            {
              longitude: 113.290554,
              latitude: 23.199935
            }
          ],
          color: "#FF0000DD",
          width: 4
        }
      ],
      QQMap: null
    };
  },
  methods: {
    getCurrentLocation(callback) {
      wx.getLocation({
        success(res) {
          wx.setStorageSync("location", res);
          callback(res);
        },
        fail(res) {
          let location = wx.getStorageSync("location", res);
          if (location) {
            callback(location);
          } else {
            console.error(res);
          }
        }
      });
    },
    gotoCurrentLocation() {
      this.getCurrentLocation((res) => {
        this.longitude = res.longitude + Math.random() / 1e4;
        this.latitude = res.latitude;
      });
    },
    getDirection(to, from, mode) {
      mode = mode || "walking";
      var options = {
        mode,
        success: (res) => {
          var coors = res.result.routes[0].polyline;
          var line = [];
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / 1e6;
          }
          for (var i = 0; i < coors.length; i += 2) {
            line.push({ latitude: coors[i], longitude: coors[i + 1] });
          }
          this.polyline = [
            {
              points: line,
              color: "#FF0000",
              width: 4
            }
          ];
        },
        fail(res) {
          console.log("getDirection Error", res);
        }
      };
      if (from) {
        options["from"] = from;
      }
      options["to"] = to;
      this.QQMap.direction(options);
    },
    findAddress(address) {
      this.QQMap.geocoder({
        address,
        success: (res) => {
          console.log(res);
          var location = {
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          };
          this.gotoCurrentLocation();
          console.log(address, location);
          this.getDirection(location);
        },
        fail(res) {
          console.log(res);
        }
      });
    },
    markPlacesNearby(keyword) {
      this.QQMap.search({
        keyword,
        success: (res) => {
          var markers = [];
          for (var i = 0; i < res.data.length; i++) {
            markers.push({
              title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
          this.markers = markers;
        }
      });
    },
    addMarker(location, content) {
      this.markers.push({
        id: this.markers.length,
        latitude: location.latitude,
        longitude: location.longitude,
        callout: {
          content: content || "\u76EE\u7684\u5730",
          display: "ALWAYS",
          textAlign: "center",
          color: "#FF0000",
          fontSize: 16
        }
      });
    }
  },
  onLoad(options) {
    const QQMapWX = require("../../libs/qqmap-wx-jssdk.js");
    this.QQMap = new QQMapWX({
      key: "TMBBZ-C5P33-2JM35-3ES4C-F4Y5K-XQFXV"
    });
    let location = { latitude: 23.10647, longitude: 113.32446 };
    this.addMarker(location, "\u5E7F\u5DDE\u5854");
    this.longitude = location.longitude;
    this.latitude = location.latitude;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.longitude,
    b: $data.latitude,
    c: $data.scale,
    d: $data.markers,
    e: $data.polyline,
    f: common_vendor.o((...args) => $options.gotoCurrentLocation && $options.gotoCurrentLocation(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/\u4FE1\u7BA1/\u5927\u4E09\u4E0B/\u79FB\u52A8\u5F00\u53D1/Vue/node.js-portable-MAD/work/weixin_map/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
