function Card(width, height, left, imgUrl, zindex, ref, posterInfo, linkTarget) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.imgUrl = imgUrl;
    this.zIndex = zindex;
    this.ref = ref;
    this.posterInfo = posterInfo;
    this.linkTarget = linkTarget;
};

var CarouselBox = function(root, config, posters) {
    defaultImgSizes = {
        level0: {width: 0, height: 0},
        level1: {width: 500, height: 120},
        level2: {width: 500, height: 244},
        level3: {width: 610, height: 290}
    };
    this.imgCnt = posters.length;
    this.containerWidth = config != null ? config.containerWidth ? config.containerWidth : 1160 : 1160;
    this.containerHeight = config != null ? config.containerHeight ? config.containerHeight : 330 : 330;
    this.animateDelay = config != null ? config.animateDelay ? config.animateDelay : 500 : 500;
    this.slideDelay = config != null ? config.slideDelay ? config.slideDelay : 5000 : 5000;
    this.imgSizes = config != null ? config.imgSizes ? config.imgSizes : defaultImgSizes : defaultImgSizes;
    this.useNavControl = config != null ? config.useNavControl ? config.useNavControl : false : false;
    this.useShadeLayer = config != null ? config.useShadeLayer == false ? config.useShadeLayer : true : true;
    this.posters = posters;
    this.imgLeftPosition = {
        imgLeft1:-this.imgSizes.level1.width,
        imgLeft2: this.containerWidth > this.imgSizes.level3.width ? 0 : -this.imgSizes.level2.width,
        imgCenter: this.containerWidth > this.imgSizes.level3.width ? (this.containerWidth - this.imgSizes.level3.width)/2 : 0,
        imgRight1: this.containerWidth > this.imgSizes.level3.width ? this.containerWidth - this.imgSizes.level2.width : this.containerWidth,
        imgRight2: this.containerWidth
    };
    this._init(root);
}

CarouselBox.prototype._init = function (root) {
    var carouselBoxElement = this.createCarouselBox(this.posters.imgUrls.length);
    $(root).append(carouselBoxElement);
    this.registerEvent(carouselBoxElement);
    this.autoSlide(carouselBoxElement, this.slideDelay);
}

CarouselBox.prototype.createCarouselBox = function (posterSize) {
    var carouselBox = $("<div class='carousel-box'></div>").css({
        width: this.containerWidth + "px",
        height:  this.containerHeight + "px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden"
    })

    var cards = this.initCarouselBoxCards(posterSize);
    for(var i = 0; i < posterSize; i++) {
        var cardElement = $("<div></div>");
        cardElement.attr({ref: cards[i].ref});
        cardElement.css({
            zIndex:  cards[i].zIndex,
            width: cards[i].width + "px",
            height: cards[i].height + "px",
            left: cards[i].left + "px",
            top: 0,
            bottom: 0,
            margin: "auto",
            position: "absolute",
            overflow: "hidden",
            boxShadow: "0 0 5px #888888"
        })
        var imgElement = $("<a target=\"_blank\"></a>").attr({href: cards[i].linkTarget}).append($("<img/>").attr({src: cards[i].imgUrl}).css({
            width: "100%",
            height: "100%"
        }))
        if(cards[i].posterInfo != undefined && cards[i].posterInfo != "") {
            var posterInfoElement = null;
            if(cards[i].linkTarget != undefined &&  cards[i].linkTarget != "") {
                posterInfoElement = $("<div class='poster-info'><a target=\"_blank\" href='"+ cards[i].linkTarget +"'>"+ cards[i].posterInfo +"</a></div>");
            } else {
                posterInfoElement = $("<div class='poster-info'><a target=\"_blank\"  onclick=\"return false\" href='#'>"+ cards[i].posterInfo +"</a></div>");
            }
            if(cards[i].zIndex == 3) {
                posterInfoElement.css({display: "block"});
            }
            cardElement.append(posterInfoElement);
        }

        if(this.useShadeLayer) {
            var shadeLayerElement = $("<div class='shade-layer'></div>");
            if(cards[i].zIndex == 3) {
                shadeLayerElement.css({display: "none"});
            }
            cardElement.append(shadeLayerElement);
        }

        if(cards[i].zIndex == 3) {
            cardElement.addClass("curindex");
        }

        cardElement.append(imgElement).addClass("poster-card");
        carouselBox.append(cardElement);
    }
    if(this.useNavControl) {
        var bannerControls = $("<div class='banner-controls'><div class='left-nav'><i class='fas fa-angle-left fa-3x'></i></div>" +
            "<div class='right-nav'><i class='fas fa-angle-right fa-3x'></i></div></div>");
        carouselBox.append(bannerControls);
    }

    var buttonNav = $("<div></div>").css({
        width: "100%",
        height: "10px",
        position: "absolute",
        bottom: "0",
        textAlign: "center"
    })

    for(var i = 0; i < posterSize; i++) {
        var navbutton = $("<div class='nav-button-Off'></div>").attr({"ref": i});
        if(cards[i].zIndex == 3) {
            navbutton.addClass("nav-button-on");
        }
        buttonNav.append(navbutton);
    }

    carouselBox.append(buttonNav);

    return carouselBox;
}

CarouselBox.prototype.initCarouselBoxCards = function (cardsSize) {
    var cards = [];
    for(var i = 0; i < cardsSize; i++) {
        var posterInfo = this.posters ? this.posters.posterInfo ? this.posters.posterInfo[i] : null : null;
        var linkTaget = this.posters ? this.posters.linkTarget ? this.posters.linkTarget[i] : null : null;
        if(i == 0) {
            cards.push(new Card(this.imgSizes.level3.width, this.imgSizes.level3.height, this.imgLeftPosition.imgCenter , this.posters.imgUrls[i], 3, i, posterInfo, linkTaget))
        } else if(i == 1) {
            cards.push(new Card(this.imgSizes.level2.width, this.imgSizes.level2.height, this.imgLeftPosition.imgRight1, this.posters.imgUrls[i], 2, i, posterInfo, linkTaget))
        } else if(i == cardsSize - 1) {
            cards.push(new Card(this.imgSizes.level2.width, this.imgSizes.level2.height, this.imgLeftPosition.imgLeft2, this.posters.imgUrls[i], 2, i, posterInfo, linkTaget))
        } else if(i == 2) {
            cards.push(new Card(this.imgSizes.level1.width, this.imgSizes.level1.height, this.imgLeftPosition.imgRight2, this.posters.imgUrls[i], 1, i, posterInfo, linkTaget))
        } else if(i == cardsSize - 2) {
            cards.push(new Card(this.imgSizes.level1.width, this.imgSizes.level1.height, this.imgLeftPosition.imgLeft1, this.posters.imgUrls[i], 1, i, posterInfo, linkTaget))
        } else {
            cards.push(new Card(this.imgSizes.level0.width, this.imgSizes.level0.height, this.imgLeftPosition.imgCenter, this.posters.imgUrls[i], 0, i, posterInfo, linkTaget))
        }
    }
    return cards;
}

CarouselBox.prototype.nextPoster = function (root, nextIndex, cardsSize, animeDelay) {
    if(nextIndex == undefined) {
        var curRef = $(".curindex", root).attr("ref");
        nextIndex = (parseInt(curRef)+1) % cardsSize;
    }
    $(".curindex", root).removeClass("curindex");

    for(var i = 0; i < cardsSize; i++) {
        if(i == nextIndex) {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zIndex:3}, 100).animate({left: this.imgLeftPosition.imgCenter , width: this.imgSizes.level3.width, height: this.imgSizes.level3.height, opacity: 1}, animeDelay).addClass("curindex");
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeIn(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeOut(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).addClass("nav-button-on");
        } else if(i == (nextIndex + 1) % cardsSize) {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zIndex:2}, 100).animate({left: this.imgLeftPosition.imgRight1, width: this.imgSizes.level2.width, height: this.imgSizes.level2.height, opacity: 1}, animeDelay);
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeOut(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeIn(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).removeClass("nav-button-on");
        } else if(i == (nextIndex + 2) % cardsSize) {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zIndex: 1}, 100).animate({left: this.imgLeftPosition.imgRight2, width:this.imgSizes.level1.width, height: this.imgSizes.level1.height, opacity: 0}, animeDelay);
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeOut(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeIn(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).removeClass("nav-button-on");
        } else if(((nextIndex-1 >= 0) && (i == nextIndex-1)) || (nextIndex == 0 && i == cardsSize -1)) {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zIndex:2}, 100).animate({left: this.imgLeftPosition.imgLeft2, width: this.imgSizes.level2.width, height: this.imgSizes.level2.height, opacity:1}, animeDelay);
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeOut(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeIn(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).removeClass("nav-button-on");
        } else if(((nextIndex-2 >= 0) && (i == nextIndex-2)) ||(nextIndex == 1 && i == cardsSize -1) || (nextIndex == 0 && i == cardsSize -2)) {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zIndex: 1}, 100).animate({left: this.imgLeftPosition.imgLeft1, width:this.imgSizes.level1.width, height: this.imgSizes.level1.height, opacity: 0}, animeDelay);
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeOut(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeIn(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).removeClass("nav-button-on");
        } else {
            $(".poster-card:nth-child(" + (i+1) + ")", root)
                .animate({zindex: 0}, 100).animate({left: this.imgLeftPosition.imgCenter, width: this.imgSizes.level0.width, height: this.imgSizes.level0.height, opacity: 0}, animeDelay);
            var posterInfoElement = $(".poster-card:nth-child(" + (i+1) + ") .poster-info", root);
            if(posterInfoElement != undefined) {
                posterInfoElement.fadeOut(animeDelay);
            }
            $(".poster-card:nth-child(" + (i+1) + ") .shade-layer", root).fadeIn(animeDelay);
            $(".nav-button-Off:nth-child(" + (i+1) + ")", root).removeClass("nav-button-on");
        }
    }
};

CarouselBox.prototype.registerEvent = function (root) {
    var self = this;
    if(this.useNavControl) {
        $(".banner-controls .left-nav", root).unbind("click").bind("click", function () {
            if(!$(".poster-card", root).is(":animated")){
                var preIndex;
                var curIndex = parseInt($(".curindex", root).attr("ref"));
                if(curIndex == 0) {
                    preIndex = self.posters.imgUrls.length - 1;
                } else {
                    preIndex = (parseInt($(".curindex", root).attr("ref")) - 1);
                }
                self.nextPoster(root, preIndex, self.posters.imgUrls.length, self.animateDelay);
            }
        });

        $(".banner-controls .right-nav", root).unbind("click").bind("click", function () {
            if(!$(".poster-card", root).is(":animated")) {
                var nextIndex = (parseInt($(".curindex", root).attr("ref")) + 1) % self.posters.imgUrls.length;
                self.nextPoster(root, nextIndex, self.posters.imgUrls.length, self.animateDelay);
            }
        });
    }

    for(var i = 0; i < self.posters.imgUrls.length; i++) {
        $(".nav-button-Off:nth-child(" + (i+1) + ")", root).unbind("click").bind("click", function () {
            if(!$(".poster-card", root).is(":animated")){
                var nextIndex = parseInt($(this).attr("ref"));
                self.nextPoster(root, nextIndex, self.posters.imgUrls.length, self.animateDelay);
            }
        });
    }
}

CarouselBox.prototype.autoSlide = function (root, delay) {
    var self = this;
    var curRoot = root;
    setInterval(function(){
        self.nextPoster(curRoot, undefined, self.posters.imgUrls.length, self.animateDelay);
    },delay);
}
