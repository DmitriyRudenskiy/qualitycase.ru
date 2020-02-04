$(document).ready(function(){
    getTraining();
    getCourses();
});

function getCourses(){
    $.post("core/core.php", {
        "action": "getCourses",
        "tid" : get('tid')
    }, function(data){
        showCourses(data);
    });
}

function getTraining(){
    $.post("core/core.php", {
        "action": "getTraining"
    }, function(data){
        showTrainingInfo(data);
    });
}

function showCourses(data) {
    data=JSON.parse(data);
    //console.log(data);
    var out = '';
    for (key in data){
        out +='<div class="row">'
        out+='<div class="col l4 m6 s12"><div class="place">';
        out +='<p class="course-num">'+data[key].corder+'</p>';
        out +='<p class="course-name">'+data[key].cname+'</p>';
        out +='</div></div>';
        out +='<div class="col l8 m6 s12">';
        out +='<div class="red-border">';
        out +='<img src="'+data[key].cimg+'" class="courses-min-img">';
        out +='<p>'+data[key].cdescr+'</p>';
        out +='<p class="course-time"><i class="material-icons">access_time</i>'+data[key].ctime+' min</p>';
        out +='<ul>';
        if (data[key].pay == 1){
            for (var key2 in data[key]['links']){
                out +='<li> <i class="material-icons">lock</i><a href="gettraining/?tid='+data[key].tid+'">';
                out+=data[key]['links'][key2]['uname']+'</a></li>';
            }
        }
        else if (data[key].pay==0) {
            for (var key2 in data[key]['links']){
                out +='<li> <i class="material-icons">chevron_right</i><a href="training/course/unit?tid='+data[key].tid+'&cid='+data[key]['links'][key2]['cid']+'&id='+data[key]['links'][key2]['id']+'#'+data[key]['links'][key2]['uorder']+'">';
                out+=data[key]['links'][key2]['uname']+'</a></li>';
            }
        }

                out += '</ul>';

        out+='</div>';
        out+='</div>';
        out+='</div>';
        out +='<div class="divider"></div>'
    }
    $('#course-out').html(out);
}

function showTrainingInfo(data) {
    data=JSON.parse(data);
    //console.log(data);
    var id = get('tid');
    $('#training').html(data[id].tname);
    $('#training-descr').html(data[id].tdescr);
    $('#training-img').attr('src',data[id].timg);
}

function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}