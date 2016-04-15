/**
 * Created by yunge on 15/12/24.
 */
"use strict";

Vue.filter('realHref', function (value) {
   return '#' + value;
});
Vue.component('star-list', {
    template: '<ul> <li style="height: 300px" id="{{char}}" v-for="char in chars" @click="toComponent(char)">{{char}}</li></ul>',
    data: function () {
        return {
            chars:
                ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    },
    methods: {
        toComponent: function (char) {
            console.log("to: " + char);
        }
    }
});
Vue.component('char-index', {
   template: '<ul style="position: fixed;top:0px;right:50px;z-index: 10"> <li v-for="char in data" @click="toComponent(char.id)">{{char.name}}</li></ul>',
   props: {
        data: Array,
        require: true,
        validator: function (value) {
            return value.length > 20;
        }
    },
    methods: {
        toComponent: function (char) {
            window.location.hash = '#' + char;
           console.log("to: " + char);
        }
    }
});
function mockNameIds(array) {
   return array.map(function (item) {
       return {
          name: item,
           id: item
       }
   })
}

Vue.filter('realImgPath', function (value) {
  return 'http://bonday.oss-cn-hangzhou.aliyuncs.com/'   + value;
});

Vue.component('school',
    {
        template: '#schoolComponent',
        props: ['item'],

    }
);

new Vue({
    el: "body",
    data: {
       data: mockNameIds(['A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']),
        schools:[{"id":"567bc144d4c65145b47886c0","name":"康奈尔大学","enName":"Cornell University","sort":88,"students":[{"name":"XZ He","type":0,"display_name":"XZ He","avatar":"562da8ed0cf2c1678cf6bad0.jpg","school":"哈佛大学法学院","mediaNums":0}]},{"id":"567bc144d4c65145b47886bf","name":"纽约大学","enName":"New York University","sort":97},{"id":"567bc144d4c65145b47886be","name":"南加州大学","enName":"University Of Southern California","sort":87,"students":[{"name":"Shijun Chen","type":0,"display_name":"Shijun Chen","avatar":"562a4c370cf2b9d37485774a.jpg","school":"纽约大学Stern商学院本科","mediaNums":0},{"name":"Olivia Zhang","type":0,"display_name":"Olivia Zhang","avatar":"562d05020cf2ab5aafba4a54.jpg","school":"波莫纳学院本科","mediaNums":0},{"name":"Allan Xu","type":0,"display_name":"Allan Xu","avatar":"562a609a0cf2b9d374857795.jpg","school":"纽约大学本科","mediaNums":0},{"name":"Xiaoning Sun","type":0,"display_name":"Xiaoning Sun","avatar":"562a51660cf2b9d374857775.jpg","school":"约翰霍普金斯大学本科","mediaNums":0}]},{"id":"567bc144d4c65145b47886bd","name":"罗切斯特大学","enName":"University of Rochester","sort":31},{"id":"567bc144d4c65145b47886bc","name":"芝加哥大学","enName":"University of Chicago","sort":17,"students":[{"name":"XZ He","type":0,"display_name":"XZ He","avatar":"562da8ed0cf2c1678cf6bad0.jpg","school":"哈佛大学法学院","mediaNums":0}]},{"id":"567bc144d4c65145b47886bb","name":"斯坦佛大学","enName":"Stanford University","sort":83,"students":[{"name":"Simiao Li","type":0,"display_name":"Simiao Li","avatar":"562b537b0cf208ed0eb20280.jpg","school":"耶鲁大学本科","mediaNums":0}]},{"id":"567bc144d4c65145b47886ba","name":"杜克大学","enName":"Duke University","sort":84,"students":[{"name":"Tiffany Mai","type":0,"display_name":"Tiffany Mai","avatar":"24367668-c5f5-4b4b-aaee-7771dc9cb5ce1448867643937.jpg","school":"加州大学戴维斯分校","mediaNums":0},{"name":"Joanna Gao","type":0,"display_name":"Joanna Gao","avatar":"f69ce682-efb5-4a12-b78f-7c4c852b521d1448875481136.jpg","school":"布尔茅尔学院","mediaNums":0}]},{"id":"567bc144d4c65145b47886b9","name":"乔治城大学","enName":"Georgetown University","sort":5,"students":[{"name":"Oranda Hou","type":0,"display_name":"Oranda Hou","avatar":"562a4d290cf2b9d374857755.jpg","school":"宾夕法尼亚大学沃顿商学院本科","mediaNums":0},{"name":"Anlan Zhu","type":0,"display_name":"Anlan Zhu","avatar":"562a5de00cf2b9d374857784.jpg","school":"加州大学伯克利分校本科","mediaNums":0},{"name":"Daniel Yuan","type":0,"display_name":"Daniel Yuan","avatar":"562b4e050cf208ed0eb20246.jpg","school":"耶鲁大学本科","mediaNums":0},{"name":"Zhining Zhu","type":0,"display_name":"Anna Zhu","avatar":"562a4f2a0cf2b9d374857761.jpg","school":"加州大学伯克利分校本科","mediaNums":0}]},{"id":"567bc144d4c65145b47886b8","name":"西北大学","enName":"Northwestern University","sort":87,"students":[{"name":"Stefanie Wang","type":0,"display_name":"Stefanie Wang","avatar":"7ce6dc71-1afc-402c-8fcc-d82f619f1d541448621245392.jpg","school":"康奈尔大学本科","mediaNums":0},{"name":"Jason Li","type":0,"display_name":"Jason Li","avatar":"56305a9c0cf2f0ad7416e82e.jpg","school":"卡耐基梅隆大学本科","mediaNums":0}]},{"id":"567bc144d4c65145b47886b7","name":"圣母大学","enName":"University of Notre Dame","sort":1,"students":[{"name":"May Li","type":0,"display_name":"May Li","avatar":"562e5c370cf260d8b1916682.jpg","school":"乔治城大学本科","mediaNums":0},{"name":"Connie Kang","type":0,"display_name":"Connie Kang","avatar":"562d02dc0cf2ab5aafba4a34.jpg","school":"宾夕法尼亚大学沃顿商学院本科","mediaNums":0},{"name":"Michelle Zhou","type":0,"display_name":"Michelle Zhou","avatar":"562d03120cf2ab5aafba4a39.jpg","school":"约翰霍普金斯大学本科","mediaNums":0}]},{"id":"567bc144d4c65145b47886b6","name":"宾夕法尼亚大学","enName":"University of Pennsylvania","sort":0,"students":[{"name":"Stefanie Wang","type":0,"display_name":"Stefanie Wang","avatar":"7ce6dc71-1afc-402c-8fcc-d82f619f1d541448621245392.jpg","school":"康奈尔大学本科","mediaNums":0},{"name":"Jason Li","type":0,"display_name":"Jason Li","avatar":"56305a9c0cf2f0ad7416e82e.jpg","school":"卡耐基梅隆大学本科","mediaNums":0}]},{"id":"567bc143d4c65145b47886b5","name":"耶鲁大学","enName":"Yale University","sort":30,"students":[{"name":"Ye Tao","type":0,"display_name":"Ye Tao","avatar":"562da9ae0cf2c1678cf6bad8.jpg","school":"耶鲁大学硕士","mediaNums":0},{"name":"Kuan Yan","type":0,"display_name":"Kuan Yan","avatar":"562da95b0cf2c1678cf6bad5.jpg","school":"西北大学本科","mediaNums":0},{"name":"XZ He","type":0,"display_name":"XZ He","avatar":"562da8ed0cf2c1678cf6bad0.jpg","school":"哈佛大学法学院","mediaNums":0},{"name":"Kid Zhao","type":0,"display_name":"Kid Zhao","avatar":"562da8a80cf2c1678cf6bace.jpg","school":"哥伦比亚大学本科","mediaNums":0}]}]
    },
    methods: {
        multi: function () {
           this.schools = this.schools.concat(this.schools);
            this.schools = this.schools.concat(this.schools);
        }
    }
});
