"use strict";

// стрелка

var ticktocker = document.querySelector(".ticktocker");

// чаши весов

var rightHolder = document.querySelector(".right-holder");
var rightSpring = document.querySelector(".right-spring");

var rightHolderCoords = {
    rT: rightHolder.getBoundingClientRect().top,
    rB: rightHolder.getBoundingClientRect().bottom,
    rL: rightHolder.getBoundingClientRect().left,
    rR: rightHolder.getBoundingClientRect().right
};

var leftHolder = document.querySelector(".left-holder");
var leftSpring = document.querySelector(".left-spring");

var leftHolderCoords = {
    lT: leftHolder.getBoundingClientRect().top,
    lB: leftHolder.getBoundingClientRect().bottom,
    lL: leftHolder.getBoundingClientRect().left,
    lR: leftHolder.getBoundingClientRect().right
};

// наличие коробки

var boxToLeft = false;
var boxToRight = false;

// изначальный параметр веса

var imLeft = 0;
var imRight = 0;

// координаты

var shiftX, shiftY;

// проверка позиции коробки

function boxPosition(x, y, callback) {

    if (((x > leftHolderCoords.lL) && (x < leftHolderCoords.lR)) && ((y > leftHolderCoords.lT) && (y < leftHolderCoords.lB))) {
        boxToLeft = true;
        callback(boxToLeft);
    } else {
        boxToLeft = false;
    }

    if (((x > rightHolderCoords.rL) && (x < rightHolderCoords.rR)) && ((y > rightHolderCoords.rT) && (y < rightHolderCoords.rB))) {
        boxToRight = true;
        callback(boxToRight);
    } else {
        boxToRight = false;
    }

}

//работа весов

function weigherGo(leftH, rightH) {

    if ((rightH == 0 || leftH == 0) || rightH == leftH) {
        ticktocker.style.transform = "none";

        rightHolder.classList.remove("active");
        rightSpring.classList.remove("active");
        leftHolder.classList.remove("active");
        leftSpring.classList.remove("active");
    }

    if (rightH > leftH) {
        ticktocker.style.transform = "rotate(45deg)";


        rightHolder.classList.add("active");
        rightSpring.classList.add("active");

    } else if (rightH < leftH) {
        ticktocker.style.transform = "rotate(-45deg)";

        leftHolder.classList.add("active");
        leftSpring.classList.add("active");
    }

    imLeft = +leftH;

    imRight = +rightH;


}

document.onmousedown = function(e) {

    var box = e.target;

    var index = box.dataset.index;

    if (!box.classList.contains("box")) return;

    var startX = e.clientX;
    var startY = e.clientY;

    // проверяем позицию, если сняли коробку с весов, то вычитаем вес

    boxPosition(startX, startY, function() {
        if (boxToLeft) {
            imLeft = +imLeft - +index;

        } else if (boxToRight) {
            imRight = +imRight - +index;

        }

        weigherGo(imLeft, imRight);
    });


    start(e.clientX, e.clientY);

    document.onmousemove = function(e) {
        moveAt(e.clientX, e.clientY);
    };

    document.onmouseup = function() {
        finish();

        boxToLeft = false;
        boxToRight = false;

    };

    function start(clientX, clientY) {

        shiftX = clientX - box.getBoundingClientRect().left;
        shiftY = clientY - box.getBoundingClientRect().top;

        moveAt(clientX, clientY);
    }

    function moveAt(clientX, clientY) {

        var newX = clientX - shiftX;
        var newY = clientY - shiftY;

        if (newY < 0) newY = 0;
        if (newY > document.documentElement.clientWidth - box.offsetHeight) {
            newY = document.documentElement.clientWidth - box.offsetHeight;
        }
        if (newX < 0) newX = 0;
        if (newX > document.documentElement.clientWidth - box.offsetHeight) {
            newX = document.documentElement.clientWidth - box.offsetHeight;
        }

        box.style.left = newX + "px";
        box.style.top = newY + "px";
    }

    function finish() {
        document.onmousemove = null;
        box.onmouseup = null;

        var endX = box.getBoundingClientRect().left;
        var endY = box.getBoundingClientRect().top;

        // проверяем позицию, если положили на весы, то добавляем вес

        boxPosition(endX, endY, function() {
            if (boxToLeft) {
                imLeft = +imLeft + +index;

            } else if (boxToRight) {
                imRight = +imRight + +index;

            }

            weigherGo(imLeft, imRight);
        });

        boxToLeft = false;
        boxToRight = false;

        //debugger;

    }

    return false;

};
