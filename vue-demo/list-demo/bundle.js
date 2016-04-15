/**
 * Created by yunge on 15/12/23.
 */
"use strict";
Vue.filter('cnTimeFilter', function (value) {
    var date = new Date(value);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/")
        + " " + date.getHours() + ":" + date.getMinutes();
});

Vue.filter('shortDateFilter', function (value) {
    var date = new Date(value);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/")
});

Vue.filter('dayToDate', function (value) {
    return value * 3600 * 24 * 1000;
});

var app = new Vue({
    el: '#app',
    data: {
        videoList: mockVideos(2),
        user: {},
        videoBlockList: videoToVideoBlock(mockVideos(2)),
        count: 1,
        hasMore: true
    },
    methods: {
        toVideoDetail: function (video) {
            alert("跳转至视频详情--" + video.name);
        },
        toUserFans: function (user) {
            alert("跳转至我的粉丝");
        },
        loadMore: function () {
            this.count++;
            if (this.count > 3) {
                this.hasMore = false;
            } else {
                this.videoList = this.videoList.concat(mockVideos(this.count));
                this.videoBlockList = videoToVideoBlock(this.videoList);
            }
        }
    }
});

function Video(eid, create_date, title, profile, imgUrl) {
    this.eid = eid;
    this.create_date = create_date;
    this.title = title;
    this.profile = profile;
    this.imgUrl = "http://img1.cache.netease.com/catchpic/7/7F/7F94DEF3BC21BE270E16A1C5FF6715F9.jpg";
}

function mockVideos(number) {
    var returnList = [
        new Video(new Date().getTime(), new Date().getTime(), "布朗姐姐谈project", "这段视频对project做了详解解释", ""),
        new Video(new Date().getTime(), new Date().getTime(), "芝大李佳颖谈圈子文化", "这段视频对圈子文化", ""),
        new Video(new Date().getTime(), new Date().getTime(), "ELon Musk谈SpaceX", "这段视频描绘了SpaceX的来龙去脉", ""),
        new Video(new Date().getTime(), new Date().getTime(), "Larry Page谈搜索的未来", "这段视频对搜索技术做了详细说明", "")
    ];
    returnList = returnList.concat(addDateList(returnList, number));
    return returnList;
}

function addDateList(videoList, days) {
    videoList.forEach(function (video) {
        video.create_date = video.create_date + 3600 * 1000 * 24 * (days || 1);
    });
    return videoList;
}

function videoToVideoBlock(videoList) {
    function VideoBlock(day, videoList) {
        this.day = day;
        this.videoList = videoList;
    }

    var videoBlockList = [];
    videoList.map(function (video) {
        video.day = parseInt(video.create_date / (3600 * 1000 * 24));
        return video;
    }).sort(function (videoM, videoN) {
            return videoM.create_date - videoN.create_date;
        }
    ).forEach(function (video) {
        if (hasExist(videoBlockList, 'day', video.day)) {
            getListByDay(videoBlockList, video.day).push(video);
        } else {
            videoBlockList.push(new VideoBlock(video.day, [video]));
        }
    });
    return videoBlockList;

    function hasExist(list, key, value) {
        var valueList = list.map(function (video) {
            return video[key];
        });
        return valueList.indexOf(value) > -1;
    }

    function getListByDay(videoBlockList, day) {
        var valueList = videoBlockList.map(function (videoBlock) {
            return videoBlock['day'];
        })
        return videoBlockList[valueList.indexOf(day)].videoList;
    }
}
