
$(document).ready(function() {
    $('#start-button').click(function() {
        this.innerHTML = "restart"
        $('#game-interface').show();

        $("html, body").animate({
            scrollTop: ($('#elapsed-seconds').offset().top - 15)
        }, 600);

        clearBoard();
    })
}); //jQuery ready function

function newBoard() {
    var tiles = [];
    var idx;
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }

    var shuffledTiles = _.shuffle(tiles);

    var selectedTiles = shuffledTiles.slice(0,8);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });

    tilePairs = _.shuffle(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && 0 == elemIndex % 4) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    var flippedTiles = [];
    var matched = 0;
    var remaining = tilePairs.length / 2;
    var missed = 0;
    $('#matches').text("matches: " + matched);
    $('#remaining').text("remaining: " + remaining);
    $('#missed').text("missed: " + missed);

    $('#game-board img').click(function() {
        var img = $(this);
        if (img.attr('src') === 'img/tile-back.png' && flippedTiles.length < 2) {
            var tile = img.data('tile');
            flippedTiles.push(img);
            img.fadeOut(100, function() {
                img.attr('src', tile.src);
                tile.flipped = !tile.flipped;
                img.fadeIn(100);

                if (flippedTiles.length == 2)
                {
                    var tileOne = flippedTiles[0];
                    var tileTwo = flippedTiles[1];

                    if (tileOne.data('tile').tileNum != tileTwo.data('tile').tileNum) {
                        _.forEach(flippedTiles, function (flippedTile) {
                            window.setTimeout(function() {
                                flippedTile.fadeOut(100, function () {
                                    flippedTile.attr('src', 'img/tile-back.png');
                                    flippedTile.data('tile').flipped = !flippedTile.data('tile').flipped;
                                    flippedTile.fadeIn(100);
                                });

                                flippedTiles = [];
                            }, 1000);
                        });

                        $('#missed').text("missed: " + ++missed);
                    }
                    else {
                        $('#matches').text("matches: " + ++matched);
                        $('#remaining').text("remaining: " + --remaining);
                        flippedTiles = [];

                        if (0 === remaining) {
                            window.clearInterval(timer);
                            $('#modal-body').html("you won in only " + elapsedSeconds + " seconds and with " + missed + " misses...<br>you should play again.");
                            $('#winning-modal').modal();
                        }
                    }
                }
            });
        }
    }); //on click of gameboard images

    var elapsedSeconds;

    $('#elapsed-seconds').text("time: 0 sec");
    var startTime = _.now();
    var timer = window.setInterval(function() {
        elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-seconds').text("time: " + elapsedSeconds + " sec");
    }, 1000);

    $('#modal-button').click(function() {
        window.clearInterval(timer);
        clearBoard();
    });

    $('#start-button').click(function() {
        window.clearInterval(timer);
    });
}

function clearBoard() {
    $('#game-board').empty();
    newBoard();
}