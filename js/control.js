
var carouselBoxConfig = {
    containerWidth: 1000,
    containerHeight: 330,
    animateDelay: 500,
    slideDelay: 1000,
    useNavControl: true,
    // useShadeLayer: false,
    // imgSizes : {
    //     level0: {width: 0, height: 0},
    //     level1: {width: 610, height: 290},
    //     level2: {width: 610, height: 290},
    //     level3: {width: 610, height: 290}
    // }
}

var posters1 = {
    imgUrls: [
        "../resources/imgs/59f45499c8d4b.jpg",
        "../resources/imgs/63d38ec27d1ed21b766d5387ab6eddc450da3ff7.jpg",
        "../resources/imgs/3289773_150538632134_2.jpg",
        "../resources/imgs/d3edd0cdb1f0473a36dfd0aa3065d48a.jpg",
        "../resources/imgs/octocat.jpg"
    ],
    posterInfo: [
        "one",
        "two",
        "three",
        "four",
        "five"
    ],
    linkTarget: [
        "http://www.bilibili.com",
        "http://www.baidu.com",
        "http://www.bilibili.com",
        "http://www.bilibili.com",
        "http://www.bilibili.com"
    ]
}

$(function($) {
    new CarouselBox("#content1", carouselBoxConfig, posters1);
});