$(document).ready(function() {
    var DICE = [
        ["aaafrs", "aaeeee", "aafirs", "adennn", "aeeeem"],
        ["aeegmu", "aegmnn", "afirsy", "bjkqxz", "ccenst"],
        ["ceiilt", "ceilpt", "ceipst", "ddhnot", "dhhlor"],
        ["dhlnor", "dhlnor", "eiiitt", "emottt", "ensssu"],
        ["fiprsy", "gorrvw", "iprrry", "nootuw", "ooottu"]
    ];

    function rando(string) {
        return string[Math.floor(Math.random() * (string.length - 1))].toUpperCase();
    }

    DICE.forEach(function(row, idx) {
        row.forEach(function(col, id) {
            $('#board').append("<div id='" + idx + id + "' data-row='" + idx + "' data-col='" + id + "' class='square'>" + rando(col) + "</div>");
        })
    })

    sessionStorage.setItem('user', '0');
    var resultArray = [];
    var idArray = [];
    var currentWord = '';
    var selected = null;

    $('.square').on('click', function() {

        if (selected) {
            if (((+this.id[0] <= +selected[0] + 1) && (+this.id[0] >= +selected[0] - 1) && (+this.id[1] <= +selected[1] + 1) && (+this.id[1] >= +selected[1] - 1)) && idArray.indexOf(this.id) < 0) {
                selected = this.id;
                $(this).addClass('selected');
                currentWord += $(this).html();
                $('#currWord').html(currentWord);
                idArray.push(this.id);
            }
        }

        if (!selected) {
            selected = this.id;
            $(this).addClass('selected');
            currentWord += $(this).html();
            $('#currWord').html(currentWord);
            idArray.push(this.id);
            //begin timer function;
            if (!resultArray.length) timer('timer');
        }

    })

    function timer(id) {
        var start = performance.now();
        var clock = document.getElementById(id);
        var timeinterval = setInterval(function() {
            var t = 180000 - (performance.now() - start);
            clock.innerHTML = '' + (Math.floor(t / 60000)) + '.' + (t / 3000).toFixed(2);
            if (t <= 0) {
                clearInterval(timeinterval);
                clock.innerHTML = "Game Over!"
                sessionStorage.setItem(sessionStorage.user++, document.getElementById('score').innerHTML);
            }
        }, 100);
    }

    function submit() {
        //request to person dictionary api
        $.get('http://api.pearson.com/v2/dictionaries/entries?headword=' + currentWord,
            function(data) {
                if (data.results.length) {
                    var phonTrans;
                    data.results.forEach(function(el,id){
                      if(el.pronunciations) return phonTrans = el.pronunciations[0].ipa;
                      })
                    var score = document.getElementById('score')
                    score.innerHTML++;
                    // console.log(data);
                    $('#chosenWords').append('<span>&nbsp<text>' + phonTrans + '</text>,&nbsp</span>');
                    $('.square').removeClass('selected');
                    $('#currWord').html('');
                    currentWord = '';
                    selected = null;
                    idArray = [];
                    resultArray.push(currentWord);

                } else {

                    $('.square').removeClass('selected');
                    $('#chosenWords').append('<span>&nbsp<text>' + currentWord + '</text>,&nbsp</span>');
                    $('#currWord').html('');
                    currentWord = '';
                    selected = null;
                    idArray = [];
                    resultArray.push(currentWord);
                }
            });

        // $('.square').removeClass('selected');
        // $('#chosenWords').append('<span>&nbsp<text>' + currentWord + '</text>,&nbsp</span>');
        // $('#currWord').html('');
        // currentWord = '';
        // selected = null;
        // idArray = [];
        // resultArray.push(currentWord);
    }

    document.getElementById("submitWord").onclick = submit;
});
